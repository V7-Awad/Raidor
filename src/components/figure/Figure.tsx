"use client";

import { useEffect, useRef } from "react";

export function Figure() {
  const figure = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = figure.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let blinkTimer: number;
    const blink = () => {
      el.classList.add("is-blinking");
      window.setTimeout(() => el.classList.remove("is-blinking"), 150);
      blinkTimer = window.setTimeout(blink, 5000 + Math.random() * 4000);
    };
    blinkTimer = window.setTimeout(blink, 3500);
    const move = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      const dx = ((event.clientX - (box.left + box.width / 2)) / box.width) * 6;
      const dy = ((event.clientY - (box.top + box.height * 0.43)) / box.height) * 6;
      el.style.setProperty("--eye-x", `${Math.max(-6, Math.min(6, dx))}px`);
      el.style.setProperty("--eye-y", `${Math.max(-6, Math.min(6, dy))}px`);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { window.clearTimeout(blinkTimer); window.removeEventListener("pointermove", move); };
  }, []);

  return <svg ref={figure} className="figure" viewBox="0 0 640 680" aria-hidden="true">
    <defs><filter id="scratch" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4"/></filter><filter id="eye-glow"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <path d="M320 46C219 46 159 126 158 249c-1 79 12 143 39 195-10 43-31 68-79 87-47 19-81 37-91 75-8 31 2 44 32 44h522c30 0 40-13 32-44-10-38-44-56-91-75-48-19-69-44-79-87 27-52 40-116 39-195C481 126 421 46 320 46Z" fill="#030303"/>
    <path className="figure-outline" d="M320 47c-102 0-160 80-161 202-1 81 13 147 40 197-14 45-36 66-82 85-48 20-83 38-91 77M320 47c102 0 160 80 161 202 1 81-13 147-40 197 14 45 36 66 82 85 48 20 83 38 91 77M194 443c3 42 12 69 29 95m223-95c-3 42-12 69-29 95" fill="none" stroke="#e8e8e8" strokeWidth="3.2" filter="url(#scratch)" strokeLinecap="round"/>
    <g className="eyes" filter="url(#eye-glow)"><ellipse cx="254" cy="307" rx="34" ry="37"/><ellipse cx="386" cy="307" rx="34" ry="37"/></g>
    <g fill="none" stroke="#fff" opacity=".78" strokeWidth="1.1" filter="url(#scratch)"><ellipse cx="254" cy="307" rx="39" ry="42"/><ellipse cx="386" cy="307" rx="39" ry="42"/></g>
  </svg>;
}
