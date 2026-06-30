"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Icosahedron, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import type { Points as ThreePoints } from "three";
import * as THREE from "three";

/**
 * Hero scene composition:
 *  - A large distorted icosahedron in the center with a wireframe overlay.
 *  - A field of particles drifting slowly.
 *  - Two point lights that orbit and respond to the pointer.
 *  - A subtle dark fog to fade particles at the edges.
 *
 * The scene is intentionally cheap — it targets 60fps on integrated GPUs.
 */
function ParticleField({ count = 1800 }: { count?: number }) {
  const ref = useRef<ThreePoints>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a sphere shell.
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
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.03;
    ref.current.rotation.x = Math.sin(t * 0.08) * 0.08;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
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

function CoreOrb() {
  const mesh = useRef<Mesh>(null);
  const wire = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.08;
      mesh.current.rotation.y += delta * 0.12;
    }
    if (wire.current) {
      wire.current.rotation.x -= delta * 0.05;
      wire.current.rotation.y -= delta * 0.08;
    }
  });

  return (
    <group>
      {/* Distorted glowing core */}
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

        {/* Wireframe overlay */}
        <Icosahedron ref={wire} args={[1.55, 1]}>
          <meshBasicMaterial
            color="#10d9a3"
            wireframe
            transparent
            opacity={0.18}
          />
        </Icosahedron>

        {/* Outer faint wireframe */}
        <Icosahedron args={[2.0, 1]}>
          <meshBasicMaterial
            color="#a855f7"
            wireframe
            transparent
            opacity={0.08}
          />
        </Icosahedron>
      </Float>
    </group>
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

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <fog attach="fog" args={["#06060a", 6, 18]} />
      <MouseLights />
      <CoreOrb />
      <ParticleField count={1400} />
    </Canvas>
  );
}
