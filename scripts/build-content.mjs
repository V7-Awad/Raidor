import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const root = process.cwd();
const schema = z.object({
  title: z.string().min(1), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  date: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.date()]), summary: z.string().min(1), tags: z.array(z.string()),
  category: z.enum(["ctf", "lab", "research", "note"]),
  updated: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.date()]).optional(), event: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(), cover: z.string().optional(),
  target: z.string().optional(), scope: z.string().optional(), outcome: z.string().optional(), draft: z.boolean().default(false),
});
const projectSchema = z.object({ title: z.string().min(1), summary: z.string().min(1), stack: z.array(z.string()), links: z.array(z.string()).default([]), status: z.string().min(1), cover: z.string().optional() });
const iso = (value) => value instanceof Date ? value.toISOString().slice(0, 10) : value;
const files = (await readdir(path.join(root, "content/writeups"))).filter((name) => name.endsWith(".mdx"));
const posts = [];
for (const file of files) {
  const source = await readFile(path.join(root, "content/writeups", file), "utf8");
  const parsed = matter(source);
  const frontmatter = schema.safeParse(parsed.data);
  if (!frontmatter.success) throw new Error(`Invalid frontmatter in content/writeups/${file}: ${frontmatter.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ")}`);
  if (frontmatter.data.slug !== file.replace(/\.mdx$/, "")) throw new Error(`Slug in content/writeups/${file} must match its filename.`);
  if (frontmatter.data.draft) continue;
  const paragraphs = parsed.content.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const plainText = parsed.content.replace(/```[\s\S]*?```/g, " ").replace(/[`*_>#\[\]()-]/g, " ").replace(/\s+/g, " ").trim();
  const headings = Array.from(parsed.content.matchAll(/^#{2,6}\s+(.+)$/gm), ([, text]) => ({ title: text.trim(), id: text.trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/[\s-]+/g, "-") }));
  posts.push({ ...frontmatter.data, date: iso(frontmatter.data.date), updated: frontmatter.data.updated ? iso(frontmatter.data.updated) : undefined, body: paragraphs, headings, wordCount: plainText.split(/\s+/).filter(Boolean).length });
}
posts.sort((a, b) => b.date.localeCompare(a.date));
const projectFiles = (await readdir(path.join(root, "content/projects"))).filter((name) => name.endsWith(".mdx"));
const projects = [];
for (const file of projectFiles) {
  const parsed = matter(await readFile(path.join(root, "content/projects", file), "utf8"));
  const project = projectSchema.safeParse(parsed.data);
  if (!project.success) throw new Error(`Invalid frontmatter in content/projects/${file}: ${project.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ")}`);
  projects.push({ ...project.data, slug: file.replace(/\.mdx$/, "") });
}
await import("node:fs/promises").then(({ mkdir }) => mkdir(path.join(root, "src/generated"), { recursive: true }));
await writeFile(path.join(root, "src/generated/posts.json"), `${JSON.stringify(posts, null, 2)}\n`);
await writeFile(path.join(root, "src/generated/projects.json"), `${JSON.stringify(projects, null, 2)}\n`);
await writeFile(path.join(root, "public/search-index.json"), `${JSON.stringify(posts.map(({ title, summary, tags, slug }) => ({ title, summary, tags, slug })))}\n`);
console.log(`Validated ${files.length} write-ups and ${projectFiles.length} projects; published ${posts.length} write-ups (drafts excluded).`);
