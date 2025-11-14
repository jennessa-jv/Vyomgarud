import React from "react";
import WireframeTunnel from "./WireframeTunnel";
import PlaneWireframe from "./PlaneWireframe";

export default function Hero() {
  return (
    <section className="min-h-[85vh] flex items-center px-6 md:px-12 lg:px-24 relative">
      
      {/* LEFT SIDE — TEXT */}
      <div className="flex-1 max-w-3xl relative z-20">
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
          Autonomous Defence Systems.
        </h1>

        <p className="mt-6 text-gray-300 text-lg max-w-xl">
          VyomGarud builds advanced UAV platforms engineered for precision,
          reliability, and modern defence environments. High-performance,
          mission-ready, and built for the future of autonomy.
        </p>

        <div className="mt-8 flex gap-4">
          <a className="bg-orange px-6 py-3 rounded text-black font-semibold" href="#contact">
            Request Demo
          </a>
          <a className="border border-gray-600 px-6 py-3 rounded text-gray-300" href="#products">
            Explore Platforms
          </a>
        </div>
      </div>

      {/* RIGHT SIDE — TUNNEL + PLANE */}
      <div className="hidden lg:block flex-none w-full max-w-[620px] relative z-10">
        <WireframeTunnel aspect={420/300} />

        {/* BIGGER PLANE */}
        <div
          className="absolute top-[-40px] right-[-20px] pointer-events-none"
          style={{ width: 380, height: 260 }}
        >
          <PlaneWireframe />
        </div>
      </div>
    </section>
  );
}
