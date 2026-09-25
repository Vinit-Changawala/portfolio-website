import "server-only";
import type { GalleryImage } from "./data";

// Deterministic fallback color pair (only ever used if a real image
// somehow fails to load) so the tile is never a blank rectangle.
const PALETTES: [string, string][] = [
  ["#5b6b4f", "#3a4a34"],
  ["#c1502e", "#8f3a20"],
  ["#1c2a22", "#0f1712"],
  ["#b98b2a", "#8c6a1c"],
  ["#7c6a8f", "#544a63"],
  ["#2e5a6c", "#1e3d49"],
];
function paletteFor(seed: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTES[hash % PALETTES.length];
}

type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
  created_at?: string;
  resource_type?: string;
};

// The card's shape (via CSS `aspect-ratio`) is set directly from the
// image's real width/height — so the card takes on the photo's actual
// proportions instead of the photo being squeezed into a guessed box.
// Lightly clamped only to stop a truly extreme image (a 10:1 banner, a
// razor-thin strip) from breaking the grid layout — this never affects
// normal photos, portraits, or graphics.
function ratioFromDimensions(width?: number, height?: number): number {
  const aspect = width && height ? width / height : 1;
  return Math.min(3, Math.max(0.4, aspect));
}

async function fetchByAssetFolder(folder: string): Promise<CloudinaryResource[] | null> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return null;

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const url =
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/by_asset_folder` +
    `?asset_folder=${encodeURIComponent(folder)}` +
    `&max_results=500`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
      // ISR: re-check this folder at most every 5 minutes, so a new
      // upload shows up on the site without needing a redeploy.
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error("Cloudinary list failed:", folder, res.status, await res.text());
      return null;
    }

    const data: { resources?: CloudinaryResource[] } = await res.json();
    // by_asset_folder can return non-image files too — keep images only.
    return (data.resources || []).filter((r) => !r.resource_type || r.resource_type === "image");
  } catch (err) {
    console.error("Cloudinary fetch error:", folder, err);
    return null;
  }
}

/**
 * Lists every image inside a category's Cloudinary folder (e.g.
 * "branding") and maps it into the same GalleryImage shape the rest of
 * the site expects — each one's `ratio` is computed from its real
 * width/height, not guessed, so the card always shows the full image
 * without a bad crop.
 *
 * Returns `null` (not an empty array) when Cloudinary isn't configured or
 * the request fails, so callers can tell "not set up yet" apart from
 * "set up, but this folder is genuinely empty" and fall back accordingly.
 */
export async function getCategoryImages(folder: string): Promise<GalleryImage[] | null> {
  const resources = await fetchByAssetFolder(folder);
  if (!resources) return null;

  return resources.map((r) => {
    const [c1, c2] = paletteFor(r.public_id);
    return { src: r.secure_url, c1, c2, ratio: ratioFromDimensions(r.width, r.height) };
  });
}

/**
 * A category's home/"You may also like" card image, pulled from a
 * dedicated `covers/<slug>` Cloudinary folder — put exactly one image in
 * there per category. Its ratio is computed automatically from the
 * image's real dimensions, same as the gallery.
 *
 * Returns `null` when that folder is empty/missing or Cloudinary isn't
 * configured, so the caller can fall back to a manual override or the
 * gradient placeholder.
 */
export async function getCoverImage(categorySlug: string): Promise<GalleryImage | null> {
  const resources = await fetchByAssetFolder(`covers/${categorySlug}`);
  if (!resources || resources.length === 0) return null;

  const r = resources[0];
  const [c1, c2] = paletteFor(r.public_id);
  return { src: r.secure_url, c1, c2, ratio: ratioFromDimensions(r.width, r.height) };
}
