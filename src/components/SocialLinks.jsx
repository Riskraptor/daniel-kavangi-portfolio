import { socials } from "../data/portfolioData";
import { IconGitHub, IconLinkedIn, IconMail, IconWhatsApp } from "./Icons";

const icons = {
  email: IconMail,
  whatsapp: IconWhatsApp,
  linkedin: IconLinkedIn,
  github: IconGitHub,
};

export default function SocialLinks({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {socials.map((item) => {
        const Icon = icons[item.id];
        if (!Icon) return null;
        return (
          <a
            key={item.id}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            aria-label={item.action ? `${item.label}: ${item.action}` : item.label}
            className="grid h-10 w-10 place-items-center border border-rule text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
}
