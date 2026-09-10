import { Link, useLocation } from "react-router-dom";
import { routes } from "../data/routes";
import { IconArrow } from "./Icons";

/**
 * Previous/next links, derived from the route registry rather than a second
 * hand-written map. The old copy listed five paths and omitted "/", so adding a
 * page meant remembering to edit this file too - and the home page silently had
 * no links at all.
 *
 * The order wraps, so the last page leads back to the first.
 */
function neighbours(pathname) {
  const index = routes.findIndex((route) => route.path === pathname);
  if (index === -1) return null;
  return {
    previous: routes[(index - 1 + routes.length) % routes.length],
    next: routes[(index + 1) % routes.length],
  };
}

export default function PageNavigator() {
  const { pathname } = useLocation();
  const current = neighbours(pathname);
  if (!current) return null;

  return (
    <nav className="page-flow wrap" aria-label="Continue exploring">
      <Link to={current.previous.path} className="page-flow-link page-flow-previous">
        <IconArrow className="h-4 w-4 rotate-180" />
        <span>
          <small>Previous</small>
          {current.previous.label}
        </span>
      </Link>
      <Link to={current.next.path} className="page-flow-link page-flow-next">
        <span>
          <small>Next</small>
          {current.next.label}
        </span>
        <IconArrow className="h-4 w-4" />
      </Link>
    </nav>
  );
}
