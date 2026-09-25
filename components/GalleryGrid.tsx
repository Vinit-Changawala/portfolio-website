"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { GalleryImage } from "@/lib/data";

/** Plain, non-clickable image grid — used on a category's own page to show
 * all of its work. No navigation, no hover label: you're already here. */
export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="columns-1 gap-[22px] px-[22px] pb-10 pt-7 sm:px-[64px] md:columns-2">
      {images.map((img, i) => {
        const delay = reduceMotion ? 0 : (i % 8) * 0.05;
        return (
          <motion.div
            key={i}
            className="group relative mb-[22px] w-full overflow-hidden rounded-2xl border border-line bg-paper2"
            style={{ aspectRatio: img.ratio }}
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {/* Color backdrop is always present — if the photo's real shape
                doesn't exactly fill the tile, this shows through the edges
                instead of the photo being cropped. */}
            <div
              className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.05]"
              style={{
                backgroundImage: `linear-gradient(150deg, ${img.c1}, ${img.c2})`,
              }}
            />
            {img.src && (
              <Image
                src={img.src}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
