/**
 * Build the web-weight wallet model.
 *
 * Step 1 (this script) welds the Sketchfab-style unshared vertices on
 * position + UV, recomputes smooth normals and re-encodes the textures.
 * Step 2 runs gltf-transform's meshopt pass over the result.
 *
 * Usage: node tools/build-model.mjs [--tex 1024] [--quality 82]
 */
import fs from "node:fs";
import sharp from "sharp";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : fallback;
};

const SRC = "assets/wallet.glb";
const WELDED = "public/models/.wallet-welded.glb";
const OUT = "public/models/wallet.optimized.glb";
const TEX = opt("tex", 1024);
const QUALITY = opt("quality", 82);

const COMP = { 5120: ["Int8Array", 1], 5121: ["Uint8Array", 1], 5122: ["Int16Array", 2], 5123: ["Uint16Array", 2], 5125: ["Uint32Array", 4], 5126: ["Float32Array", 4] };
const NCOMP = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };

const buf = fs.readFileSync(SRC);
const jsonLen = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.toString("utf8", 20, 20 + jsonLen));
const binStart = 20 + jsonLen + 8;
const dv = new DataView(buf.buffer, buf.byteOffset);

const READ = {
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
  const read = READ[a.componentType];
  const out = new Float64Array(a.count * n);
  for (let i = 0; i < a.count; i++)
    for (let c = 0; c < n; c++) out[i * n + c] = read(base + i * stride + c * sz);
  return out;
}

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

const world = {};
(function walk(ni, parent) {
  const n = gltf.nodes[ni];
  const m = mul(parent, nodeMatrix(n));
  world[ni] = m;
  for (const c of n.children ?? []) walk(c, m);
})(0, nodeMatrix({ matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] }));

// For the Sketchfab exports the scene root may not be node 0, so walk all roots.
const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
for (const root of gltf.scenes[gltf.scene ?? 0].nodes) {
  (function walk2(ni, parent) {
    const n = gltf.nodes[ni];
    const m = mul(parent, nodeMatrix(n));
    world[ni] = m;
    for (const c of n.children ?? []) walk2(c, m);
  })(root, identity);
}

/* ---------------------------------------------------------------- gather */

const parts = [];
for (const [ni, M] of Object.entries(world)) {
  const node = gltf.nodes[ni];
  if (node.mesh == null) continue;
  for (const prim of gltf.meshes[node.mesh].primitives) {
    if (prim.attributes.POSITION == null) continue;
    const pos = readAccessor(prim.attributes.POSITION);
    const uv = prim.attributes.TEXCOORD_0 != null ? readAccessor(prim.attributes.TEXCOORD_0) : null;
    const idx = readAccessor(prim.indices);
    const n = pos.length / 3;
    const P = new Float64Array(n * 3);
    const U = new Float64Array(n * 2);
    for (let i = 0; i < n; i++) {
      const x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
      P[i * 3] = M[0] * x + M[4] * y + M[8] * z + M[12];
      P[i * 3 + 1] = M[1] * x + M[5] * y + M[9] * z + M[13];
      P[i * 3 + 2] = M[2] * x + M[6] * y + M[10] * z + M[14];
      if (uv) { U[i * 2] = uv[i * 2]; U[i * 2 + 1] = uv[i * 2 + 1]; }
    }
    parts.push({ P, U, I: idx, mat: prim.material ?? 0 });
  }
}

const vertsIn = parts.reduce((s, p) => s + p.P.length / 3, 0);
console.log(`source vertices: ${vertsIn}`);

/* ------------------------------------------------------- weld + normals */

const bufferParts = [];
let offset = 0;
const bufferViews = [];
const accessors = [];

function addView(data, extra, acc) {
  const bytes = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  const pad = (4 - (offset % 4)) % 4;
  if (pad) { bufferParts.push(Buffer.alloc(pad)); offset += pad; }
  const start = offset;
  bufferParts.push(bytes);
  offset += bytes.length;
  const view = { buffer: 0, byteOffset: start, byteLength: bytes.length };
  if (extra) view.target = extra;
  bufferViews.push(view);
  if (acc) {
    acc.bufferView = bufferViews.length - 1;
    accessors.push(acc);
    return accessors.length - 1;
  }
  return bufferViews.length - 1;
}

const primitives = [];
let vertsOut = 0;

for (const part of parts) {
  const n = part.P.length / 3;

  // weld on position + UV so the existing texture mapping is untouched
  const map = new Map();
  const remap = new Uint32Array(n);
  const P = [], U = [];
  for (let i = 0; i < n; i++) {
    const key =
      `${Math.round(part.P[i * 3] * 1e5)},${Math.round(part.P[i * 3 + 1] * 1e5)},${Math.round(part.P[i * 3 + 2] * 1e5)}|` +
      `${Math.round(part.U[i * 2] * 1e5)},${Math.round(part.U[i * 2 + 1] * 1e5)}`;
    let t = map.get(key);
    if (t === undefined) {
      t = P.length / 3;
      map.set(key, t);
      P.push(part.P[i * 3], part.P[i * 3 + 1], part.P[i * 3 + 2]);
      U.push(part.U[i * 2], part.U[i * 2 + 1]);
    }
    remap[i] = t;
  }

  const faces = [];
  for (let t = 0; t < part.I.length; t += 3) {
    const a = remap[part.I[t]], b = remap[part.I[t + 1]], c = remap[part.I[t + 2]];
    if (a === b || b === c || a === c) continue;
    faces.push(a, b, c);
  }
  vertsOut += P.length / 3;

  // smooth normals from the welded faces
  const N = new Float64Array(P.length);
  for (let t = 0; t < faces.length; t += 3) {
    const i0 = faces[t] * 3, i1 = faces[t + 1] * 3, i2 = faces[t + 2] * 3;
    const e1x = P[i1] - P[i0], e1y = P[i1 + 1] - P[i0 + 1], e1z = P[i1 + 2] - P[i0 + 2];
    const e2x = P[i2] - P[i0], e2y = P[i2 + 1] - P[i0 + 1], e2z = P[i2 + 2] - P[i0 + 2];
    const nx = e1y * e2z - e1z * e2y, ny = e1z * e2x - e1x * e2z, nz = e1x * e2y - e1y * e2x;
    for (const base of [i0, i1, i2]) { N[base] += nx; N[base + 1] += ny; N[base + 2] += nz; }
  }
  for (let i = 0; i < N.length; i += 3) {
    const l = Math.hypot(N[i], N[i + 1], N[i + 2]) || 1;
    N[i] /= l; N[i + 1] /= l; N[i + 2] /= l;
  }

  const pos32 = Float32Array.from(P);
  const nrm32 = Float32Array.from(N);
  const uv32 = Float32Array.from(U);
  const idx = Uint32Array.from(faces);

  let mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos32.length; i += 3)
    for (let k = 0; k < 3; k++) {
      mn[k] = Math.min(mn[k], pos32[i + k]);
      mx[k] = Math.max(mx[k], pos32[i + k]);
    }

  primitives.push({
    attributes: {
      POSITION: addView(pos32, 34962, { componentType: 5126, count: pos32.length / 3, type: "VEC3", min: mn, max: mx }),
      NORMAL: addView(nrm32, 34962, { componentType: 5126, count: nrm32.length / 3, type: "VEC3" }),
      TEXCOORD_0: addView(uv32, 34962, { componentType: 5126, count: uv32.length / 2, type: "VEC2" }),
    },
    indices: addView(idx, 34963, { componentType: 5125, count: idx.length, type: "SCALAR" }),
    material: part.mat,
  });
}

console.log(`welded vertices : ${vertsOut} (${((vertsOut / vertsIn) * 100).toFixed(1)}%)`);

/* --------------------------------------------------------------- images */

const images = [];
for (let i = 0; i < gltf.images.length; i++) {
  const bv = gltf.bufferViews[gltf.images[i].bufferView];
  const off = binStart + (bv.byteOffset ?? 0);
  const src = buf.subarray(off, off + bv.byteLength);
  const jpg = await sharp(src)
    .resize(TEX, TEX, { fit: "fill", kernel: "lanczos3" })
    .jpeg({ quality: QUALITY, chromaSubsampling: "4:2:0", progressive: true, mozjpeg: true })
    .toBuffer();
  images.push({ mimeType: "image/jpeg", bufferView: addView(jpg) });
}

const binaryOut = Buffer.concat(bufferParts);

const outGltf = {
  asset: { version: "2.0", generator: "sorokopud-works build-model" },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0, name: "Wallet" }],
  meshes: [{ name: "Wallet", primitives }],
  materials: gltf.materials,
  textures: gltf.textures,
  samplers: gltf.samplers ?? [{}],
  images,
  accessors,
  bufferViews,
  buffers: [{ byteLength: binaryOut.length }],
};

function writeGlb(path, g, bin) {
  let js = Buffer.from(JSON.stringify(g), "utf8");
  while (js.length % 4) js = Buffer.concat([js, Buffer.from(" ")]);
  const pad = (4 - (bin.length % 4)) % 4;
  const body = pad ? Buffer.concat([bin, Buffer.alloc(pad)]) : bin;
  const total = 12 + 8 + js.length + 8 + body.length;
  const head = Buffer.alloc(12);
  head.write("glTF", 0, "ascii");
  head.writeUInt32LE(2, 4);
  head.writeUInt32LE(total, 8);
  const jh = Buffer.alloc(8);
  jh.writeUInt32LE(js.length, 0);
  jh.write("JSON", 4, "ascii");
  const bh = Buffer.alloc(8);
  bh.writeUInt32LE(body.length, 0);
  bh.write("BIN\0", 4, "ascii");
  fs.writeFileSync(path, Buffer.concat([head, jh, js, bh, body]));
}

writeGlb(WELDED, outGltf, binaryOut);
console.log(`welded file: ${(fs.statSync(WELDED).size / 1048576).toFixed(2)} MB`);

/* ------------------------------- meshopt pass via gltf-transform ------- */

const { NodeIO } = await import("@gltf-transform/core");
const { ALL_EXTENSIONS } = await import("@gltf-transform/extensions");
const { dedup, prune, meshopt } = await import("@gltf-transform/functions");
const { MeshoptEncoder } = await import("meshoptimizer");

await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  "meshopt.encoder": MeshoptEncoder,
});

const doc = await io.read(WELDED);
await doc.transform(
  dedup(),
  prune(),
  meshopt({ encoder: MeshoptEncoder, level: "high" }),
);

const data = await io.writeBinary(doc);
fs.writeFileSync(OUT, data);
fs.rmSync(WELDED);

console.log(`\nwrote ${OUT}: ${(data.byteLength / 1048576).toFixed(2)} MB`);
