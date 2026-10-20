"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import Fuse from "fuse.js";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatDate, posts } from "@/lib/posts";

const categories = ["ctf", "lab", "research", "note"] as const;
const difficulties = ["easy", "medium", "hard"] as const;
type Filters = { q: string; tag: string; category: string; difficulty: string };

export function Archive() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const filters: Filters = {
    q: searchParams.get("q") ?? "",
    tag: searchParams.get("tag") ?? "",
    category: searchParams.get("category") ?? "",
    difficulty: searchParams.get("difficulty") ?? "",
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.key === "/" && target && !["INPUT", "TEXTAREA"].includes(target.tagName) && !target.isContentEditable) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const counts = useMemo(() => Object.fromEntries(
    [...new Set(posts.flatMap((post) => post.tags))].sort().map((tag) => [tag, posts.filter((post) => post.tags.includes(tag)).length]),
  ), []);
  const fuse = useMemo(() => new Fuse(posts, { keys: ["title", "summary", "tags"], threshold: .34, ignoreLocation: true }), []);
  const shown = useMemo(() => (filters.q ? fuse.search(filters.q).map((result) => result.item) : posts)
    .filter((post) => !filters.tag || post.tags.includes(filters.tag))
    .filter((post) => !filters.category || post.category === filters.category)
    .filter((post) => !filters.difficulty || post.difficulty === filters.difficulty),
  [fuse, filters.q, filters.tag, filters.category, filters.difficulty]);

  const update = (changes: Partial<Filters>) => {
    const next = { ...filters, ...changes };
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.tag) params.set("tag", next.tag);
    if (next.category) params.set("category", next.category);
    if (next.difficulty) params.set("difficulty", next.difficulty);
    router.replace(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false });
  };

  const categoryCount = (category: string) => posts.filter((post) => post.category === category).length;
  const difficultyCount = (difficulty: string) => posts.filter((post) => post.difficulty === difficulty).length;

  return <div className="archive">
    <label className="search-label" htmlFor="search">Search write-ups <kbd>/</kbd></label>
    <input ref={searchRef} id="search" className="search" value={filters.q} placeholder="Title, summary, or tag…" onChange={(event) => update({ q: event.target.value })}/>

    <div className="archive-filter-group" aria-label="Filter by type">
      <span className="archive-filter-label">TYPE</span>
      <div className="tag-row"><button className={!filters.category ? "tag active" : "tag"} onClick={() => update({ category: "" })}>All ({posts.length})</button>
        {categories.map((category) => <button key={category} className={filters.category === category ? "tag active" : "tag"} onClick={() => update({ category: filters.category === category ? "" : category })}>{category} ({categoryCount(category)})</button>)}
      </div>
    </div>

    <div className="archive-filter-group" aria-label="Filter by difficulty">
      <span className="archive-filter-label">DIFFICULTY</span>
      <div className="tag-row"><button className={!filters.difficulty ? "tag active" : "tag"} onClick={() => update({ difficulty: "" })}>Any level</button>
        {difficulties.map((difficulty) => <button key={difficulty} className={filters.difficulty === difficulty ? "tag active" : "tag"} onClick={() => update({ difficulty: filters.difficulty === difficulty ? "" : difficulty })}>{difficulty} ({difficultyCount(difficulty)})</button>)}
      </div>
    </div>

    <div className="archive-filter-group" aria-label="Filter by tag">
      <span className="archive-filter-label">TOPICS</span>
      <div className="tag-row"><button className={!filters.tag ? "tag active" : "tag"} onClick={() => update({ tag: "" })}>All topics</button>
        {Object.entries(counts).map(([tag, count]) => <button key={tag} className={filters.tag === tag ? "tag active" : "tag"} onClick={() => update({ tag: filters.tag === tag ? "" : tag })}>{tag} ({count})</button>)}
      </div>
    </div>

    <p className="result-count">{shown.length} write-ups shown</p>
    {shown.length ? <div className="post-list">{shown.map((post) => <article className="post-row" key={post.slug}>
      <time dateTime={post.date}>{formatDate(post.date)}</time><div>
        <h2><Link href={`/writeups/${post.slug}`} prefetch={false}>{post.title}</Link></h2><p>{post.summary}</p>
        <div className="post-tags">{post.tags.map((tag) => <button key={tag} onClick={() => update({ tag })}>{tag}</button>)}</div>
      </div><span className="row-mark" aria-hidden="true">↗</span>
    </article>)}</div> : <div className="empty-state"><p>No write-ups match. Clear the filters to see all.</p><button className="text-button" onClick={() => update({ q: "", tag: "", category: "", difficulty: "" })}>Clear filters</button></div>}
  </div>;
}
