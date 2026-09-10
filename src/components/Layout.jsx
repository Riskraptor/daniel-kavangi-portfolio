import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import RouteProgress from "./RouteProgress";
import PageNavigator from "./PageNavigator";
import Intro from "./Intro";
import Home from "../pages/Home";
import About from "../pages/About";
import Experience from "../pages/Experience";
import Work from "../pages/Work";
import Education from "../pages/Education";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import { pageMeta, siteUrl } from "../data/portfolioData";
import { routeByPath } from "../data/routes";

function setMeta(selector, attribute, value) {
  const node = document.querySelector(selector);
  if (node) node.setAttribute(attribute, value);
}

/**
 * Canonical URLs and breadcrumbs only make sense for real pages. An unmatched
 * path renders the 404 view, so it must not claim to be canonical and must not
 * invite indexing, or every mistyped inbound link becomes its own search result.
 */
function setCanonical(href) {
  let node = document.querySelector('link[rel="canonical"]');
  if (!href) {
    node?.remove();
    return;
  }
  if (!node) {
    node = document.createElement("link");
    node.rel = "canonical";
    document.head.appendChild(node);
  }
  node.setAttribute("href", href);
}

function setBreadcrumb(route, url) {
  const existing = document.getElementById("breadcrumb-jsonld");
  if (!route || route.path === "/") {
    existing?.remove();
    return;
  }

  const payload = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: route.label, item: url },
    ],
  };

  const node = existing || document.createElement("script");
  node.id = "breadcrumb-jsonld";
  node.type = "application/ld+json";
  node.textContent = JSON.stringify(payload);
  if (!existing) document.head.appendChild(node);
}

function usePageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const route = routeByPath(pathname);
    const meta = pageMeta[pathname] || pageMeta["/404"];
    const url = `${siteUrl}${pathname === "/" ? "/" : pathname}`;
    const shareTitle = meta.shareTitle || meta.title;
    const shareDescription = meta.shareDescription || meta.description;
    const shareImage = `${siteUrl}/${meta.socialImage}`;

    document.title = meta.title;

    // The page description and the share blurb are written for different
    // readers: one for a search result, one for a link preview.
    setMeta('meta[name="description"]', "content", meta.description);
    setMeta('meta[name="robots"]', "content", route ? "index, follow" : "noindex, follow");

    setMeta('meta[property="og:title"]', "content", shareTitle);
    setMeta('meta[property="og:description"]', "content", shareDescription);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", shareImage);
    setMeta('meta[property="og:image:secure_url"]', "content", shareImage);
    setMeta('meta[name="twitter:title"]', "content", shareTitle);
    setMeta('meta[name="twitter:description"]', "content", shareDescription);
    setMeta('meta[name="twitter:image"]', "content", shareImage);

    setCanonical(route ? url : null);
    setBreadcrumb(route, url);
  }, [pathname]);
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function HashRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith("#/")) return;
    let path = hash.slice(1).split("?")[0];
    if (!path.startsWith("/") || path.startsWith("//") || path.includes("://") || path.includes("\\")) {
      return;
    }
    if (path.startsWith("/portfolio")) path = "/work";
    const next = path || "/";
    window.history.replaceState(null, "", next);
    navigate(next, { replace: true });
  }, [navigate]);

  return null;
}

export default function Layout() {
  usePageMeta();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const failsafe = window.setTimeout(() => setReady(true), 2200);
    return () => window.clearTimeout(failsafe);
  }, []);

  return (
    <div className={`site flex min-h-screen flex-col bg-paper text-ink ${ready ? "is-ready" : "is-intro"}`}>
      <a
        href="#main"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById("main");
          if (!main) return;
          main.setAttribute("tabindex", "-1");
          main.focus({ preventScroll: true });
          main.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      >
        Skip to content
      </a>
      <Intro onDone={() => setReady(true)} />
      <ScrollToTop />
      <HashRedirect />
      <RouteProgress />
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-1 pt-16 outline-none lg:pt-[4.25rem]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/education" element={<Education />} />
          <Route path="/portfolio" element={<Navigate to="/work" replace />} />
          <Route path="/portfolio/:id" element={<Navigate to="/work" replace />} />
          <Route path="/work" element={<Work />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <PageNavigator />
      </main>
      <Footer />
    </div>
  );
}
