/**
 * Pre-build step: derive responsive variants of every source photograph.
 *
 * The portrait ships at 1600x1600 but never renders wider than about 400 CSS
 * pixels, so the original is roughly a nine-times overdraw on a 1x screen. This
 * writes AVIF, WebP and JPEG at several widths into public/media, which Vite
 * copies to dist untouched.
 *
 * Output is generated, not committed. Delete public/media and rebuild to
 * regenerate. Filenames are stable, and vercel.json caches them for a week
 * with revalidation.
 */
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { FALLBACK_FORMAT, IMAGE_WIDTHS, MODERN_FORMATS } from "../src/data/media.js";

const SOURCE_DIR = path.resolve("src/assets/images");
const OUTPUT_DIR = path.resolve("public/media");

// Widths and formats come from the shared contract so the files produced here
// are exactly the ones the markup offers. Only the encoder settings live here.
const WIDTHS = IMAGE_WIDTHS;

const ENCODER_OPTIONS = {
  avif: { quality: 52, effort: 6 },
  webp: { quality: 72, effort: 5 },
  jpg: { quality: 78, mozjpeg: true },
};

const FORMATS = [...MODERN_FORMATS, FALLBACK_FORMAT].map((extension) => ({
  extension,
  options: ENCODER_OPTIONS[extension],
}));

async function fileSize(file) {
  return (await stat(file)).size;
}

function format(bytes) {
  return `${(bytes / 1024).toFixed(1)} kB`;
}

await mkdir(OUTPUT_DIR, { recursive: true });

const sources = (await readdir(SOURCE_DIR)).filter((name) => /\.(jpe?g|png)$/i.test(name));
if (sources.length === 0) {
  console.warn("generate-images: no source images found");
}

const manifest = {};

for (const source of sources) {
  const name = source.replace(/\.[^.]+$/, "");
  const input = path.join(SOURCE_DIR, source);
  const metadata = await sharp(input).metadata();
  const usable = WIDTHS.filter((width) => width <= metadata.width);

  manifest[name] = {
    width: metadata.width,
    height: metadata.height,
    widths: usable,
    formats: FORMATS.map((entry) => entry.extension),
  };

  const originalSize = await fileSize(input);
  let largestJpeg = 0;

  for (const width of usable) {
    for (const { extension, options } of FORMATS) {
      const output = path.join(OUTPUT_DIR, `${name}-${width}.${extension}`);
      await sharp(input)
        .resize({ width, withoutEnlargement: true })
        .toFormat(extension === "jpg" ? "jpeg" : extension, options)
        .toFile(output);
      if (extension === "jpg") largestJpeg = Math.max(largestJpeg, await fileSize(output));
    }
  }

  const widest = usable[usable.length - 1];
  const avif = await fileSize(path.join(OUTPUT_DIR, `${name}-${widest}.avif`));
  console.log(
    `generate-images: ${source} ${format(originalSize)} -> ${widest}px avif ${format(avif)}, jpeg ${format(largestJpeg)}`
  );
}

await writeFile(
  path.join(OUTPUT_DIR, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`
);

console.log(`generate-images: ${sources.length} source image(s), ${WIDTHS.length} widths, ${FORMATS.length} formats`);
