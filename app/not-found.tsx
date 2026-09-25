import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-[22px] py-[90px] sm:px-[64px]">
      <h2 className="mb-3 font-serif text-[28px] font-medium">Page not found</h2>
      <p className="mb-6 opacity-65">That project or category doesn&apos;t exist.</p>
      <Link href="/" className="text-accent underline">
        Back to home
      </Link>
    </div>
  );
}
