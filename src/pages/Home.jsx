import { ArrowRight, BadgeDollarSign, CalendarCheck2, CalendarDays, Camera, ChevronDown, Clock3, Quote, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/Button";
import { achievements, heroImage, portfolioItems, services, testimonials } from "@/data/mockData";
import { formatCurrency, toISODate } from "@/lib/utils";

function QuickBook() {
  const navigate = useNavigate();
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const minDate = toISODate(new Date());

  const submit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (service) params.set("service", service);
    if (date) params.set("date", date);
    const query = params.toString();
    navigate(`/booking${query ? `?${query}` : ""}`);
  };

  return (
    <form
      onSubmit={submit}
      aria-label="Start a booking"
      className="grid gap-2 rounded-3xl border border-line bg-white p-2 shadow-lift md:grid-cols-[1.3fr_1fr_auto] md:rounded-full"
    >
      <label className="relative flex flex-col rounded-2xl px-4 py-2.5 transition focus-within:bg-sand/60 hover:bg-sand/60 md:rounded-full md:px-6">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-ink">
          <Camera className="h-3.5 w-3.5 text-coral-600" />
          What are you planning?
        </span>
        <select
          value={service}
          onChange={(event) => setService(event.target.value)}
          className="w-full cursor-pointer appearance-none truncate bg-transparent pr-6 text-[0.95rem] text-ink outline-none"
        >
          <option value="">Choose a session</option>
          {services.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title} — from {formatCurrency(item.price)}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute bottom-3 right-4 h-4 w-4 text-ink-500 md:right-6" />
      </label>
      <label className="flex flex-col rounded-2xl border-t border-line px-4 py-2.5 transition focus-within:bg-sand/60 hover:bg-sand/60 md:rounded-full md:border-l md:border-t-0 md:px-6">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-ink">
          <CalendarDays className="h-3.5 w-3.5 text-coral-600" />
          Preferred date
        </span>
        <input
          type="date"
          min={minDate}
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="w-full cursor-pointer bg-transparent text-[0.95rem] text-ink outline-none [color-scheme:light]"
        />
      </label>
      <Button type="submit" size="lg" className="h-14 w-full md:w-auto">
        Start booking
        <ArrowRight className="h-5 w-5" />
      </Button>
    </form>
  );
}

function Hero() {
  return (
    <section className="container pt-2 md:pt-4">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-sand md:rounded-4xl">
        <img
          src={heroImage.src}
          alt={heroImage.alt}
          fetchPriority="high"
          className="h-[30rem] w-full object-cover object-[60%_center] sm:h-[34rem] md:h-[min(76vh,44rem)]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent md:bg-gradient-to-r md:from-ink/70 md:via-ink/25" />
        <div className="absolute inset-x-0 bottom-0 p-5 pb-16 sm:p-8 sm:pb-20 md:inset-y-0 md:flex md:max-w-2xl md:flex-col md:justify-center md:p-14 md:pb-28">
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-sun-400" />
            Photography studio · Tunis · Paris · Milan
          </p>
          <h1 className="mt-4 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl md:text-7xl">
            Beautiful photos, <em className="font-medium text-sun-300">booked in minutes.</em>
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-white/90 md:text-lg">
            Weddings, portraits, brands and events — with clear prices and a simple three-step booking.
          </p>
        </div>
        <p className="absolute bottom-4 right-5 hidden text-xs font-medium text-white/80 md:block">{heroImage.caption}</p>
      </div>
      <div className="relative z-10 mx-auto -mt-10 max-w-4xl px-1 md:-mt-12">
        <QuickBook />
      </div>
    </section>
  );
}

const promises = [
  { icon: BadgeDollarSign, title: "Prices shown up front", copy: "Every session lists its starting price.", tint: "bg-sun-100 text-ink" },
  { icon: ShieldCheck, title: "Nothing to pay online", copy: "Send a request; we confirm details with you first.", tint: "bg-lagoon-50 text-lagoon-700" },
  { icon: Clock3, title: "Fast delivery", copy: "Edits in as little as 48 hours.", tint: "bg-sky-50 text-sky-500" }
];

function Promises() {
  return (
    <section className="container mt-10 md:mt-14">
      <ul className="grid gap-3 sm:grid-cols-3">
        {promises.map(({ icon: Icon, title, copy, tint }) => (
          <li key={title} className="flex items-start gap-3 rounded-2xl p-2">
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${tint}`}>
              <Icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-semibold">{title}</span>
              <span className="block text-sm leading-6 text-ink-500">{copy}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="container py-16 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Book a session" title="What would you like to capture?" />
        <Link to="/services" className="inline-flex items-center gap-1.5 font-semibold text-lagoon-600 hover:text-lagoon-700">
          Compare all services
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {services.map((service, index) => (
          <Reveal key={service.id} delay={(index % 4) * 0.05} className="h-full">
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function RecentWork() {
  const picks = [0, 2, 6, 3, 8].map((index) => portfolioItems[index]);
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Recent work" title="Let the photos do the talking." />
          <Link to="/portfolio" className="inline-flex items-center gap-1.5 font-semibold text-lagoon-600 hover:text-lagoon-700">
            See the full portfolio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
          {picks.map((item, index) => (
            <Link
              key={item.id}
              to={`/portfolio?category=${item.category}`}
              className={`group relative overflow-hidden rounded-3xl bg-sand ${
                index === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-[4/5] md:aspect-auto md:min-h-[15rem]"
              } ${index === 4 ? "hidden md:block" : ""}`}
            >
              <img src={item.image} alt={`${item.title}, ${item.location}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-3 left-3 right-3 text-white md:bottom-4 md:left-4">
                <p className="text-xs font-medium text-white/85">{item.category}</p>
                <p className="font-display text-lg font-semibold leading-tight md:text-xl">{item.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { title: "Pick your session", copy: "Choose a service and see its starting price, duration and delivery time.", tint: "bg-sun-100" },
  { title: "Choose a date", copy: "Select the day that suits you and tell us where — or that you're not sure yet.", tint: "bg-sky-50" },
  { title: "Send your request", copy: "Add your contact details. We review it and reply by email to confirm.", tint: "bg-lagoon-50" }
];

function HowItWorks() {
  return (
    <section className="container py-16 md:py-24">
      <SectionHeading eyebrow="How booking works" title="Three steps. No surprises." align="center" />
      <ol className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <Reveal key={step.title} delay={index * 0.08}>
            <li className={`h-full rounded-3xl p-6 md:p-8 ${step.tint}`}>
              <span className="font-display text-5xl font-semibold text-coral-600">{index + 1}</span>
              <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 leading-7 text-ink-500">{step.copy}</p>
            </li>
          </Reveal>
        ))}
      </ol>
      <div className="mt-10 text-center">
        <Button asChild size="lg">
          <Link to="/booking">
            <CalendarCheck2 className="h-5 w-5" />
            Start your booking
          </Link>
        </Button>
      </div>
    </section>
  );
}

function Testimonials() {
  const colors = ["text-coral-500", "text-lagoon-600", "text-sky-500"];
  return (
    <section className="bg-sand py-16 md:py-24">
      <div className="container">
        <SectionHeading eyebrow="Kind words" title="From people we've photographed." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.08} className="h-full">
              <figure className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-soft md:p-8">
                <Quote className={`h-7 w-7 ${colors[index % 3]}`} />
                <blockquote className="mt-4 flex-1 font-display text-xl leading-snug text-ink">{item.quote}</blockquote>
                <figcaption className="mt-6 border-t border-line pt-4">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-ink-500">{item.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-sm font-medium text-ink-500">
          {achievements.slice(0, 4).map((item) => (
            <Link key={item.title} to="/achievements" className="inline-flex items-center gap-2 hover:text-ink">
              <item.icon className="h-4 w-4 text-coral-600" />
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="container py-16 md:py-24">
      <div className="grid overflow-hidden rounded-[1.75rem] bg-lagoon-700 text-white md:grid-cols-2 md:rounded-4xl">
        <div className="p-7 sm:p-10 md:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sun-300">Ready when you are</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.05] md:text-5xl">Have a date in mind?</h2>
          <p className="mt-4 max-w-md leading-7 text-white/85">
            Send a request today — it's free, and nothing is final until we've confirmed the details together.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="light">
              <Link to="/booking">
                Book a session
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10">
              <Link to="/services">See prices</Link>
            </Button>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
          alt="Turquoise sea meeting a sunlit beach"
          loading="lazy"
          className="h-56 w-full object-cover md:h-full"
        />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Promises />
      <ServicesSection />
      <RecentWork />
      <HowItWorks />
      <Testimonials />
      <FinalCta />
    </>
  );
}
