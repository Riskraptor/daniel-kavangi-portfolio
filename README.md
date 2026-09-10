# Daniel Mwendwa Kavangi — Portfolio

Personal portfolio for **Daniel Mwendwa Kavangi**, actuarial science graduate and data & risk analyst in Nairobi.

Live: **[daniel.kavangi.co.ke](https://daniel.kavangi.co.ke)**

React 19 · Vite · React Router · Tailwind CSS v4 · deployed on Vercel.

---

## Getting started

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Generates responsive images, then starts Vite on :5173 |
| `npm run build` | Images → Vite build → static assets (cards, shells, sitemap, manifest, icons, service worker) |
| `npm run preview` | Serves the real build on :4173 |
| `npm run lint` | ESLint across app, API, scripts and tests |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Node test runner: contact API, form validation, theme contrast |
| `npm run images` | Regenerates `public/media` on its own |

CI runs lint, typecheck, test, build and a production `npm audit` on every push and PR.

---

## Making changes

Most edits are **data edits**. Three files hold almost everything.

### Add or change a page → `src/data/routes.js`

One entry drives all of it:

- the navigation bar and footer links
- the page `<title>`, description and share copy
- the 1200×630 share card, drawn from `card.eyebrow` / `card.lines` / `card.accent`
- the prerendered HTML shell that crawlers and link unfurlers see
- the `sitemap.xml` entry
- the previous/next links at the foot of the page
- an optional LCP image preload (`preloadImage`)

```js
{
  slug: "writing",
  path: "/writing",
  label: "Writing",
  title: "Writing | Daniel Mwendwa Kavangi",
  description: "…",          // for search results
  shareTitle: "…",           // for link previews
  shareDescription: "…",
  card: { eyebrow: "WRITING", lines: ["Two lines", "of display type."], accent: "#C4A36A" },
  sitemap: { priority: "0.7", changefreq: "monthly" },
}
```

Then add the `<Route>` and page component in `src/components/Layout.jsx`. Nothing else needs touching — this file is read by the browser bundle *and* by the Node build scripts, so they cannot drift apart.

### Add a project → `projects` in `src/data/portfolioData.js`

`featuredProject` is whichever entry has `featured: true`; `otherProjects` is the rest. The Selected work page leads with the featured one.

### Add a skill → `skills` in `src/data/portfolioData.js`

Each skill may carry `evidence`, pointing at a page that shows it being used:

```js
{ name: "Stochastic modelling", evidence: [evidence.research] }
```

Only claim evidence that genuinely exists on the site — that is the point of the section.

---

## How the rest fits together

```
src/data/routes.js          route registry (browser + build scripts)
src/data/media.js           responsive image contract (browser + build scripts)
src/data/portfolioData.js   content: bio, experience, education, skills, projects
src/components/             UI, including the hand-drawn research chart
src/lib/contact.js          contact form validation and delivery
api/contact.js              serverless contact endpoint
scripts/generate-images.mjs pre-build: AVIF/WebP/JPEG at five widths
scripts/build-static-assets.mjs post-build: cards, shells, sitemap, manifest, icons, sw
tests/                      node:test suites
```

### Theming

Colour tokens live in `@theme` in `src/index.css`; the dark theme redefines the same tokens. Tokens are named for **the surface they sit on** (`--color-bronze-on-paper`, `--color-bronze-on-ink`), so the palette inverts without special cases.

`public/theme.js` applies a stored choice before first paint. It is a separate file, not an inline script, because the CSP allows `script-src 'self'` with no inline hashes.

`tests/theme-tokens.test.mjs` asserts WCAG contrast for both themes, so a palette change that drops a pair below the threshold fails CI.

### Files other systems depend on

Some files in `public/` are referenced from **outside** this repository, so
grepping the source will not show them as used:

| File | Used by |
| --- | --- |
| `public/cv-headshot.jpg` | The CV hosted on rxresu.me points its photo at `https://daniel.kavangi.co.ke/cv-headshot.jpg` |
| `public/Daniel-Mwendwa-Kavangi-Resume.pdf` | The Download CV button, and any link already sent to an employer |

`tests/public-assets.test.mjs` fails if one goes missing. Add an entry there
before adding another externally-referenced file.

### Images

`public/media` is **generated, not committed**. Widths and formats come from `src/data/media.js`, read by both the generator and `SmartImage`, so a width added there is produced and offered in the same change.

---

## Contact form

The endpoint requires an allow-listed `Origin`, an hCaptcha token and a rate-limit slot before it will deliver or hand back a Web3Forms key.

Set these in Vercel → Settings → Environment Variables (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `CONTACT_TO_EMAIL` | Where messages go |
| `RESEND_API_KEY` | Preferred delivery path |
| `CONTACT_FROM` | Sender identity for Resend |
| `WEB3FORMS_ACCESS_KEY` | Fallback, submitted from the browser |
| `HCAPTCHA_SECRET` | **Recommended.** Lets the API verify the captcha itself |
| `VITE_HCAPTCHA_SITEKEY` | Public site key matching that secret |

Without `HCAPTCHA_SECRET` the API cannot verify the token itself, so it defers to Web3Forms and does not send directly through Resend.

`tests/contact-api.test.mjs` covers the origin check, the captcha requirement, rate limiting under a spoofed `x-forwarded-for`, and that the access key is never disclosed to an unauthenticated caller.

---

## Deployment

Vercel builds from the repository root on push to `main`. `vercel.json` carries the security headers, caching rules, SPA rewrites, and `noindex` for `*.vercel.app` preview deployments.
