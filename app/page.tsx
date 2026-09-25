import { CategoryCardGrid } from "@/components/CategoryCardGrid";
import { PageShell } from "@/components/PageShell";
import { getCoverImage } from "@/lib/cloudinary";
import { getHomeCards } from "@/lib/data";

// Re-check each category's Cloudinary cover folder at most every 5
// minutes (see lib/cloudinary.ts), so a newly uploaded cover appears on
// the site without a redeploy.
export const revalidate = 300;

export default async function HomePage() {
  const baseline = getHomeCards();
  const cards = await Promise.all(
    baseline.map(async (c) => {
      const liveCover = await getCoverImage(c.slug);
      return liveCover ? { ...c, cover: liveCover } : c;
    }),
  );

  return (
    <PageShell
      header={
        <div className="shrink-0 border-b border-line px-[22px] pb-[26px] pt-7 sm:px-[64px] sm:pt-10">
          <div className="mb-[10px] text-[12.5px] tracking-[0.06em] text-accent">
            PORTFOLIO
          </div>
          <h1 className="mb-[10px] max-w-[16ch] font-serif text-[26px] font-medium leading-[1.1] sm:text-[38px]">
            Scroll down to see the work.
          </h1>
          <p className="max-w-[46ch] text-[14.5px] opacity-70">
            Branding, fashion, editorial and social work — pick a category to
            see the full set.
          </p>
        </div>
      }
    >
      <CategoryCardGrid categories={cards} />
      <footer className="px-[22px] pb-[60px] pt-7 text-[12px] opacity-40 sm:px-[64px]">
        © 2026 Rushvi Changawala. All rights reserved.
      </footer>
    </PageShell>
  );
}
