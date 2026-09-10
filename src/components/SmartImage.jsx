import { useCallback, useState } from "react";
import { fallbackImage, pictureSources } from "../data/media";

/**
 * Renders one of the generated responsive variants rather than the 1600px
 * original. AVIF first, then WebP, with JPEG for anything older.
 *
 * @param {string} name  base filename in public/media, without width or extension
 * @param {string} sizes CSS `sizes` describing the rendered width per breakpoint
 * @param {boolean} priority set on an image that is visible without scrolling,
 *   so it loads eagerly at high priority instead of being deferred
 */
export default function SmartImage({
  name,
  alt,
  sizes,
  className = "",
  width,
  height,
  priority = false,
}) {
  const [loaded, setLoaded] = useState(false);

  // A callback ref, not an effect: an image restored from cache can finish
  // decoding before React attaches onLoad, and this still catches it without
  // triggering a second render pass on every mount.
  const measure = useCallback((node) => {
    if (node?.complete && node.naturalWidth > 0) setLoaded(true);
  }, []);

  const fallback = fallbackImage(name);

  return (
    <picture>
      {pictureSources(name).map((source) => (
        <source key={source.type} type={source.type} srcSet={source.srcSet} sizes={sizes} />
      ))}
      <img
        ref={measure}
        src={fallback.src}
        srcSet={fallback.srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        className={`img-fade ${loaded ? "is-loaded" : ""} ${className}`}
      />
    </picture>
  );
}
