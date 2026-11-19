import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary: "bg-coral-600 text-white shadow-coral hover:bg-coral-700",
        dark: "bg-ink text-white hover:bg-ink-700",
        outline: "border border-ink/15 bg-white text-ink hover:border-ink/40",
        ghost: "text-ink hover:bg-ink/5",
        light: "bg-white text-ink shadow-soft hover:bg-sun-100"
      },
      size: {
        sm: "h-10 px-4 text-sm",
        default: "h-12 px-6 text-[0.95rem]",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
);

export const Button = forwardRef(function Button({ className, variant, size, asChild = false, type, ...props }, ref) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : type || "button"}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
});
