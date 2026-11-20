import { cn } from "@/lib/utils";

/** Sage lens mark + wordmark. */
export function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-8 w-8", className)}>
      <circle cx="16" cy="16" r="15" fill="#C1D9B6" />
      <circle cx="16" cy="16" r="9" fill="none" stroke="#2F4728" strokeWidth="2.5" />
      <circle cx="16" cy="16" r="3.5" fill="#2F4728" />
    </svg>
  );
}

export function Logo({ className }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-display text-[1.6rem] font-semibold leading-none tracking-tight">phtxy</span>
    </span>
  );
}
