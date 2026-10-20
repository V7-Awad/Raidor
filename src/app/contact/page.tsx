import { siteConfig } from "@/config/site";
export const metadata = { title: "Contact", description: "Contact Raider." };
export default function Contact() { return <div className="page-shell"><h1>Contact</h1><p className="page-lede">For security conversations, collaboration, and questions about a write-up:</p><p><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p><div className="link-list">{Object.entries(siteConfig.socials).map(([name,url]) => <a key={name} href={url} target="_blank" rel="noopener noreferrer">{name} ↗</a>)}</div></div>; }
