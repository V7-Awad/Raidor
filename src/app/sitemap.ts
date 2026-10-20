import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { posts } from "@/lib/posts";
export default function sitemap(): MetadataRoute.Sitemap { const routes = ["", "/writeups", "/projects", "/about", "/contact"]; return [...routes.map((route) => ({ url: `${siteConfig.url}${route}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: route === "" ? 1 : .7 })), ...posts.map((post) => ({ url: `${siteConfig.url}/writeups/${post.slug}`, lastModified: new Date(post.date), changeFrequency: "yearly" as const, priority: .6 }))]; }
