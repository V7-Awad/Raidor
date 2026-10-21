"use client";
import { useEffect, useState } from "react";
export function GlobalEffects() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    try {
      const start = window.requestAnimationFrame(() => setShow(true));
      const startedAt = Date.now();
      const duration = 900;
      const interval = window.setInterval(() => {
        const elapsed = Date.now() - startedAt;
        setProgress(Math.min(94, Math.round((elapsed / duration) * 94)));
      }, 100);
      let finish: number | undefined;
      let complete: number | undefined;
      const hide = () => {
        window.clearInterval(interval);
        if (complete) window.clearTimeout(complete);
        if (finish) window.clearTimeout(finish);
        setShow(false);
      };
      complete = window.setTimeout(() => {
        window.clearInterval(interval);
        setProgress(100);
        finish = window.setTimeout(hide, 600);
      }, duration);
      return () => {
        cancelAnimationFrame(start);
        clearInterval(interval);
        if (complete) clearTimeout(complete);
        if (finish) clearTimeout(finish);
      };
    } catch { /* storage can be unavailable */ }
  // Show the intro on each full page load.
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
