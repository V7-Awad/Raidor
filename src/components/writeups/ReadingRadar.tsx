"use client";

import { useEffect, useState } from "react";

export function ReadingRadar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const next = scrollable <= 0 ? 100 : Math.min(100, Math.max(0, Math.round((window.scrollY / scrollable) * 100)));
        setProgress((current) => current === next ? current : next);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <div className="reading-radar" role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
    <span className="radar-screen"><i className="radar-sweep" style={{ transform: `rotate(${progress * 3.6}deg)` }}/><i className="radar-ping"/></span>
    <span className="radar-percent">{progress}%</span>
  </div>;
}
