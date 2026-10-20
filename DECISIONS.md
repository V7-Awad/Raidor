# Decisions

- **Identity values:** Display name and handle are `Raider`, based on the user's stated name. Domain `raidor.tech`, email, and social profile URLs were supplied by the user.
- **Tagline:** The user approved a temporary tagline: “Security research, CTF write-ups, and notes from the edge.” It is editable in `src/config/site.ts`.
- **Identity artwork:** `identity.jpg` was supplied after implementation began and is kept as `public/brand/identity-original.jpg`. The hero uses a hand-built SVG interpretation of the silhouette and eyes, with generated concentric rings; no automated tracing tool was present.
- **Content pipeline:** MDX sources are validated at dev/build time with Zod, then indexed into typed JSON; `next-mdx-remote` renders the articles with GFM, heading links, and Shiki highlighting. Drafts stay out of the published index.
- **Fonts:** Syne, Newsreader, and JetBrains Mono are self-hosted by `next/font` with `display: swap`.
- **Ring field:** A small raw WebGL fragment shader is used with a CSS static fallback and reduced-motion handling.
- **Deploy:** The user supplied the domain but no Vercel project authorization or DNS access was available. The finished site is ready for deployment; production deployment and domain connection remain pending.
- **Lighthouse:** A local production-build mobile audit is saved under `reports/`. Live-host measurements remain pending deployment.
