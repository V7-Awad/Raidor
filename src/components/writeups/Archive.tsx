"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import Fuse from "fuse.js";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatDate, posts } from "@/lib/posts";
export function Archive() {
  const searchParams = useSearchParams(); const router = useRouter(); const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const query = searchParams.get("q") ?? ""; const tag = searchParams.get("tag") ?? "";
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === "/" && !["INPUT", "TEXTAREA"].includes((event.target as HTMLElement).tagName)) { event.preventDefault(); searchRef.current?.focus(); } }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, []);
  const counts = useMemo(() => Object.fromEntries([...new Set(posts.flatMap((p) => p.tags))].sort().map((t) => [t, posts.filter((p) => p.tags.includes(t)).length])), []);
  const fuse = useMemo(() => new Fuse(posts, { keys: ["title", "summary", "tags"], threshold: .34, ignoreLocation: true }), []);
  const shown = useMemo(() => (query ? fuse.search(query).map((result) => result.item) : posts).filter((post) => !tag || post.tags.includes(tag)), [fuse, query, tag]);
  const update = (q: string, nextTag: string) => { const params = new URLSearchParams(); if (nextTag) params.set("tag", nextTag); if (q) params.set("q", q); router.replace(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false }); };
  return <div className="archive"><label className="search-label" htmlFor="search">Search write-ups</label><input ref={searchRef} id="search" className="search" value={query} placeholder="Title, summary, or tag…" onChange={(e) => update(e.target.value, tag)}/><div className="tag-row"><button className={!tag ? "tag active" : "tag"} onClick={() => update(query, "")}>All ({posts.length})</button>{Object.entries(counts).map(([name, count]) => <button key={name} className={tag === name ? "tag active" : "tag"} onClick={() => update(query, tag === name ? "" : name)}>{name} ({count})</button>)}</div><p className="result-count">{shown.length} write-ups shown</p>{shown.length ? <div className="post-list">{shown.map((post) => <article className="post-row" key={post.slug}><time dateTime={post.date}>{formatDate(post.date)}</time><div><h2><Link href={`/writeups/${post.slug}`} prefetch={false}>{post.title}</Link></h2><p>{post.summary}</p><div className="post-tags">{post.tags.map((t) => <button key={t} onClick={() => update(query, t)}>{t}</button>)}</div></div><span className="row-mark" aria-hidden="true">↗</span></article>)}</div> : <div className="empty-state"><p>No write-ups match. Clear the filter to see all.</p><button className="text-button" onClick={() => update("", "")}>Clear filters</button></div>}</div>;
}
