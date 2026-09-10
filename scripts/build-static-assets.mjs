/**
 * Post-build step.
 *
 * For every route in the registry this writes:
 *   - social-<slug>.png, the 1200x630 link-preview card
 *   - <path>/index.html, a shell whose head already carries that page's
 *     metadata, so crawlers and link unfurlers see the right tags without
 *     running the app
 *
 * It then writes sitemap.xml from the same registry, which is why a new page
 * can never again be missing from it, plus the PWA manifest and its icons.
 *
 * Icons are generated rather than committed, so the mark lives in exactly one
 * place and no binary needs re-exporting when it changes.
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { preloadHint } from "../src/data/media.js";
import { routes, siteUrl, socialImagePath } from "../src/data/routes.js";

const dist = path.resolve("dist");

function xml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character]
  );
}

function socialCard(route) {
  const { card } = route;
  const [lineOne, lineTwo] = card.lines.map(xml);
  return `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#14202B"/>
          <stop offset="1" stop-color="#0B1117"/>
        </linearGradient>
        <radialGradient id="glow" cx="0" cy="0" r="1" gradientTransform="translate(1045 105) rotate(135) scale(480)">
          <stop stop-color="${card.accent}" stop-opacity="0.35"/>
          <stop offset="1" stop-color="${card.accent}" stop-opacity="0"/>
        </radialGradient>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#F4F0E8" stroke-opacity="0.075" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <rect width="1200" height="630" fill="url(#grid)"/>
      <rect width="1200" height="630" fill="url(#glow)"/>
      <path d="M810 630 C855 425 960 310 1200 236" fill="none" stroke="${card.accent}" stroke-opacity="0.32" stroke-width="2"/>
      <path d="M920 630 C945 455 1030 365 1200 325" fill="none" stroke="#F4F0E8" stroke-opacity="0.14" stroke-width="1"/>
      <rect x="74" y="74" width="52" height="52" fill="none" stroke="${card.accent}" stroke-width="2"/>
      <text x="100" y="109" text-anchor="middle" fill="${card.accent}" font-size="18" font-family="Georgia, serif" font-weight="700">DK</text>
      <text x="74" y="184" fill="${card.accent}" font-size="17" font-family="Arial, sans-serif" font-weight="700" letter-spacing="4">${xml(card.eyebrow)}</text>
      <text x="74" y="290" fill="#F4F0E8" font-size="64" font-family="Georgia, serif" font-weight="700">${lineOne}</text>
      <text x="74" y="367" fill="#F4F0E8" font-size="64" font-family="Georgia, serif" font-weight="700">${lineTwo}</text>
      <line x1="74" y1="419" x2="194" y2="419" stroke="${card.accent}" stroke-width="3"/>
      <text x="74" y="470" fill="#D7D1C6" font-size="24" font-family="Arial, sans-serif">${xml(route.shareDescription)}</text>
      <text x="74" y="564" fill="#AEB7BB" font-size="18" font-family="Arial, sans-serif" letter-spacing="1">DANIEL.KAVANGI.CO.KE</text>
    </svg>`;
}

/**
 * Replaces a single tag in the built HTML head. Throws when the tag is missing
 * so a template change can never silently ship pages with stale metadata.
 */
function replaceTag(html, pattern, replacement, label) {
  if (!pattern.test(html)) {
    throw new Error(`generate-social-pages: no ${label} tag found in dist/index.html`);
  }
  return html.replace(pattern, replacement);
}

function withMetadata(html, route) {
  const url = `${siteUrl}${route.path}`;
  const image = `${siteUrl}/${socialImagePath(route)}`;
  const alt = `${route.title}. ${route.shareDescription}`;

  const replacements = [
    [/<title>[\s\S]*?<\/title>/, `<title>${xml(route.title)}</title>`, "title"],
    [
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${xml(route.description)}" />`,
      "description",
    ],
    [/<link\s+rel="canonical"[\s\S]*?\/>/, `<link rel="canonical" href="${xml(url)}" />`, "canonical"],
    [/<meta\s+property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${xml(url)}" />`, "og:url"],
    [
      /<meta\s+property="og:title"[\s\S]*?\/>/,
      `<meta property="og:title" content="${xml(route.shareTitle)}" />`,
      "og:title",
    ],
    [
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${xml(route.shareDescription)}" />`,
      "og:description",
    ],
    [
      /<meta\s+property="og:image"\s+content[\s\S]*?\/>/,
      `<meta property="og:image" content="${xml(image)}" />`,
      "og:image",
    ],
    [
      /<meta\s+property="og:image:secure_url"[\s\S]*?\/>/,
      `<meta property="og:image:secure_url" content="${xml(image)}" />`,
      "og:image:secure_url",
    ],
    [
      /<meta\s+property="og:image:type"[\s\S]*?\/>/,
      `<meta property="og:image:type" content="image/png" />`,
      "og:image:type",
    ],
    [
      /<meta\s+property="og:image:alt"[\s\S]*?\/>/,
      `<meta property="og:image:alt" content="${xml(alt)}" />`,
      "og:image:alt",
    ],
    [
      /<meta\s+name="twitter:title"[\s\S]*?\/>/,
      `<meta name="twitter:title" content="${xml(route.shareTitle)}" />`,
      "twitter:title",
    ],
    [
      /<meta\s+name="twitter:description"[\s\S]*?\/>/,
      `<meta name="twitter:description" content="${xml(route.shareDescription)}" />`,
      "twitter:description",
    ],
    [
      /<meta\s+name="twitter:image"[\s\S]*?\/>/,
      `<meta name="twitter:image" content="${xml(image)}" />`,
      "twitter:image",
    ],
  ];

  return replacements.reduce(
    (current, [pattern, replacement, label]) => replaceTag(current, pattern, replacement, label),
    html
  );
}

function sitemap(lastmod) {
  const entries = routes
    .filter((route) => route.sitemap)
    .map((route) =>
      [
        "  <url>",
        `    <loc>${siteUrl}${route.path}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${route.sitemap.changefreq}</changefreq>`,
        `    <priority>${route.sitemap.priority}</priority>`,
        "  </url>",
      ].join("\n")
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

/**
 * Both font families are used on every page, and both are self-hosted with
 * hashed filenames, so the browser only discovers them after parsing the CSS.
 * Preloading the two latin faces removes that second round trip.
 */
async function fontPreloads() {
  const assets = await readdir(path.join(dist, "assets"));
  return assets
    .filter((file) => file.endsWith(".woff2") && !file.includes("latin-ext"))
    .map(
      (file) =>
        `    <link rel="preload" as="font" type="font/woff2" href="/assets/${file}" crossorigin />`
    )
    .join("\n");
}

function imagePreload(route) {
  if (!route.preloadImage) return "";
  const hint = preloadHint(route.preloadImage.name, route.preloadImage.sizes);
  return `    <link rel="preload" as="image" type="${hint.type}" href="${hint.href}" imagesrcset="${xml(hint.imagesrcset)}" imagesizes="${xml(hint.imagesizes)}" />`;
}

const html = await readFile(path.join(dist, "index.html"), "utf8");
const fonts = await fontPreloads();

for (const route of routes) {
  await sharp(Buffer.from(socialCard(route)))
    .png({ compressionLevel: 9 })
    .toFile(path.join(dist, socialImagePath(route)));

  const hints = [fonts, imagePreload(route)].filter(Boolean).join("\n");
  const output = withMetadata(html, route).replace("  </head>", `${hints}\n  </head>`);

  if (route.path === "/") {
    await writeFile(path.join(dist, "index.html"), output);
    continue;
  }

  const folder = path.join(dist, route.path.slice(1));
  await mkdir(folder, { recursive: true });
  await writeFile(path.join(folder, "index.html"), output);
}

await writeFile(path.join(dist, "sitemap.xml"), sitemap(new Date().toISOString().slice(0, 10)));


const ICON_INK = "#14202B";
const ICON_PAPER = "#F4F0E8";

/**
 * @param {number} size
 * @param {number} inset fraction of the canvas kept clear of the mark. Maskable
 *   icons are cropped to a circle by some launchers, so the glyph has to sit
 *   well inside the safe zone.
 */
function iconSvg(size, inset) {
  const fontSize = Math.round(size * (1 - inset * 2) * 0.42);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${ICON_INK}"/>
  <text x="50%" y="50%" dy="0.35em" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="700" fill="${ICON_PAPER}">DK</text>
</svg>`;
}

const icons = [
  { file: "icon-192.png", size: 192, inset: 0.08, purpose: "any" },
  { file: "icon-512.png", size: 512, inset: 0.08, purpose: "any" },
  { file: "icon-maskable-512.png", size: 512, inset: 0.2, purpose: "maskable" },
  { file: "apple-touch-icon.png", size: 180, inset: 0.1, purpose: null },
];

for (const icon of icons) {
  await sharp(Buffer.from(iconSvg(icon.size, icon.inset)))
    .png({ compressionLevel: 9 })
    .toFile(path.join(dist, icon.file));
}

const manifest = {
  name: "Daniel Mwendwa Kavangi",
  short_name: "D. Kavangi",
  description: routes[0].shareDescription,
  start_url: "/",
  scope: "/",
  display: "standalone",
  background_color: ICON_PAPER,
  theme_color: ICON_INK,
  lang: "en",
  categories: ["business", "education", "finance"],
  icons: icons
    .filter((icon) => icon.purpose)
    .map((icon) => ({
      src: `/${icon.file}`,
      sizes: `${icon.size}x${icon.size}`,
      type: "image/png",
      purpose: icon.purpose,
    })),
};

await writeFile(path.join(dist, "manifest.webmanifest"), `${JSON.stringify(manifest, null, 2)}
`);

console.log(
  `build-static-assets: ${routes.length} pages, ${routes.length} cards, ${icons.length} icons, sitemap and manifest written`
);
