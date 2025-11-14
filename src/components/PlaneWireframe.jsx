// src/components/PlaneWireframe.jsx
import React from "react";

export default function PlaneWireframe({
  colorA = "#ffb400",
  colorB = "#00ff99",
}) {
  return (
    <svg
      viewBox="0 0 420 280"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id="planeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colorA} />
          <stop offset="100%" stopColor={colorB} />
        </linearGradient>

        {/* Double Glow */}
        <filter id="planeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="first" />
          <feGaussianBlur stdDeviation="8" in="first" result="second" />
          <feMerge>
            <feMergeNode in="second" />
            <feMergeNode in="first" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <style>{`
        .main {
          stroke-dasharray: 12 18;
          animation: dash 5s linear infinite;
        }
        .detail {
          stroke-dasharray: 8 14;
          animation: dash 7s linear infinite reverse;
          opacity: 0.9;
        }
        @keyframes dash {
          to { stroke-dashoffset: -500; }
        }
      `}</style>

      <g
        stroke="url(#planeGrad)"
        fill="none"
        strokeWidth="3.2"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#planeGlow)"
      >
        {/* F-22 main silhouette */}
        <path
          className="main"
          d="
            M210 20
            L240 55
            L300 70
            L350 110
            L315 145
            L310 180
            L260 200
            L235 240
            L210 255
            L185 240
            L160 200
            L110 180
            L105 145
            L70 110
            L120 70
            L180 55
            Z
          "
        />

        {/* Cockpit */}
        <polygon
          className="detail"
          points="190,60 230,60 245,90 210,110 175,90"
        />

        {/* Spine */}
        <path className="detail" d="M210 30 L210 110 L210 240" />

        {/* Left wing panels */}
        <path className="detail" d="M210 110 L150 130 L125 120" />
        <path className="detail" d="M210 140 L160 155 L135 150" />
        <path className="detail" d="M210 170 L170 185 L150 180" />

        {/* Right wing panels */}
        <path className="detail" d="M210 110 L270 130 L295 120" />
        <path className="detail" d="M210 140 L260 155 L285 150" />
        <path className="detail" d="M210 170 L250 185 L270 180" />

        {/* Tail thrust */}
        <polyline className="detail" points="185,220 210,245 235,220" />
      </g>
    </svg>
  );
}
