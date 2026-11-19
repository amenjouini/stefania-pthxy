import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { achievements, portfolioItems } from "@/data/mockData";

const approach = [
  { title: "Light-first direction", copy: "Every session is planned around the best light for the place and the moment.", tint: "bg-sun-100" },
  { title: "Editorial sequencing", copy: "Your gallery is arranged to tell a story, not just to list photos.", tint: "bg-sky-50" },
  { title: "Careful retouching", copy: "Natural skin, true colors and a polished finish on every image.", tint: "bg-coral-50" },
  { title: "Private client flow", copy: "A personal, private process from your first message to your final gallery.", tint: "bg-lagoon-50" }
];

const tints = ["bg-coral-50 text-coral-600", "bg-sun-100 text-ink", "bg-sky-50 text-sky-500", "bg-lagoon-50 text-lagoon-600"];

export default function Achievements() {
  return (
    <div className="pb-20 pt-8 md:pt-14">
      <section className="container grid items-center gap-8 md:grid-cols-[1.1fr_.9fr] md:gap-14">
        <div>
          <p className="eyebrow">About PHTXY</p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Photos with feeling — and a calm, simple process.
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink-500">
            PHTXY photographs couples, founders, artists, magazines and brands. Based between Tunis, Paris and Milan, we travel wherever the story is.
          </p>
          <Button asChild size="lg" className="mt-7">
            <Link to="/booking">
              Book a session
              <ArrowRight className="h-5 w-5" />
            </Link>
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
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {approach.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05} className="h-full">
              <div className={`h-full rounded-3xl p-6 ${item.tint}`}>
                <p className="font-display text-3xl font-semibold text-coral-600">0{index + 1}</p>
                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                <p className="mt-1.5 leading-7 text-ink-700">{item.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container pt-16 md:pt-24">
        <h2 className="font-display text-3xl font-semibold md:text-4xl">Awards & features</h2>
        <ol className="mt-6 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
          {achievements.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={item.title} className="flex items-start gap-4 p-5 md:items-center md:gap-6 md:p-6">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tints[index % tints.length]}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1 md:grid md:grid-cols-[1fr_1.2fr] md:items-center md:gap-6">
                  <div>
                    <p className="text-sm font-medium text-ink-500">
                      {item.year} · {item.type}
                    </p>
                    <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
                  </div>
                  <p className="mt-1 leading-7 text-ink-500 md:mt-0">{item.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
