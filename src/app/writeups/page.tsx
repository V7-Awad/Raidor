import { Suspense } from "react";
import { Archive } from "@/components/writeups/Archive";
import { SurpriseMe } from "@/components/writeups/SurpriseMe";
import { posts } from "@/lib/posts";
export const metadata = { title: "Write-ups", description: "Technical write-ups, research notes, and lab reports." };
export default function Writeups() { return <div className="page-shell"><div className="writeups-heading"><div><h1>Write-ups</h1><p className="page-lede">CTF notes, lab reports, and research from the field.</p></div><SurpriseMe slugs={posts.map((post) => post.slug)}/></div><Suspense fallback={<p>Loading archive…</p>}><Archive/></Suspense></div>; }
