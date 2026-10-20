# Raider

A monochrome personal site for security write-ups, lab notes, and projects.

## Run locally

```sh
pnpm install
pnpm dev
```

## Write-ups

Write-ups live in `content/writeups/*.mdx`. Add a file with a unique matching `slug` and filename, ISO date, summary, tags, and category. The pre-build script validates its frontmatter and generates the typed archive and search index. Set `draft: true` to omit a post from the site, RSS, and sitemap. Use normal Markdown, fenced code blocks, and the `Callout` component. Projects use the same workflow in `content/projects/*.mdx` with `stack`, `links`, `status`, and an optional `cover`.

## Change identity

Edit `src/config/site.ts` to change the display name, handle, tagline, canonical URL, email, and social links. The current tagline is a temporary draft.

## Deploy

Install dependencies with pnpm and run `pnpm build`. The app is configured for Next.js deployment on Vercel. Set a production domain in `site.ts`, then configure DNS and verify the response security headers after deployment. Umami remains disabled unless both values in `.env.example` are set; no analytics script is wired until that opt-in is implemented.

## Checks

```sh
pnpm lint
pnpm typecheck
pnpm build
```

## Lighthouse snapshot

Local production build audited on 20 October 2026 with Lighthouse 13.5 mobile emulation: Performance 97, Accessibility 100, Best Practices 100, SEO 100; LCP 2.28 s and CLS 0. The HTML and JSON reports are in `reports/`. These results describe the local production build; live hosting can change the measurements.
