import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";

export function ServiceCard({ service }) {
  return (
    <Link
      to={`/booking?service=${service.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <img
          src={service.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        {service.category === "Post-production" && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[0.7rem] font-semibold text-ink">Remote</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <h3 className="text-[0.95rem] font-semibold leading-snug text-ink sm:text-lg">{service.title}</h3>
        <p className="mt-1 hidden text-sm leading-6 text-ink-500 sm:block">{service.short}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <p className="text-sm text-ink-500">
            from <span className="text-base font-bold text-ink sm:text-lg">{formatCurrency(service.price)}</span>
          </p>
          <span className="hidden h-9 w-9 shrink-0 place-items-center rounded-full bg-coral-50 text-coral-600 transition group-hover:bg-coral-600 group-hover:text-white sm:grid">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
