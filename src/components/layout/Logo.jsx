import { cn } from "@/lib/utils";

/** Four-color lens mark + wordmark. */
export function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-8 w-8", className)}>
      <path d="M16 16V2a14 14 0 0 1 14 14z" fill="#E4572E" />
      <path d="M16 16h14a14 14 0 0 1-14 14z" fill="#FFC857" />
      <path d="M16 16v14A14 14 0 0 1 2 16z" fill="#0F766E" />
      <path d="M16 16H2A14 14 0 0 1 16 2z" fill="#3B9FD8" />
      <circle cx="16" cy="16" r="5.5" fill="#FBF6EE" />
      <circle cx="16" cy="16" r="2.5" fill="#1C2B2E" />
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
