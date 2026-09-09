import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { navLinks, personalInfo } from "../data/portfolioData";
import { IconClose, IconMenu } from "./Icons";
import ResumeButton from "./ResumeButton";
import SocialLinks from "./SocialLinks";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b bg-paper ${
        open ? "bottom-0 overflow-hidden border-rule" : scrolled ? "border-rule" : "border-transparent"
      }`}
    >
      <div className="wrap flex h-16 items-center justify-between lg:h-[4.25rem]">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 shrink-0 place-items-center border border-ink bg-ink font-serif text-[11px] font-semibold tracking-wide text-paper">
            {personalInfo.initials}
          </span>
          <span className="hidden truncate text-sm font-semibold tracking-tight text-ink sm:block">
            {personalInfo.shortName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `relative px-2.5 py-2 text-[0.9rem] transition-colors xl:px-3 ${
                  isActive
                    ? "font-semibold text-ink after:absolute after:inset-x-2 after:bottom-1 after:h-px after:bg-ink xl:after:inset-x-3"
                    : "text-ink-soft hover:text-ink"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <ResumeButton variant="secondary" size="sm" className="ml-3" />
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center border border-rule text-ink"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-16 bottom-0 overflow-y-auto bg-paper lg:hidden">
          <nav aria-label="Mobile" className="wrap flex min-h-full flex-col py-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `border-b border-rule py-4 font-serif text-3xl ${
                    isActive ? "text-ink" : "text-ink-soft"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-8 flex flex-col gap-4">
              <ResumeButton />
              <SocialLinks />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
