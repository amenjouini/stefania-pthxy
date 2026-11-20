import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Gallery } from "@/components/Gallery";
import { portfolioCategories, portfolioItems } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Portfolio() {
  const [params, setParams] = useSearchParams();
  const requested = params.get("category");
  const category = portfolioCategories.includes(requested) ? requested : "All";
  const items = useMemo(() => (category === "All" ? portfolioItems : portfolioItems.filter((item) => item.category === category)), [category]);

  const setCategory = (value) => setParams(value === "All" ? {} : { category: value }, { replace: true, preventScrollReset: true });

  return (
    <div className="pb-24 pt-8 md:pt-14">
      <section className="container">
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">Work</h1>
        <p className="mt-2 text-lg text-ink-500">Tap any photo to see it larger.</p>
      </section>

      <div className="sticky top-16 z-30 mt-5 bg-paper/90 backdrop-blur-md md:top-[4.5rem]">
        <div className="container no-scrollbar flex gap-2 overflow-x-auto py-3" role="tablist" aria-label="Filter by category">
          {portfolioCategories.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={category === item}
              onClick={() => setCategory(item)}
              className={cn(
                "h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition",
                category === item ? "bg-sage-200 text-sage-900" : "text-ink-500 hover:bg-sage-50 hover:text-ink"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <section className="container pt-4">
        <Gallery items={items} />
      </section>
    </div>
  );
}
