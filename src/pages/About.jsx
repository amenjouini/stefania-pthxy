import { CalendarDays, Quote } from "lucide-react";
import { useBooking } from "@/components/booking/BookingProvider";
import { Button } from "@/components/ui/Button";
import { portfolioItems, testimonials } from "@/data/mockData";

const approach = [
  { title: "Light-first direction", copy: "Every session is planned around the best light for the place and the moment." },
  { title: "A story, not a list", copy: "Your gallery is arranged to tell the day, not just to show photos." },
  { title: "Careful retouching", copy: "Natural skin, true colors and a polished finish on every image." }
];

export default function About() {
  const { openBooking } = useBooking();

  return (
    <div className="pb-24 pt-8 md:pt-14">
      <section className="container grid items-center gap-8 md:grid-cols-[1.1fr_.9fr] md:gap-14">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">About PHTXY</h1>
          <p className="mt-5 text-lg leading-8 text-ink-500">
            PHTXY photographs couples, families, artists and brands. Based between Tunis, Paris and Milan, and happy to travel wherever the story is.
          </p>
          <Button size="lg" className="mt-7" onClick={() => openBooking()}>
            <CalendarDays className="h-5 w-5" />
            Book a session
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[portfolioItems[7], portfolioItems[2]].map((item, index) => (
            <img
              key={item.id}
              src={item.image}
              alt={`${item.title}, ${item.location}`}
              className={`aspect-[3/4] w-full rounded-3xl object-cover ${index === 1 ? "mt-10" : ""}`}
            />
          ))}
        </div>
      </section>

      <section className="container pt-16 md:pt-24">
        <h2 className="font-display text-3xl font-semibold md:text-4xl">How we work</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {approach.map((item, index) => (
            <div key={item.title} className="rounded-3xl bg-sage-100 p-6">
              <p className="font-display text-3xl font-semibold text-sage-700">0{index + 1}</p>
              <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
              <p className="mt-1.5 leading-7 text-ink-700">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container pt-16 md:pt-24">
        <h2 className="font-display text-3xl font-semibold md:text-4xl">Kind words</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <figure key={item.name} className="flex flex-col rounded-3xl border border-line bg-white p-6 shadow-soft">
              <Quote className="h-6 w-6 text-sage-500" />
              <blockquote className="mt-3 flex-1 font-display text-lg leading-snug">{item.quote}</blockquote>
              <figcaption className="mt-5 border-t border-line pt-3">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-ink-500">{item.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
