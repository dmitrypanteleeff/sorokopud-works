"use client";

import {
  Component,
  useCallback,
  useEffect,
  useMemo,
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
  // The model is pre-compressed with EXT_meshopt_compression (104 MB -> ~2 MB).
  // drei wires the meshopt decoder in by default; draco is not needed.
  const { scene } = useGLTF("/models/wallet.optimized.glb", false, true);

  // The wallet GLB already faces +Z (the cover with the button strap points
  // at the camera), so no rotation correction is needed. We only centre it
  // and normalise its size, whatever units the GLB was exported in.
  const { model, scale } = useMemo(() => {
    const clone = scene.clone(true);
    clone.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Fit the largest dimension into a predictable world size.
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = 2.6 / maxDim;

    // Shift the model so its bounding-box centre sits on the group origin.
    clone.position.set(-center.x, -center.y, -center.z);

    return { model: clone, scale: s };
  }, [scene]);

  useEffect(() => {
    const target = group.current;
    if (!target) return;

    target.scale.setScalar(scale);
    onReady();
  }, [model, scale, onReady]);

  useFrame((state, delta) => {
    const target = group.current;
    if (!target) return;

    if (reduced) {
      autoY.current = 0;
      target.rotation.set(0, 0, 0);
      return;
    }

    // Keep the cover facing the viewer: a gentle swing around the front view
    // instead of a full spin, so the wallet never turns its back.
    autoY.current += delta * 0.35;
    const swing = Math.sin(autoY.current) * 0.32;
    const targetY = swing + state.pointer.x * 0.18;
    const targetX = state.pointer.y * 0.08;

    target.rotation.y = THREE.MathUtils.lerp(target.rotation.y, targetY, 0.06);
    target.rotation.x = THREE.MathUtils.lerp(target.rotation.x, targetX, 0.06);
  });

  return (
    <group ref={group}>
      <primitive object={model} />
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
        <p className="font-serif text-lg text-espresso">SOROKOPUD-WORKS</p>
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
