"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
export function ImageZoom({ src, alt = "", title }: { src: string; alt?: string; title?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (!open) return; const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [open]);
  return <><button type="button" className="image-zoom-trigger" onClick={() => setOpen(true)} aria-label={`Enlarge image: ${alt}`}><Image src={src} alt={alt} title={title} width={900} height={900} sizes="(max-width: 700px) 100vw, 70ch"/></button>{open && <div className="image-zoom-overlay" role="dialog" aria-modal="true" aria-label={alt} onClick={() => setOpen(false)}><button type="button" className="image-zoom-close" onClick={() => setOpen(false)} aria-label="Close image">×</button><Image src={src} alt={alt} width={1200} height={1200} sizes="95vw" priority onClick={(event) => event.stopPropagation()}/></div>}</>;
}
