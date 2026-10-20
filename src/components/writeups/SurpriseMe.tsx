"use client";

import { useRouter } from "next/navigation";

export function SurpriseMe({ slugs }: { slugs: string[] }) {
  const router = useRouter();
  const openRandomWriteup = () => {
    if (!slugs.length) return;
    router.push(`/writeups/${slugs[Math.floor(Math.random() * slugs.length)]}`);
  };

  return <button className="surprise-link" type="button" onClick={openRandomWriteup}>Surprise me ↗</button>;
}
