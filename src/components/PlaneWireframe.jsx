// src/components/WireframeTunnel.jsx
import React, { useRef, useEffect } from "react";

export default function PlaneWireframe({
  aspect = 420 / 300,
  colorA = "#ff5a8a",
  colorB = "#b66cff",
  frames = 20,
}) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    const DPR = window.devicePixelRatio || 1;

    let W, H;

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      W = rect.width;
      H = rect.width / aspect;

      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = (t) => {
      ctx.clearRect(0, 0, W, H);

      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, colorA);
      grad.addColorStop(1, colorB);

      const pad = W * 0.05;
      const near = { x0: pad, y0: pad, x1: W - pad, y1: H - pad };

      const px = mouseRef.current.x;
      const py = mouseRef.current.y;

      const vanishX = lerp(near.x0 + W * 0.12, near.x0 + W * 0.04, px);
      const vanishY = lerp(near.y0 + H * 0.45, near.y0 + H * 0.55, py);

      const far = {
        x0: vanishX - 20,
        y0: vanishY - 20,
        x1: vanishX + 20,
        y1: vanishY + 20,
      };

      const rects = [];
      for (let i = 0; i < frames; i++) {
        const t = Math.pow(i / (frames - 1), 1.18);
        rects.push({
          x0: lerp(near.x0, far.x0, t),
          y0: lerp(near.y0, far.y0, t),
          x1: lerp(near.x1, far.x1, t),
          y1: lerp(near.y1, far.y1, t),
        });
      }

      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = grad;
      ctx.lineJoin = "round";

      rects.forEach((r, idx) => {
        ctx.globalAlpha = 1 - idx / frames;
        ctx.lineWidth = lerp(2.2, 0.4, idx / frames);

        ctx.beginPath();
        ctx.moveTo(r.x0, r.y0);
        ctx.lineTo(r.x1, r.y0);
        ctx.lineTo(r.x1, r.y1);
        ctx.lineTo(r.x0, r.y1);
        ctx.closePath();
        ctx.stroke();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    const handleMove = (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseRef.current = { x, y };
    };

    window.addEventListener("pointermove", handleMove);
    resize();
    animate(0);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", handleMove);
    };
  }, [aspect, colorA, colorB, frames]);

  return (
    <div ref={wrapperRef} className="w-full relative" style={{ paddingBottom: `${100 / aspect}%` }}>
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
