import type { CategoryContent } from "@/lib/data";
import { CategoryCard } from "./CategoryCard";

export function CategoryCardGrid({ categories }: { categories: CategoryContent[] }) {
  return (
    <div className="columns-1 gap-[22px] px-[22px] pb-10 pt-7 sm:px-[64px] md:columns-2">
      {categories.map((c, i) => (
        <CategoryCard key={c.slug} category={c} index={i} />
      ))}
    </div>
  );
}
