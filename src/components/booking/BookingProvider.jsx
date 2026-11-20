import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { BookingForm } from "@/components/booking/BookingForm";
import { Button } from "@/components/ui/Button";

const BookingContext = createContext(null);

export function useBooking() {
  return useContext(BookingContext);
}

/** Pop-out booking panel: a bottom sheet on phones, a side panel on larger screens. */
function BookingDrawer({ open, serviceId, formKey, onClose, onDone }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 bottom-0 flex max-h-[94dvh] flex-col overflow-hidden rounded-t-[1.75rem] bg-paper shadow-lift outline-none sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[30rem] sm:rounded-none sm:rounded-l-[1.75rem]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-line bg-sage-200 px-5 py-4">
              <h2 id="drawer-title" className="font-display text-2xl font-semibold text-sage-900">
                Book a session
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close booking" className="hover:bg-sage-300">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="pb-safe overflow-y-auto overscroll-contain px-5 pt-5">
              <BookingForm key={formKey} defaultServiceId={serviceId} onDone={onDone} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Floating "Book" button. Hidden on the booking page and while the home booking section is on screen. */
function FloatingBook({ hidden, onOpen }) {
  const { pathname } = useLocation();
  const [sectionVisible, setSectionVisible] = useState(false);

  // Hide while any on-page booking call-to-action ([data-hide-floating]) is on screen
  useEffect(() => {
    setSectionVisible(false);
    const targets = document.querySelectorAll("[data-hide-floating]");
    if (!targets.length) return undefined;
    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
        setSectionVisible(visible.size > 0);
      },
      { threshold: 0.15 }
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  const show = !hidden && !sectionVisible && pathname !== "/booking" && pathname !== "/admin";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[60] sm:bottom-6 sm:right-6"
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button size="lg" onClick={() => onOpen()} className="h-14 px-6 shadow-lift ring-1 ring-sage-400/70">
            <CalendarDays className="h-5 w-5" />
            Book a session
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function BookingProvider({ children }) {
  const [state, setState] = useState({ open: false, serviceId: null, formKey: 0, finished: false });

  /** Open the booking panel, optionally preselecting a service id. */
  const openBooking = useCallback((serviceId = null) => {
    setState((current) => {
      const resetForm = current.finished || (serviceId && serviceId !== current.serviceId);
      return {
        open: true,
        serviceId: serviceId || current.serviceId,
        formKey: resetForm ? current.formKey + 1 : current.formKey,
        finished: resetForm ? false : current.finished
      };
    });
  }, []);
  const closeBooking = useCallback(() => setState((current) => ({ ...current, open: false })), []);
  const markDone = useCallback(() => setState((current) => ({ ...current, finished: true })), []);

  // Close the panel on navigation
  const { pathname } = useLocation();
  useEffect(() => closeBooking(), [pathname, closeBooking]);

  return (
    <BookingContext.Provider value={{ openBooking, closeBooking }}>
      {children}
      <FloatingBook hidden={state.open} onOpen={openBooking} />
      <BookingDrawer open={state.open} serviceId={state.serviceId} formKey={state.formKey} onClose={closeBooking} onDone={markDone} />
    </BookingContext.Provider>
  );
}
