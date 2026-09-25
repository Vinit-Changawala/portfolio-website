import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryCardGrid } from "@/components/CategoryCardGrid";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PageShell } from "@/components/PageShell";
import { getCategoryImages, getCoverImage } from "@/lib/cloudinary";
import { CATEGORIES, getCategoryContent, getOtherCategories } from "@/lib/data";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

// Re-check this category's Cloudinary folder at most every 5 minutes, so
// a newly uploaded image appears on the site without a redeploy.
export const revalidate = 300;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategoryContent(params.slug);
  if (!category) notFound();

  // Live images from Cloudinary win when available; otherwise fall back
  // to the placeholder gradients from lib/data.ts (e.g. before Cloudinary
  // env vars are set up, or if that folder is genuinely still empty).
  const liveImages = await getCategoryImages(category.slug);
  const images = liveImages && liveImages.length > 0 ? liveImages : category.images;

  const othersBaseline = getOtherCategories(params.slug, 4);
  const others = await Promise.all(
    othersBaseline.map(async (c) => {
      const liveCover = await getCoverImage(c.slug);
      return liveCover ? { ...c, cover: liveCover } : c;
    })
  );
  const count = images.length;

  return (
    <PageShell
      header={
        <div className="shrink-0 border-b border-line px-[22px] pb-[22px] pt-7 sm:px-[64px] sm:pt-10">
          <Link
            href="/"
            className="mb-[14px] inline-flex items-center gap-[6px] text-[12.5px] opacity-55 hover:opacity-100"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Back to home
          </Link>
          <div className="flex flex-wrap items-baseline justify-between gap-5">
            <h2 className="font-serif text-[24px] font-medium sm:text-[32px]">
              {category.title}
            </h2>
            <span className="text-[13px] opacity-45">
              {count} {count === 1 ? "image" : "images"}
            </span>
          </div>
        </div>
      }
    >
      {images.length > 0 ? (
        <GalleryGrid images={images} />
      ) : (
        <p className="px-[22px] pt-10 text-[14px] opacity-60 sm:px-[64px]">
          No images in this category yet.
        </p>
      )}

      {others.length > 0 && (
        <>
          <div className="px-[22px] pb-[22px] pt-10 sm:px-[64px]">
            <h2 className="font-serif text-[20px] font-medium">You may also like</h2>
          </div>
          <CategoryCardGrid categories={others} />
        </>
      )}

      <footer className="px-[22px] pb-[60px] pt-1 text-[12px] opacity-40 sm:px-[64px]">
        © 2026 Alex Neilson Studio
      </footer>
    </PageShell>
  );
}
