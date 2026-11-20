import { ArrowRight, CalendarDays, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { BookingForm } from "@/components/booking/BookingForm";
import { useBooking } from "@/components/booking/BookingProvider";
import { Gallery } from "@/components/Gallery";
import { Button } from "@/components/ui/Button";
import { portfolioItems } from "@/data/mockData";

const featuredWork = [0, 2, 7, 3, 8, 6, 1, 9, 13].map((index) => portfolioItems[index]);

export default function Home() {
  const { openBooking } = useBooking();

  return (
    <>
      {/* Intro */}
      <section className="container pb-8 pt-8 md:pb-12 md:pt-16">
        <div className="max-w-3xl">
          <p className="eyebrow">Photography · Tunis · Paris · Milan</p>
          <h1 className="mt-3 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Photos that feel like <span className="italic text-sage-700">you.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-ink-500">Weddings, portraits, events and brands. Pick a date, and we'll take care of the rest.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row" data-hide-floating>
            <Button size="lg" onClick={() => openBooking()}>
              <CalendarDays className="h-5 w-5" />
              Book a session
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/services">
                See prices
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Work */}
      <section aria-labelledby="work-title" className="container">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 id="work-title" className="font-display text-3xl font-semibold md:text-4xl">
            Recent work
          </h2>
          <Link to="/portfolio" className="inline-flex items-center gap-1.5 font-semibold text-sage-700 hover:text-sage-900">
            See all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Gallery items={featuredWork} />
      </section>

      {/* Booking — right under the work */}
      <section id="book" data-hide-floating aria-labelledby="book-title" className="container scroll-mt-20 py-14 md:py-20">
        <div className="grid gap-6 rounded-[1.75rem] bg-sage-200 p-2.5 pt-7 sm:p-8 md:grid-cols-[1fr_1.15fr] md:gap-12 md:rounded-4xl md:p-12">
          <div className="px-3 sm:px-0 md:pt-4">
            <h2 id="book-title" className="font-display text-4xl font-semibold leading-tight text-sage-900 md:text-5xl">
              Book your session
            </h2>
            <p className="mt-3 max-w-md text-lg leading-8 text-sage-900/80">Choose your event, date and place. It takes about two minutes.</p>
            <ul className="mt-6 hidden gap-3 text-sage-900 md:grid">
              {["Pick the type of event, date and time", "Tell us where the shoot will be", "Choose how you'd like to pay"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/70">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-soft sm:p-7">
            <BookingForm />
          </div>
        </div>
      </section>
    </>
  );
}
