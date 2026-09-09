import { Link } from "react-router-dom";
import { navLinks, personalInfo, socials } from "../data/portfolioData";
import { IconArrow, IconExternal } from "./Icons";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="border-t border-rule bg-paper">
      <div className="wrap grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-xl font-medium tracking-tight text-ink">{personalInfo.name}</p>
          <p className="mt-1 text-sm text-ink-soft">{personalInfo.headline}</p>
          <p className="mt-3 max-w-sm text-sm text-ink-muted">{personalInfo.availability}.</p>
          <div className="mt-5">
            <SocialLinks />
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <p className="eyebrow mb-1">Navigate</p>
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="w-fit text-ink-soft transition-colors hover:text-ink">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2.5 text-sm text-ink-soft">
          <p className="eyebrow mb-1">Contact</p>
          {socials.map((item) => {
            const Cue = item.external ? IconExternal : IconArrow;
            return (
              <a
                key={item.id}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="group w-fit"
              >
                <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  {item.label}
                </span>
                <span className="mt-0.5 inline-flex items-center gap-1 text-ink-soft transition-colors group-hover:text-ink">
                  {item.action}
                  <Cue className="h-3 w-3 text-accent" />
                </span>
              </a>
            );
          })}
          <a href={`tel:${personalInfo.phone}`} className="w-fit transition-colors hover:text-ink">
            Call {personalInfo.phoneDisplay}
          </a>
          <p>{personalInfo.location}</p>
        </div>
      </div>
      <div className="border-t border-rule">
        <div className="wrap flex flex-col gap-2 py-5 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {personalInfo.name}
          </span>
          <span>Nairobi, Kenya</span>
        </div>
      </div>
    </footer>
  );
}
