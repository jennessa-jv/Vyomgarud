// src/components/DroneShowcase.jsx
import React, { useRef, useEffect, useState } from "react";

/**
 * DroneShowcase
 * - Left: rotating neon wireframe drone (canvas)
 * - Right: stat blocks with animated counters and neon accents
 *
 * Usage:
 * <DroneShowcase />
 */
export default function DroneShowcase() {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
        <div className="w-full lg:w-1/2 flex justify-center">
          <div style={{ width: "100%", maxWidth: 640 }}>
            <RotatingDrone aspect={640 / 420} />
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl font-bold mb-4">Platform Performance</h2>
          <p className="text-gray-300 mb-6 max-w-xl">
            High-performance UAV platforms built for endurance, secure comms, ruggedized environments, and advanced autonomy.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatBlock title="Endurance" value={15} suffix="+ hr" description="Typical mission loiter time" />
            <StatBlock title="Comm Range" value={60} suffix=" km" description="Encrypted line-of-sight" />
            <StatBlock title="Ruggedness" value={810} suffix="H" description="MIL-STD tested (810H)" />
            <StatBlock title="Autonomy" value={5} suffix="+" description="Autonomy level (L5+ possible)" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------
   RotatingDrone (canvas)
   - uses requestAnimationFrame
   - draws stylized plane outlines, rotates slowly
---------------------------------*/
function RotatingDrone({ aspect = 640 / 420 }) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    const DPR = Math.max(1, window.devicePixelRatio || 1);

    // outline definition (normalized -1..1 coordinates)
    const outlines = [
      // simplified wings + fuselage outlines (polylines)
      [[0.9,0.06],[0.6,0.0],[0.2,-0.02],[-0.5,-0.02],[-0.85,-0.18],[-0.7,0.12],[-0.5,0.18],[0.2,0.14],[0.6,0.08],[0.9,0.06]],
      [[0.9,-0.02],[0.6,-0.06],[0.3,-0.10],[0.0,-0.08],[-0.4,-0.12],[-0.7,-0.08],[-0.9,-0.02]],
      [[-0.4,-0.02],[-0.2,-0.08],[0.0,-0.06],[0.2,-0.05]],
      [[-0.4,0.02],[-0.2,0.08],[0.0,0.06],[0.2,0.05]]
    ];

    let W = 0, H = 0;

    function resize() {
      const rect = wrapper.getBoundingClientRect();
      W = rect.width;
      H = Math.max(220, rect.width / aspect);
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    let start = performance.now();

    function draw(now) {
      const t = (now - start) * 0.001;
      ctx.clearRect(0, 0, W, H);

      // background subtle vignette
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, "rgba(4, 38, 34, 0.05)");
      bgGrad.addColorStop(1, "rgba(4, 38, 34, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // center, scale and parallax
      const cx = W * 0.55 + (mouseRef.current.x - 0.5) * 40;
      const cy = H * 0.48 + (mouseRef.current.y - 0.5) * 18;
      const baseScale = Math.min(W, H) * 0.9;

      // rotation
      const rot = Math.sin(t * 0.3) * 0.06 + 0.18 * Math.sin(t * 0.07);

      // neon gradient
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, "#ff5a8a");
      grad.addColorStop(1, "#b66cff");

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);

      // additive blend for neon
      ctx.globalCompositeOperation = "lighter";

      // draw glow layers (3 passes for depth)
      for (let pass = 0; pass < 3; pass++) {
        const alpha = 0.12 + (0.08 * (2 - pass));
        const blur = 6 + pass * 10;
        ctx.lineWidth = (5 - pass * 1.6) * (DPR <= 1 ? 1 : 1.2);
        ctx.strokeStyle = grad;
        ctx.shadowBlur = blur;
        ctx.shadowColor = `rgba(255,110,170,${alpha})`;
        outlines.forEach((poly) => {
          ctx.beginPath();
          poly.forEach((pt, i) => {
            const x = pt[0] * baseScale * 0.45;
            const y = pt[1] * baseScale * 0.45;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.closePath();
          ctx.stroke();
        });
      }

      // fine inner lines
      ctx.lineWidth = 1.2;
      ctx.shadowBlur = 2;
      ctx.strokeStyle = "#ffd6ea";
      outlines.forEach((poly) => {
        ctx.beginPath();
        poly.forEach((pt, i) => {
          const x = pt[0] * baseScale * 0.45;
          const y = pt[1] * baseScale * 0.45;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.stroke();
      });

      // scanning sweep (horizontal)
      const sweep = (t * 40) % (baseScale);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgba(255,255,255,0.02)`;
      ctx.beginPath();
      ctx.rect(-baseScale * 0.6 + (sweep - baseScale * 0.3), -baseScale * 0.45, baseScale * 0.2, baseScale * 0.9);
      ctx.fill();

      ctx.restore();

      // clear shadow for next frame
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(draw);
    }

    function onMove(e) {
      const rect = wrapper.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0] && e.touches[0].clientY);
      if (clientX == null) return;
      const nx = (clientX - rect.left) / rect.width;
      const ny = (clientY - rect.top) / rect.height;
      mouseRef.current.x += (Math.max(0, Math.min(1, nx)) - mouseRef.current.x) * 0.14;
      mouseRef.current.y += (Math.max(0, Math.min(1, ny)) - mouseRef.current.y) * 0.14;
    }

    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });

    resize();
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspect]);

  return (
    <div ref={wrapperRef} style={{ width: "100%", paddingBottom: `${100 / aspect}%`, position: "relative" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden />
    </div>
  );
}

/* -------------------------
   StatBlock with animated counter
--------------------------*/
function StatBlock({ title, value, suffix = "", description = "" }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    let raf = null;
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min(1, (ts - start) / 900); // 900ms animate
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(step);
      else {
        setDisplay(value);
        cancelAnimationFrame(raf);
      }
    }

    // IntersectionObserver to start when visible
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !doneRef.current) {
          doneRef.current = true;
          raf = requestAnimationFrame(step);
        }
      }
    }, { threshold: 0.4, rootMargin: "0px" });

    if (ref.current) obs.observe(ref.current);
    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, [value]);

  return (
    <div ref={ref} className="card-neon p-5 rounded-xl bg-[#071717] border border-gray-800">
      <div className="text-sm text-gray-400 mb-2">{title}</div>
      <div className="flex items-baseline gap-3">
        <div className="text-3xl md:text-4xl font-bold">{display}{suffix}</div>
        <div className="text-sm text-gray-400"> </div>
      </div>
      <div className="mt-2 text-sm text-gray-300">{description}</div>
      <div className="mt-4 text-orange font-semibold">Details →</div>
      <div className="scanline absolute inset-0 pointer-events-none rounded-xl" />
    </div>
  );
}
