import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useBooking } from "@/components/booking/BookingProvider";
import { Button } from "@/components/ui/Button";
import { categoryService } from "@/data/mockData";

function Lightbox({ items, index, onClose, onMove, onBook }) {
  const item = items[index];

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

  const stop = (event) => event.stopPropagation();

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[80] flex flex-col bg-sage-900/[0.97]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <div className="flex items-center justify-between p-3 text-white sm:p-5" onClick={stop}>
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="max-h-full max-w-full rounded-2xl object-contain"
          onClick={stop}
        />
        {items.length > 1 &&
          [
            [-1, ChevronLeft, "Previous photo", "left-2 sm:left-4"],
            [1, ChevronRight, "Next photo", "right-2 sm:right-4"]
          ].map(([dir, Icon, label, pos]) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              onClick={(event) => {
                stop(event);
                onMove(dir);
              }}
              className={`absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-soft transition hover:bg-white ${pos}`}
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
      </div>
      <div className="pb-safe flex flex-col gap-3 p-4 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6" onClick={stop}>
        <div>
          <p className="font-display text-2xl font-semibold">{item.title}</p>
          <p className="flex items-center gap-1.5 text-sm text-white/75">
            <MapPin className="h-4 w-4" />
            {item.location} · {item.category}
          </p>
        </div>
        <Button onClick={() => onBook(categoryService[item.category])}>
          <CalendarDays className="h-4 w-4" />
          Book a session like this
        </Button>
      </div>
    </motion.div>
  );
}

/** Masonry photo grid; tap a photo to view it large. */
export function Gallery({ items }) {
  const { openBooking } = useBooking();
  const [activeIndex, setActiveIndex] = useState(null);
  const close = useCallback(() => setActiveIndex(null), []);
  const move = useCallback((dir) => setActiveIndex((value) => (value + dir + items.length) % items.length), [items.length]);

  useEffect(() => setActiveIndex(null), [items]);

  return (
    <>
      <div className="masonry">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative block w-full overflow-hidden rounded-2xl bg-sage-100 text-left md:rounded-3xl"
            aria-label={`Open ${item.title}, ${item.location}`}
          >
            <img
              src={item.image}
              alt=""
              loading="lazy"
              decoding="async"
              style={{ aspectRatio: item.ratio }}
              className="w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sage-900/55 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
            <div className="absolute bottom-3 left-3 right-3 translate-y-1 text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
              <p className="font-display text-lg font-semibold leading-tight">{item.title}</p>
              <p className="text-xs text-white/85">{item.location}</p>
            </div>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {activeIndex !== null && items[activeIndex] && (
          <Lightbox
            items={items}
            index={activeIndex}
            onClose={close}
            onMove={move}
            onBook={(serviceId) => {
              close();
              openBooking(serviceId);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
