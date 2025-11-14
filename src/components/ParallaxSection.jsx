// src/components/ParallaxSection.jsx
import React, { useRef, useEffect } from "react";
import PlaneWireframeAlt from "./PlaneWireframeAlt";

export default function ParallaxSection() {
  const wrap = useRef(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;

    function onScroll() {
      const rect = el.getBoundingClientRect();
      const t = Math.min(
        1,
        Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height))
      );

      const plane = el.querySelector(".plane-overlay");
      if (plane) {
        plane.style.transform = `
          translateY(${(1 - t) * -40}px)
          translateX(${(1 - t) * 12}px)
          scale(${1 + t * 0.1})
          rotate(-8deg)
        `;
        plane.style.opacity = `${0.65 + t * 0.35}`;
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={wrap} className="py-28 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex items-center gap-12">

        {/* LEFT SIDE */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold">Persistent ISR Platforms</h2>
          <p className="mt-4 text-gray-300 max-w-xl">
            High-endurance airborne platforms with mission-specific payloads and secure comms.
          </p>
          <div className="mt-8">
            <a
              href="#contact"
              className="bg-orange px-5 py-3 rounded text-black font-semibold inline-block hover:opacity-90 transition"
            >
              Request a datasheet
            </a>
          </div>
        </div>

        {/* RIGHT SIDE — SMALLER, HIGHER, TILTED, MOVED LEFT */}
        <div className="w-full max-w-[560px] relative">

          <div
            className="plane-overlay absolute pointer-events-none"
            style={{
              top: "-200px",       // higher
              right: "40px",       // moved LEFT
              width: "420px",      // smaller
              height: "280px",
              transform: "rotate(-8deg)",
              opacity: 0.85
            }}
          >
            <div className="relative w-full h-full">

        
              <div
                className="absolute inset-0 blur-[35px] animate-pulse-plane"
                style={{
                  background:
                    "radial-gradient(circle at 40% 60%, rgba(255,120,200,0.28), transparent 70%)",
                }}
              ></div>

              {/* Jet wireframe */}
              <PlaneWireframeAlt
                aspect={900 / 930}
                colorA="#ff6aa3"
                colorB="#a66bff"
                scale={1.15}  
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
