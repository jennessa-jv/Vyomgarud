// src/components/ParticlesBackground.jsx
import React, { useRef, useEffect } from "react";

export default function ParticlesBackground({
  density = 80, // more = more particles
  color = "#ff6aa6",
}) {
  const ref = useRef();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0, h = 0;
    let particles = [];
    let raf = null;
    const DPR = Math.max(1, window.devicePixelRatio || 1);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      initParticles();
    }

    function rand(a,b){ return a + Math.random()*(b-a) }

    function initParticles(){
      particles = [];
      const n = Math.max(20, Math.floor((w*h)/100000 * density));
      for(let i=0;i<n;i++){
        particles.push({
          x: rand(0,w),
          y: rand(0,h),
          r: rand(0.4,2.6),
          vx: rand(-0.05,0.05),
          vy: rand(-0.02,0.02),
          phase: rand(0,Math.PI*2),
          hueShift: rand(-30,30)
        });
      }
    }

    function draw(t){
      ctx.clearRect(0,0,w,h);
      for(const p of particles){
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.01;
        if(p.x < -10) p.x = w+10;
        if(p.x > w+10) p.x = -10;
        if(p.y < -10) p.y = h+10;
        if(p.y > h+10) p.y = -10;

        const a = 0.18 + 0.12*Math.sin(p.phase);
        const g = ctx.createRadialGradient(p.x,p.y,p.r*0.1,p.x,p.y,p.r*7);
        const colA = hexToRgba(color, a);
        const colB = hexToRgba("#1defff", a*0.25);
        g.addColorStop(0, colA);
        g.addColorStop(1, colB);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r*3, 0, Math.PI*2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    function hexToRgba(hex, a){
      const h = hex.replace("#","");
      const r = parseInt(h.substring(0,2),16);
      const g = parseInt(h.substring(2,4),16);
      const b = parseInt(h.substring(4,6),16);
      return `rgba(${r},${g},${b},${a})`;
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density, color]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden
    />
  );
}
