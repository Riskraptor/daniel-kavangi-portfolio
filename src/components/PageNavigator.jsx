import { Link, useLocation } from "react-router-dom";
import { IconArrow } from "./Icons";

const flow = {
  "/about": { previous: { to: "/", label: "Home" }, next: { to: "/work", label: "Selected work" } },
  "/work": { previous: { to: "/about", label: "About" }, next: { to: "/experience", label: "Experience" } },
  "/experience": { previous: { to: "/work", label: "Selected work" }, next: { to: "/education", label: "Education" } },
  "/education": { previous: { to: "/experience", label: "Experience" }, next: { to: "/contact", label: "Contact" } },
  "/contact": { previous: { to: "/education", label: "Education" }, next: { to: "/", label: "Home" } },
};

export default function PageNavigator() {
  const { pathname } = useLocation();
  const current = flow[pathname];
  if (!current) return null;

  return (
    <nav className="page-flow wrap" aria-label="Continue exploring">
      <Link to={current.previous.to} className="page-flow-link page-flow-previous">
        <IconArrow className="h-4 w-4 rotate-180" />
        <span><small>Previous</small>{current.previous.label}</span>
      </Link>
      <Link to={current.next.to} className="page-flow-link page-flow-next">
        <span><small>Next</small>{current.next.label}</span>
        <IconArrow className="h-4 w-4" />
      </Link>
    </nav>
  );
}
