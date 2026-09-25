import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="max-w-[620px] px-[22px] py-[64px] sm:px-[64px] sm:py-[90px]">
      <h2 className="mb-3 font-serif text-[28px] font-medium sm:text-[40px]">
        Let&apos;s work together
      </h2>
      <p className="mb-10 max-w-[42ch] opacity-65">
        Tell me a little about your project and I&apos;ll get back to you.
      </p>
      <ContactForm />
    </div>
  );
}
