import { CalendarDays, Clock3, PackageCheck } from "lucide-react";
import { useBooking } from "@/components/booking/BookingProvider";
import { Button } from "@/components/ui/Button";
import { services } from "@/data/mockData";
import { formatCurrency } from "@/lib/utils";

export default function Services() {
  const { openBooking } = useBooking();

  return (
    <div className="pb-24 pt-8 md:pt-14">
      <section className="container max-w-4xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">Services & prices</h1>
        <p className="mt-3 text-lg leading-8 text-ink-500">Starting prices. The final amount is confirmed with you by email.</p>

        <ul className="mt-8 grid gap-3">
          {services.map((service) => (
            <li key={service.id} className="flex items-center gap-4 rounded-3xl border border-line bg-white p-3 shadow-soft sm:p-4">
              <img src={service.image} alt="" loading="lazy" className="h-20 w-20 shrink-0 rounded-2xl object-cover sm:h-24 sm:w-28" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h2 className="text-lg font-semibold">{service.title}</h2>
                  <p className="text-sm text-ink-500">
                    from <span className="text-lg font-bold text-ink">{formatCurrency(service.price)}</span>
                  </p>
                </div>
                <p className="mt-0.5 text-sm text-ink-500">{service.short}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-ink-700">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5 text-sage-600" />
                    {service.duration}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <PackageCheck className="h-3.5 w-3.5 text-sage-600" />
                    Ready in {service.delivery}
                  </span>
                </div>
              </div>
              <Button size="sm" className="hidden shrink-0 sm:inline-flex" onClick={() => openBooking(service.id)}>
                <CalendarDays className="h-4 w-4" />
                Book
              </Button>
              <Button size="icon" className="shrink-0 sm:hidden" onClick={() => openBooking(service.id)} aria-label={`Book ${service.title}`}>
                <CalendarDays className="h-5 w-5" />
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
