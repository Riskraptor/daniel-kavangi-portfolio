/*
 * Applies a stored theme choice before first paint.
 *
 * This has to run ahead of the app, or someone who chose a theme against their
 * system preference gets a flash of the wrong one. It is a separate file rather
 * than an inline script because the CSP allows script-src 'self' and no inline
 * hashes - a blocked script would leave the flash in place on every load.
 *
 * No stored choice means no attribute, which lets the prefers-color-scheme rule
 * in the stylesheet decide.
 */
(function () {
  try {
    var stored = window.localStorage.getItem("portfolio-theme");
    if (stored === "dark" || stored === "light") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  } catch (error) {
    // Private mode or blocked storage: fall back to the system preference.
  }
})();
