import Link from "next/link";
import { Figure } from "@/components/figure/Figure";
import { SurpriseMe } from "@/components/writeups/SurpriseMe";
import { posts, formatDate } from "@/lib/posts";
import { siteConfig } from "@/config/site";
import { headers } from "next/headers";
export default async function Home() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const jsonLd = { "@context": "https://schema.org", "@type": "WebSite", name: siteConfig.name, url: siteConfig.url, description: siteConfig.tagline };
  return <><script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}/><section className="hero"><div className="hero-content"><Figure/><h1>{siteConfig.name}</h1><p className="hero-tagline">{siteConfig.tagline}</p><div className="hero-links"><Link href="/writeups" prefetch={false}>Read write-ups</Link><Link href="/about" prefetch={false}>About</Link><SurpriseMe slugs={posts.map((post) => post.slug)}/></div></div></section><section className="section"><div className="section-head"><h2>Latest write-ups</h2><Link href="/writeups" prefetch={false}>All write-ups →</Link></div><div className="post-list">{posts.slice(0,6).map((post) => <article className="post-row" key={post.slug}><time dateTime={post.date}>{formatDate(post.date)}</time><div><h2><Link href={`/writeups/${post.slug}`} prefetch={false}>{post.title}</Link></h2><p>{post.summary}</p><div className="post-tags">{post.tags.map((tag) => <Link key={tag} href={`/writeups?tag=${tag}`} prefetch={false}>{tag}</Link>)}</div></div><span className="row-mark" aria-hidden="true">↗</span></article>)}</div></section><section className="section"><div className="section-head"><h2>A little about this space</h2><Link href="/about" prefetch={false}>More about me →</Link></div><p className="intro-copy">A collection of technical write-ups, lab notes, and things learned while exploring security. Written to make the next investigation a little easier.</p></section></>;
}
