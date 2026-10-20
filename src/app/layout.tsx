import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Menu } from "@/components/ui/Menu";
import { GlobalEffects } from "@/components/ui/GlobalEffects";
import { Terminal } from "@/components/ui/Terminal";
import { JetBrains_Mono, Newsreader, Syne } from "next/font/google";
import "./globals.css";
const syne = Syne({ subsets: ["latin"], weight: ["700"], variable: "--font-syne", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], variable: "--font-newsreader", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-jetbrains", display: "swap" });
export const metadata: Metadata = { metadataBase: new URL(siteConfig.url), title: { default: `${siteConfig.name} — ${siteConfig.handle}`, template: `%s — ${siteConfig.name}` }, description: siteConfig.tagline, alternates: { canonical: "/" }, icons: { icon: [{ url: "/brand/favicon.svg", type: "image/svg+xml" }, { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" }, { url: "/brand/icon-512.png", sizes: "512x512", type: "image/png" }], apple: "/brand/apple-touch-icon.png" }, openGraph: { type: "website", siteName: siteConfig.name, title: siteConfig.name, description: siteConfig.tagline, images: ["/brand/og-default.png"] }, twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.tagline, images: ["/brand/og-default.png"] }, robots: { index: true, follow: true } };
export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" data-scroll-behavior="smooth" className={`${syne.variable} ${newsreader.variable} ${jetbrains.variable}`}><body><a className="skip-link" href="#main">Skip to content</a><GlobalEffects/><Menu/><Terminal/><main id="main">{children}</main><footer className="site-footer"><Link className="footer-name" href="/" prefetch={false}>{siteConfig.name}</Link><span>Quiet notes for curious minds.</span><nav>{Object.entries(siteConfig.socials).map(([name,url]) => <a key={name} href={url} target="_blank" rel="noopener noreferrer">{name}</a>)}</nav><small>© {new Date().getFullYear()} {siteConfig.name}</small></footer></body></html>; }
