"use client";

import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Text, Line, OrbitControls, Billboard } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Shell, SectorTag } from "./sections";
import { skillBars, careerTrace } from "@/lib/prototype-data";
import type { Palette } from "@/lib/prototype-theme";

type Colors = Palette["three"];
const LIGHT = "#f5f3ee";

/** Pauses a chart's render loop while it's scrolled out of view. */
function useVisible(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "120px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
  return visible;
}

/* ── shared 3D bits ─────────────────────────────────────────── */

function GridFloor({ c }: { c: Colors }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color={c.canvas} roughness={0.9} metalness={0.3} transparent opacity={0.5} />
      </mesh>
      <gridHelper args={[12, 12, c.edge, "#333340"]} position={[0, 0, 0]} />
    </group>
  );
}

function Lights({ c }: { c: Colors }) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 8, 4]} intensity={1.6} color="#fff3ea" />
      <pointLight position={[-4, 3, 3]} intensity={12} color={c.edge} distance={18} />
      <pointLight position={[4, 3, -3]} intensity={10} color={c.rim} distance={18} />
    </>
  );
}

/* ── bar chart ──────────────────────────────────────────────── */

function Bar({
  x,
  height,
  color,
  hot,
  onOver,
  onOut,
}: {
  x: number;
  height: number;
  color: string;
  hot: boolean;
  onOver: (e: ThreeEvent<PointerEvent>) => void;
  onOut: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const target = hot ? height * 1.06 : height;
    ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, target, dt * 4);
    ref.current.position.y = ref.current.scale.y / 2;
  });
  return (
    <mesh
      ref={ref}
      position={[x, 0, 0]}
      scale={[0.62, 0.001, 0.62]}
      castShadow
      onPointerOver={(e) => {
        e.stopPropagation();
        onOver(e);
      }}
      onPointerOut={onOut}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hot ? 0.7 : 0.18}
        roughness={0.3}
        metalness={0.5}
      />
    </mesh>
  );
}

function BarsScene({ c, onHover }: { c: Colors; onHover: (i: number | null) => void }) {
  const [hot, setHot] = useState<number | null>(null);
  const max = Math.max(...skillBars.map((d) => d.value));
  const W = skillBars.length;

  return (
    <>
      <Lights c={c} />
      <GridFloor c={c} />
      {skillBars.map((d, i) => {
        const h = (d.value / max) * 2.6 + 0.1;
        const x = (i - (W - 1) / 2) * 1.15;
        return (
          <group key={d.label}>
            <Bar
              x={x}
              height={h}
              color={hot === i ? c.edge : c.rim}
              hot={hot === i}
              onOver={() => {
                setHot(i);
                onHover(i);
              }}
              onOut={() => {
                setHot(null);
                onHover(null);
              }}
            />
            <Billboard position={[x, h + 0.34, 0]}>
              <Text fontSize={0.34} color={hot === i ? c.rim : LIGHT} anchorX="center" anchorY="bottom">
                {String(d.value)}
              </Text>
            </Billboard>
            <Text
              position={[x, -0.05, 0.55]}
              rotation={[-Math.PI / 2.2, 0, 0]}
              fontSize={0.19}
              color={hot === i ? c.rim : "#9aa0ac"}
              anchorX="center"
              anchorY="middle"
              maxWidth={1.1}
              textAlign="center"
            >
              {d.label}
            </Text>
          </group>
        );
      })}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={hot === null} autoRotateSpeed={0.5} minPolarAngle={Math.PI * 0.2} maxPolarAngle={Math.PI * 0.5} />
    </>
  );
}

/* ── line trace ─────────────────────────────────────────────── */

function TraceScene({ c, onHover }: { c: Colors; onHover: (i: number | null) => void }) {
  const [hot, setHot] = useState<number | null>(null);
  const max = Math.max(...careerTrace.map((d) => d.value));
  const N = careerTrace.length;

  const points = useMemo(
    () =>
      careerTrace.map((d, i) => new THREE.Vector3((i - (N - 1) / 2) * 1.3, (d.value / max) * 2.4 + 0.1, 0)),
    [max, N]
  );

  return (
    <>
      <Lights c={c} />
      <GridFloor c={c} />
      <Line points={points} color={c.rim} lineWidth={3} />
      {/* soft vertical droplines */}
      {points.map((p, i) => (
        <Line key={`d${i}`} points={[[p.x, 0, 0], [p.x, p.y, 0]]} color={c.edge} lineWidth={1} transparent opacity={0.25} />
      ))}
      {careerTrace.map((d, i) => {
        const p = points[i];
        const hotNode = hot === i;
        return (
          <group key={d.year}>
            <mesh
              position={p}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHot(i);
                onHover(i);
              }}
              onPointerOut={() => {
                setHot(null);
                onHover(null);
              }}
            >
              <sphereGeometry args={[hotNode ? 0.17 : 0.12, 20, 20]} />
              <meshStandardMaterial color={hotNode ? c.edge : c.rim} emissive={hotNode ? c.edge : c.rim} emissiveIntensity={hotNode ? 0.9 : 0.4} roughness={0.3} />
            </mesh>
            <Text position={[p.x, -0.35, 0.4]} rotation={[-Math.PI / 2.2, 0, 0]} fontSize={0.22} color={hotNode ? c.rim : "#9aa0ac"} anchorX="center">
              {d.year}
            </Text>
          </group>
        );
      })}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={hot === null} autoRotateSpeed={0.4} minPolarAngle={Math.PI * 0.25} maxPolarAngle={Math.PI * 0.5} />
    </>
  );
}

/* ── chart frames (Canvas + DOM readout) ────────────────────── */

function ChartCanvas({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <Canvas camera={{ position: [0, 2.6, 6], fov: 42 }} dpr={[1, 1.7]} frameloop={visible ? "always" : "never"} gl={{ antialias: true, alpha: true }}>
      {children}
    </Canvas>
  );
}

function Readout({ line1, line2, hint }: { line1: string; line2: string; hint: string }) {
  return (
    <div className="pointer-events-none absolute left-4 top-4 font-mono">
      <div className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "var(--pt-muted)" }}>
        {hint}
      </div>
      <div className="text-lg font-bold" style={{ color: "var(--pt-white)" }}>
        {line1}
      </div>
      <div className="text-xs" style={{ color: "var(--pt-primary)" }}>
        {line2}
      </div>
    </div>
  );
}

function SkillBarsChart({ c }: { c: Colors }) {
  const wrap = useRef<HTMLDivElement>(null);
  const visible = useVisible(wrap);
  const [hot, setHot] = useState<number | null>(null);
  const d = hot !== null ? skillBars[hot] : null;
  return (
    <div ref={wrap} className="pt-glass relative h-[360px] overflow-hidden rounded-xl border sm:h-[420px]" style={{ borderColor: "var(--pt-line)" }}>
      <Readout
        hint="skill telemetry · drag to orbit"
        line1={d ? `${d.label} · ${d.value}` : "Car setup"}
        line2={d ? d.detail : "hover a channel"}
      />
      <ChartCanvas visible={visible}>
        <BarsScene c={c} onHover={setHot} />
      </ChartCanvas>
    </div>
  );
}

function CareerTraceChart({ c }: { c: Colors }) {
  const wrap = useRef<HTMLDivElement>(null);
  const visible = useVisible(wrap);
  const [hot, setHot] = useState<number | null>(null);
  const d = hot !== null ? careerTrace[hot] : null;
  return (
    <div ref={wrap} className="pt-glass relative h-[360px] overflow-hidden rounded-xl border sm:h-[420px]" style={{ borderColor: "var(--pt-line)" }}>
      <Readout
        hint="career trace · drag to orbit"
        line1={d ? `${d.year} · load ${d.value}` : "Season trajectory"}
        line2={d ? d.detail : "hover a lap marker"}
      />
      <ChartCanvas visible={visible}>
        <TraceScene c={c} onHover={setHot} />
      </ChartCanvas>
    </div>
  );
}

/* ── section ────────────────────────────────────────────────── */

export function Telemetry({ colors }: { colors: Colors }) {
  return (
    <Shell id="telemetry">
      <SectorTag n="Pit Lane" label="Live Telemetry — the data" purple />
      <div className="max-w-2xl">
        <h2
          className="text-5xl font-black uppercase italic leading-[0.95] tracking-[-0.02em] sm:text-6xl md:text-7xl"
          style={{ color: "var(--pt-white)" }}
        >
          The work, read as{" "}
          <span style={{ color: "var(--pt-primary)" }}>data.</span>
        </h2>
        <p className="mt-6 text-lg" style={{ color: "var(--pt-muted)" }}>
          Interactive 3D telemetry — skill channels and a five-season career trace. Drag to orbit, hover a
          node to read the stint.
        </p>
      </div>
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <SkillBarsChart c={colors} />
        <CareerTraceChart c={colors} />
      </div>
    </Shell>
  );
}
