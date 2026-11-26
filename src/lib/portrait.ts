import gopalCutout from "@/assets/gopal-cutout.webp";

/**
 * Resolves the hero portrait image URL, mapping empty or legacy placeholder paths
 * back to the bundled studio WebP cutout while keeping custom uploaded URLs intact.
 */
export function resolvePortraitPhoto(src?: string): string {
  if (!src || src.trim().length === 0) return gopalCutout;
  const clean = src.trim().toLowerCase();
  if (clean.includes("gopal-profile") || clean.includes("me-b") || clean.includes("gopal-cutout")) {
    return gopalCutout;
  }
  return src.trim();
}
