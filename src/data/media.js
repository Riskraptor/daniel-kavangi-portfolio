/**
 * Responsive image contract, shared by the browser bundle and the Node script
 * that produces the files. Both read these constants, so a width added here is
 * generated and offered in the same change.
 *
 * Keep this file free of imports, like routes.js.
 */

const MEDIA_BASE = "/media";

/** The portrait never renders wider than ~400 CSS px, so 1200 covers 3x. */
export const IMAGE_WIDTHS = [320, 480, 640, 960, 1200];

/** Offered in order; the browser takes the first it can decode. */
export const MODERN_FORMATS = ["avif", "webp"];

/** Universal fallback for the <img> itself. */
export const FALLBACK_FORMAT = "jpg";

/** Width used for the plain src attribute when srcset is unsupported. */
const FALLBACK_WIDTH = 640;

function srcSet(name, extension) {
  return IMAGE_WIDTHS.map((width) => `${MEDIA_BASE}/${name}-${width}.${extension} ${width}w`).join(", ");
}

export function pictureSources(name) {
  return MODERN_FORMATS.map((extension) => ({
    type: `image/${extension}`,
    srcSet: srcSet(name, extension),
  }));
}

export function fallbackImage(name) {
  return {
    src: `${MEDIA_BASE}/${name}-${FALLBACK_WIDTH}.${FALLBACK_FORMAT}`,
    srcSet: srcSet(name, FALLBACK_FORMAT),
  };
}

/** Preferred format for a preload hint: the smallest the browser might use. */
export function preloadHint(name, sizes) {
  return {
    type: `image/${MODERN_FORMATS[0]}`,
    href: `${MEDIA_BASE}/${name}-${FALLBACK_WIDTH}.${MODERN_FORMATS[0]}`,
    imagesrcset: srcSet(name, MODERN_FORMATS[0]),
    imagesizes: sizes,
  };
}
