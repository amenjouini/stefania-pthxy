import { cn } from "@/lib/utils";

export function Card({ className, children }) {
  return <div className={cn("rounded-3xl border border-line bg-white shadow-soft", className)}>{children}</div>;
}

export function CardContent({ className, children }) {
  return <div className={cn("p-5 md:p-6", className)}>{children}</div>;
}
