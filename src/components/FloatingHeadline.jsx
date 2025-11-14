// src/components/FloatingHeadline.jsx
import React from "react";

/**
 * FloatingHeadline (decorative only)
 * - Non-interactive: pointer-events none, user-select none
 * - Low opacity so it doesn't compete with content
 */
export default function FloatingHeadline({ text = "Precision. Trust. Promise" }) {
  return (
    <div
      aria-hidden="true"
      className="floating-headline"
      style={{
        position: "fixed",
        left: 12,
        top: 12,
        zIndex: 0,              // behind main content
        pointerEvents: "none",  // don't capture pointer events
        userSelect: "none",     // can't be selected
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        opacity: 0.06,
        fontSize: "8vw",
        fontWeight: 800,
        lineHeight: 0.9,
        color: "white",
        transform: "translateZ(0)",
        textShadow: "0 8px 20px rgba(0,0,0,0.6), 0 0 22px rgba(255,110,170,0.06)"
      }}
    >
      {text}
    </div>
  );
}
