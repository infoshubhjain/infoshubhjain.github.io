"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Icosahedron, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import type { Points as ThreePoints } from "three";
import * as THREE from "three";

/**
 * Scroll-driven hero scene.
 *
 * As the user scrolls through the hero (0 → 1 progress):
 *   0.0 — Distorted icosahedron "AI core"
 *   0.4 — Morphs into a wireframe neural-network-like structure (more icosahedrons)
 *   0.7 — Dissolves into a particle field
 *   1.0 — Fully dissolved
 *
 * The camera also orbits around the orb based on scroll progress,
 * giving a 3D parallax feel even without mouse input.
 *
 * Mouse movement adds a subtle parallax on top of the scroll camera.
 */

function CoreOrb({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const mesh = useRef<Mesh>(null);
  const wire = useRef<Mesh>(null);
  const outerWire = useRef<Mesh>(null);
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const p = scrollProgress.current; // 0 → 1

    // Rotation always runs.
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.08;
      mesh.current.rotation.y += delta * 0.12;
    }
    if (wire.current) {
      wire.current.rotation.x -= delta * 0.05;
      wire.current.rotation.y -= delta * 0.08;
    }
    if (outerWire.current) {
      outerWire.current.rotation.x += delta * 0.03;
      outerWire.current.rotation.y -= delta * 0.04;
    }

    // Scale + opacity shifts based on scroll:
    //   p < 0.4  → solid orb prominent
    //   p 0.4–0.7 → wireframes take over
    //   p > 0.7  → everything dissolves
    if (group.current) {
      const dissolve = THREE.MathUtils.clamp((p - 0.6) / 0.4, 0, 1);
      group.current.scale.setScalar(1 - dissolve * 0.4);
      group.current.position.z = -dissolve * 3;
    }

    // Material opacity shifts.
    if (mesh.current) {
      const mat = mesh.current.material as THREE.Material & { opacity: number; transparent: boolean };
      mat.transparent = true;
      mat.opacity = THREE.MathUtils.clamp(1 - p * 1.5, 0, 1);
    }
    if (wire.current) {
      const mat = wire.current.material as THREE.Material & { opacity: number; transparent: boolean };
      mat.transparent = true;
      // Wireframes peak at p=0.5, fade by p=0.9
      mat.opacity = THREE.MathUtils.clamp(0.18 + Math.sin(p * Math.PI) * 0.4, 0, 0.6);
    }
    if (outerWire.current) {
      const mat = outerWire.current.material as THREE.Material & { opacity: number; transparent: boolean };
      mat.transparent = true;
      mat.opacity = THREE.MathUtils.clamp(0.08 + Math.sin(p * Math.PI) * 0.3, 0, 0.4);
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
        <Icosahedron ref={mesh} args={[1.35, 4]}>
          <MeshDistortMaterial
            color="#0a3b2e"
            emissive="#10d9a3"
            emissiveIntensity={0.35}
            roughness={0.18}
            metalness={0.85}
            distort={0.35}
            speed={1.6}
          />
        </Icosahedron>

        <Icosahedron ref={wire} args={[1.55, 1]}>
          <meshBasicMaterial color="#10d9a3" wireframe transparent opacity={0.18} />
        </Icosahedron>

        <Icosahedron ref={outerWire} args={[2.0, 1]}>
          <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.08} />
        </Icosahedron>
      </Float>
    </group>
  );
}

function ParticleField({
  count = 1400,
  scrollProgress,
}: {
  count?: number;
  scrollProgress: React.MutableRefObject<number>;
}) {
  const ref = useRef<ThreePoints>(null);
  const matRef = useRef<THREE.PointMaterial>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.03;
      ref.current.rotation.x = Math.sin(t * 0.08) * 0.08;
    }
    // Particles fade in as the orb dissolves.
    if (matRef.current) {
      const p = scrollProgress.current;
      matRef.current.opacity = THREE.MathUtils.clamp(0.3 + p * 0.7, 0, 0.9);
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        ref={matRef}
        transparent
        color="#10d9a3"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.85}
      />
    </Points>
  );
}

function MouseLights() {
  const light1 = useRef<THREE.PointLight>(null);
  const light2 = useRef<THREE.PointLight>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (light1.current) {
      light1.current.position.x = pointer.x * 6 + Math.sin(t * 0.5) * 1.5;
      light1.current.position.y = pointer.y * 4 + Math.cos(t * 0.4) * 1.5;
    }
    if (light2.current) {
      light2.current.position.x = -pointer.x * 5 + Math.cos(t * 0.3) * 2;
      light2.current.position.y = -pointer.y * 3 + Math.sin(t * 0.6) * 1.5;
    }
  });

  return (
    <>
      <pointLight ref={light1} position={[4, 3, 4]} intensity={45} color="#10d9a3" distance={14} />
      <pointLight ref={light2} position={[-4, -2, 3]} intensity={30} color="#a855f7" distance={14} />
      <ambientLight intensity={0.4} />
    </>
  );
}

/**
 * Camera rig — orbits based on scroll progress + subtle mouse parallax.
 * Uses direct THREE.Camera mutation (allowed inside useFrame, the lint
 * rule is overly strict here — R3F explicitly supports this pattern).
 */
/* eslint-disable react-hooks/immutability */
function CameraRig({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const { camera, pointer } = useThree();

  useFrame((state, delta) => {
    const p = scrollProgress.current;
    const t = state.clock.getElapsedTime();

    // Base camera position orbits with scroll.
    // p=0 → front view, p=0.5 → side view, p=1 → back/dissolved
    const orbitAngle = p * Math.PI * 0.6; // up to ~108° orbit
    const targetX = Math.sin(orbitAngle) * 6;
    const targetZ = Math.cos(orbitAngle) * 6;

    // Mouse parallax on top — subtle.
    const mouseX = pointer.x * 0.8;
    const mouseY = pointer.y * 0.5;

    // Camera pulls back as scroll progresses (dissolve effect).
    const pullback = p * 3;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX + mouseX, delta * 2);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouseY, delta * 2);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ + pullback, delta * 2);

    camera.lookAt(0, 0, 0);

    // Subtle camera shake for life.
    camera.position.x += Math.sin(t * 0.7) * 0.05;
    camera.position.y += Math.cos(t * 0.5) * 0.05;
  });

  return null;
}
/* eslint-enable react-hooks/immutability */

export function HeroScene({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <fog attach="fog" args={["#06060a", 6, 18]} />
      <MouseLights />
      <CameraRig scrollProgress={scrollProgress} />
      <CoreOrb scrollProgress={scrollProgress} />
      <ParticleField count={1400} scrollProgress={scrollProgress} />
    </Canvas>
  );
}
