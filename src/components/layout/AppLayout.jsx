import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { navItems, services } from "@/data/mockData";
import { cn } from "@/lib/utils";

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const onBooking = pathname === "/booking";

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
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || open ? "border-line bg-cream/90 backdrop-blur-xl" : "border-transparent bg-cream"
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
                cn(
                  "rounded-full px-4 py-2 text-[0.95rem] font-medium text-ink-500 transition hover:bg-ink/5 hover:text-ink",
                  isActive && "bg-white text-ink shadow-soft"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {!onBooking && (
            <Button asChild size="sm" className="md:h-11 md:px-5">
              <Link to="/booking">Book a session</Link>
            </Button>
          )}
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
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-cream md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <nav aria-label="Mobile" className="container flex flex-col py-4">
              <NavLink to="/" end className="border-b border-line py-4 font-display text-2xl font-medium">
                Home
              </NavLink>
              {navItems.map((item) => (
                <NavLink key={item.href} to={item.href} className="border-b border-line py-4 font-display text-2xl font-medium">
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="container pb-8">
              <p className="mb-3 mt-4 text-sm font-semibold text-ink-500">Popular</p>
              <div className="flex flex-wrap gap-2">
                {services.slice(0, 4).map((service) => (
                  <Link
                    key={service.id}
                    to={`/booking?service=${service.id}`}
                    className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium"
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
              <Button asChild size="lg" className="mt-8 w-full">
                <Link to="/booking">
                  Book a session
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-sand">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm leading-7 text-ink-500">
            Photography for weddings, portraits, brands and events — based in Tunis, Paris and Milan, and happy to travel.
          </p>
          <Button asChild className="mt-6">
            <Link to="/booking">
              Book a session
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold">Explore</p>
          <ul className="grid gap-3 text-ink-500">
            <li><Link className="hover:text-ink" to="/services">Services & prices</Link></li>
            <li><Link className="hover:text-ink" to="/portfolio">Portfolio</Link></li>
            <li><Link className="hover:text-ink" to="/achievements">About & awards</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold">Popular sessions</p>
          <ul className="grid gap-3 text-ink-500">
            {services.slice(0, 4).map((service) => (
              <li key={service.id}>
                <Link className="hover:text-ink" to={`/booking?service=${service.id}`}>{service.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container flex flex-col gap-2 py-6 text-sm text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PHTXY. Private commissions by appointment.</p>
          <Link to="/admin" className="hover:text-ink">Studio dashboard</Link>
        </div>
      </div>
    </footer>
  );
}

export function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <div id="main" className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
