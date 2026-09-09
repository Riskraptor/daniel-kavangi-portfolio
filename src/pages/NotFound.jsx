import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { IconArrow } from "../components/Icons";
import { navLinks, personalInfo } from "../data/portfolioData";

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="wrap flex min-h-[70vh] flex-col justify-center py-20">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 max-w-2xl font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          This page is not on {personalInfo.firstName}'s site.
        </h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          The address may be mistyped, or the page has moved. Use one of the pages below.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="btn btn-secondary">
              {link.label}
              <IconArrow className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
