#!/usr/bin/env node
/**
 * Inspect a GLB and report the transform needed to present it front-on.
 *
 * A wallet-like product is a flat slab: two large parallel faces (the cover and
 * the back) with a small thickness between them. The cover is the face that
 * carries the strap and the button, so we pick the side whose geometry bulges
 * outwards most from the slab's mid-plane.
 *
 * Prints the results as JSON so they can be pasted into the viewer, or imported
 * by tools/apply-model-transform.mjs.
 *
 * Usage: node tools/inspect-model.mjs assets/wallet.glb
 */
import fs from "node:fs";

const FILE = process.argv[2] ?? "assets/wallet.glb";

const COMP = {
  5120: ["Int8Array", 1], 5121: ["Uint8Array", 1], 5122: ["Int16Array", 2],
  5123: ["Uint16Array", 2], 5125: ["Uint32Array", 4], 5126: ["Float32Array", 4],
};
const NCOMP = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };

const buf = fs.readFileSync(FILE);
const magic = buf.toString("ascii", 0, 4);
if (magic !== "glTF") throw new Error(`${FILE} is not a GLB (magic: ${magic})`);

const jsonLen = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.toString("utf8", 20, 20 + jsonLen));
const binStart = 20 + jsonLen + 8;
const dv = new DataView(buf.buffer, buf.byteOffset);

const READERS = {
  5120: (o) => dv.getInt8(o),
  5121: (o) => dv.getUint8(o),
  5122: (o) => dv.getInt16(o, true),
  5123: (o) => dv.getUint16(o, true),
  5125: (o) => dv.getUint32(o, true),
  5126: (o) => dv.getFloat32(o, true),
};

function readAccessor(ai) {
  const a = gltf.accessors[ai];
  const bv = gltf.bufferViews[a.bufferView];
  const base = binStart + (bv.byteOffset ?? 0) + (a.byteOffset ?? 0);
  const n = NCOMP[a.type];
  const [, sz] = COMP[a.componentType];
  const stride = bv.byteStride ?? sz * n;
  const read = READERS[a.componentType];
  const out = new Float64Array(a.count * n);
  for (let i = 0; i < a.count; i++)
    for (let c = 0; c < n; c++) out[i * n + c] = read(base + i * stride + c * sz);
  return out;
}

/* ---------------------------------------------------------- world matrices */

function nodeMatrix(n) {
  if (n.matrix) return n.matrix.slice();
  const [tx, ty, tz] = n.translation ?? [0, 0, 0];
  const [x, y, z, w] = n.rotation ?? [0, 0, 0, 1];
  const [sx, sy, sz] = n.scale ?? [1, 1, 1];
  const x2 = x + x, y2 = y + y, z2 = z + z;
  const xx = x * x2, xy = x * y2, xz = x * z2;
  const yy = y * y2, yz = y * z2, zz = z * z2;
  const wx = w * x2, wy = w * y2, wz = w * z2;
  return [
    (1 - (yy + zz)) * sx, (xy + wz) * sx, (xz - wy) * sx, 0,
    (xy - wz) * sy, (1 - (xx + zz)) * sy, (yz + wx) * sy, 0,
    (xz + wy) * sz, (yz - wx) * sz, (1 - (xx + yy)) * sz, 0,
    tx, ty, tz, 1,
  ];
}

function mul(a, b) {
  const o = new Array(16).fill(0);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      o[c * 4 + r] = s;
    }
  return o;
}

/* ------------------------------------------------------------- gather tris */

const positions = [];

function walk(nodeIndex, parent, out) {
  const n = gltf.nodes[nodeIndex];
  const world = mul(parent, nodeMatrix(n));
  if (n.mesh != null) {
    for (const prim of gltf.meshes[n.mesh].primitives) {
      if (prim.attributes.POSITION == null) continue;
      const pos = readAccessor(prim.attributes.POSITION);
      const idx = prim.indices != null ? readAccessor(prim.indices) : null;
      const triCount = idx ? idx.length / 3 : pos.length / 9;
      for (let t = 0; t < triCount; t++) {
        for (let k = 0; k < 3; k++) {
          const vi = idx ? idx[t * 3 + k] : t * 3 + k;
          const x = pos[vi * 3], y = pos[vi * 3 + 1], z = pos[vi * 3 + 2];
          out.push(
            world[0] * x + world[4] * y + world[8] * z + world[12],
            world[1] * x + world[5] * y + world[9] * z + world[13],
            world[2] * x + world[6] * y + world[10] * z + world[14],
          );
        }
      }
    }
  }
  for (const c of n.children ?? []) walk(c, world, out);
}

const tris = [];
for (const root of gltf.scenes[gltf.scene ?? 0].nodes) walk(root, nodeMatrix({ matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] }), tris);
// Push in chunks: spreading a multi-million element array overflows the stack.
for (let i = 0; i < tris.length; i += 65536) {
  positions.push(...tris.slice(i, i + 65536));
}

const vertexCount = positions.length / 3;
const min = [Infinity, Infinity, Infinity];
const max = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < positions.length; i += 3)
  for (let k = 0; k < 3; k++) {
    const v = positions[i + k];
    if (v < min[k]) min[k] = v;
    if (v > max[k]) max[k] = v;
  }
const size = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
const center = [(max[0] + min[0]) / 2, (max[1] + min[1]) / 2, (max[2] + min[2]) / 2];

/* -------------------------------------------------- which axis is thickness */

// The thinnest axis of the bounding box is the wallet's thickness, so the two
// faces of the cover lie perpendicular to it.
const axisOrder = [0, 1, 2].sort((a, b) => size[a] - size[b]);
const thinAxis = axisOrder[0];
const upAxis = axisOrder[2];

/* --------------------------- which side of the thin axis carries the cover */

// Sample the surface and compare how far the geometry reaches out on each side
// of the slab's mid-plane. The cover with its strap/button sticks out further.
let posReach = 0, negReach = 0, posCount = 0, negCount = 0;
const mid = center[thinAxis];
for (let i = 0; i < positions.length; i += 3) {
  const d = positions[i + thinAxis] - mid;
  if (d > 0) { posReach += d; posCount++; } else { negReach -= d; negCount++; }
}
const posMean = posCount ? posReach / posCount : 0;
const negMean = negCount ? negReach / negCount : 0;
const frontSign = posMean >= negMean ? 1 : -1;

const AXIS_NAMES = ["x", "y", "z"];

/* ------------------------------------------------------- rotation to build */

// Three.js: we want the thin axis pointing at the camera (+Z) and the model
// standing up (its longest axis along +Y).
let rotation = [0, 0, 0]; // radians, XYZ order for THREE.Euler
const note = [];

if (thinAxis === 2) {
  // already facing +Z (or -Z); flip 180° around Y if the cover is at -Z
  if (frontSign < 0) { rotation = [0, Math.PI, 0]; note.push("cover was at -Z, turned 180° around Y"); }
  else note.push("cover already faces +Z");
  if (upAxis !== 1) { rotation[2] += Math.PI / 2; note.push(`${AXIS_NAMES[upAxis]} re-oriented to Y`); }
} else if (thinAxis === 0) {
  // thickness along X: bring X to Z (and the cover to +Z)
  rotation = [0, frontSign > 0 ? Math.PI / 2 : -Math.PI / 2, 0];
  note.push(`thickness along ${AXIS_NAMES[thinAxis]}, rotated to face +Z`);
} else {
  // thickness along Y: lay it flat by rotating around X
  rotation = [frontSign > 0 ? -Math.PI / 2 : Math.PI / 2, 0, 0];
  note.push(`thickness along ${AXIS_NAMES[thinAxis]}, rotated to face +Z`);
}

const scale = 2.6 / Math.max(size[0], size[1], size[2]);

const result = {
  file: FILE,
  triangles: Math.round(vertexCount / 3),
  vertices: vertexCount,
  bounds: { min: min.map(round4), max: max.map(round4) },
  size: size.map(round4),
  center: center.map(round4),
  thicknessAxis: AXIS_NAMES[thinAxis],
  upAxis: AXIS_NAMES[upAxis],
  coverSide: frontSign > 0 ? "+" : "-",
  coverReach: { positive: round4(posMean), negative: round4(negMean) },
  rotationRadians: rotation.map(round6),
  rotationDegrees: rotation.map((r) => round6((r * 180) / Math.PI)),
  normalizedScale: round6(scale),
  notes: note,
};

function round4(v) { return Math.round(v * 1e4) / 1e4; }
function round6(v) { return Math.round(v * 1e6) / 1e6; }

console.log(JSON.stringify(result, null, 2));
