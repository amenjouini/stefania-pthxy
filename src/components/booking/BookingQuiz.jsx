import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, RotateCcw, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { services } from "@/data/mockData";
import { formatCurrency } from "@/lib/utils";

const questions = [
  {
    id: "occasion",
    title: "What are we photographing?",
    recap: "Occasion",
    options: [
      { id: "wedding", label: "A wedding", emoji: "💍", scores: { "wedding-coverage": 6, "photo-shooting": 2 } },
      { id: "event", label: "An event or party", emoji: "🥂", scores: { "event-coverage": 6, "photo-shooting": 2 } },
      { id: "portrait", label: "Portraits of me or us", emoji: "😊", scores: { "photo-shooting": 6, retouching: 1 } },
      { id: "fashion", label: "Fashion or a brand campaign", emoji: "✨", scores: { "fashion-photography": 6, "commercial-photography": 3 } },
      { id: "product", label: "Products for my business", emoji: "📦", scores: { "product-photography": 6, "commercial-photography": 3 } },
      { id: "edits", label: "Editing photos I already have", emoji: "🎨", scores: { "photo-editing": 5, retouching: 5 } }
    ]
  },
  {
    id: "crew",
    title: "How many people?",
    recap: "People",
    options: [
      { id: "solo", label: "Just me", emoji: "🙋", scores: { "photo-shooting": 4, retouching: 2 } },
      { id: "small", label: "2 – 5 people", emoji: "👫", scores: { "photo-shooting": 4, "event-coverage": 2 } },
      { id: "medium", label: "6 – 20 people", emoji: "🎊", scores: { "event-coverage": 4, "photo-shooting": 2 } },
      { id: "crowd", label: "A big crowd", emoji: "🌊", scores: { "wedding-coverage": 5, "event-coverage": 4 } }
    ]
  },
  {
    id: "vibe",
    title: "Which style feels like you?",
    recap: "Style",
    options: [
      { id: "cinematic", label: "Cinematic & moody", emoji: "🎬", scores: { "wedding-coverage": 2, "fashion-photography": 2, "photo-shooting": 2 } },
      { id: "dreamy", label: "Bright & dreamy", emoji: "☁️", scores: { "photo-shooting": 3, "wedding-coverage": 2 } },
      { id: "bold", label: "Bold & editorial", emoji: "🔥", scores: { "fashion-photography": 4, "commercial-photography": 2 } },
      { id: "timeless", label: "Warm & timeless", emoji: "🤍", scores: { "wedding-coverage": 3, "photo-shooting": 2 } }
    ]
  },
  {
    id: "place",
    title: "Where will it happen?",
    recap: "Setting",
    options: [
      { id: "city", label: "City streets", emoji: "🌆", scores: { "fashion-photography": 2, "photo-shooting": 2 } },
      { id: "nature", label: "Outdoors in nature", emoji: "🏔️", scores: { "wedding-coverage": 2, "photo-shooting": 2 } },
      { id: "studio", label: "In a studio", emoji: "💡", scores: { "product-photography": 3, "fashion-photography": 2 } },
      { id: "venue", label: "At a venue / indoors", emoji: "🏛️", scores: { "event-coverage": 3, "wedding-coverage": 2 } },
      { id: "surprise", label: "Not sure yet", emoji: "🤷", scores: { "photo-shooting": 2, "event-coverage": 1 } }
    ]
  },
  {
    id: "budget",
    title: "What budget feels comfortable?",
    recap: "Budget",
    options: [
      { id: "low", label: "$100 – $400", emoji: "🌱", scores: { retouching: 5, "photo-editing": 4 } },
      { id: "mid", label: "$400 – $1,000", emoji: "🌿", scores: { "photo-shooting": 5, "product-photography": 3 } },
      { id: "high", label: "$1,000 – $3,000", emoji: "🌳", scores: { "event-coverage": 5, "fashion-photography": 3 } },
      { id: "sky", label: "$3,000+", emoji: "🚀", scores: { "wedding-coverage": 5, "commercial-photography": 4 } }
    ]
  }
];

/** "Help me choose" — 5 tap-to-answer questions that recommend a service. Rendered as a dialog. */
export function BookingQuiz({ onComplete, onClose }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const dialogRef = useRef(null);
  const total = questions.length;
  const question = questions[index];

  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const result = useMemo(() => {
    if (!done) return null;
    const tally = {};
    Object.values(answers).forEach((option) => {
      Object.entries(option.scores).forEach(([serviceId, points]) => {
        tally[serviceId] = (tally[serviceId] || 0) + points;
      });
    });
    const ranked = Object.entries(tally).sort((a, b) => b[1] - a[1]);
    const service = services.find((item) => item.id === ranked[0]?.[0]) || services[0];
    const recap = questions.map((item) => `${item.recap}: ${answers[item.id]?.label}`).join(" · ");
    return { service, recap };
  }, [answers, done]);

  const pick = (option) => {
    setAnswers((current) => ({ ...current, [question.id]: option }));
    window.setTimeout(() => {
      if (index === total - 1) setDone(true);
      else setIndex((value) => value + 1);
    }, 220);
  };

  const restart = () => {
    setIndex(0);
    setAnswers({});
    setDone(false);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-title"
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[1.75rem] bg-cream p-5 shadow-lift outline-none sm:rounded-[1.75rem] sm:p-7"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-ink-500">{done ? "Our suggestion" : `Question ${index + 1} of ${total}`}</p>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>
        {!done && (
          <div className="mt-2 flex gap-1.5" aria-hidden="true">
            {questions.map((item, itemIndex) => (
              <span key={item.id} className={`h-1.5 flex-1 rounded-full transition-colors ${itemIndex <= index ? "bg-coral-500" : "bg-sand-dark"}`} />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait" initial={false}>
          {done && result ? (
            <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mt-4">
              <h2 id="quiz-title" className="font-display text-3xl font-semibold leading-tight">
                We'd suggest <span className="text-coral-600">{result.service.title}</span>
              </h2>
              <div className="mt-5 overflow-hidden rounded-3xl border border-line bg-white">
                <img src={result.service.image} alt="" className="aspect-[16/9] w-full object-cover" />
                <div className="p-5">
                  <p className="leading-7 text-ink-500">{result.service.description}</p>
                  <p className="mt-3 text-sm text-ink-500">
                    from <span className="text-lg font-bold text-ink">{formatCurrency(result.service.price)}</span> · {result.service.duration} · delivered in {result.service.delivery}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <Button size="lg" onClick={() => onComplete({ service: result.service, notes: `Quiz answers — ${result.recap}` })}>
                  <Check className="h-5 w-5" />
                  Choose this
                </Button>
                <Button size="lg" variant="outline" onClick={restart}>
                  <RotateCcw className="h-4 w-4" />
                  Start over
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div key={question.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} className="mt-5">
              <h2 id="quiz-title" className="font-display text-3xl font-semibold leading-tight">{question.title}</h2>
              <div className="mt-5 grid gap-2.5">
                {question.options.map((option) => {
                  const selected = answers[question.id]?.id === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => pick(option)}
                      className={`flex min-h-14 items-center gap-4 rounded-2xl border bg-white px-4 py-3 text-left font-medium transition hover:border-lagoon-600 ${
                        selected ? "border-lagoon-600 ring-2 ring-lagoon-100" : "border-line"
                      }`}
                    >
                      <span className="text-2xl" aria-hidden="true">{option.emoji}</span>
                      <span className="flex-1">{option.label}</span>
                      {selected && <Check className="h-5 w-5 text-lagoon-600" />}
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 flex items-center justify-between">
                <Button variant="ghost" size="sm" disabled={index === 0} onClick={() => setIndex((value) => Math.max(value - 1, 0))}>
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <span className="text-sm text-ink-500">About 30 seconds</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
