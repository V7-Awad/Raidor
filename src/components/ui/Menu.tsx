"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const links = [["Home", "/"], ["Write-ups", "/writeups"], ["Projects", "/projects"], ["About", "/about"], ["Contact", "/contact"]];
export function Menu() {
  const [open, setOpen] = useState(false); const trigger = useRef<HTMLButtonElement>(null); const firstLink = useRef<HTMLAnchorElement>(null);
  useEffect(() => { if (open) firstLink.current?.focus(); }, [open]);
  useEffect(() => { const key = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); } if (open && event.key === "Tab") { const anchors = [...document.querySelectorAll<HTMLAnchorElement>(".menu-panel a")]; if (event.shiftKey && document.activeElement === anchors[0]) { event.preventDefault(); anchors.at(-1)?.focus(); } else if (!event.shiftKey && document.activeElement === anchors.at(-1)) { event.preventDefault(); anchors[0]?.focus(); } } }; window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, [open]);
  return <><button ref={trigger} className="menu-trigger" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(true)}><span/><span/></button>{open && <div className="menu-overlay" role="dialog" aria-modal="true" aria-label="Navigation menu"><button className="menu-close" onClick={() => { setOpen(false); trigger.current?.focus(); }} aria-label="Close navigation">×</button><nav className="menu-panel">{links.map(([label, href], i) => <Link key={href} href={href} prefetch={false} ref={i === 0 ? firstLink : undefined} onClick={() => setOpen(false)}>{label}</Link>)}</nav></div>}</>;
}
