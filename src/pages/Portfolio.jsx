import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { categoryService, getService, portfolioCategories, portfolioItems } from "@/data/mockData";
import { cn, formatCurrency } from "@/lib/utils";

function Lightbox({ items, index, onClose, onMove }) {
  const item = items[index];
  const service = getService(categoryService[item.category]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onMove(1);
      if (event.key === "ArrowLeft") onMove(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onMove]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[80] flex flex-col bg-ink/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="flex items-center justify-between p-3 text-white sm:p-5" onClick={(event) => event.stopPropagation()}>
        <p className="text-sm text-white/70">
          {index + 1} / {items.length}
        </p>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={onClose} aria-label="Close" autoFocus>
          <X className="h-6 w-6" />
        </Button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 sm:px-16">
        <motion.img
          key={item.id}
          src={item.image.replace("w=1000", "w=1800")}
          alt={`${item.title}, ${item.location}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="max-h-full max-w-full rounded-2xl object-contain"
          onClick={(event) => event.stopPropagation()}
        />
        {[
          [-1, ChevronLeft, "Previous photo", "left-2 sm:left-4"],
          [1, ChevronRight, "Next photo", "right-2 sm:right-4"]
        ].map(([dir, Icon, label, pos]) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            onClick={(event) => {
              event.stopPropagation();
              onMove(dir);
            }}
            className={`absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-soft transition hover:bg-white ${pos}`}
          >
            <Icon className="h-5 w-5" />
          </button>
        ))}
      </div>
      <div
        className="pb-safe flex flex-col gap-3 p-4 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div>
          <p className="font-display text-2xl font-semibold">{item.title}</p>
          <p className="flex items-center gap-1.5 text-sm text-white/70">
            <MapPin className="h-4 w-4" />
            {item.location} · {item.category}
          </p>
        </div>
        {service && (
          <Button asChild>
            <Link to={`/booking?service=${service.id}`}>
              Book {service.title}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const [params, setParams] = useSearchParams();
  const requested = params.get("category");
  const category = portfolioCategories.includes(requested) ? requested : "All";
  const [activeIndex, setActiveIndex] = useState(null);

  const items = useMemo(() => (category === "All" ? portfolioItems : portfolioItems.filter((item) => item.category === category)), [category]);
  const service = category !== "All" ? getService(categoryService[category]) : null;

  const setCategory = (value) => {
    setParams(value === "All" ? {} : { category: value }, { replace: true, preventScrollReset: true });
  };
  const close = useCallback(() => setActiveIndex(null), []);
  const move = useCallback((dir) => setActiveIndex((value) => (value + dir + items.length) % items.length), [items.length]);

  return (
    <div className="pb-20 pt-8 md:pt-14">
      <section className="container">
        <p className="eyebrow">Portfolio</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">Recent stories we've photographed.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-500">Weddings, portraits, fashion, brands, events and travel. Tap any photo to see it larger.</p>
      </section>

      <div className="sticky top-16 z-30 mt-6 border-b border-line bg-cream/90 backdrop-blur-md md:top-[4.5rem]">
        <div className="container no-scrollbar flex gap-2 overflow-x-auto py-3" role="tablist" aria-label="Filter by category">
          {portfolioCategories.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={category === item}
              onClick={() => setCategory(item)}
              className={cn(
                "h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition",
                category === item ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink/30"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <section className="container pt-6">
        <motion.div layout className="masonry">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((item, index) => (
              <motion.button
                layout
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group relative block w-full overflow-hidden rounded-2xl bg-sand text-left md:rounded-3xl"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                aria-label={`Open ${item.title}, ${item.location}`}
              >
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ aspectRatio: item.ratio }}
                  className="w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white md:bottom-4 md:left-4">
                  <p className="font-display text-lg font-semibold leading-tight md:text-2xl">{item.title}</p>
                  <p className="text-xs text-white/85 md:text-sm">{item.location}</p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center shadow-soft md:p-10">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">Like what you see?</h2>
          <p className="max-w-md text-ink-500">
            {service ? `${service.title} starts from ${formatCurrency(service.price)}.` : "Pick a session and send a request in a couple of minutes."}
          </p>
          <Button asChild size="lg" className="mt-2">
            <Link to={service ? `/booking?service=${service.id}` : "/booking"}>
              Book a session
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <AnimatePresence>
        {activeIndex !== null && items[activeIndex] && <Lightbox items={items} index={activeIndex} onClose={close} onMove={move} />}
      </AnimatePresence>
    </div>
  );
}
