import { ArrowRight, Clock3, PackageCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { services } from "@/data/mockData";
import { formatCurrency } from "@/lib/utils";

const groups = [
  { title: "Photo sessions", copy: "We come to you — or you come to the studio.", items: services.filter((s) => s.category === "Shooting") },
  { title: "Editing & retouching", copy: "Send us your photos. Everything happens remotely.", items: services.filter((s) => s.category !== "Shooting") }
];

function ServiceRow({ service }) {
  const Icon = service.icon;
  return (
    <article className="group grid overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition duration-300 hover:shadow-lift sm:grid-cols-[14rem_1fr] md:grid-cols-[18rem_1fr]">
      <div className="relative aspect-[16/10] overflow-hidden bg-sand sm:aspect-auto">
        <img src={service.image} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="flex flex-col p-5 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-semibold md:text-2xl">
              <Icon className="h-5 w-5 text-coral-600" />
              {service.title}
            </h3>
            <p className="mt-0.5 text-ink-500">{service.short}</p>
          </div>
          <p className="text-right">
            <span className="block text-xs font-medium text-ink-500">from</span>
            <span className="font-display text-3xl font-semibold leading-none">{formatCurrency(service.price)}</span>
          </p>
        </div>
        <p className="mt-4 max-w-2xl leading-7 text-ink-700">{service.description}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 font-medium">
            <Clock3 className="h-4 w-4 text-sky-500" />
            {service.duration === "Remote" ? "Remote" : service.duration}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-lagoon-50 px-3 py-1.5 font-medium">
            <PackageCheck className="h-4 w-4 text-lagoon-600" />
            Delivered within {service.delivery}
          </span>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 md:mt-auto md:pt-6">
          <Button asChild>
            <Link to={`/booking?service=${service.id}`}>
              Book this session
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export default function Services() {
  return (
    <div className="pb-20 pt-8 md:pt-14">
      <section className="container">
        <p className="eyebrow">Services & prices</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          Every session, with the price up front.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-500">
          Prices shown are starting prices. Tell us about your plans and we'll confirm the final quote by email before anything is booked.
        </p>
        <nav aria-label="Service groups" className="mt-6 flex flex-wrap gap-2">
          {groups.map((group, index) => (
            <a key={group.title} href={`#group-${index}`} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold hover:border-ink/30">
              {group.title}
            </a>
          ))}
        </nav>
      </section>

      {groups.map((group, index) => (
        <section key={group.title} id={`group-${index}`} className="container scroll-mt-24 pt-12 md:pt-16">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">{group.title}</h2>
            <p className="text-ink-500">{group.copy}</p>
          </div>
          <div className="grid gap-4 md:gap-5">
            {group.items.map((service) => (
              <Reveal key={service.id}>
                <ServiceRow service={service} />
              </Reveal>
            ))}
          </div>
        </section>
      ))}

      <section className="container pt-16">
        <div className="flex flex-col items-start justify-between gap-5 rounded-3xl bg-sun-100 p-6 md:flex-row md:items-center md:p-10">
          <div>
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold md:text-3xl">
              <Sparkles className="h-6 w-6 text-coral-600" />
              Not sure which one fits?
            </h2>
            <p className="mt-2 max-w-xl text-ink-700">Answer five quick questions in the booking form and we'll suggest the right session.</p>
          </div>
          <Button asChild size="lg" variant="dark">
            <Link to="/booking">Help me choose</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
