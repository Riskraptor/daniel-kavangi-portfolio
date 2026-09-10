import { cn } from "../utils/cn";

export function IconArrow({ className = "" }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconMail({ className = "" }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function IconPhone({ className = "" }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3c0 1-1 2-2 2C9.5 19.5 4.5 14.5 4.5 5.5c0-1 1-2 2-2Z" />
    </svg>
  );
}

export function IconWhatsApp({ className = "" }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2.5A9.5 9.5 0 0 0 3.3 16.3L2.5 21.5l5.32-.78A9.5 9.5 0 1 0 12.04 2.5Zm5.53 13.47c-.23.65-1.14 1.2-1.86 1.36-.49.11-1.13.2-3.29-.71-2.76-1.16-4.54-4-4.68-4.18-.14-.18-1.14-1.52-1.14-2.9 0-1.38.72-2.06.98-2.34.23-.25.62-.36.98-.36h.7c.23 0 .53-.08.82.63.3.73.99 2.53 1.08 2.71.09.18.14.39.03.62-.1.23-.16.37-.31.57-.16.2-.33.44-.47.59-.16.18-.32.37-.14.7.18.32.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.51 1.54.32.16.51.14.7-.08.18-.23.8-.93 1.02-1.25.21-.32.43-.27.73-.16.3.1 1.91.9 2.24 1.07.32.16.54.25.62.39.08.14.08.82-.15 1.47Z" />
    </svg>
  );
}

export function IconPin({ className = "" }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

export function IconMenu({ className = "" }) {
  return (
    <svg className={cn("h-6 w-6", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconClose({ className = "" }) {
  return (
    <svg className={cn("h-6 w-6", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconCap({ className = "" }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3 9 9-5 9 5-9 5-9-5Z" />
      <path d="M7 11.5v4.2c0 .4 2.2 2.3 5 2.3s5-1.9 5-2.3v-4.2" />
      <path d="M21 9v6" />
    </svg>
  );
}

export function IconBriefcase({ className = "" }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
      <path d="M3 12h18" />
    </svg>
  );
}

export function IconAward({ className = "" }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="9" r="5.5" />
      <path d="m8.5 13.5-1.5 7 5-2.5 5 2.5-1.5-7" />
    </svg>
  );
}

export function IconLang({ className = "" }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3 3.8 6 3.8 9s-1.3 6-3.8 9c-2.5-3-3.8-6-3.8-9S9.5 6 12 3Z" />
    </svg>
  );
}

export function IconCheck({ className = "" }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5 10 17.5 19 7" />
    </svg>
  );
}

export function IconSend({ className = "" }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 14-7-4 16-3-6-7-3Z" />
    </svg>
  );
}

export function IconDownload({ className = "" }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4v12M7 11l5 5 5-5M5 20h14" />
    </svg>
  );
}

export function IconExternal({ className = "" }) {
  return (
    <svg className={cn("h-3.5 w-3.5 shrink-0", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 5h5v5M19 5 10 14" />
      <path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

export function IconLinkedIn({ className = "" }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3.5A1.96 1.96 0 1 0 5.24 7.4 1.96 1.96 0 0 0 5.25 3.5ZM20.44 20h-3.37v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95V20H9.7V8.5h3.23v1.57h.05c.45-.85 1.54-1.75 3.17-1.75 3.39 0 4.02 2.23 4.02 5.13V20Z" />
    </svg>
  );
}

export function IconGitHub({ className = "" }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.2A9.8 9.8 0 0 0 2.2 12.1c0 4.36 2.83 8.06 6.76 9.37.5.1.68-.22.68-.48v-1.7c-2.75.6-3.33-1.18-3.33-1.18-.45-1.14-1.1-1.45-1.1-1.45-.9-.62.07-.6.07-.6 1 .07 1.52 1.03 1.52 1.03.89 1.53 2.33 1.09 2.9.83.09-.65.35-1.09.63-1.34-2.2-.25-4.51-1.1-4.51-4.9 0-1.08.39-1.97 1.03-2.66-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.8c.85 0 1.7.11 2.5.32 1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.41.1 2.66.64.69 1.03 1.58 1.03 2.66 0 3.81-2.32 4.64-4.53 4.89.36.31.68.92.68 1.86v2.76c0 .26.18.58.69.48A9.81 9.81 0 0 0 21.8 12 9.8 9.8 0 0 0 12 2.2Z" />
    </svg>
  );
}

export function IconAlert({ className = "" }) {
  return (
    <svg className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5h.01" />
    </svg>
  );
}

export function IconSun({ className = "" }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  );
}

export function IconMoon({ className = "" }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}
