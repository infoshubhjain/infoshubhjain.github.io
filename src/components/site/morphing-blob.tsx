"use client";

import { useEffect, useRef } from "react";

/**
 * Generative morphing blob that responds to cursor position.
 * Lightweight canvas-only — no WebGL dependency.
 */
export function MorphingBlob({
  className,
  color = "primary",
}: {
  className?: string;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Simplex-ish noise via sin combination
    const noise = (x: number, y: number, t: number) => {
      return (
        Math.sin(x * 1.2 + t * 0.7) *
        Math.cos(y * 0.9 + t * 0.5) *
        Math.sin((x + y) * 0.8 + t * 0.3)
      );
    };

    const draw = () => {
      t += 0.008;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      // Smooth mouse follow
      smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * 0.03;
      smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * 0.03;

      ctx.clearRect(0, 0, w, h);

      // Get computed primary color
      const style = getComputedStyle(document.documentElement);
      const primaryHSL = style.getPropertyValue("--primary").trim() || "160 84% 39%";

      // Draw 3 layered blobs with noise distortion
      for (let layer = 0; layer < 3; layer++) {
        const layerT = t + layer * 0.8;
        const radiusBase = Math.min(w, h) * (0.25 - layer * 0.04);
        const cx = w * (0.4 + layer * 0.1) + (smoothMouse.current.x - 0.5) * 30 * (layer + 1);
        const cy = h * (0.35 + layer * 0.08) + (smoothMouse.current.y - 0.5) * 20 * (layer + 1);

        ctx.beginPath();
        const steps = 80;
        for (let i = 0; i <= steps; i++) {
          const angle = (i / steps) * Math.PI * 2;
          const n = noise(
            Math.cos(angle) * 1.5 + layer,
            Math.sin(angle) * 1.5 + layer,
            layerT
          );
          const r = radiusBase + n * radiusBase * 0.35;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();

        const alpha = 0.08 - layer * 0.02;
        ctx.fillStyle = `hsla(${primaryHSL}, ${alpha})`;
        ctx.filter = `blur(${40 + layer * 20}px)`;
        ctx.fill();
      }
      ctx.filter = "none";

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
      aria-hidden
    />
  );
}
