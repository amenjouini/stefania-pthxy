import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, copy, align = "left", as: Tag = "h2", className, children }) {
  const centered = align === "center";
  return (
    <Reveal className={cn(centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}>
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <Tag className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-4xl md:text-5xl">{title}</Tag>
      {copy ? <p className="mt-4 text-base leading-7 text-ink-500 md:text-lg">{copy}</p> : null}
      {children}
    </Reveal>
  );
}
