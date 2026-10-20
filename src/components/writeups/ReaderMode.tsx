"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "raider-reader-mode";

export function ReaderMode() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) === "on";
    setEnabled(saved);
    document.documentElement.classList.toggle("reader-mode", saved);
    return () => document.documentElement.classList.remove("reader-mode");
  }, []);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    document.documentElement.classList.toggle("reader-mode", next);
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  }

  return <button className="reader-mode-toggle" type="button" onClick={toggle} aria-pressed={enabled}>
    <span aria-hidden="true">{enabled ? "◉" : "◌"}</span>
    {enabled ? "Exit reading mode" : "Quiet reading"}
  </button>;
}
