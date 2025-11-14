// src/hooks/useScrollReveal.js
import { useEffect } from "react";

export default function useScrollReveal(selector = ".reveal", rootMargin = "-8% 0px -20% 0px") {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(selector));
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
        }
      }
    }, { root: null, rootMargin, threshold: 0.06 });
    els.forEach((el)=> io.observe(el));
    return ()=> io.disconnect();
  }, [selector, rootMargin]);
}
