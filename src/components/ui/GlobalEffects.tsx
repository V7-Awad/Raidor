"use client";
import { useEffect, useState } from "react";
export function GlobalEffects() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    try {
      if (sessionStorage.getItem("raider-seen")) return;
      const start = window.requestAnimationFrame(() => setShow(true));
      const interval = window.setInterval(() => setProgress((value) => Math.min(94, value + Math.ceil(Math.random() * 8))), 55);
      let finish: number | undefined;
      let complete: number | undefined;
      const hide = () => {
        window.clearInterval(interval);
        if (complete) window.clearTimeout(complete);
        if (finish) window.clearTimeout(finish);
        setShow(false);
        sessionStorage.setItem("raider-seen", "1");
      };
      complete = window.setTimeout(() => {
        window.clearInterval(interval);
        setProgress(100);
        finish = window.setTimeout(hide, 420);
      }, 1500);
      const skip = () => hide();
      window.addEventListener("keydown", skip, { once: true });
      window.addEventListener("pointerdown", skip, { once: true });
      return () => {
        cancelAnimationFrame(start);
        clearInterval(interval);
        if (complete) clearTimeout(complete);
        clearTimeout(complete);
        if (finish) clearTimeout(finish);
        window.removeEventListener("keydown", skip);
        window.removeEventListener("pointerdown", skip);
      };
    } catch { /* storage can be unavailable */ }
  // The intro is a one-time session animation.
  }, []);

  useEffect(() => {
    let previousTitle = document.title;
    const onVisibilityChange = () => {
      if (document.hidden) {
        previousTitle = document.title;
        document.title = "I see you 👀 — Raider";
      } else {
        document.title = previousTitle;
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const status = progress < 35 ? "Waking up the signal…" : progress < 72 ? "Checking the perimeter…" : progress < 100 ? "Unpacking the good stuff…" : "Access granted. Welcome in.";
  return <><div className="grain" aria-hidden="true"/><div className="seams" aria-hidden="true"/>{show && <div className="intro-screen" aria-hidden="true"><div className="intro-card"><span className="intro-eyes">◉　◉</span><p className="intro-status">{status}</p><div className="intro-progress"><span style={{ width: `${progress}%` }} /></div><span className="intro-percent">{progress}%</span></div></div>}</>;
}
