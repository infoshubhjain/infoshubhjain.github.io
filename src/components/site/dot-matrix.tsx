"use client";

import { useEffect, useRef } from "react";

/**
 * Canvas dot-matrix that lights up around the cursor (Clerk-style reveal).
 * Renders as a pointer-events-none overlay; listens on its parent element,
 * so drop it inside any relatively-positioned hover card.
 */
export function DotMatrix({
  spacing = 16,
  radius = 130,
  className,
}: {
  spacing?: number;
  radius?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let mouse: { x: number; y: number } | null = null;
    // Intensity eases toward target for a soft fade-in/out.
    let intensity = 0;
    let target = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const color = getComputedStyle(parent).getPropertyValue("--primary").trim();

    const draw = () => {
      intensity += (target - intensity) * 0.08;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      ctx.clearRect(0, 0, w, h);

      if (intensity > 0.01 && mouse) {
        for (let x = spacing / 2; x < w; x += spacing) {
          for (let y = spacing / 2; y < h; y += spacing) {
            const d = Math.hypot(x - mouse.x, y - mouse.y);
            if (d > radius) continue;
            const falloff = 1 - d / radius;
            const r = 1.6 * falloff * intensity;
            if (r < 0.1) continue;
            ctx.globalAlpha = falloff * 0.7 * intensity;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      if (intensity > 0.01 || target > 0) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };
    const onMove = (e: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      target = 1;
      start();
    };
    const onLeave = () => {
      target = 0;
      start();
    };

    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, [spacing, radius]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
    />
  );
}
