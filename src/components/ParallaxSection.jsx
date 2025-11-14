// src/components/ParallaxSection.jsx
import React, { useRef, useEffect } from "react";
import WireframeTunnel from "./WireframeTunnel";
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

      // t from 0..1; use to move plane overlay
      const plane = el.querySelector(".plane-overlay");
      if (plane) {
        plane.style.transform = `
          translateY(${(1 - t) * -40}px)
          translateX(${(1 - t) * 12}px)
          scale(${0.9 + t * 0.12})
        `;
        plane.style.opacity = `${0.6 + t * 0.4}`;
      }

      // NOTE: tunnel canvas referenced previously was unused — kept for parity
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={wrap} className="py-28 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex items-center gap-12">
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

        <div className="w-full max-w-[560px] relative">
          {/* main tunnel */}
          <WireframeTunnel aspect={420 / 300} />

          {/* overlay: alt plane wireframe */}
        <div className="plane-overlay absolute top-[-60px] right-[-16px] w-[340px] h-[230px] pointer-events-none">
  <PlaneWireframeAlt aspect={900 / 930} colorA="#ff6aa3" colorB="#a66bff" scale={1} />
</div>

        </div>
      </div>
    </section>
  );
}
