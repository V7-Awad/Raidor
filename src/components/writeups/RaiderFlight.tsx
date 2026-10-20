"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function RaiderFlight() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const article = document.getElementById("writeup-content");
        if (!article) return;

        const articleTop = article.getBoundingClientRect().top + window.scrollY;
        const travel = Math.max(1, article.offsetHeight - window.innerHeight * 0.55);
        const position = window.scrollY - articleTop + window.innerHeight * 0.12;
        const next = Math.min(100, Math.max(0, Math.round((position / travel) * 100)));
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

  const verticalCycle = (1 - Math.cos((progress / 100) * Math.PI * 4)) / 2;
  const top = 8 + verticalCycle * 46;

  return (
    <div className="raider-flight-track" aria-hidden="true">
      <div
        className="raider-flight"
        style={{
          top: `${top}vh`,
        }}
      >
        <Image
          className="raider-flight-image"
          src="/brand/raider-swing.png"
          width={512}
          height={768}
          alt=""
          unoptimized
        />
      </div>
    </div>
  );
}
