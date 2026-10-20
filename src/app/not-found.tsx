import Link from "next/link";
import { Figure } from "@/components/figure/Figure";
import { SurpriseMe } from "@/components/writeups/SurpriseMe";
import { posts } from "@/lib/posts";
export default function NotFound() { return <div className="not-found"><Figure/><p className="lost-signal">404 // SIGNAL LOST</p><h1>Target not found.</h1><p>The watcher lost this trail. Head back to base or follow a random signal.</p><div className="not-found-actions"><Link href="/">← Back to base</Link><SurpriseMe slugs={posts.map((post) => post.slug)}/></div></div>; }
