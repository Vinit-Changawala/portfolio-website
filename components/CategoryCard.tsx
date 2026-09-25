"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { CategoryContent } from "@/lib/data";

export function CategoryCard({
  category,
  index = 0,
}: {
  category: CategoryContent;
  index?: number;
}) {
  const reduceMotion = useReducedMotion();
  const delay = reduceMotion ? 0 : (index % 8) * 0.05;

  return (
    <motion.div
      className="mb-[22px] break-inside-avoid"
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={reduceMotion ? undefined : { y: -5 }}
    >
      <Link
        href={`/work/${category.slug}`}
        aria-label={`View ${category.title} work`}
        className="group block overflow-hidden rounded-2xl border border-line bg-paper2 transition-[border-color,box-shadow] duration-300 hover:border-transparent hover:shadow-[0_18px_36px_rgba(0,0,0,0.14)]"
      >
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: category.cover.ratio }}
        >
          {/* Color backdrop is always present — covers any sub-pixel gap
              from the aspect-ratio clamp (see lib/cloudinary.ts) on truly
              extreme images. For anything normal, the card's shape already
              matches the photo's real shape, so this never shows. */}
          <div
            className="absolute inset-0 transition-transform duration-[600ms] ease-out group-hover:scale-[1.07]"
            style={{
              backgroundImage: `linear-gradient(150deg, ${category.cover.c1}, ${category.cover.c2})`,
            }}
          />
          {category.cover.src && (
            <Image
              src={category.cover.src}
              alt={category.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
            />
          )}
          <div className="thumb-reveal">
            <span className="thumb-cat">
              {category.title}
              <span className="rule" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
