import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useBooking } from "@/components/booking/BookingProvider";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { navItems } from "@/data/mockData";
import { cn } from "@/lib/utils";

function Header() {
  const { openBooking } = useBooking();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || open ? "border-line bg-paper/90 backdrop-blur-xl" : "border-transparent bg-paper"
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Link to="/" aria-label="PHTXY home" className="rounded-full">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn("rounded-full px-4 py-2 text-[0.95rem] font-medium text-ink-500 transition hover:text-ink", isActive && "bg-sage-100 text-ink")
              }
            >
              {item.label}
            </NavLink>
          ))}
          {pathname !== "/booking" && (
            <Button size="sm" className="ml-3 h-11 px-5" onClick={() => openBooking()}>
              <CalendarDays className="h-4 w-4" />
              Book
            </Button>
          )}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            className="absolute inset-x-0 top-full border-b border-line bg-paper shadow-soft md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <div className="container flex flex-col py-2">
              {[{ label: "Home", href: "/" }, ...navItems].map((item) => (
                <NavLink key={item.href} to={item.href} end className="border-b border-line py-4 text-lg font-semibold last:border-0">
                  {item.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-sage-50">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-ink-500">Photography studio · Tunis · Paris · Milan</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink-500">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href} className="hover:text-ink">
              {item.label}
            </Link>
          ))}
          <Link to="/booking" className="hover:text-ink">
            Book
          </Link>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="container flex flex-col gap-1 py-5 text-xs text-ink-500 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} PHTXY</p>
          <Link to="/admin" className="hover:text-ink">
            Studio dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <div id="main" className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
