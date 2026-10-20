import type { Post } from "@/lib/posts";
import { formatDate, readingTime } from "@/lib/posts";

const categoryLabel = { ctf: "CTF", lab: "LAB", research: "RESEARCH", note: "FIELD NOTE" } as const;

export function CaseBoard({ post }: { post: Post }) {
  const isSample = post.tags.includes("sample");

  return (
    <div className="case-board">
      <div className="case-board-heading">
        <span>RAIDER // CASE FILE</span>
        <span className={isSample ? "case-status sample" : "case-status"}>{isSample ? "SAMPLE" : "OPEN NOTES"}</span>
      </div>
      <dl className="case-facts">
        <div><dt>TYPE</dt><dd>{categoryLabel[post.category]}</dd></div>
        {post.target && <div><dt>TARGET</dt><dd>{post.target}</dd></div>}
        {post.scope && <div><dt>SCOPE</dt><dd>{post.scope}</dd></div>}
        {post.difficulty && <div><dt>LEVEL</dt><dd>{post.difficulty.toUpperCase()}</dd></div>}
        {post.event && <div><dt>EVENT</dt><dd>{post.event}</dd></div>}
        {post.outcome && <div><dt>OUTCOME</dt><dd>{post.outcome}</dd></div>}
        <div><dt>FILED</dt><dd><time dateTime={post.date}>{formatDate(post.date)}</time></dd></div>
        <div><dt>READ</dt><dd>{readingTime(post)} MIN · {post.wordCount} WORDS</dd></div>
      </dl>
      <div className="case-tags">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      {post.headings.length > 0 && <nav className="case-timeline" aria-label="Write-up sections">
        <p>INVESTIGATION LOG</p>
        <ol>{post.headings.map((heading, index) => <li key={heading.id}>
          <a href={`#${heading.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{heading.title}</a>
        </li>)}</ol>
      </nav>}
    </div>
  );
}
