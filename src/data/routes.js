/**
 * Single source of truth for every public route.
 *
 * Adding a page means adding one entry here. That entry drives the nav, the
 * page metadata, the share card, the prerendered HTML shell, the sitemap and
 * the previous/next footer links — nothing else needs editing.
 *
 * Keep this file free of imports so the Node build scripts can read it
 * directly, the same way the browser bundle does.
 */

export const siteUrl = "https://daniel.kavangi.co.ke";

export const routes = [
  {
    slug: "home",
    path: "/",
    label: "Home",
    title: "Daniel Mwendwa Kavangi | Data & Risk Analyst",
    description:
      "Daniel Mwendwa Kavangi is an actuarial science graduate and data & risk analyst in Nairobi, using Python, R and Excel for insurance, banking and fintech decisions.",
    shareTitle: "Daniel Mwendwa Kavangi | Data & Risk Analyst",
    shareDescription:
      "Actuarial science graduate and data & risk analyst in Nairobi. Python, R and Excel for insurance, banking and fintech decisions.",
    card: {
      eyebrow: "ACTUARIAL SCIENCE · DATA & RISK",
      lines: ["Daniel Mwendwa", "Kavangi"],
      accent: "#C4A36A",
    },
    sitemap: { priority: "1.0", changefreq: "monthly" },
  },
  {
    slug: "about",
    path: "/about",
    label: "About",
    title: "About | Daniel Mwendwa Kavangi",
    description:
      "Actuarial science, data analysis and risk work by Daniel Mwendwa Kavangi, a Chuka University actuarial science graduate in Nairobi working in Python, R and Excel.",
    shareTitle: "About Daniel Mwendwa Kavangi | Data & Risk Analyst",
    shareDescription:
      "Actuarial science, data and risk analysis for insurance, banking and fintech decisions.",
    card: {
      eyebrow: "ABOUT",
      lines: ["Actuarial science.", "Practical analysis."],
      accent: "#B9D5CD",
    },
    sitemap: { priority: "0.8", changefreq: "monthly" },
  },
  {
    slug: "work",
    path: "/work",
    label: "Selected work",
    title: "Selected work | Daniel Mwendwa Kavangi",
    description:
      "Team-led actuarial research: stochastic modelling of retirement adequacy for informal-sector workers in Chuka Municipality, using financial diaries and Monte Carlo simulation.",
    shareTitle: "Selected Work | Retirement Adequacy Research",
    shareDescription:
      "A team-led actuarial study using 3,000 financial-diary entries and 10,000 Monte Carlo iterations.",
    card: {
      eyebrow: "SELECTED WORK · 2026",
      lines: ["Retirement adequacy", "under volatile income."],
      accent: "#D8B66A",
    },
    sitemap: { priority: "0.9", changefreq: "monthly" },
  },
  {
    slug: "experience",
    path: "/experience",
    label: "Experience",
    title: "Experience | Daniel Mwendwa Kavangi",
    description:
      "Data Visualization Intern at Excelerate and Budget Assistant at Machakos County Assembly: dashboards, expenditure tracking, variance analysis and audit documentation.",
    shareTitle: "Experience | Daniel Mwendwa Kavangi",
    shareDescription:
      "Data visualisation, budget analysis and financial reporting using Python, R, Excel and VBA.",
    card: {
      eyebrow: "EXPERIENCE",
      lines: ["Data visualisation.", "Budget analysis."],
      accent: "#B9D5CD",
    },
    sitemap: { priority: "0.9", changefreq: "monthly" },
  },
  {
    slug: "education",
    path: "/education",
    label: "Education",
    title: "Education | Daniel Mwendwa Kavangi",
    description:
      "BSc Actuarial Science from Chuka University, professional certificates in R, Excel and technical support, and referee details available on request.",
    shareTitle: "Education & Credentials | Daniel Mwendwa Kavangi",
    shareDescription:
      "Actuarial science education, quantitative training and selected professional certificates.",
    card: {
      eyebrow: "EDUCATION & CREDENTIALS",
      lines: ["Actuarial science.", "Built on evidence."],
      accent: "#C4A36A",
    },
    sitemap: { priority: "0.8", changefreq: "monthly" },
  },
  {
    slug: "contact",
    path: "/contact",
    label: "Contact",
    title: "Contact | Daniel Mwendwa Kavangi",
    description:
      "Contact Daniel Mwendwa Kavangi about actuarial, insurance, banking, data analysis and fintech roles in Nairobi and remote.",
    shareTitle: "Contact Daniel Mwendwa Kavangi",
    shareDescription:
      "Get in touch about actuarial, insurance, banking, data-analysis and fintech opportunities.",
    card: {
      eyebrow: "CONTACT",
      lines: ["Let's discuss", "the next decision."],
      accent: "#B9D5CD",
    },
    sitemap: { priority: "0.8", changefreq: "monthly" },
  },
];

/** Not a real page: metadata for anything that does not match a route. */
export const notFoundRoute = {
  slug: "404",
  path: "/404",
  label: "Page not found",
  title: "Page not found | Daniel Mwendwa Kavangi",
  description: "This page is not on Daniel Mwendwa Kavangi's site.",
  shareTitle: "Page not found | Daniel Mwendwa Kavangi",
  shareDescription: "This page is not on Daniel Mwendwa Kavangi's site.",
  card: null,
  sitemap: null,
};

export function routeByPath(path) {
  return routes.find((route) => route.path === path) || null;
}

export function socialImagePath(route) {
  return `social-${route?.card ? route.slug : "home"}.png`;
}
