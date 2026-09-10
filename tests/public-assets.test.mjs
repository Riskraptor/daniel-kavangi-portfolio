import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import test from "node:test";

/**
 * Some files in public/ are referenced from outside this repository, so no
 * amount of grepping the source will show them as used. Deleting one looks
 * safe and breaks something you cannot see from here.
 *
 * This happened: public/cv-headshot.jpg was removed as an unused asset, which
 * silently emptied the photo frame on the CV, because the resume hosted at
 * rxresu.me points its picture at https://daniel.kavangi.co.ke/cv-headshot.jpg.
 * The SPA catch-all rewrite then answered that request with index.html, so it
 * failed as a broken image rather than a 404 anyone would notice.
 *
 * Add an entry here for any public file an external system depends on.
 */
const EXTERNALLY_REFERENCED = [
  {
    file: "public/cv-headshot.jpg",
    usedBy: "rxresu.me CV picture -> https://daniel.kavangi.co.ke/cv-headshot.jpg",
  },
  {
    file: "public/Daniel-Mwendwa-Kavangi-Resume.pdf",
    usedBy: "Download CV button, and any link already shared with an employer",
  },
  {
    file: "public/favicon.svg",
    usedBy: "index.html, and browsers that cached it",
  },
];

for (const { file, usedBy } of EXTERNALLY_REFERENCED) {
  test(`${file} still exists (${usedBy})`, async () => {
    const info = await stat(new URL(`../${file}`, import.meta.url)).catch(() => null);
    assert.ok(info, `${file} is missing. It is not referenced from this repo, but ${usedBy}`);
    assert.ok(info.size > 0, `${file} is empty`);
  });
}
