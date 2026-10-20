import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { posts } from "@/lib/posts";
import projects from "@/generated/projects.json";
export default function sitemap(): MetadataRoute.Sitemap { const routes = ["", "/writeups", "/projects", "/about", "/contact"]; return [...routes.map((route) => ({ url: `${siteConfig.url}${route}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: route === "" ? 1 : .7 })), ...posts.map((post) => ({ url: `${siteConfig.url}/writeups/${post.slug}`, lastModified: new Date(post.date), changeFrequency: "yearly" as const, priority: .6 })), ...projects.map((project) => ({ url: `${siteConfig.url}/projects/${project.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: .5 }))]; }
