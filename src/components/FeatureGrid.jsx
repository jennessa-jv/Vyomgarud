// src/components/FeatureGrid.jsx
import React, { useRef } from "react";

function useTilt() {
  const ref = useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      el.style.transform = `perspective(800px) rotateX(${(y - 0.5) * 8}deg) rotateY(${(x - 0.5) * 14}deg) translateZ(4px)`;
    }

    function onLeave() {
      el.style.transform = "";
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return ref;
}

export default function FeatureGrid({ items = null }) {
  const defaultItems = items || [
    { title: "Hardened Autonomy", desc: "Robust, mission-adaptive autonomy stack." },
    { title: "Encrypted Comms", desc: "Resilient, anti-jam communications." },
    { title: "Rapid Integration", desc: "Payload modularity and custom interfaces." },
    { title: "Long Endurance", desc: "Extended loitering for persistent ISR." },
  ];

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        {/* Removed the heading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {defaultItems.map((it, i) => (
            <FeatureCard key={i} {...it} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, desc }) {
  const ref = useTilt();
  return (
    <div
      ref={ref}
      className="reveal reveal-card rounded-xl p-6 bg-[#0f1114] border border-gray-800 text-gray-100"
      style={{
        transition: `transform 700ms cubic-bezier(.2,.9,.2,1), opacity 600ms`,
        transformOrigin: "center",
      }}
    >
      {/* Removed “Feature” label */}
      <h4 className="font-bold text-lg">{title}</h4>
      <p className="mt-3 text-gray-300 text-sm">{desc}</p>

      <div className="mt-4 text-orange font-semibold">Learn more →</div>
    </div>
  );
}
