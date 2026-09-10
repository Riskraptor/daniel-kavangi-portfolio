import { useCallback, useEffect, useState } from "react";
import { IconMoon, IconSun } from "./Icons";

const STORAGE_KEY = "portfolio-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Read during the first render, so the button never paints the wrong icon and
 * then corrects itself. public/theme.js has already applied any stored choice
 * to <html> by this point.
 */
function readTheme() {
  const chosen = document.documentElement.getAttribute("data-theme");
  if (chosen === "dark" || chosen === "light") return chosen;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function hasStoredChoice() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "dark" || stored === "light";
  } catch {
    return false;
  }
}

export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    // The address bar and task switcher read this, so it has to follow along.
    document
      .querySelector('meta[name="theme-color"]:not([media])')
      ?.setAttribute("content", theme === "dark" ? "#12181d" : "#f4f0e8");
  }, [theme]);

  // Someone who has not chosen explicitly should still follow their system if
  // it changes while the page is open.
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    const onChange = (event) => {
      if (!hasStoredChoice()) setTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((previous) => {
      const next = previous === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // The choice still applies for this page view.
      }
      return next;
    });
  }, []);

  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`theme-toggle ${className}`.trim()}
      aria-pressed={dark}
      aria-label={dark ? "Switch to the light theme" : "Switch to the dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
    >
      {dark ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
    </button>
  );
}
