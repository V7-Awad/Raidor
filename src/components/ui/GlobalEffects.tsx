"use client";
import { useEffect, useState } from "react";
export function GlobalEffects() {
  const [show, setShow] = useState(false);
  useEffect(() => { try { if (!sessionStorage.getItem("raider-seen")) { const start = window.requestAnimationFrame(() => setShow(true)); const timer = window.setTimeout(() => { setShow(false); sessionStorage.setItem("raider-seen", "1"); }, 850); const skip = () => { setShow(false); sessionStorage.setItem("raider-seen", "1"); }; window.addEventListener("keydown", skip, { once: true }); window.addEventListener("pointerdown", skip, { once: true }); return () => { cancelAnimationFrame(start); clearTimeout(timer); window.removeEventListener("keydown", skip); window.removeEventListener("pointerdown", skip); }; } } catch { /* storage can be unavailable */ } }, []);
  return <><div className="grain" aria-hidden="true"/><div className="seams" aria-hidden="true"/>{show && <div className="intro-screen" aria-hidden="true"><span className="intro-eyes">●　●</span></div>}</>;
}
