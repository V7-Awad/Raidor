import type { Metadata } from "next";
import Link from "next/link";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Callout } from "@/components/writeups/Callout";
import { CodeBlock } from "@/components/writeups/CodeBlock";
import { ImageZoom } from "@/components/writeups/ImageZoom";
import { Canopy } from "@/components/writeups/Canopy";
import { RaiderFlight } from "@/components/writeups/RaiderFlight";
import { ReadingRadar } from "@/components/writeups/ReadingRadar";
import { CaseBoard } from "@/components/writeups/CaseBoard";
import { ReaderMode } from "@/components/writeups/ReaderMode";
import { getPost, posts, formatDate, readingTime } from "@/lib/posts";
import { siteConfig } from "@/config/site";
import { headers } from "next/headers";

export function generateStaticParams() { return posts.map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const post = getPost(slug);
  return post ? { title: post.title, description: post.summary, alternates: { canonical: `/writeups/${post.slug}` }, openGraph: { type: "article", title: post.title, description: post.summary, publishedTime: post.date, modifiedTime: post.updated } } : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const post = getPost(slug); if (!post) notFound();
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const index = posts.findIndex((item) => item.slug === slug); const previous = posts[index + 1]; const next = posts[index - 1];
  const source = await readFile(path.join(process.cwd(), "content", "writeups", `${slug}.mdx`), "utf8");
  const { content } = await compileMDX({ source, components: { Callout, pre: CodeBlock, img: ImageZoom }, options: { parseFrontmatter: true, mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }], [rehypePrettyCode, { theme: "github-dark" }]] } } });
  const jsonLd = { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.summary, datePublished: post.date, dateModified: post.updated ?? post.date, author: { "@type": "Person", name: siteConfig.name }, mainEntityOfPage: `${siteConfig.url}/writeups/${post.slug}` };
  return <div className="page-shell"><script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}/><ReadingRadar/><RaiderFlight/><div className="post-layout"><article id="writeup-content" className="post-article"><div className="reader-mode-row"><ReaderMode/></div><Canopy/><header><p className="post-meta"><time dateTime={post.date}>{formatDate(post.date)}</time><span>{readingTime(post)} min read</span>{post.difficulty && <span>{post.difficulty}</span>}{post.updated && <span>Updated {formatDate(post.updated)}</span>}</p><h1>{post.title}</h1><p className="page-lede">{post.summary}</p><div className="post-tags">{post.tags.map((tag) => <Link key={tag} href={`/writeups?tag=${tag}`} prefetch={false}>{tag}</Link>)}</div></header><div className="post-body">{content}</div><nav className="post-nav" aria-label="Adjacent write-ups">{previous ? <Link href={`/writeups/${previous.slug}`} prefetch={false}>← {previous.title}</Link> : <span/>}{next ? <Link href={`/writeups/${next.slug}`} prefetch={false}>{next.title} →</Link> : <span/>}</nav></article><aside><CaseBoard post={post}/></aside></div></div>;
}
