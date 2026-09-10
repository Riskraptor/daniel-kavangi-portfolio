import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

/**
 * Contrast is a property of the token values, so it can be checked here rather
 * than by eye. This catches a palette change that quietly drops a pair below
 * WCAG, in either theme, without anyone having to open the site.
 */

const css = await readFile(new URL("../src/index.css", import.meta.url), "utf8");

function block(pattern) {
  const match = css.match(pattern);
  assert.ok(match, `expected to find a token block matching ${pattern}`);
  return Object.fromEntries(
    [...match[1].matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()])
  );
}

const light = block(/@theme\s*\{([\s\S]*?)\n\}/);
const systemDark = block(
  /@media \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme="light"\]\) \{([\s\S]*?)\n {2}\}/
);
const chosenDark = block(/:root\[data-theme="dark"\] \{([\s\S]*?)\n\}/);

function luminance(hex) {
  const value = hex.replace("#", "");
  const channels = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** [foreground token, background token, minimum ratio, what it is] */
const PAIRS = [
  ["--color-ink", "--color-paper", 4.5, "body text"],
  ["--color-ink-soft", "--color-paper", 4.5, "secondary text"],
  ["--color-ink-muted", "--color-paper", 4.5, "muted text on the page"],
  ["--color-ink-muted", "--color-surface", 4.5, "muted text on panels"],
  ["--color-accent", "--color-paper", 4.5, "links"],
  ["--color-danger", "--color-surface", 4.5, "form errors"],
  ["--color-bronze-on-paper", "--color-paper", 4.5, "eyebrow labels"],
  ["--color-bronze-on-paper", "--color-surface", 4.5, "eyebrow labels on panels"],
  ["--color-bronze-on-ink", "--color-ink", 4.5, "eyebrow labels on the ink band"],
  ["--color-paper", "--color-ink", 4.5, "text on the ink band"],
  ["--color-field", "--color-paper", 3, "form control borders"],
  ["--color-field", "--color-surface", 3, "form control borders on panels"],
  ["--chart-series-1", "--color-surface", 3, "chart series 1"],
  ["--chart-series-2", "--color-surface", 3, "chart series 2"],
  ["--chart-series-3", "--color-surface", 3, "chart series 3"],
];

for (const [themeName, tokens] of [
  ["light", light],
  ["dark", chosenDark],
]) {
  test(`${themeName} theme meets contrast minimums`, () => {
    for (const [fg, bg, minimum, description] of PAIRS) {
      assert.ok(tokens[fg], `${themeName}: ${fg} is not defined`);
      assert.ok(tokens[bg], `${themeName}: ${bg} is not defined`);
      const ratio = contrast(tokens[fg], tokens[bg]);
      assert.ok(
        ratio >= minimum,
        `${themeName}: ${description} (${fg} on ${bg}) is ${ratio.toFixed(2)}:1, needs ${minimum}:1`
      );
    }
  });
}

test("both dark blocks define the same tokens with the same values", () => {
  // One block answers the system preference, the other an explicit choice.
  // They have to stay identical or the toggle disagrees with the OS.
  assert.deepEqual(
    Object.keys(systemDark).sort(),
    Object.keys(chosenDark).sort(),
    "the two dark blocks define different token names"
  );
  assert.deepEqual(systemDark, chosenDark, "the two dark blocks disagree on a value");
});

test("dark theme overrides every colour token the light theme defines", () => {
  const themed = Object.keys(light).filter(
    (name) => name.startsWith("--color-") || name.startsWith("--chart-")
  );
  const missing = themed.filter((name) => !(name in chosenDark));
  assert.deepEqual(missing, [], `these tokens keep their light value in dark mode: ${missing}`);
});

test("the explicit choice can override the system preference in both directions", () => {
  // A dark-preferring system with an explicit light choice must fall through to
  // the light tokens, which only works while the media block excludes it.
  assert.match(
    css,
    /@media \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme="light"\]\)/,
    "the system-dark block must exclude an explicit light choice"
  );
  assert.match(css, /:root\[data-theme="dark"\]/, "an explicit dark choice needs its own block");
});
