"use client";

import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Billboard, Text, Line, OrbitControls, Icosahedron } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

export type ConstellationNode = { id: string; color: string; count: number };

/** Evenly distribute n points on a sphere (fibonacci spiral). */
function spherePositions(n: number, radius: number): [number, number, number][] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const pts: [number, number, number][] = [];
  for (let i = 0; i < n; i++) {
    const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2; // 1 → -1
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    pts.push([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]);
  }
  return pts;
}

function CenterCore() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.2;
      mesh.current.rotation.y += delta * 0.3;
    }
  });
  return (
    <group>
      <Icosahedron ref={mesh} args={[0.32, 0]}>
        <meshStandardMaterial
          color="#0a3b2e"
          emissive="#10d9a3"
          emissiveIntensity={0.9}
          roughness={0.2}
          metalness={0.8}
        />
      </Icosahedron>
      <Icosahedron args={[0.45, 0]}>
        <meshBasicMaterial color="#10d9a3" wireframe transparent opacity={0.25} />
      </Icosahedron>
    </group>
  );
}

function CategoryNode({
  position,
  node,
  active,
  dim,
  labelColor,
  onHover,
}: {
  position: [number, number, number];
  node: ConstellationNode;
  active: boolean;
  dim: boolean;
  labelColor: string;
  onHover: (id: string | null) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    const target = active ? 1.8 : 1;
    const s = THREE.MathUtils.lerp(mesh.current.scale.x, target, delta * 8);
    mesh.current.scale.setScalar(s);
  });

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          onHover(node.id);
        }}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={active ? 1.5 : 0.55}
          roughness={0.3}
          metalness={0.4}
          transparent
          opacity={dim ? 0.35 : 1}
        />
      </mesh>
      <Billboard>
        <Text
          position={[0, 0.34, 0]}
          fontSize={0.17}
          color={active ? node.color : labelColor}
          anchorX="center"
          anchorY="bottom"
          fillOpacity={dim ? 0.4 : 1}
          outlineWidth={0.004}
          outlineColor={active ? node.color : "#00000000"}
        >
          {node.id}
        </Text>
        <Text
          position={[0, 0.31, 0]}
          fontSize={0.1}
          color={labelColor}
          anchorX="center"
          anchorY="top"
          fillOpacity={dim ? 0.25 : 0.5}
        >
          {node.count} skills
        </Text>
      </Billboard>
    </group>
  );
}

function Scene({
  nodes,
  active,
  onHover,
  labelColor,
}: {
  nodes: ConstellationNode[];
  active: string | null;
  onHover: (id: string | null) => void;
  labelColor: string;
}) {
  const positions = useMemo(() => spherePositions(nodes.length, 2.7), [nodes.length]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]} intensity={30} color="#10d9a3" distance={16} />
      <pointLight position={[-4, -3, 2]} intensity={18} color="#a855f7" distance={16} />

      <CenterCore />

      {nodes.map((n, i) => {
        const isActive = active === n.id;
        return (
          <Line
            key={`line-${n.id}`}
            points={[[0, 0, 0], positions[i]]}
            color={isActive ? n.color : labelColor}
            lineWidth={isActive ? 2 : 1}
            transparent
            opacity={active ? (isActive ? 0.9 : 0.08) : 0.2}
          />
        );
      })}

      {nodes.map((n, i) => (
        <CategoryNode
          key={n.id}
          position={positions[i]}
          node={n}
          active={active === n.id}
          dim={!!active && active !== n.id}
          labelColor={labelColor}
          onHover={onHover}
        />
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!active}
        autoRotateSpeed={0.6}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
      />
    </>
  );
}

export function SkillsConstellation3D({
  nodes,
  active,
  onHover,
}: {
  nodes: ConstellationNode[];
  active: string | null;
  onHover: (id: string | null) => void;
}) {
  const { resolvedTheme } = useTheme();
  const labelColor = resolvedTheme === "light" ? "#232838" : "#dfe7f0";

  // Pause the render loop while the section is scrolled out of view.
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!wrapper.current) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(wrapper.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapper} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 1.8]}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Scene nodes={nodes} active={active} onHover={onHover} labelColor={labelColor} />
      </Canvas>
    </div>
  );
}
