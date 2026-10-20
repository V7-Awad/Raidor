import { Suspense } from "react";
import { Archive } from "@/components/writeups/Archive";
export const metadata = { title: "Write-ups", description: "Technical write-ups, research notes, and lab reports." };
export default function Writeups() { return <div className="page-shell"><h1>Write-ups</h1><p className="page-lede">CTF notes, lab reports, and research from the field.</p><Suspense fallback={<p>Loading archive…</p>}><Archive/></Suspense></div>; }
