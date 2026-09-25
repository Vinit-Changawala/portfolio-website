"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-[22px]">
        <label htmlFor="name" className="mb-2 block text-[12.5px] tracking-wide opacity-70">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full border-0 border-b border-line bg-transparent py-[10px] px-[2px] outline-none focus:border-accent"
        />
      </div>
      <div className="mb-[22px]">
        <label htmlFor="email" className="mb-2 block text-[12.5px] tracking-wide opacity-70">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border-0 border-b border-line bg-transparent py-[10px] px-[2px] outline-none focus:border-accent"
        />
      </div>
      <div className="mb-[22px]">
        <label htmlFor="message" className="mb-2 block text-[12.5px] tracking-wide opacity-70">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full resize-y border-0 border-b border-line bg-transparent py-[10px] px-[2px] outline-none focus:border-accent"
        />
      </div>
      <motion.button
        type="submit"
        disabled={status === "sending"}
        whileTap={{ scale: 0.97 }}
        className="mt-1 rounded-sm bg-accent px-[26px] py-[13px] text-[14px] text-[#fff8f0] transition-colors hover:bg-accent2 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </motion.button>

      <AnimatePresence>
        {status === "ok" && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-[13px] text-accent"
          >
            Thanks — your message was received. I&apos;ll get back to you soon.
          </motion.p>
        )}
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-[13px] opacity-70"
          >
            Something went wrong sending that — please email me directly instead.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
