import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const dist = path.resolve("dist");
const siteUrl = "https://daniel.kavangi.co.ke";

const pages = [
  {
    path: "/",
    slug: "home",
    metaTitle: "Daniel Mwendwa Kavangi | Data & Risk Analyst",
    eyebrow: "ACTUARIAL SCIENCE · DATA & RISK",
    title: ["Daniel Mwendwa", "Kavangi"],
    description: "Data & risk analysis for insurance, banking and fintech decisions.",
    accent: "#C4A36A",
  },
  {
    path: "/about",
    slug: "about",
    metaTitle: "About Daniel Mwendwa Kavangi | Data & Risk Analyst",
    eyebrow: "ABOUT",
    title: ["Actuarial science.", "Practical analysis."],
    description: "Python, R and Excel for data, risk and financial decisions.",
    accent: "#B9D5CD",
  },
  {
    path: "/work",
    slug: "work",
    metaTitle: "Selected Work | Retirement Adequacy Research",
    eyebrow: "SELECTED WORK · 2026",
    title: ["Retirement adequacy", "under volatile income."],
    description: "100 participants · 3,000 diary entries · 10,000 Monte Carlo iterations.",
    accent: "#D8B66A",
  },
  {
    path: "/experience",
    slug: "experience",
    metaTitle: "Experience | Daniel Mwendwa Kavangi",
    eyebrow: "EXPERIENCE",
    title: ["Data visualisation.", "Budget analysis."],
    description: "Practical work across dashboards, reporting, variance tracking and audit documentation.",
    accent: "#B9D5CD",
  },
  {
    path: "/education",
    slug: "education",
    metaTitle: "Education & Credentials | Daniel Mwendwa Kavangi",
    eyebrow: "EDUCATION & CREDENTIALS",
    title: ["Actuarial science.", "Built on evidence."],
    description: "Quantitative training, professional certificates and a research-led foundation.",
    accent: "#C4A36A",
  },
  {
    path: "/contact",
    slug: "contact",
    metaTitle: "Contact Daniel Mwendwa Kavangi",
    eyebrow: "CONTACT",
    title: ["Let’s discuss", "the next decision."],
    description: "Open to actuarial, insurance, banking, data-analysis and fintech opportunities.",
    accent: "#B9D5CD",
  },
];

function xml(value) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character]);
}

function attr(value) {
  return xml(value);
}

function socialCard(page) {
  const [lineOne, lineTwo] = page.title.map(xml);
  return `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#14202B"/>
          <stop offset="1" stop-color="#0B1117"/>
        </linearGradient>
        <radialGradient id="glow" cx="0" cy="0" r="1" gradientTransform="translate(1045 105) rotate(135) scale(480)">
          <stop stop-color="${page.accent}" stop-opacity="0.35"/>
          <stop offset="1" stop-color="${page.accent}" stop-opacity="0"/>
        </radialGradient>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#F4F0E8" stroke-opacity="0.075" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <rect width="1200" height="630" fill="url(#grid)"/>
      <rect width="1200" height="630" fill="url(#glow)"/>
      <path d="M810 630 C855 425 960 310 1200 236" fill="none" stroke="${page.accent}" stroke-opacity="0.32" stroke-width="2"/>
      <path d="M920 630 C945 455 1030 365 1200 325" fill="none" stroke="#F4F0E8" stroke-opacity="0.14" stroke-width="1"/>
      <rect x="74" y="74" width="52" height="52" fill="none" stroke="${page.accent}" stroke-width="2"/>
      <text x="100" y="109" text-anchor="middle" fill="${page.accent}" font-size="18" font-family="Georgia, serif" font-weight="700">DK</text>
      <text x="74" y="184" fill="${page.accent}" font-size="17" font-family="Arial, sans-serif" font-weight="700" letter-spacing="4">${xml(page.eyebrow)}</text>
      <text x="74" y="290" fill="#F4F0E8" font-size="64" font-family="Georgia, serif" font-weight="700">${lineOne}</text>
      <text x="74" y="367" fill="#F4F0E8" font-size="64" font-family="Georgia, serif" font-weight="700">${lineTwo}</text>
      <line x1="74" y1="419" x2="194" y2="419" stroke="${page.accent}" stroke-width="3"/>
      <text x="74" y="470" fill="#D7D1C6" font-size="24" font-family="Arial, sans-serif">${xml(page.description)}</text>
      <text x="74" y="564" fill="#AEB7BB" font-size="18" font-family="Arial, sans-serif" letter-spacing="1">DANIEL.KAVANGI.CO.KE</text>
    </svg>`;
}

function replaceMeta(html, page) {
  const title = page.metaTitle;
  const description = page.description;
  const url = `${siteUrl}${page.path}`;
  const image = `${siteUrl}/social-${page.slug}.png`;
  let next = html;
  next = next.replace(/<title>[\s\S]*?<\/title>/, `<title>${xml(title)}</title>`);
  next = next.replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${attr(description)}" />`);
  next = next.replace(/<link\s+rel="canonical"[\s\S]*?\/>/, `<link rel="canonical" href="${attr(url)}" />`);
  next = next.replace(/<meta\s+property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${attr(url)}" />`);
  next = next.replace(/<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${attr(title)}" />`);
  next = next.replace(/<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${attr(description)}" />`);
  next = next.replace(/<meta\s+property="og:image"[\s\S]*?\/>/, `<meta property="og:image" content="${attr(image)}" />`);
  next = next.replace(/<meta\s+property="og:image:secure_url"[\s\S]*?\/>/, `<meta property="og:image:secure_url" content="${attr(image)}" />`);
  next = next.replace(/<meta\s+property="og:image:type"[\s\S]*?\/>/, `<meta property="og:image:type" content="image/png" />`);
  next = next.replace(/<meta\s+property="og:image:alt"[\s\S]*?\/>/, `<meta property="og:image:alt" content="${attr(`${title}. ${description}`)}" />`);
  next = next.replace(/<meta\s+name="twitter:title"[\s\S]*?\/>/, `<meta name="twitter:title" content="${attr(title)}" />`);
  next = next.replace(/<meta\s+name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${attr(description)}" />`);
  next = next.replace(/<meta\s+name="twitter:image"[\s\S]*?\/>/, `<meta name="twitter:image" content="${attr(image)}" />`);
  return next;
}

const html = await readFile(path.join(dist, "index.html"), "utf8");

for (const page of pages) {
  await sharp(Buffer.from(socialCard(page))).png({ compressionLevel: 9 }).toFile(path.join(dist, `social-${page.slug}.png`));
  const output = replaceMeta(html, page);
  if (page.path === "/") {
    await writeFile(path.join(dist, "index.html"), output);
    continue;
  }
  const folder = path.join(dist, page.slug === "home" ? "" : page.path.slice(1));
  await mkdir(folder, { recursive: true });
  await writeFile(path.join(folder, "index.html"), output);
}
