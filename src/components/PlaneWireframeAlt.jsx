// src/components/PlaneWireframeAlt.jsx
import React, { useRef, useEffect } from "react";

/**
 * PlaneWireframeAlt.jsx
 * - Alternative neon wireframe plane (more angular)
 * - Responsive canvas, pointer parallax, gentle roll/rotation, ghost trails
 *
 * Props:
 *  - aspect (width/height ratio) default 340/220
 *  - colorA/colorB: neon gradient colors
 *  - scale: overall scale multiplier
 *  - trailCount: number of ghost trails
 */
export default function PlaneWireframeAlt({
  aspect = 340 / 220,
  colorA = "#ff0",
  colorB = "#ffe066",
  scale = 1,
  trailCount = 6,
}) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  const DPR = Math.max(1, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    let W = 0;
    let H = 0;
    let start = performance.now();

    function resize() {
      const rect = wrapper.getBoundingClientRect();
      W = Math.max(64, rect.width);
      H = Math.max(40, Math.round(rect.width / aspect));
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      start = performance.now();
    }

    // A more angular technical model for a plane / UAV (normalized coords)
    // Points are in local space roughly -1..1
    const model = {
      fuselage: [
        { x: 1.0, y: 0.0 },   // nose
        { x: 0.65, y: -0.05 },
        { x: 0.35, y: -0.12 },
        { x: -0.25, y: -0.22 },
        { x: -0.72, y: -0.18 },
        { x: -0.95, y: 0.0 },  // tail tip
        { x: -0.72, y: 0.18 },
        { x: -0.25, y: 0.22 },
        { x: 0.35, y: 0.12 },
        { x: 0.65, y: 0.05 },
      ],
      wings: [
        { x: 0.18, y: -0.07 }, { x: -0.18, y: -0.55 }, { x: -0.40, y: -0.54 },
        { x: -0.58, y: -0.40 }, { x: -0.28, y: -0.32 }, { x: 0.12, y: -0.10 }
      ],
      wingsLower: [
        { x: 0.18, y: 0.07 }, { x: -0.18, y: 0.55 }, { x: -0.40, y: 0.54 },
        { x: -0.58, y: 0.40 }, { x: -0.28, y: 0.32 }, { x: 0.12, y: 0.10 }
      ],
      tail: [
        { x: -0.7, y: -0.08 }, { x: -0.85, y: -0.26 }, { x: -0.85, y: 0.26 }, { x: -0.7, y: 0.08 }
      ],
      cockpit: [
        { x: 0.3, y: -0.04 }, { x: 0.1, y: -0.02 }, { x: 0.1, y: 0.02 }, { x: 0.3, y: 0.04 }
      ],
      centerline: [
        { x: 1.0, y: 0 }, { x: -0.95, y: 0 }
      ]
    };

    // rotate a point by angle
    function rotate(pt, a) {
      const c = Math.cos(a), s = Math.sin(a);
      return { x: pt.x * c - pt.y * s, y: pt.x * s + pt.y * c };
    }

    // project model point to canvas coordinates
    function project(pt, sx, sy, tx, ty, angle, tilt) {
      const r = rotate(pt, angle);
      // slight perspective: scale by (1 - small * y)
      const depth = 1 - r.y * 0.06;
      return {
        x: tx + r.x * sx * depth,
        y: ty + r.y * sy * 0.86 + tilt
      };
    }

    function toRgba(hex, a = 1) {
      const h = (hex || "#000000").replace("#", "");
      const r = parseInt(h.substring(0, 2), 16) || 0;
      const g = parseInt(h.substring(2, 4), 16) || 0;
      const b = parseInt(h.substring(4, 6), 16) || 0;
      return `rgba(${r},${g},${b},${a})`;
    }

    function draw(now) {
      const elapsed = (now - start) * 0.001;

      ctx.clearRect(0, 0, W, H);

      const cx = W * 0.5;
      const cy = H * 0.5;

      // pointer parallax influence
      const px = (pointerRef.current.x - 0.5) * 2; // -1..1
      const py = (pointerRef.current.y - 0.5) * 2;

      // base angle roll + subtle yaw from pointer
      const roll = Math.sin(elapsed * 0.6) * 0.04 + px * 0.05;
      const tilt = Math.cos(elapsed * 0.8) * (H * 0.006) + py * (H * 0.01);

      // scale to canvas
      const size = Math.min(W, H) * 0.42 * scale;
      const sx = size;
      const sy = size;

      // gradient stroke
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, colorA);
      grad.addColorStop(1, colorB);

      // draw ghost trails (fades)
      for (let g = trailCount - 1; g >= 0; g--) {
        const fade = (g + 1) / (trailCount + 1);
        const aAngle = roll - g * 0.02;
        const aTilt = tilt * (0.85 + g * 0.05);
        const lineW = 2.6 * fade;
        ctx.beginPath();
        const pts = model.fuselage.map(p => project(p, sx, sy, cx - px * 8, cy - py * 6, aAngle, aTilt));
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.closePath();
        ctx.strokeStyle = toRgba(colorB, 0.06 * fade);
        ctx.lineWidth = Math.max(0.5, lineW);
        ctx.shadowBlur = 10 * fade;
        ctx.shadowColor = toRgba(colorA, 0.06 * fade);
        ctx.stroke();
      }

      // main fuselage
      ctx.beginPath();
      const fusPts = model.fuselage.map(p => project(p, sx, sy, cx - px * 8, cy - py * 6, roll, tilt));
      ctx.moveTo(fusPts[0].x, fusPts[0].y);
      for (let i = 1; i < fusPts.length; i++) ctx.lineTo(fusPts[i].x, fusPts[i].y);
      ctx.closePath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.shadowBlur = 16;
      ctx.shadowColor = toRgba(colorA, 0.95);
      ctx.globalCompositeOperation = "lighter";
      ctx.stroke();

      // wings upper + lower detailed strokes
      ctx.beginPath();
      const wingPts = model.wings.map(p => project(p, sx, sy, cx - px * 8, cy - py * 6, roll, tilt));
      ctx.moveTo(wingPts[0].x, wingPts[0].y);
      for (let i = 1; i < wingPts.length; i++) ctx.lineTo(wingPts[i].x, wingPts[i].y);
      ctx.strokeStyle = toRgba(colorB, 0.95);
      ctx.lineWidth = 1.4;
      ctx.shadowBlur = 8;
      ctx.stroke();

      ctx.beginPath();
      const wingLowPts = model.wingsLower.map(p => project(p, sx, sy, cx - px * 8, cy - py * 6, roll, tilt));
      ctx.moveTo(wingLowPts[0].x, wingLowPts[0].y);
      for (let i = 1; i < wingLowPts.length; i++) ctx.lineTo(wingLowPts[i].x, wingLowPts[i].y);
      ctx.strokeStyle = toRgba(colorA, 0.9);
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // cockpit / centerline
      ctx.beginPath();
      const cockpitPts = model.cockpit.map(p => project(p, sx, sy, cx - px * 8, cy - py * 6, roll, tilt));
      ctx.moveTo(cockpitPts[0].x, cockpitPts[0].y);
      for (let i = 1; i < cockpitPts.length; i++) ctx.lineTo(cockpitPts[i].x, cockpitPts[i].y);
      ctx.strokeStyle = toRgba(colorA, 0.95);
      ctx.lineWidth = 1.0;
      ctx.shadowBlur = 6;
      ctx.stroke();

      ctx.beginPath();
      const centerPts = model.centerline.map(p => project(p, sx, sy, cx - px * 8, cy - py * 6, roll, tilt));
      ctx.moveTo(centerPts[0].x, centerPts[0].y);
      ctx.lineTo(centerPts[1].x, centerPts[1].y);
      ctx.strokeStyle = toRgba(colorB, 0.85);
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // tail fins
      ctx.beginPath();
      const tailPts = model.tail.map(p => project(p, sx, sy, cx - px * 8, cy - py * 6, roll, tilt));
      ctx.moveTo(tailPts[0].x, tailPts[0].y);
      for (let i = 1; i < tailPts.length; i++) ctx.lineTo(tailPts[i].x, tailPts[i].y);
      ctx.closePath();
      ctx.strokeStyle = toRgba(colorB, 0.9);
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // subtle cross-scan lines over plane
      ctx.save();
      ctx.globalCompositeOperation = "overlay";
      ctx.globalAlpha = 0.05 + 0.03 * Math.sin(elapsed * 2.4);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 0.6;
      for (let s = -2; s <= 2; s++) {
        ctx.beginPath();
        for (let i = 0; i < model.fuselage.length; i++) {
          const p = model.fuselage[i];
          const pxoff = s * 0.04;
          const proj = project({ x: p.x + pxoff, y: p.y }, sx, sy, cx - px * 8, cy - py * 6, roll, tilt);
          if (i === 0) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.stroke();
      }
      ctx.restore();

      // nose glow
      ctx.save();
      const nosePt = project({ x: 1.05, y: 0 }, sx, sy, cx - px * 8, cy - py * 6, roll, tilt);
      const glowR = Math.max(2, Math.min(W, H) * 0.015);
      const g = ctx.createRadialGradient(nosePt.x, nosePt.y, 0, nosePt.x, nosePt.y, glowR * 6);
      g.addColorStop(0, toRgba(colorA, 0.95));
      g.addColorStop(0.4, toRgba(colorB, 0.24));
      g.addColorStop(1, toRgba("#000000", 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(nosePt.x, nosePt.y, glowR * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // reset
      ctx.globalCompositeOperation = "source-over";
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(draw);
    }

    // pointer smoothing
    function handlePointer(e) {
      const rect = wrapper.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0] && e.touches[0].clientY);
      if (clientX == null || clientY == null) return;
      const nx = (clientX - rect.left) / rect.width;
      const ny = (clientY - rect.top) / rect.height;
      pointerRef.current.x += (Math.max(0, Math.min(1, nx)) - pointerRef.current.x) * 0.14;
      pointerRef.current.y += (Math.max(0, Math.min(1, ny)) - pointerRef.current.y) * 0.14;
    }

    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);
    window.addEventListener("pointermove", handlePointer);
    window.addEventListener("touchmove", handlePointer, { passive: true });

    resize();
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("touchmove", handlePointer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspect, colorA, colorB, scale, trailCount]);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        height: "auto",
        position: "relative",
        paddingBottom: `${(1 / aspect) * 100}%`,
        overflow: "visible",
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
