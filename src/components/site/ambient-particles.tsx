"use client";

import { useEffect, useRef } from "react";

export function AmbientParticles({ count = 50 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      r: 2 + Math.random() * 2,
      vx: 0.1 + Math.random() * 0.2,
      vy: 0.05 + Math.random() * 0.1,
      opacity: 0.1 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    const color = "oklch(0.78 0.18 165)";

    const draw = () => {
      ctx.clearRect(0, 0, w(), h());

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.01;

        if (p.x > w() + p.r) p.x = -p.r;
        if (p.x < -p.r) p.x = w() + p.r;
        if (p.y > h() + p.r) p.y = -p.r;
        if (p.y < -p.r) p.y = h() + p.r;

        ctx.globalAlpha = p.opacity + Math.sin(p.phase) * 0.15;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[-40]"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
