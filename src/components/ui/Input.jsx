import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-2xl border bg-white px-4 text-base text-ink outline-none transition placeholder:text-ink-300 focus:border-sage-600 focus:ring-4 focus:ring-sage-100";

export const Input = forwardRef(function Input({ className, invalid, ...props }, ref) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(fieldBase, "h-12", invalid ? "border-danger-600" : "border-line", className)}
      {...props}
    />
  );
});

export const Textarea = forwardRef(function Textarea({ className, invalid, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(fieldBase, "min-h-28 resize-y py-3", invalid ? "border-danger-600" : "border-line", className)}
      {...props}
    />
  );
});

export function Label({ className, optional, children, ...props }) {
  return (
    <label className={cn("mb-1.5 block text-sm font-semibold text-ink", className)} {...props}>
      {children}
      {optional ? <span className="ml-1 font-normal text-ink-500">(optional)</span> : null}
    </label>
  );
}

export function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-danger-600">
      {children}
    </p>
  );
}
