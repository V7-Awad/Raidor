import Link from "next/link";
import projects from "@/generated/projects.json";

export const metadata = { title: "Projects", description: "Selected security and software projects." };

export default function Projects() {
  return <div className="page-shell">
    <p className="lost-signal">FIELD INDEX // PROJECTS</p>
    <h1>Projects</h1>
    <p className="page-lede">Tools, experiments, and work in progress. Open a project file for its notes and links.</p>
    <div className="project-list">{projects.map((project, index) => <article className="project" key={project.slug}>
      <p className="project-index">PROJECT FILE · {String(index + 1).padStart(2, "0")}</p>
      <h2><Link href={`/projects/${project.slug}`} prefetch={false}>{project.title}</Link></h2>
      <p>{project.summary}</p>
      <div className="project-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}<span>· {project.status}</span></div>
      <Link className="project-open" href={`/projects/${project.slug}`} prefetch={false}>Open project file →</Link>
    </article>)}</div>
  </div>;
}
