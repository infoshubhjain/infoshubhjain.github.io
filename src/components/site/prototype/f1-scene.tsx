"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, MeshReflectorMaterial, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { PALETTES, type Palette } from "@/lib/prototype-theme";

/**
 * "Lights Out" — the active team's real F1 car (Ferrari F1-75 / Red Bull RB18,
 * Draco-compressed) on a reflective grid with bloom. The car swaps per team;
 * a slow turntable showcases it. A procedural car renders on load/error.
 * Everything reacts to `speedRef` (scroll = throttle).
 */

const DRACO_PATH = "/draco/";
// Preload + Draco-decode both liveries at module load (during the start-lights
// loader) so the real car — not the procedural fallback — drives in on launch.
Object.values(PALETTES).forEach((p) => useGLTF.preload(p.three.model, DRACO_PATH));
// Fixed flattering three-quarter — the reduced-motion resting angle (otherwise
// the car turntables continuously, accelerating with scroll; see CarRig).
const YAW_CENTER = -0.9;

type Colors = Palette["three"];
type SpeedRef = React.MutableRefObject<number>;

function Wheel({ position, rim, tyre, speedRef }: { position: [number, number, number]; rim: string; tyre: string; speedRef: SpeedRef }) {
  const spin = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y += (0.5 + speedRef.current * 22) * delta;
  });
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <group ref={spin}>
        <mesh castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.36, 24]} />
          <meshStandardMaterial color={tyre} roughness={0.85} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.19, 0]}>
          <cylinderGeometry args={[0.19, 0.19, 0.02, 24]} />
          <meshStandardMaterial color={rim} emissive={rim} emissiveIntensity={0.4} roughness={0.4} metalness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

function ProceduralCar({ c, speedRef }: { c: Colors; speedRef: SpeedRef }) {
  const mat = (color: string, rough = 0.35, metal = 0.55, emissive = 0) => (
    <meshStandardMaterial color={color} roughness={rough} metalness={metal} emissive={color} emissiveIntensity={emissive} />
  );
  return (
    <group rotation={[0, -0.55, 0]} position={[0, 0.02, 0]}>
      <mesh castShadow position={[0, 0.42, 0]}>
        <boxGeometry args={[4.4, 0.22, 0.9]} />
        {mat(c.body, 0.28, 0.62, 0.1)}
      </mesh>
      <mesh castShadow position={[2.35, 0.44, 0]}>
        <boxGeometry args={[1.5, 0.18, 0.36]} />
        {mat(c.body, 0.28, 0.62, 0.1)}
      </mesh>
      {[-0.62, 0.62].map((z) => (
        <mesh key={z} castShadow position={[-0.4, 0.42, z]}>
          <boxGeometry args={[2.0, 0.5, 0.32]} />
          {mat(c.body, 0.34, 0.56, 0.08)}
        </mesh>
      ))}
      <mesh castShadow position={[-1.2, 0.78, 0]}>
        <boxGeometry args={[1.7, 0.5, 0.34]} />
        {mat(c.tyre, 0.6, 0.3)}
      </mesh>
      <mesh castShadow position={[-0.2, 0.7, 0]}>
        <boxGeometry args={[0.9, 0.32, 0.5]} />
        {mat(c.tyre, 0.6, 0.3)}
      </mesh>
      <mesh position={[-0.15, 0.9, 0]}>
        <sphereGeometry args={[0.15, 20, 20]} />
        {mat(c.accent, 0.4, 0.3, 0.1)}
      </mesh>
      <mesh position={[-0.2, 0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.34, 0.035, 8, 20, Math.PI]} />
        {mat(c.tyre, 0.5, 0.4)}
      </mesh>
      <mesh castShadow position={[3.0, 0.16, 0]}>
        <boxGeometry args={[0.5, 0.05, 1.9]} />
        {mat(c.tyre, 0.5, 0.3)}
      </mesh>
      <mesh position={[3.0, 0.22, 0]}>
        <boxGeometry args={[0.5, 0.02, 1.9]} />
        {mat(c.accent, 0.4, 0.5, 0.25)}
      </mesh>
      <mesh castShadow position={[-2.35, 0.95, 0]}>
        <boxGeometry args={[0.1, 0.42, 1.5]} />
        {mat(c.tyre, 0.5, 0.3)}
      </mesh>
      <mesh position={[-2.28, 1.12, 0]}>
        <boxGeometry args={[0.35, 0.05, 1.5]} />
        {mat(c.body, 0.32, 0.5, 0.18)}
      </mesh>
      <mesh position={[-2.42, 0.6, 0]}>
        <boxGeometry args={[0.05, 0.12, 0.5]} />
        {mat(c.edge, 0.2, 0.3, 1.4)}
      </mesh>
      <Wheel position={[1.7, 0.34, 0.72]} rim={c.rim} tyre={c.tyre} speedRef={speedRef} />
      <Wheel position={[1.7, 0.34, -0.72]} rim={c.rim} tyre={c.tyre} speedRef={speedRef} />
      <Wheel position={[-1.7, 0.34, 0.78]} rim={c.rim} tyre={c.tyre} speedRef={speedRef} />
      <Wheel position={[-1.7, 0.34, -0.78]} rim={c.rim} tyre={c.tyre} speedRef={speedRef} />
    </group>
  );
}

function GltfCar({ path }: { path: string }) {
  const { scene } = useGLTF(path, DRACO_PATH);

  // Clone + normalize scale/position so each team's real livery fits the stage.
  const model = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = true;
    });
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const scale = 4.6 / Math.max(size.x, size.y, size.z);
    root.scale.setScalar(scale);
    root.position.set(-center.x * scale, -box.min.y * scale + 0.02, -center.z * scale);
    return root;
  }, [scene]);

  return <primitive object={model} />;
}

/** Falls back to the procedural car if a model fails to load. Keyed by path so it resets on team switch. */
class CarErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function CarRig({ c, speedRef, modelPath, reduced }: { c: Colors; speedRef: SpeedRef; modelPath: string; reduced: boolean }) {
  const g = useRef<THREE.Group>(null);
  const entrance = useRef(0);
  useFrame((state, delta) => {
    if (!g.current) return;
    const t = state.clock.getElapsedTime();
    // Drive-in: after "lights out" the car sweeps in from off-screen right.
    entrance.current = Math.min(1, entrance.current + delta / 1.4);
    const e = reduced ? 1 : 1 - Math.pow(1 - entrance.current, 3); // easeOutCubic
    g.current.position.x = (1 - e) * 15;
    // Continuous turntable whose speed tracks scroll (scroll = throttle): a slow
    // idle spin that accelerates as you move down the page. Reduced-motion holds
    // a fixed flattering three-quarter.
    if (reduced) {
      g.current.rotation.y = YAW_CENTER;
    } else {
      g.current.rotation.y += delta * (0.35 + speedRef.current * 6);
    }
    g.current.position.y = reduced ? 0 : Math.sin(t * 2) * 0.01;
  });
  const fallback = <ProceduralCar c={c} speedRef={speedRef} />;
  return (
    <group ref={g}>
      <CarErrorBoundary key={modelPath} fallback={fallback}>
        <Suspense fallback={fallback}>
          <GltfCar path={modelPath} />
        </Suspense>
      </CarErrorBoundary>
    </group>
  );
}

function Grid({ c, speedRef, reduced, mobile }: { c: Colors; speedRef: SpeedRef; reduced: boolean; mobile: boolean }) {
  const dashes = useRef<THREE.Group>(null);
  const COUNT = 14;
  const SPAN = 42;
  const spacing = SPAN / COUNT;
  useFrame((_, delta) => {
    if (!dashes.current) return;
    // No idle scroll under reduced-motion; only the user's own scroll drives it.
    const move = ((reduced ? 0 : 2) + speedRef.current * 60) * delta;
    dashes.current.children.forEach((ch) => {
      ch.position.x += move;
      if (ch.position.x > 12) ch.position.x -= SPAN;
    });
  });
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[80, 40]} />
        <MeshReflectorMaterial
          resolution={mobile ? 512 : 1024}
          blur={mobile ? [200, 60] : [400, 120]}
          mixBlur={1}
          mixStrength={18}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.3}
          roughness={0.85}
          metalness={0.5}
          color={c.canvas}
        />
      </mesh>
      <group ref={dashes}>
        {Array.from({ length: COUNT }).map((_, i) => (
          <mesh key={i} position={[-10 + i * spacing, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.4, 0.16]} />
            <meshStandardMaterial color="#f5f3ee" emissive="#f5f3ee" emissiveIntensity={0.2} roughness={0.6} />
          </mesh>
        ))}
      </group>
      {[-4.6, 4.6].map((z) => (
        <mesh key={z} position={[0, 0.012, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[80, 0.12]} />
          <meshStandardMaterial color={c.edge} emissive={c.edge} emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/* eslint-disable react-hooks/immutability -- R3F supports direct camera mutation inside useFrame */
function CameraDrift({ reduced }: { reduced: boolean }) {
  const { camera } = useThree();
  const intro = useRef(0);
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    intro.current = Math.min(1, intro.current + delta / 2.4);
    const e = 1 - Math.pow(1 - intro.current, 3);
    // Camera holds a stable elevated 3/4 frame; only the car tracks the cursor
    // (CarRig). A gentle idle bob keeps the shot alive. As the hero scrolls away,
    // the camera pulls back + rises so the car recedes cinematically (the scene
    // then pauses once content covers it).
    const scroll = reduced ? 0 : Math.min(1, (typeof window !== "undefined" ? window.scrollY / window.innerHeight : 0));
    const es = scroll * scroll; // ease-in: holds, then accelerates away
    const baseX = 5.2;
    const baseY = 2.3 + (reduced ? 0 : Math.sin(t * 0.6) * 0.05);
    const tx = THREE.MathUtils.lerp(9.5, baseX, e) + es * 2.2;
    const ty = THREE.MathUtils.lerp(5.5, baseY, e) + es * 3.2;
    const tz = THREE.MathUtils.lerp(9.5, 6.5, e) + es * 5.5;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tx, delta * 2.4);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty, delta * 2.4);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, tz, delta * 2.4);
    camera.lookAt(0, 0.7, 0);
  });
  return null;
}
/* eslint-enable react-hooks/immutability */

export function F1Scene({ speedRef, reduced, colors, mobile }: { speedRef: SpeedRef; reduced: boolean; colors: Colors; mobile: boolean }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // The canvas is fixed full-screen, so an IntersectionObserver would always
    // report "visible". Pause the render loop by scroll instead: once the hero is
    // scrolled past, the opaque sections cover the canvas — stop rendering it.
    const onScroll = () => setVisible(window.scrollY < window.innerHeight * 1.15);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fog = useMemo(() => new THREE.Fog(colors.canvas, 13, 34), [colors.canvas]);

  return (
    <div ref={wrapper} className="fixed inset-0">
      <Canvas
        shadows={!mobile}
        camera={{ position: [9.5, 5.5, 9.5], fov: 40 }}
        dpr={mobile ? [1, 1.3] : [1, 1.7]}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: !mobile }}
      >
        <color attach="background" args={[colors.canvas]} />
        <primitive attach="fog" object={fog} />

        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[6, 10, 4]}
          intensity={2.8}
          color="#fff3ea"
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0002}
        />
        <directionalLight position={[-8, 3, -6]} intensity={2} color={colors.edge} />
        {/* Front fill so the car stays lit as it yaws to track the cursor. */}
        <directionalLight position={[2, 4, 9]} intensity={1.1} color="#fff3ea" />
        <pointLight position={[0, 3, 5]} intensity={10} color={colors.accent} distance={20} />
        <pointLight position={[-3, 1, -3]} intensity={14} color={colors.bodyDk} distance={16} />

        <CarRig c={colors} speedRef={speedRef} modelPath={colors.model} reduced={reduced} />
        <Grid c={colors} speedRef={speedRef} reduced={reduced} mobile={mobile} />
        <ContactShadows position={[0, 0.015, 0]} opacity={0.6} scale={22} blur={2.4} far={6} color="#000000" />
        <CameraDrift reduced={reduced} />

        {/* Bloom is GPU-heavy; skip it on mobile for smoothness. */}
        {!mobile && (
          <EffectComposer>
            <Bloom intensity={0.7} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur radius={0.8} />
            <Vignette offset={0.28} darkness={0.72} eskil={false} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
