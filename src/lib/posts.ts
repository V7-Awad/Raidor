import postData from "@/generated/posts.json";

export type Post = {
  title: string;
  slug: string;
  date: string;
  updated?: string;
  summary: string;
  tags: string[];
  category: "ctf" | "lab" | "research" | "note";
  event?: string;
  difficulty?: "easy" | "medium" | "hard";
  cover?: string;
  body: string[];
  headings: { title: string; id: string }[];
  wordCount: number;
};

export const posts = postData as Post[];
export function getPost(slug: string) { return posts.find((post) => post.slug === slug); }
export function readingTime(post: Post) { return Math.max(1, Math.ceil(post.wordCount / 220)); }
export function formatDate(date: string) { return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${date}T00:00:00`)); }
