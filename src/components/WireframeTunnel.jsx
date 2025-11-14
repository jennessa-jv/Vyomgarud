// src/components/WireframeTunnel.jsx
import React, { useRef, useEffect } from "react";

export default function WireframeTunnel({
  aspect = 420 / 300,
  colorA = "rgba(255,150,0,0.35)",
  colorB = "rgba(0,255,120,0.35)",
  frames = 22,
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

    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      // atmospheric dim fade
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0, 0, W, H);

      // gradient
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
        x0: vanishX - 15,
        y0: vanishY - 15,
        x1: vanishX + 15,
        y1: vanishY + 15,
      };

      const rects = [];
      for (let i = 0; i < frames; i++) {
        const t = Math.pow(i / (frames - 1), 1.2);
        rects.push({
          x0: lerp(near.x0, far.x0, t),
          y0: lerp(near.y0, far.y0, t),
          x1: lerp(near.x1, far.x1, t),
          y1: lerp(near.y1, far.y1, t),
        });
      }

      // cinematic softer glow
      ctx.globalCompositeOperation = "screen";
      ctx.strokeStyle = grad;

      rects.forEach((r, idx) => {
        ctx.globalAlpha = 0.25 * (1 - idx / frames); // dimmer
        ctx.lineWidth = lerp(1.4, 0.2, idx / frames);

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
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = (e.clientY - rect.top) / rect.height;
    };

    window.addEventListener("pointermove", handleMove);
    resize();
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", handleMove);
    };
  }, [aspect, colorA, colorB, frames]);

  return (
    <div
      ref={wrapperRef}
      className="w-full relative"
      style={{ paddingBottom: `${100 / aspect}%` }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
