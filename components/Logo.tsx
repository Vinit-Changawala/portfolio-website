"use client";

export function Logo() {
  return (
    <span className="flex flex-col font-serif text-[34px] font-medium leading-[0.92] tracking-tight">
      <span className="wm-line animate-wm-in [animation-delay:.05s]">
        Rushvi
      </span>
      <span className="wm-line ml-[22px] text-accent2 animate-wm-in [animation-delay:.18s]">
        Changawala
      </span>
    </span>
  );
}

export function LogoMini() {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-lineside text-[11px]">
      RC
    </span>
  );
}
