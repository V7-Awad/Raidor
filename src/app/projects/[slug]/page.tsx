import type { Metadata } from "next";
import Link from "next/link";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import projects from "@/generated/projects.json";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project ? { title: project.title, description: project.summary } : {};
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const source = await readFile(path.join(process.cwd(), "content", "projects", `${slug}.mdx`), "utf8");
  const { content } = await compileMDX({ source, options: { parseFrontmatter: true } });

  return <div className="page-shell project-detail">
    <Link className="back-link" href="/projects" prefetch={false}>← All projects</Link>
    <p className="lost-signal">PROJECT FILE // {slug.toUpperCase()}</p>
    <h1>{project.title}</h1>
    <p className="page-lede">{project.summary}</p>
    <div className="project-detail-meta">
      <span>STATUS // {project.status}</span>
      {project.stack.map((item) => <span key={item}>{item}</span>)}
    </div>
    {project.links.length > 0 && <nav className="project-resource-links" aria-label="Project resources">
      {project.links.map((url) => <a key={url} href={url} target="_blank" rel="noopener noreferrer">Open resource ↗</a>)}
    </nav>}
    <article className="project-notes">{content}</article>
  </div>;
}
