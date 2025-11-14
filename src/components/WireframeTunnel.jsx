// src/components/WireframeTunnel.jsx
import React, { useRef, useEffect } from "react";

/**
 * WireframeTunnel (responsive + neon + pulsing + parallax + vignette + scanlines)
 *
 * Props:
 *  - aspect: width/height ratio (default 420/300)
 *  - colorA/colorB: neon gradient colors
 *  - frames: number of tunnel frames
 *  - scan: object to tweak scanline effect
 */
export default function WireframeTunnel({
  aspect = 420 / 300,
  colorA = "#ff5a8a", // pink (refined)
  colorB = "#b66cff", // purple (refined)
  frames = 20,
  scan = { lineCount: 30, speed: 0.18, alpha: 0.06 }, // small subtle scanlines
}) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 }); // normalized
  const DPR = Math.max(1, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    // helpers
    const lerp = (a, b, t) => a + (b - a) * t;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    let W = 0;
    let H = 0;
    let start = performance.now();

    function resize() {
      const rect = wrapper.getBoundingClientRect();
      W = Math.max(32, rect.width);
      H = Math.max(48, Math.round(rect.width / aspect));
      // set canvas pixel size with DPR
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      // ensure a fresh start for time-based animation
      start = performance.now();
    }

    // rounded rect clip helper
    function roundRectPath(ctx, x, y, w, h, r) {
      const radius = Math.max(0, Math.min(r, w / 2, h / 2));
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
    }

    // convert hex to rgba string
    function toRgba(hex, a = 1) {
      const h = hex.replace("#", "");
      const r = parseInt(h.substring(0, 2), 16);
      const g = parseInt(h.substring(2, 4), 16);
      const b = parseInt(h.substring(4, 6), 16);
      return `rgba(${r},${g},${b},${a})`;
    }

    function draw(now) {
      const t = now - start;

      // clear fully (transparent)
      ctx.clearRect(0, 0, W, H);

      // clip to rounded rect to keep corners clean
      ctx.save();
      const cornerR = Math.min(22, W * 0.05);
      roundRectPath(ctx, 0, 0, W, H, cornerR);
      ctx.clip();

      // --- NO background fill (transparent) ---
      // (we removed ctx.fillStyle = "#042a24"; ctx.fillRect(...))

      // prepare near/far rects (same logic as before)
      const padX = Math.max(14, W * 0.048);
      const padY = Math.max(14, H * 0.048);
      const near = { x0: padX, y0: padY, x1: W - padX, y1: H - padY };

      // pointer parallax-derived vanish point
      const px = mouseRef.current.x;
      const py = mouseRef.current.y;
      const vanishX = lerp(near.x0 + (near.x1 - near.x0) * 0.12, near.x0 + (near.x1 - near.x0) * 0.06, px);
      const vanishY = lerp(near.y0 + (near.y1 - near.y0) * 0.45, near.y0 + (near.y1 - near.y0) * 0.55, py);
      const vanishW = Math.max(28, W * 0.095);
      const far = { x0: vanishX - vanishW / 2, y0: vanishY - vanishW / 2, x1: vanishX + vanishW / 2, y1: vanishY + vanishW / 2 };

      // pulsing factor (gentle)
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.0012);
      const pulseEase = 0.92 + 0.18 * easeOut(pulse);

      // build rects
      const rects = [];
      for (let i = 0; i < frames; i++) {
        const u = i / (frames - 1);
        const easeT = Math.pow(u, 1.12);
        const rx0 = lerp(near.x0, far.x0, easeT);
        const ry0 = lerp(near.y0, far.y0, easeT);
        const rx1 = lerp(near.x1, far.x1, easeT);
        const ry1 = lerp(near.y1, far.y1, easeT);
        rects.push({ x0: rx0, y0: ry0, x1: rx1, y1: ry1, t: easeT });
      }

      // neon gradient
      const grad = ctx.createLinearGradient(W * 0.05, 0, W * 0.95, H);
      grad.addColorStop(0, colorA);
      grad.addColorStop(1, colorB);

      // additive neon drawing
      ctx.globalCompositeOperation = "lighter";
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      for (let idx = 0; idx < rects.length; idx++) {
        const r = rects[idx];
        const depth = idx / (rects.length - 1);
        const alphaBase = lerp(0.98, 0.28, depth);
        const depthPulse = 1 + 0.06 * Math.sin(t * 0.0015 + idx * 0.25);
        const lineW = lerp(1.6, 0.8, depth) * pulseEase * depthPulse;
        ctx.lineWidth = Math.max(0.6, lineW * Math.min(2.6, DPR));
        ctx.strokeStyle = grad;
        ctx.shadowBlur = lerp(6, 14, 1 - depth);
        ctx.shadowColor = `rgba(255,110,170,${Math.min(0.95, alphaBase)})`;
        ctx.globalAlpha = alphaBase * (0.92 + 0.08 * Math.sin(t * 0.0009 + idx));
        ctx.beginPath();
        ctx.moveTo(r.x0, r.y0);
        ctx.lineTo(r.x1, r.y0);
        ctx.lineTo(r.x1, r.y1);
        ctx.lineTo(r.x0, r.y1);
        ctx.closePath();
        ctx.stroke();
      }

      // connectors (grid)
      const cols = Math.max(8, Math.floor(W / 46));
      const rows = Math.max(6, Math.floor(H / 30));

      ctx.lineWidth = 0.92;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(255,110,170,0.28)";
      ctx.globalAlpha = 0.86;

      for (let c = 0; c <= cols; c++) {
        const frac = c / cols;
        ctx.beginPath();
        for (let k = 0; k < rects.length; k++) {
          const r = rects[k];
          const x = lerp(r.x0, r.x1, frac);
          const y = r.y0;
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = grad;
        ctx.stroke();
      }

      ctx.shadowColor = "rgba(190,110,255,0.22)";
      ctx.globalAlpha = 0.8;

      for (let rIdx = 0; rIdx <= rows; rIdx++) {
        const frac = rIdx / rows;
        ctx.beginPath();
        for (let k = 0; k < rects.length; k++) {
          const rct = rects[k];
          const y = lerp(rct.y0, rct.y1, frac);
          const x = rct.x0;
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = grad;
        ctx.stroke();
      }

      // accent far square
      ctx.beginPath();
      ctx.lineWidth = 2.4 * (1.0 + 0.08 * Math.sin(t * 0.0008));
      ctx.shadowBlur = 18;
      ctx.shadowColor = "rgba(255,110,170,0.95)";
      ctx.globalAlpha = 1;
      ctx.moveTo(far.x0, far.y0);
      ctx.lineTo(far.x1, far.y0);
      ctx.lineTo(far.x1, far.y1);
      ctx.lineTo(far.x0, far.y1);
      ctx.closePath();
      ctx.stroke();

      // restore to normal composite for overlays
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      // --- VIGNETTE (soft radial/directional) ---
      // radial darkening on corners to help neon pop
      ctx.save();
      const vig = ctx.createRadialGradient(W * 0.5, H * 0.45, Math.min(W, H) * 0.18, W * 0.5, H * 0.45, Math.max(W, H) * 0.9);
      vig.addColorStop(0.0, "rgba(0,0,0,0)");      // center transparent
      vig.addColorStop(0.6, "rgba(0,0,0,0.04)");
      vig.addColorStop(1.0, "rgba(0,0,0,0.32)");   // corners darker
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // --- HORIZONTAL SCAN LINES (animated) ---
      // subtle neon tint in the scan lines: gradient across width
      ctx.save();
      const scanOffset = (t * 0.001 * scan.speed * H) % (H / scan.lineCount);
      const scanGrad = ctx.createLinearGradient(0, 0, W, 0);
      scanGrad.addColorStop(0, toRgba(colorA, 0.85));
      scanGrad.addColorStop(1, toRgba(colorB, 0.85));
      ctx.globalCompositeOperation = "overlay";
      ctx.globalAlpha = scan.alpha;

      // draw N thin lines spaced evenly, offset moves over time
      const spacing = H / (scan.lineCount || 30);
      for (let i = -2; i < scan.lineCount + 4; i++) {
        const y = (i * spacing + scanOffset) % (H + spacing) - spacing;
        // soft single-pixel lines: draw a thin gradient band
        const band = 1.0 + Math.sin((i + t * 0.002) * 0.4) * 0.4; // slight variance
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.lineWidth = 0.9 * band;
        ctx.strokeStyle = scanGrad;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.restore();

      // finish clip
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    }

    // pointer -> normalized smoothing
    function handlePointerMove(e) {
      const rect = wrapper.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0] && e.touches[0].clientY);
      if (clientX == null || clientY == null) return;
      const nx = (clientX - rect.left) / rect.width;
      const ny = (clientY - rect.top) / rect.height;
      mouseRef.current.x = lerp(mouseRef.current.x, Math.min(1, Math.max(0, nx)), 0.18);
      mouseRef.current.y = lerp(mouseRef.current.y, Math.min(1, Math.max(0, ny)), 0.18);
    }

    // idle gentle motion
    let idleAngle = 0;
    function idleTick() {
      idleAngle += 0.0009;
      const cx = 0.5 + 0.03 * Math.sin(idleAngle * 2.0);
      const cy = 0.5 + 0.03 * Math.cos(idleAngle * 1.2);
      mouseRef.current.x = lerp(mouseRef.current.x, cx, 0.006);
      mouseRef.current.y = lerp(mouseRef.current.y, cy, 0.006);
      requestAnimationFrame(idleTick);
    }

    // listeners & start
    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    resize();
    rafRef.current = requestAnimationFrame(draw);
    idleTick();

    // cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspect, colorA, colorB, frames, scan]);

  // wrapper uses padding-bottom trick to maintain aspect ratio responsively
  return (
    <div
      ref={wrapperRef}
      className="rounded-2xl"
      style={{
        width: "100%",
        height: "auto",
        position: "relative",
        paddingBottom: `${(1 / aspect) * 100}%`, // height relative to width
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: 12,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block", borderRadius: 12 }}
          role="img"
          aria-label="Neon wireframe tunnel"
        />
      </div>
    </div>
  );
}
