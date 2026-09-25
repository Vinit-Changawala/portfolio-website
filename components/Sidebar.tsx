"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/data";
import { Logo, LogoMini } from "./Logo";

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile topbar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-side px-[18px] py-[14px] text-sideink md:hidden">
        <Link
          href="/"
          className="flex items-center gap-[10px] font-serif text-[15px]"
        >
          <LogoMini />
          Your Name
        </Link>
        <button
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-lineside text-sideink"
        >
          ☰
        </button>
      </div>

      {/* Scrim (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-[35] bg-black/35 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-40 w-[78%] max-w-[320px] transform overflow-y-auto bg-side px-[34px] pb-7 pt-11 text-sideink transition-transform duration-200 ease-out md:sticky md:top-0 md:left-0 md:right-auto md:h-screen md:w-[300px] md:max-w-none md:translate-x-0 ${
          open
            ? "translate-x-0 shadow-[-20px_0_40px_rgba(0,0,0,.25)]"
            : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <Link href="/" className="mb-[46px] block">
            <Logo />
            <div className="mt-[10px] text-[11.5px] tracking-[0.09em] text-sideinkdim">
              GRAPHIC &amp; BRAND DESIGN
            </div>
          </Link>

          <p className="mb-3 font-serif text-[13px] italic text-sideinkdim">
            Work
          </p>

          <nav className="flex flex-col">
            {CATEGORIES.map((c) => {
              const href = `/work/${c.slug}`;
              const active = pathname?.startsWith(href);
              return (
                <Link
                  key={c.slug}
                  href={href}
                  className={`-ml-3 border-l-2 py-[9px] pl-3 text-[14.5px] transition-colors ${
                    active
                      ? "border-accent2 text-sideink"
                      : "border-transparent text-sideinkdim hover:text-sideink"
                  }`}
                >
                  {c.title.toUpperCase()}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          <Link
            href="/contact"
            className={`mt-8 flex items-center justify-between border-t border-lineside pt-[22px] text-[14.5px] ${
              pathname === "/contact"
                ? "text-sideink"
                : "text-sideinkdim hover:text-sideink"
            }`}
          >
            <span>Contact</span>
            <span aria-hidden="true">→</span>
          </Link>

          {/* <div className="mt-[18px] text-[11px] text-sideinkdim opacity-60">
            Built with Next.js
          </div> */}
        </div>
      </aside>
    </>
  );
}
