"use client";

import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") ||
          canvas.getContext("webgl") ||
          canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

let webglSupport: boolean | null = null;

function getWebglSupport(): boolean {
  if (webglSupport === null) {
    webglSupport = supportsWebGL();
  }
  return webglSupport;
}

// Remap the model's original cool palette (cyan / graphite / violet)
// onto the landing's warm leather palette. The metal shell is toned down
// so it reads as dark instead of reflecting the bright environment to white.
type MaterialTweak = {
  color: string;
  metalness?: number;
  roughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
};

const MATERIAL_OVERRIDES: Record<string, MaterialTweak> = {
  // The GLB also has cool emissive glow (cyan/violet); kill it so the warm
  // base colors below are actually visible.
  "Electric Cyan": {
    color: "#3e2c23",
    roughness: 0.5,
    emissive: "#000000",
    emissiveIntensity: 0,
  }, // core sphere → dark espresso
  "Graphite Metal": {
    color: "#2b2b2b",
    metalness: 0.3,
    roughness: 0.45,
    emissive: "#000000",
    emissiveIntensity: 0,
  }, // shell → dark ink
  "Violet Accent": {
    color: "#b87333",
    metalness: 0.35,
    roughness: 0.4,
    emissive: "#000000",
    emissiveIntensity: 0,
  }, // accent → copper
};

function applyMaterialPalette(scene: THREE.Object3D) {
  scene.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!mesh.isMesh) return;

    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];

    for (const material of materials) {
      const standard = material as THREE.MeshStandardMaterial;
      const tweak = MATERIAL_OVERRIDES[standard.name];
      if (!tweak) continue;

      standard.color.set(tweak.color);
      if (typeof tweak.metalness === "number") {
        standard.metalness = tweak.metalness;
      }
      if (typeof tweak.roughness === "number") {
        standard.roughness = tweak.roughness;
      }
      if (tweak.emissive) {
        standard.emissive.set(tweak.emissive);
      }
      if (typeof tweak.emissiveIntensity === "number") {
        standard.emissiveIntensity = tweak.emissiveIntensity;
      }
    }
  });
}

function usePrefersReducedMotion(): boolean {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", onStoreChange);
    return () => mq.removeEventListener("change", onStoreChange);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

class SceneErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode; onError?: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Core({
  reduced,
  onReady,
}: {
  reduced: boolean;
  onReady: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const autoY = useRef(0);
  const { scene } = useGLTF("/models/ai-core.glb");

  useEffect(() => {
    const target = group.current;
    if (!target) return;

    applyMaterialPalette(scene);

    // Fit the model to a predictable size and centre it, whatever its GLB units.
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 2.4 / maxDim;
    const center = box.getCenter(new THREE.Vector3());

    target.scale.setScalar(scale);
    target.position.set(
      -center.x * scale,
      -center.y * scale,
      -center.z * scale,
    );

    onReady();
  }, [scene, onReady]);

  useFrame((state, delta) => {
    const target = group.current;
    if (!target) return;

    if (reduced) {
      autoY.current = 0;
      target.rotation.set(0, 0, 0);
      return;
    }

    // Very gentle constant rotation plus a tiny pointer reaction.
    autoY.current += delta * 0.16;
    const targetY = autoY.current + state.pointer.x * 0.22;
    const targetX = state.pointer.y * 0.1;

    target.rotation.y = THREE.MathUtils.lerp(target.rotation.y, targetY, 0.06);
    target.rotation.x = THREE.MathUtils.lerp(target.rotation.x, targetX, 0.06);
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.95} />
      <directionalLight position={[4, 3, 5]} intensity={2.6} color="#fff1dd" />
      <directionalLight position={[-5, 1, -3]} intensity={1.6} color="#c98a4b" />
      <pointLight position={[-4, 2, 4]} intensity={0.8} color="#d9c4a8" />
      <pointLight position={[0, -3, 2]} intensity={0.5} color="#b87333" />
    </>
  );
}

function Fallback() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-3xl border border-linen bg-paper/60 p-8">
      <div className="text-center">
        <div
          aria-hidden
          className="mx-auto mb-5 h-24 w-24 rounded-full bg-[radial-gradient(circle_at_35%_30%,#b87333,#3e2c23)] opacity-90 shadow-inner"
        />
        <p className="font-serif text-lg text-espresso">TERRA CORIUM</p>
        <p className="mt-1 text-sm text-ink/60">
          3D-модель изделия сейчас недоступна
        </p>
      </div>
    </div>
  );
}

export default function AiCoreCanvas() {
  const webgl = useSyncExternalStore<boolean | null>(
    () => () => {},
    getWebglSupport,
    () => null,
  );
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduced = usePrefersReducedMotion();

  const handleReady = useCallback(() => setReady(true), []);
  const handleError = useCallback(() => setFailed(true), []);

  // Placeholder before hydration settles (same shape on server and client).
  if (webgl === null) {
    return <div className="h-full w-full" aria-hidden />;
  }

  if (!webgl) {
    return <Fallback />;
  }

  return (
    <div className="relative h-full w-full">
      <SceneErrorBoundary fallback={<Fallback />} onError={handleError}>
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 0, 4.5], fov: 42 }}
        >
          <Lights />
          <Environment resolution={64} frames={1}>
            <Lightformer
              form="rect"
              intensity={1.0}
              position={[0, 3, -5]}
              scale={[8, 6, 1]}
              color="#e8d7bd"
            />
            <Lightformer
              form="rect"
              intensity={0.55}
              position={[-4, 1, 2]}
              scale={[4, 6, 1]}
              color="#cdb79a"
            />
            <Lightformer
              form="rect"
              intensity={0.4}
              position={[4, -1, 3]}
              scale={[3, 3, 1]}
              color="#b87333"
            />
          </Environment>
          <Core reduced={reduced} onReady={handleReady} />
        </Canvas>
      </SceneErrorBoundary>

      {!ready && !failed && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="eyebrow text-xs text-espresso/50">Загружаем изделие…</p>
        </div>
      )}
    </div>
  );
}
