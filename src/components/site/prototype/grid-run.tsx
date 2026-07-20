"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshReflectorMaterial, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";
import { PALETTES, type TeamId } from "@/lib/prototype-theme";
import { anton } from "@/lib/prototype-fonts";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

type Palette = (typeof PALETTES)[TeamId];

/**
 * "URBANA GP — GRID RUN": a time-trial dash. Launched from the hero Drive button.
 * Steer the real team car across three lanes to dodge single-lane barriers, and
 * control your own pace — ↑ accelerate, ↓ brake — to reach the chequered flag as
 * fast as you can without crashing. Hot state lives in a mutable `game` ref
 * mutated inside useFrame; the DOM HUD samples it on its own rAF.
 */

const DRACO_PATH = "/draco/";
// Tuned so the car's nose points down-track (away from the chase cam) — we chase
// the rear of the car, not its face.
const PLAYER_YAW = Math.PI;
const LANES = [-2.3, 0, 2.3];
const MIN_SPEED = 24;
const MAX_SPEED = 94;
const START_SPEED = 42;
const ACCEL = 34; // speed units/sec while ↑ held
const BRAKE = 48; // speed units/sec while ↓ held
const FINISH_DIST = 1650; // race length
const SPAWN_Z = -150;
const BEHIND_Z = 12;
const HURDLE_HALF = 1.5; // collision z half-window
const N_HURDLES = 8;
const HURDLE_GAP = 21; // min spacing between barriers

type Hurdle = { z: number; lane: number; hit: boolean };
type Status = "countdown" | "racing" | "over" | "finish";
type Game = {
  status: Status;
  speed: number;
  distance: number;
  time: number;
  lane: number; // target lane 0..2
  carX: number; // smoothed x
  crashT: number;
  up: boolean;
  down: boolean;
  hurdles: Hurdle[];
};

function makeGame(): Game {
  const hurdles: Hurdle[] = [];
  let z = -50;
  for (let i = 0; i < N_HURDLES; i++) {
    hurdles.push({ z, lane: Math.floor(Math.random() * 3), hit: false });
    z -= HURDLE_GAP + Math.random() * 16;
  }
  return { status: "countdown", speed: START_SPEED, distance: 0, time: 0, lane: 1, carX: 0, crashT: 0, up: false, down: false, hurdles };
}

function nearestLane(x: number) {
  let best = 0;
  let bd = Infinity;
  for (let i = 0; i < 3; i++) {
    const d = Math.abs(x - LANES[i]);
    if (d < bd) { bd = d; best = i; }
  }
  return best;
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = (s % 60).toFixed(1);
  return m > 0 ? `${m}:${sec.padStart(4, "0")}` : sec;
}

/** The real team car, normalized and oriented to face away down the track. */
function PlayerModel({ path }: { path: string }) {
  const { scene } = useGLTF(path, DRACO_PATH);
  const model = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = true; });
    // Bake the facing rotation BEFORE measuring, so the centering accounts for it
    // (rotating after centering shifts an off-origin model off-centre).
    root.rotation.set(0, PLAYER_YAW, 0);
    root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const scale = 4.4 / Math.max(size.x, size.y, size.z);
    root.scale.setScalar(scale);
    root.position.set(-center.x * scale, -box.min.y * scale + 0.02, -center.z * scale);
    return root;
  }, [scene]);
  return <primitive object={model} />;
}

/** A single-lane red/white striped barrier to dodge. */
function Hurdle({ edge }: { edge: string }) {
  return (
    <group>
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1.8, 0.82, 0.34]} />
        <meshStandardMaterial color={edge} emissive={edge} emissiveIntensity={0.55} roughness={0.4} />
      </mesh>
      {[-0.55, 0.05, 0.65].map((x) => (
        <mesh key={x} position={[x, 0.5, 0.18]}>
          <boxGeometry args={[0.26, 0.82, 0.06]} />
          <meshStandardMaterial color="#f5f3ee" emissive="#f5f3ee" emissiveIntensity={0.35} />
        </mesh>
      ))}
      {[-0.78, 0.78].map((x) => (
        <mesh key={x} castShadow position={[x, 0.16, 0]}>
          <boxGeometry args={[0.12, 0.32, 0.12]} />
          <meshStandardMaterial color="#0d0d0f" />
        </mesh>
      ))}
    </group>
  );
}

/** Chequered finish line spanning the track. */
function FinishLine() {
  const tiles: React.ReactElement[] = [];
  const cols = 12;
  for (let r = 0; r < 2; r++) {
    for (let cIdx = 0; cIdx < cols; cIdx++) {
      const w = 10 / cols;
      tiles.push(
        <mesh key={`${r}-${cIdx}`} rotation={[-Math.PI / 2, 0, 0]} position={[-5 + w * (cIdx + 0.5), 0.02, r * 0.9 - 0.45]}>
          <planeGeometry args={[w, 0.9]} />
          <meshStandardMaterial color={(r + cIdx) % 2 === 0 ? "#f5f3ee" : "#0d0d0f"} emissive={(r + cIdx) % 2 === 0 ? "#f5f3ee" : "#000"} emissiveIntensity={0.25} />
        </mesh>,
      );
    }
  }
  return <group>{tiles}</group>;
}

/* eslint-disable react-hooks/immutability -- r3f mutates object3D transforms in useFrame by design */
function Scene({ game, colors, modelPath, mobile, onEnd }: { game: React.MutableRefObject<Game>; colors: Palette; modelPath: string; mobile: boolean; onEnd: (r: "crash" | "finish") => void }) {
  const player = useRef<THREE.Group>(null);
  const hurdleRefs = useRef<(THREE.Group | null)[]>([]);
  const dashes = useRef<THREE.Group>(null);
  const posts = useRef<THREE.Group>(null);
  const finish = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const c = colors.three;
  const ended = useRef(false);

  useFrame((state, delta) => {
    const g = game.current;
    const d = Math.min(delta, 0.05);

    if (g.status === "over") {
      g.crashT += d;
      if (player.current) {
        player.current.rotation.y += d * 7 * Math.max(0, 1 - g.crashT);
        player.current.position.y = Math.max(0, Math.sin(g.crashT * 4) * 0.15 * Math.max(0, 1 - g.crashT));
      }
      if (!ended.current && g.crashT > 0.4) { ended.current = true; onEnd("crash"); }
      return;
    }
    if (g.status === "finish") {
      if (!ended.current) { ended.current = true; onEnd("finish"); }
      // coast the car forward off the line for a beat
      if (player.current) player.current.rotation.z = THREE.MathUtils.damp(player.current.rotation.z, 0, 6, d);
      return;
    }
    if (g.status !== "racing") {
      ended.current = false;
      // place the barriers at their grid spots while the lights are on
      for (let i = 0; i < g.hurdles.length; i++) {
        const h = g.hurdles[i];
        const ref = hurdleRefs.current[i];
        if (ref) { ref.position.set(LANES[h.lane], 0, h.z); ref.visible = h.z > SPAWN_Z - 10 && h.z < BEHIND_Z + 4; }
      }
      return;
    }
    ended.current = false;

    // player-controlled speed
    if (g.up) g.speed += ACCEL * d;
    else if (g.down) g.speed -= BRAKE * d;
    g.speed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, g.speed));
    g.distance += g.speed * d;
    g.time += d;

    // reached the flag?
    if (g.distance >= FINISH_DIST) { g.status = "finish"; return; }
    const remaining = FINISH_DIST - g.distance;

    // player lane + bank
    g.carX = THREE.MathUtils.damp(g.carX, LANES[g.lane], 9, d);
    if (player.current) {
      player.current.position.set(g.carX, 0.02, 0);
      player.current.rotation.set(0, 0, (LANES[g.lane] - g.carX) * 0.16);
    }

    // hurdles approach, collide, recycle (stop spawning near the flag)
    const pLane = nearestLane(g.carX);
    const committed = Math.abs(g.carX - LANES[pLane]) < 1.05;
    for (let i = 0; i < g.hurdles.length; i++) {
      const h = g.hurdles[i];
      const prevZ = h.z;
      h.z += g.speed * d;
      // swept check: did the barrier cross the car's plane this frame in-lane?
      // (a plain window test tunnels at high speed / low fps)
      if (!h.hit && committed && h.lane === pLane && prevZ <= HURDLE_HALF && h.z >= -HURDLE_HALF) {
        g.status = "over";
        return;
      }
      if (h.z > BEHIND_Z) {
        if (remaining > 200) {
          const minZ = Math.min(...g.hurdles.map((x) => x.z));
          h.z = minZ - (HURDLE_GAP + Math.random() * 16);
          h.lane = Math.floor(Math.random() * 3);
          h.hit = false;
        } else {
          h.z = SPAWN_Z * 3; // park it away — clear run to the line
          h.hit = true;
        }
      }
      const ref = hurdleRefs.current[i];
      if (ref) { ref.position.set(LANES[h.lane], 0, h.z); ref.visible = h.z > SPAWN_Z - 10 && h.z < BEHIND_Z + 4; }
    }

    // finish line rides in as you close on it
    if (finish.current) {
      finish.current.position.z = -remaining;
      finish.current.visible = remaining < 170;
    }

    // scrolling track detail
    const scroll = g.speed * d;
    if (dashes.current) dashes.current.children.forEach((ch) => { ch.position.z += scroll; if (ch.position.z > 14) ch.position.z -= 160; });
    if (posts.current) posts.current.children.forEach((ch) => { ch.position.z += scroll; if (ch.position.z > 14) ch.position.z -= 150; });

    // chase cam: trail the car, widen FOV with speed
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, g.carX * 0.4, 5, d);
    cam.position.y = 3.5;
    cam.position.z = 8.6;
    const targetFov = (mobile ? 70 : 62) + ((g.speed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED)) * 10;
    cam.fov = THREE.MathUtils.damp(cam.fov, targetFov, 4, d);
    cam.updateProjectionMatrix();
    cam.lookAt(g.carX * 0.5, 0.85, -16);
  });

  const DASH_N = 26;
  const POST_N = 24;
  return (
    <>
      <color attach="background" args={[c.canvas]} />
      <fog attach="fog" args={[c.canvas, 30, 130]} />
      <ambientLight intensity={0.55} />
      <directionalLight castShadow position={[5, 12, 6]} intensity={2.6} color="#fff3ea" shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-6, 4, -8]} intensity={1.4} color={c.edge} />
      <pointLight position={[0, 4, 4]} intensity={8} color={c.accent} distance={26} />

      <group ref={player}>
        <PlayerModel path={modelPath} />
      </group>

      {Array.from({ length: N_HURDLES }).map((_, i) => (
        <group key={i} ref={(el) => { hurdleRefs.current[i] = el; }} visible={false}>
          <Hurdle edge={c.edge} />
        </group>
      ))}

      <group ref={finish} visible={false}>
        <FinishLine />
      </group>

      {/* road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -55]}>
        <planeGeometry args={[26, 220]} />
        {mobile ? (
          <meshStandardMaterial color={c.canvas} roughness={0.7} metalness={0.4} />
        ) : (
          <MeshReflectorMaterial resolution={512} blur={[300, 90]} mixBlur={1} mixStrength={12} depthScale={1} roughness={0.8} metalness={0.5} color={c.canvas} />
        )}
      </mesh>
      {[-1.15, 1.15].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, -55]}>
          <planeGeometry args={[0.06, 220]} />
          <meshStandardMaterial color="#f5f3ee" emissive="#f5f3ee" emissiveIntensity={0.15} roughness={0.6} />
        </mesh>
      ))}
      <group ref={dashes}>
        {Array.from({ length: DASH_N }).map((_, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -i * 6]}>
            <planeGeometry args={[0.14, 2.4]} />
            <meshStandardMaterial color="#f5f3ee" emissive="#f5f3ee" emissiveIntensity={0.25} roughness={0.6} />
          </mesh>
        ))}
      </group>
      {[-3.7, 3.7].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.014, -55]}>
          <planeGeometry args={[0.5, 220]} />
          <meshStandardMaterial color={c.edge} emissive={c.edge} emissiveIntensity={0.5} />
        </mesh>
      ))}
      <group ref={posts}>
        {Array.from({ length: POST_N }).map((_, i) => (
          <group key={i} position={[0, 0, -i * 6.2]}>
            {[-4.4, 4.4].map((x) => (
              <mesh key={x} position={[x, 0.7, 0]} castShadow>
                <boxGeometry args={[0.16, 1.4, 0.16]} />
                <meshStandardMaterial color={c.edge} emissive={c.edge} emissiveIntensity={0.7} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[3, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.28} />
      </mesh>

      {!mobile && (
        <EffectComposer>
          <Bloom intensity={0.6} luminanceThreshold={0.4} luminanceSmoothing={0.9} mipmapBlur radius={0.7} />
          <Vignette offset={0.3} darkness={0.72} eskil={false} />
        </EffectComposer>
      )}
    </>
  );
}
/* eslint-enable react-hooks/immutability */

export function GridRun({ team, onExit }: { team: TeamId; onExit: () => void }) {
  const palette = PALETTES[team];
  const mobile = useMediaQuery("(max-width: 768px)");
  const game = useRef<Game>(makeGame());
  const [status, setStatus] = useState<Status>("countdown");
  const [lights, setLights] = useState(0);
  const [hud, setHud] = useState({ kmh: 0, gear: 1, time: 0, progress: 0 });
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem("gridrun-time") : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (raw) setBest(Number(raw));
  }, []);

  // start-lights countdown → go
  const startCountdown = useRef<() => void>(() => {});
  useEffect(() => {
    startCountdown.current = () => {
      let i = 0;
      const tick = () => {
        i += 1;
        if (i <= 5) { setLights(i); setTimeout(tick, 440); }
        else setTimeout(() => { setLights(0); setStatus("racing"); game.current.status = "racing"; }, 650);
      };
      setTimeout(tick, 500);
    };
    startCountdown.current();
  }, []);

  // input — ↑↓ speed (held), ←→ steer (discrete)
  useEffect(() => {
    const move = (dir: -1 | 1) => {
      const g = game.current;
      if (g.status === "racing") g.lane = Math.max(0, Math.min(2, g.lane + dir));
    };
    const onKey = (e: KeyboardEvent) => {
      const g = game.current;
      switch (e.key) {
        case "ArrowUp": case "w": case "W": e.preventDefault(); g.up = true; break;
        case "ArrowDown": case "s": case "S": e.preventDefault(); g.down = true; break;
        case "ArrowLeft": case "a": case "A": e.preventDefault(); move(-1); break;
        case "ArrowRight": case "d": case "D": e.preventDefault(); move(1); break;
        case "Escape": onExit(); break;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const g = game.current;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") g.up = false;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") g.down = false;
    };
    let sx = 0, sy = 0;
    const onTS = (e: TouchEvent) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
    const onTE = (e: TouchEvent) => {
      const g = game.current;
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 32) move(dx > 0 ? 1 : -1);
      else if (Math.abs(dy) > 32 && g.status === "racing") g.speed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, g.speed + (dy < 0 ? 14 : -14)));
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("touchstart", onTS, { passive: true });
    window.addEventListener("touchend", onTE, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("touchstart", onTS);
      window.removeEventListener("touchend", onTE);
    };
  }, [onExit]);

  // sample game state for the HUD (throttled)
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      const g = game.current;
      if (t - last > 80) {
        last = t;
        setHud({
          kmh: Math.round(g.speed * 3.4),
          gear: Math.max(1, Math.min(8, Math.round(((g.speed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED)) * 7) + 1)),
          time: g.time,
          progress: Math.min(1, g.distance / FINISH_DIST),
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onEnd = (r: "crash" | "finish") => {
    if (r === "finish") {
      setStatus("finish");
      const time = game.current.time;
      setBest((b) => {
        const nb = b == null ? time : Math.min(b, time);
        if (typeof localStorage !== "undefined") localStorage.setItem("gridrun-time", String(nb));
        return nb;
      });
    } else {
      setStatus("over");
    }
  };

  const restart = () => {
    game.current = makeGame();
    setStatus("countdown");
    setLights(0);
    startCountdown.current();
  };

  const isFinish = status === "finish";
  const finalTime = game.current.time;
  const isPB = best != null && Math.abs(best - finalTime) < 0.05;

  return (
    <motion.div
      className="fixed inset-0 z-[70] overflow-hidden"
      style={{ background: palette.vars["--pt-canvas"] }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Canvas shadows={!mobile} camera={{ position: [0, 3.5, 8.6], fov: mobile ? 70 : 62 }} dpr={mobile ? [1, 1.3] : [1, 1.7]} gl={{ antialias: !mobile }}>
        <Suspense fallback={null}>
          <Scene game={game} colors={palette} modelPath={palette.three.model} mobile={mobile} onEnd={onEnd} />
        </Suspense>
      </Canvas>

      {/* HUD */}
      <div className="pointer-events-none absolute inset-0 z-[71] font-mono text-white">
        {/* lap time */}
        <div className="absolute left-5 top-5 sm:left-8 sm:top-8">
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/50">lap time</div>
          <div className={`${anton.className} text-5xl leading-none tabular-nums sm:text-6xl`}>{fmtTime(hud.time)}</div>
          {best != null && <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/40">best · {fmtTime(best)}</div>}
        </div>
        {/* speed + gear */}
        <div className="absolute right-5 top-5 text-right sm:right-8 sm:top-8">
          <div className="flex items-baseline justify-end gap-2">
            <span className="tabular-nums text-4xl font-bold leading-none sm:text-5xl">{hud.kmh.toString().padStart(3, "0")}</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">km/h</span>
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/50">
            gear <span className="text-lg font-bold" style={{ color: palette.vars["--pt-primary"] }}>{hud.gear}</span>
          </div>
        </div>
        {/* progress to flag */}
        <div className="absolute bottom-6 left-1/2 w-64 -translate-x-1/2 text-center">
          <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-white/50">
            <span>lap</span>
            <span className="tabular-nums">{Math.round(hud.progress * 100)}%</span>
            <span>🏁</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full" style={{ width: `${hud.progress * 100}%`, background: palette.vars["--pt-primary"] }} />
          </div>
          <div className="mt-2 hidden text-[10px] uppercase tracking-[0.25em] text-white/40 sm:block">↑ accelerate · ↓ brake · ← → steer · esc exit</div>
        </div>
      </div>

      <button
        onClick={onExit}
        className="pointer-events-auto absolute right-5 top-24 z-[72] rounded-full border border-white/20 bg-black/30 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm transition-colors hover:text-white sm:top-28"
      >
        ✕ exit
      </button>

      {/* start-lights countdown */}
      <AnimatePresence>
        {status === "countdown" && (
          <motion.div className="pointer-events-none absolute inset-0 z-[72] flex flex-col items-center justify-center" exit={{ opacity: 0 }}>
            <div className="flex gap-2 sm:gap-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className="h-10 w-8 rounded-sm sm:h-14 sm:w-11" style={{ background: i < lights ? "#ff2222" : "rgba(255,255,255,0.12)", boxShadow: i < lights ? "0 0 22px #ff2222" : "none" }} />
              ))}
            </div>
            <div className={`${anton.className} mt-6 text-2xl uppercase tracking-wide text-white/80 sm:text-4xl`}>
              {lights < 5 ? "Grid — get ready" : "Lights out!"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* finish / crash */}
      <AnimatePresence>
        {(status === "over" || status === "finish") && (
          <motion.div className="absolute inset-0 z-[72] flex flex-col items-center justify-center text-center" style={{ background: "rgba(0,0,0,0.62)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="font-mono text-sm uppercase tracking-[0.3em]" style={{ color: palette.vars["--pt-primary"] }}>
              {isFinish ? "🏁 Chequered flag" : "Retired — DNF"}
            </div>
            <div className={`${anton.className} mt-2 text-6xl uppercase leading-none sm:text-7xl`}>
              {isFinish ? fmtTime(finalTime) : "Crashed"}
            </div>
            <div className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-white/60">
              {isFinish ? (isPB ? "★ new personal best!" : best != null ? `best · ${fmtTime(best)}` : "") : "you hit a barrier"}
            </div>
            <div className="mt-8 flex gap-3">
              <button onClick={restart} className={`${anton.className} pointer-events-auto rounded-lg px-6 py-3 text-xl uppercase tracking-wide transition-transform hover:-translate-y-0.5`} style={{ background: palette.vars["--pt-primary"], color: palette.vars["--pt-on-primary"] }}>
                {isFinish ? "Race again ↻" : "Re-run ↻"}
              </button>
              <button onClick={onExit} className="pointer-events-auto rounded-lg border border-white/25 px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-white/80 transition-colors hover:text-white">
                Exit to site
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
