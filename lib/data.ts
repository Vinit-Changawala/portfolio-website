export type Category = {
  slug: string;
  title: string;
};

export type GalleryImage = {
  /** Real image (Cloudinary URL or a local /public path). Falls back to
   * the c1/c2 gradient when omitted. */
  src?: string;
  c1: string;
  c2: string;
  /** The image's real aspect ratio (width / height) — e.g. 1.5 for a
   * landscape 3:2 photo, 0.67 for a portrait 2:3 photo, 1 for a square.
   * The card is sized directly from this (via CSS `aspect-ratio`), so
   * it takes on the photo's actual shape instead of the photo being
   * squeezed into a fixed box. */
  ratio: number;
};

export type CategoryContent = Category & {
  /** The home-page card image for this category — completely independent
   * of the images below. Swap this without touching the gallery, and
   * vice versa. */
  cover: GalleryImage;
  /** Every image of this category's work. Any number, independently per
   * category — add or remove freely, nothing else needs to change. */
  images: GalleryImage[];
};

export const CATEGORIES: Category[] = [
  { slug: "branding", title: "Branding" },
  { slug: "social-media", title: "Social Media Posts" },
  { slug: "logos", title: "Logos" },
  { slug: "typography", title: "Expressive Typography" },
  { slug: "fashion-studio", title: "Fashion Studio" },
  { slug: "magazine-cover", title: "Magazine Cover Design" },
  { slug: "wedding", title: "Wedding Accessories" },
];

const PALETTES: [string, string][] = [
  ["#5b6b4f", "#3a4a34"],
  ["#c1502e", "#8f3a20"],
  ["#1c2a22", "#0f1712"],
  ["#b98b2a", "#8c6a1c"],
  ["#7c6a8f", "#544a63"],
  ["#2e5a6c", "#1e3d49"],
  ["#a3532f", "#733a1f"],
  ["#4a5c4e", "#2f3d32"],
];
const RATIOS = [1.3, 0.9, 1.1, 0.75, 1.0, 0.85];

function paletteFor(seed: string, i: number): [string, string] {
  const idx = (seed.length * 7 + i * 13) % PALETTES.length;
  return PALETTES[idx];
}
function ratioFor(seed: string, i: number): number {
  const idx = (seed.length + i * 3) % RATIOS.length;
  return RATIOS[idx];
}
function makeGalleryImage(seed: string, i: number): GalleryImage {
  const [c1, c2] = paletteFor(seed, i);
  return { c1, c2, ratio: ratioFor(seed, i) };
}

// Placeholder gallery size per category — in real use, each category can
// have any number of images, totally independently of the others. Just
// add/remove entries from that category's `images` array below.
const PLACEHOLDER_COUNTS: Record<string, number> = {
  branding: 5,
  "fashion-studio": 3,
  "social-media": 6,
  "magazine-cover": 4,
  logos: 2,
  wedding: 4,
  typography: 3,
};

// Real cover images go HERE — one entry per category slug. Add a category
// below and its card switches from a gradient to your real photo; leave a
// category out and it just keeps its gradient placeholder until you do.
//
// Example:
//   branding: {
//     src: "https://res.cloudinary.com/your-cloud-name/image/upload/covers/branding-cover.jpg",
//     c1: "#5b6b4f",
//     c2: "#3a4a34",
//     ratio: 1.3,
//   },
const COVERS: Partial<Record<string, GalleryImage>> = {
  // branding: { src: "...", c1: "#5b6b4f", c2: "#3a4a34", ratio: 1.3 },
};

// Placeholder data — replace with your real work. See the README
// ("Add your real content") for exactly how to point a category's cover
// or gallery images at real Cloudinary/local images instead of gradients.
export const CATEGORY_CONTENT: CategoryContent[] = CATEGORIES.map((c) => {
  const count = PLACEHOLDER_COUNTS[c.slug] ?? 4;
  return {
    ...c,
    cover: COVERS[c.slug] ?? makeGalleryImage(`${c.slug}-cover`, 0),
    images: Array.from({ length: count }, (_, i) =>
      makeGalleryImage(c.slug, i),
    ),
  };
});

export function getCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryContent(slug: string): CategoryContent | undefined {
  return CATEGORY_CONTENT.find((c) => c.slug === slug);
}

/** Home page: one card per category, in CATEGORIES order. */
export function getHomeCards(): CategoryContent[] {
  return CATEGORY_CONTENT;
}

/** "You may also like" on a category page: other categories to explore. */
export function getOtherCategories(
  excludeSlug: string,
  count = 4,
): CategoryContent[] {
  return CATEGORY_CONTENT.filter((c) => c.slug !== excludeSlug).slice(0, count);
}
