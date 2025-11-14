// src/components/FloatingBlueprint.jsx
import React from "react";

export default function FloatingBlueprint() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.07,
        transform: "translateZ(0)",
        userSelect: "none",
        mixBlendMode: "screen",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          inset: 0,
          filter: "drop-shadow(0 0 16px rgba(255,110,170,0.5))",
        }}
      >
        <defs>
          <linearGradient id="bp-grad" x1="0%" y1="0%" x2="100%" y2="120%">
            <stop offset="0%" stopColor="#ff6aa3" />
            <stop offset="100%" stopColor="#a66bff" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="bp-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <style>{`
            @keyframes slowFloat {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-12px); }
              100% { transform: translateY(0px); }
            }
            .float {
              animation: slowFloat 12s ease-in-out infinite;
            }
          `}</style>
        </defs>

        <g
          stroke="url(#bp-grad)"
          strokeWidth="2"
          fill="none"
          filter="url(#bp-glow)"
          className="float"
          opacity="0.45"
        >
          {/* F-22 silhouette */}
          <path d="M960 160 L1040 240 L1180 280 L1300 380 L1240 450 L1220 600 L1080 660 L1000 800 L960 840 L920 800 L840 660 L700 600 L680 450 L620 380 L740 280 L880 240 Z" />

          {/* Internal panel lines */}
          <line x1="960" y1="200" x2="960" y2="780" opacity="0.55" />
          <polyline points="960,280 880,340 760,320" opacity="0.35" />
          <polyline points="960,280 1040,340 1160,320" opacity="0.35" />

          <polyline points="960,420 880,480 820,460" opacity="0.3" />
          <polyline points="960,420 1040,480 1100,460" opacity="0.3" />

          {/* Wing detail */}
          <polyline points="960,560 900,600 840,580" opacity="0.28" />
          <polyline points="960,560 1020,600 1080,580" opacity="0.28" />

          {/* Tail vector box */}
          <polyline points="900,720 960,780 1020,720" opacity="0.35" />

          {/* Decorative blueprint cross-lines */}
          <line x1="400" y1="200" x2="1520" y2="880" opacity="0.12" />
          <line x1="1520" y1="200" x2="400" y2="880" opacity="0.12" />

          {/* Secondary background geometry */}
          <circle cx="960" cy="520" r="420" opacity="0.08" />
          <circle cx="960" cy="520" r="280" opacity="0.05" />
          <circle cx="960" cy="520" r="140" opacity="0.04" />
        </g>
      </svg>
    </div>
  );
}
