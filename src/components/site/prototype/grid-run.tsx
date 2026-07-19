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
 * "URBANA GP — GRID RUN": an F1 endless-runner. Launched from the hero Drive
 * button. Weave across three grid lanes, dodge rival cars, grab DRS boosts, and
 * climb from P20 toward P1. The player is the real team car; rivals are pooled
 * low-poly cars. All hot state lives in a mutable ref (`game`) mutated inside
 * useFrame — the DOM HUD samples it on its own rAF to avoid per-frame re-renders.
 */

const DRACO_PATH = "/draco/";
// Tuned so the car's nose points down-track (away from the chase cam).
const PLAYER_YAW = 0;
const LANES = [-2.3, 0, 2.3];
const START_SPEED = 34;
const MAX_SPEED = 96;
const ACCEL = 2.3; // speed gained per second
const DRS_MULT = 1.5;
const DRS_TIME = 1.8; // boost seconds
const DRS_REFILL = 4.5; // seconds to refill the meter
const SPAWN_Z = -140; // rivals appear this far ahead
const BEHIND_Z = 13; // past here a rival is behind you
const CAR_LEN = 4.4; // collision half-window ×2
const N_RIVALS = 7;
const START_POS = 20;

type Rival = { z: number; lane: number; close: number; color: string; hit: boolean };
type Status = "countdown" | "racing" | "over";
type Game = {
  status: Status;
  speed: number;
  distance: number;
  lane: number; // target lane 0..2
  carX: number; // smoothed x
  overtakes: number;
  drs: number; // meter 0..1
  drsActive: number; // seconds remaining
  crashT: number; // crash spin timer
  rivals: Rival[];
};

const RIVAL_COLORS = ["#ff3b3b", "#00d2be", "#ff8000", "#3671c6", "#b6babd", "#2293d1", "#358c75", "#e8002d"];

function makeGame(): Game {
  const rivals: Rival[] = Array.from({ length: N_RIVALS }, (_, i) => ({
    z: SPAWN_Z * (0.35 + (i / N_RIVALS) * 0.9),
    lane: Math.floor(Math.random() * 3),
    close: 0.42 + Math.random() * 0.22,
    color: RIVAL_COLORS[i % RIVAL_COLORS.length],
    hit: false,
  }));
  return { status: "countdown", speed: START_SPEED, distance: 0, lane: 1, carX: 0, overtakes: 0, drs: 1, drsActive: 0, crashT: 0, rivals };
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

/** The real team car, normalized and oriented to face away down the track. */
function PlayerModel({ path }: { path: string }) {
  const { scene } = useGLTF(path, DRACO_PATH);
  const model = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = true; });
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
  return <primitive object={model} rotation={[0, PLAYER_YAW, 0]} />;
}

/** Pooled low-poly rival F1 car. */
function RivalCar({ color }: { color: string }) {
  const body = (c: string, rough = 0.4, metal = 0.5) => (
    <meshStandardMaterial color={c} roughness={rough} metalness={metal} />
  );
  return (
    <group rotation={[0, PLAYER_YAW, 0]}>
      {/* chassis */}
      <mesh castShadow position={[0, 0.42, 0]}>
        <boxGeometry args={[4.0, 0.34, 0.86]} />
        {body(color)}
      </mesh>
      {/* nose */}
      <mesh castShadow position={[2.4, 0.4, 0]}>
        <boxGeometry args={[1.3, 0.2, 0.34]} />
        {body(color)}
      </mesh>
      {/* airbox */}
      <mesh castShadow position={[-0.2, 0.72, 0]}>
        <boxGeometry args={[0.7, 0.34, 0.4]} />
        {body("#0d0d0f", 0.6, 0.2)}
      </mesh>
      {/* rear wing */}
      <mesh castShadow position={[-2.35, 0.82, 0]}>
        <boxGeometry args={[0.18, 0.46, 1.5]} />
        {body(color)}
      </mesh>
      {/* front wing */}
      <mesh castShadow position={[3.05, 0.16, 0]}>
        <boxGeometry args={[0.5, 0.06, 1.7]} />
        {body("#0d0d0f", 0.6, 0.2)}
      </mesh>
      {/* wheels */}
      {[[1.6, 0.62], [1.6, -0.62], [-1.7, 0.66], [-1.7, -0.66]].map(([x, z], i) => (
        <mesh key={i} castShadow position={[x, 0.34, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.32, 20]} />
          {body("#111114", 0.85, 0.1)}
        </mesh>
      ))}
    </group>
  );
}

/* eslint-disable react-hooks/immutability -- r3f mutates object3D transforms in useFrame by design */
function Scene({ game, colors, modelPath, mobile, onEnd }: { game: React.MutableRefObject<Game>; colors: Palette; modelPath: string; mobile: boolean; onEnd: () => void }) {
  const player = useRef<THREE.Group>(null);
  const rivalRefs = useRef<(THREE.Group | null)[]>([]);
  const dashes = useRef<THREE.Group>(null);
  const posts = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const c = colors.three;
  const ended = useRef(false);

  useFrame((state, delta) => {
    const g = game.current;
    const d = Math.min(delta, 0.05);

    // crash spin-out then hand off to the game-over overlay
    if (g.status === "over") {
      g.crashT += d;
      if (player.current) {
        player.current.rotation.y += d * 7 * Math.max(0, 1 - g.crashT);
        player.current.position.y = Math.max(0, Math.sin(g.crashT * 4) * 0.15 * Math.max(0, 1 - g.crashT));
      }
      if (!ended.current && g.crashT > 0.4) { ended.current = true; onEnd(); }
      return;
    }

    if (g.status !== "racing") return;
    ended.current = false; // allow a fresh game-over after a re-run

    g.speed = Math.min(MAX_SPEED, g.speed + ACCEL * d);
    const boost = g.drsActive > 0 ? DRS_MULT : 1;
    const v = g.speed * boost;
    g.distance += v * d;

    // DRS meter: drain while active, refill otherwise
    if (g.drsActive > 0) g.drsActive = Math.max(0, g.drsActive - d);
    else g.drs = Math.min(1, g.drs + d / DRS_REFILL);

    // player lane + bank
    g.carX = THREE.MathUtils.damp(g.carX, LANES[g.lane], 9, d);
    if (player.current) {
      player.current.position.x = g.carX;
      player.current.position.z = 0;
      player.current.position.y = 0.02;
      // group holds position + bank; the yaw lives on the model (PlayerModel)
      player.current.rotation.set(0, 0, (LANES[g.lane] - g.carX) * 0.16);
    }

    // rivals approach, collide, get overtaken, recycle
    const pLane = nearestLane(g.carX);
    const committed = Math.abs(g.carX - LANES[pLane]) < 1.0;
    for (let i = 0; i < g.rivals.length; i++) {
      const r = g.rivals[i];
      r.z += v * r.close * d;
      if (!r.hit && committed && r.lane === pLane && Math.abs(r.z) < CAR_LEN * 0.5) {
        // contact → spin out
        g.status = "over";
        return;
      }
      if (r.z > BEHIND_Z) {
        if (!r.hit) { g.overtakes += 1; } // cleanly passed
        // recycle ahead in a fresh lane, spread out
        r.z = SPAWN_Z - Math.random() * 30;
        r.lane = Math.floor(Math.random() * 3);
        r.close = 0.4 + Math.random() * 0.24;
        r.color = RIVAL_COLORS[Math.floor(Math.random() * RIVAL_COLORS.length)];
        r.hit = false;
      }
      const ref = rivalRefs.current[i];
      if (ref) { ref.position.set(LANES[r.lane], 0.02, r.z); ref.visible = r.z > SPAWN_Z - 10; }
    }

    // track motion: lane dashes + side posts scroll toward the camera
    const scroll = v * d;
    if (dashes.current) dashes.current.children.forEach((ch) => { ch.position.z += scroll; if (ch.position.z > 14) ch.position.z -= 160; });
    if (posts.current) posts.current.children.forEach((ch) => { ch.position.z += scroll; if (ch.position.z > 14) ch.position.z -= 150; });

    // chase cam: trail the car, widen FOV on DRS
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, g.carX * 0.4, 5, d);
    cam.position.y = 3.5;
    cam.position.z = 8.6;
    const targetFov = (mobile ? 72 : 64) + (g.drsActive > 0 ? 8 : 0);
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

      {/* player */}
      <group ref={player}>
        <PlayerModel path={modelPath} />
      </group>

      {/* rivals */}
      {Array.from({ length: N_RIVALS }).map((_, i) => (
        <group key={i} ref={(el) => { rivalRefs.current[i] = el; }} visible={false}>
          <RivalCar color={game.current.rivals[i].color} />
        </group>
      ))}

      {/* road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -55]}>
        <planeGeometry args={[26, 220]} />
        {mobile ? (
          <meshStandardMaterial color={c.canvas} roughness={0.7} metalness={0.4} />
        ) : (
          <MeshReflectorMaterial resolution={512} blur={[300, 90]} mixBlur={1} mixStrength={12} depthScale={1} roughness={0.8} metalness={0.5} color={c.canvas} />
        )}
      </mesh>
      {/* lane dividers */}
      {[-1.15, 1.15].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, -55]}>
          <planeGeometry args={[0.06, 220]} />
          <meshStandardMaterial color="#f5f3ee" emissive="#f5f3ee" emissiveIntensity={0.15} roughness={0.6} />
        </mesh>
      ))}
      {/* centre-lane dashes */}
      <group ref={dashes}>
        {Array.from({ length: DASH_N }).map((_, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -i * 6]}>
            <planeGeometry args={[0.14, 2.4]} />
            <meshStandardMaterial color="#f5f3ee" emissive="#f5f3ee" emissiveIntensity={0.25} roughness={0.6} />
          </mesh>
        ))}
      </group>
      {/* red/white curbs */}
      {[-3.7, 3.7].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.014, -55]}>
          <planeGeometry args={[0.5, 220]} />
          <meshStandardMaterial color={c.edge} emissive={c.edge} emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* side posts for speed sense */}
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

      <ContactShadowsLite />
      {!mobile && (
        <EffectComposer>
          <Bloom intensity={0.6} luminanceThreshold={0.4} luminanceSmoothing={0.9} mipmapBlur radius={0.7} />
          <Vignette offset={0.3} darkness={0.72} eskil={false} />
        </EffectComposer>
      )}
    </>
  );
}

function ContactShadowsLite() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
      <circleGeometry args={[3, 24]} />
      <meshBasicMaterial color="#000000" transparent opacity={0.28} />
    </mesh>
  );
}
/* eslint-enable react-hooks/immutability */

export function GridRun({ team, onExit }: { team: TeamId; onExit: () => void }) {
  const palette = PALETTES[team];
  const mobile = useMediaQuery("(max-width: 768px)");
  const game = useRef<Game>(makeGame());
  const [status, setStatus] = useState<Status>("countdown");
  const [lights, setLights] = useState(0);
  const [hud, setHud] = useState({ position: START_POS, kmh: 0, gear: 1, drs: 1, drsActive: false });
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem("gridrun-best") : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (raw) setBest(Number(raw));
  }, []);

  // start-lights countdown → go
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= 5; i++) timers.push(setTimeout(() => setLights(i), 500 + i * 420));
    timers.push(
      setTimeout(() => {
        setLights(0);
        setStatus("racing");
        game.current.status = "racing";
      }, 500 + 5 * 420 + 650),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // input
  useEffect(() => {
    const move = (dir: -1 | 1) => {
      const g = game.current;
      if (g.status !== "racing") return;
      g.lane = Math.max(0, Math.min(2, g.lane + dir));
    };
    const drs = () => {
      const g = game.current;
      if (g.status === "racing" && g.drsActive <= 0 && g.drs > 0.95) { g.drsActive = DRS_TIME; g.drs = 0; }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") { e.preventDefault(); move(-1); }
      else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") { e.preventDefault(); move(1); }
      else if (e.key === " ") { e.preventDefault(); drs(); }
      else if (e.key === "Escape") onExit();
    };
    let sx = 0;
    const onTS = (e: TouchEvent) => { sx = e.touches[0].clientX; };
    const onTE = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 34) move(dx > 0 ? 1 : -1);
      else drs();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTS, { passive: true });
    window.addEventListener("touchend", onTE, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTS);
      window.removeEventListener("touchend", onTE);
    };
  }, [onExit]);

  // sample game state for the HUD (throttled, no per-frame React churn)
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      const g = game.current;
      if (t - last > 90) {
        last = t;
        const position = Math.max(1, START_POS - g.overtakes);
        setHud({
          position,
          kmh: Math.round((g.speed * (g.drsActive > 0 ? DRS_MULT : 1)) * 3.35),
          gear: Math.max(1, Math.min(8, Math.round((g.speed / MAX_SPEED) * 7) + 1)),
          drs: g.drs,
          drsActive: g.drsActive > 0,
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const endRace = () => {
    setStatus("over");
    const finalPos = Math.max(1, START_POS - game.current.overtakes);
    setBest((b) => {
      const nb = b == null ? finalPos : Math.min(b, finalPos);
      if (typeof localStorage !== "undefined") localStorage.setItem("gridrun-best", String(nb));
      return nb;
    });
  };

  const restart = () => {
    game.current = makeGame();
    setStatus("countdown");
    setLights(0);
    // replay countdown
    let i = 0;
    const tick = () => {
      i++;
      if (i <= 5) { setLights(i); setTimeout(tick, 420); }
      else setTimeout(() => { setLights(0); setStatus("racing"); game.current.status = "racing"; }, 650);
    };
    setTimeout(tick, 500);
  };

  const finalPos = Math.max(1, START_POS - game.current.overtakes);

  return (
    <motion.div
      className="fixed inset-0 z-[70] overflow-hidden"
      style={{ background: palette.vars["--pt-canvas"] }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Canvas
        shadows={!mobile}
        camera={{ position: [0, 3.5, 8.6], fov: mobile ? 72 : 64 }}
        dpr={mobile ? [1, 1.3] : [1, 1.7]}
        gl={{ antialias: !mobile }}
      >
        <Suspense fallback={null}>
          <Scene game={game} colors={palette} modelPath={palette.three.model} mobile={mobile} onEnd={endRace} />
        </Suspense>
      </Canvas>

      {/* HUD */}
      <div className="pointer-events-none absolute inset-0 z-[71] font-mono text-white">
        {/* position */}
        <div className="absolute left-5 top-5 sm:left-8 sm:top-8">
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/50">position</div>
          <div className={`${anton.className} text-6xl leading-none sm:text-7xl`} style={{ color: hud.position <= 3 ? palette.vars["--pt-accent"] : "#fff" }}>
            P{hud.position}
          </div>
          {best != null && <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/40">best · P{best}</div>}
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
        {/* DRS meter */}
        <div className="absolute bottom-6 left-1/2 w-56 -translate-x-1/2 text-center">
          <div className="mb-1 text-[10px] uppercase tracking-[0.3em]" style={{ color: hud.drsActive ? "#2ee56b" : "rgba(255,255,255,0.5)" }}>
            {hud.drsActive ? "▮ DRS OPEN" : hud.drs > 0.95 ? "DRS READY — SPACE" : "DRS charging"}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full" style={{ width: `${Math.round(hud.drs * 100)}%`, background: hud.drsActive ? "#2ee56b" : palette.vars["--pt-primary"] }} />
          </div>
          <div className="mt-2 hidden text-[10px] uppercase tracking-[0.25em] text-white/40 sm:block">← → steer · space drs · esc exit</div>
        </div>
      </div>

      {/* exit */}
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
                <span
                  key={i}
                  className="h-10 w-8 rounded-sm sm:h-14 sm:w-11"
                  style={{ background: i < lights ? "#ff2222" : "rgba(255,255,255,0.12)", boxShadow: i < lights ? "0 0 22px #ff2222" : "none" }}
                />
              ))}
            </div>
            <div className={`${anton.className} mt-6 text-2xl uppercase tracking-wide text-white/80 sm:text-4xl`}>
              {lights < 5 ? "Grid — get ready" : "Lights out!"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* game over */}
      <AnimatePresence>
        {status === "over" && (
          <motion.div
            className="absolute inset-0 z-[72] flex flex-col items-center justify-center text-center"
            style={{ background: "rgba(0,0,0,0.6)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="font-mono text-sm uppercase tracking-[0.3em]" style={{ color: palette.vars["--pt-primary"] }}>
              {finalPos === 1 ? "Chequered flag" : "Retired — DNF"}
            </div>
            <div className={`${anton.className} mt-2 text-7xl uppercase leading-none sm:text-8xl`} style={{ color: "#fff" }}>
              P{finalPos}
            </div>
            <div className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-white/60">
              {game.current.overtakes} overtakes{best != null ? ` · best P${best}` : ""}
            </div>
            <div className="mt-8 flex gap-3">
              <button
                onClick={restart}
                className={`${anton.className} pointer-events-auto rounded-lg px-6 py-3 text-xl uppercase tracking-wide transition-transform hover:-translate-y-0.5`}
                style={{ background: palette.vars["--pt-primary"], color: palette.vars["--pt-on-primary"] }}
              >
                Re-run ↻
              </button>
              <button
                onClick={onExit}
                className="pointer-events-auto rounded-lg border border-white/25 px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-white/80 transition-colors hover:text-white"
              >
                Exit to site
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
