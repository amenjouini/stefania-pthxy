import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Loader2,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Timer
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { BookingQuiz } from "@/components/booking/BookingQuiz";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/Input";
import { getService, services } from "@/data/mockData";
import { sendBookingEmail } from "@/lib/email";
import { cn, formatCurrency, formatDate, formatShortDate, parseISODate, startOfToday } from "@/lib/utils";

const timeOptions = ["09:00", "11:00", "14:00", "16:00", "18:00", "Flexible"];

const paymentMethods = [
  { id: "Credit Card", label: "Card" },
  { id: "PayPal", label: "PayPal" },
  { id: "Bank Transfer", label: "Bank transfer" },
  { id: "Cash on Session", label: "Cash on the day" }
];

const isRemote = (service) => service?.category !== "Shooting";

/* ---------- Small building blocks ---------- */

function Stepper({ steps, current, onJump }) {
  return (
    <nav aria-label="Booking progress">
      <p className="text-sm font-semibold text-ink-500">
        Step {current + 1} of {steps.length}
      </p>
      <ol className="mt-2 flex gap-2">
        {steps.map((step, index) => {
          const reachable = index < current;
          return (
            <li key={step.id} className="flex-1">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onJump(index)}
                className="group w-full text-left disabled:cursor-default"
                aria-current={index === current ? "step" : undefined}
              >
                <span className={cn("block h-1.5 rounded-full transition-colors", index <= current ? "bg-coral-500" : "bg-sand-dark")} />
                <span
                  className={cn(
                    "mt-2 hidden text-sm font-medium sm:block",
                    index === current ? "text-ink" : "text-ink-500",
                    reachable && "group-hover:text-lagoon-600 group-hover:underline"
                  )}
                >
                  {step.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function ServiceOption({ service, selected, onSelect }) {
  const Icon = service.icon;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(service)}
      className={cn(
        "relative flex w-full items-center gap-3 rounded-2xl border bg-white p-2.5 text-left transition sm:gap-4",
        selected ? "border-lagoon-600 ring-2 ring-lagoon-100" : "border-line hover:border-ink/30"
      )}
    >
      <img src={service.image} alt="" loading="lazy" className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-xl object-cover sm:h-20 sm:w-20" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 font-semibold text-ink">
          <Icon className="h-4 w-4 shrink-0 text-coral-600" />
          <span className="truncate">{service.title}</span>
        </span>
        <span className="mt-0.5 block truncate text-sm text-ink-500">{service.short}</span>
        <span className="mt-1 block text-sm text-ink-500">
          <span className="font-bold text-ink">from {formatCurrency(service.price)}</span> · {service.duration === "Remote" ? `ready in ${service.delivery}` : service.duration}
        </span>
      </span>
      <span
        className={cn(
          "mr-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition",
          selected ? "border-lagoon-600 bg-lagoon-600 text-white" : "border-ink-300"
        )}
        aria-hidden="true"
      >
        {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
    </button>
  );
}

function Chip({ selected, onClick, children }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "h-11 rounded-full border px-4 text-sm font-semibold transition",
        selected ? "border-lagoon-600 bg-lagoon-600 text-white" : "border-line bg-white text-ink hover:border-ink/30"
      )}
    >
      {children}
    </button>
  );
}

function SummaryRow({ icon: Icon, label, value, muted }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink-500" />
      <span className="w-20 shrink-0 text-sm text-ink-500">{label}</span>
      <span className={cn("min-w-0 flex-1 break-words text-sm font-medium", muted ? "text-ink-300" : "text-ink")}>{value}</span>
    </div>
  );
}

function Summary({ service, booking }) {
  if (!service) {
    return (
      <div className="rounded-3xl border border-dashed border-ink-300/60 bg-white/60 p-6 text-center">
        <Sparkles className="mx-auto h-6 w-6 text-coral-500" />
        <p className="mt-3 font-semibold">Your booking summary</p>
        <p className="mt-1 text-sm leading-6 text-ink-500">Choose a session to see the price, timing and delivery here.</p>
      </div>
    );
  }
  const remote = isRemote(service);
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
      <img src={service.image} alt="" className="aspect-[16/8] w-full object-cover" />
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">Your session</p>
        <p className="mt-1 font-display text-2xl font-semibold leading-tight">{service.title}</p>
        <div className="mt-3 divide-y divide-line border-y border-line">
          {remote ? (
            <SummaryRow icon={MapPin} label="Where" value="Remote — no visit needed" />
          ) : (
            <>
              <SummaryRow icon={CalendarDays} label="Date" value={booking.date ? formatDate(booking.date) : "Not chosen yet"} muted={!booking.date} />
              <SummaryRow icon={Clock3} label="Start" value={booking.time || "Flexible"} />
              <SummaryRow icon={MapPin} label="Location" value={booking.location || "To be confirmed"} muted={!booking.location} />
              <SummaryRow icon={Timer} label="Duration" value={service.duration} />
            </>
          )}
          <SummaryRow icon={PackageCheck} label="Delivery" value={`Within ${service.delivery}`} />
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <span className="text-sm text-ink-500">Starting price</span>
          <span className="font-display text-3xl font-semibold">{formatCurrency(service.price)}</span>
        </div>
        <p className="mt-3 flex gap-2 rounded-2xl bg-lagoon-50 p-3 text-sm leading-6 text-lagoon-700">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          Nothing is charged online. We confirm availability and your final price by email first.
        </p>
      </div>
    </div>
  );
}

/* ---------- Main flow ---------- */

export function BookingFlow() {
  const [params] = useSearchParams();
  const presetService = getService(params.get("service"));
  const presetDate = parseISODate(params.get("date"));

  const [service, setService] = useState(presetService || null);
  const [booking, setBooking] = useState({ date: presetDate, time: "", location: "", payment: "" });
  const [step, setStep] = useState(presetService ? 1 : 0);
  const [stepError, setStepError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | error | done
  const [quizOpen, setQuizOpen] = useState(false);
  const topRef = useRef(null);
  const firstRender = useRef(true);

  const form = useForm({ mode: "onTouched", defaultValues: { fullName: "", email: "", phone: "", notes: "" } });
  const { errors } = form.formState;

  const steps = useMemo(
    () =>
      isRemote(service)
        ? [{ id: "service", label: "Service" }, { id: "details", label: "Your details" }]
        : [{ id: "service", label: "Service" }, { id: "schedule", label: "Date & place" }, { id: "details", label: "Your details" }],
    [service]
  );
  const current = steps[Math.min(step, steps.length - 1)]?.id;
  const isLast = step === steps.length - 1;

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const top = topRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0 || top > window.innerHeight * 0.4) {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step, status]);

  const update = (patch) => setBooking((value) => ({ ...value, ...patch }));

  const selectService = (next) => {
    setService(next);
    setStepError("");
  };

  const onQuizComplete = useCallback(
    ({ service: next, notes }) => {
      selectService(next);
      if (!form.getValues("notes")) form.setValue("notes", notes);
      setQuizOpen(false);
    },
    [form]
  );
  const closeQuiz = useCallback(() => setQuizOpen(false), []);

  const submit = form.handleSubmit(async (customer) => {
    setStatus("sending");
    const remote = isRemote(service);
    try {
      await sendBookingEmail({
        service,
        date: remote ? undefined : booking.date,
        time: remote ? "" : booking.time || "Flexible",
        location: remote ? "Remote" : booking.location || "To be confirmed",
        duration: service.duration,
        customer: { ...customer, phone: customer.phone || "Not supplied" },
        payment: booking.payment || "No preference"
      });
      setStatus("done");
    } catch (error) {
      console.error("Booking email failed", error);
      setStatus("error");
    }
  });

  const next = () => {
    if (current === "service" && !service) {
      setStepError("Please choose a session to continue.");
      return;
    }
    if (current === "schedule" && !booking.date) {
      setStepError("Please pick a date to continue.");
      return;
    }
    setStepError("");
    if (isLast) {
      submit();
      return;
    }
    setStep((value) => value + 1);
  };

  const back = () => {
    setStepError("");
    setStep((value) => Math.max(value - 1, 0));
  };

  if (status === "done") {
    const firstName = form.getValues("fullName").trim().split(" ")[0];
    return (
      <div ref={topRef} className="mx-auto max-w-2xl scroll-mt-24 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-lagoon-600 text-white shadow-lift"
        >
          <Check className="h-10 w-10" strokeWidth={2.5} />
        </motion.div>
        <h1 className="mt-6 font-display text-4xl font-semibold leading-tight md:text-5xl">
          Request sent{firstName ? `, ${firstName}` : ""}!
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-lg leading-8 text-ink-500">
          We've received your request for <strong className="text-ink">{service.title}</strong>
          {!isRemote(service) && booking.date ? <> on <strong className="text-ink">{formatDate(booking.date)}</strong></> : null}.
        </p>
        <div className="mt-8 rounded-3xl border border-line bg-white p-6 text-left shadow-soft">
          <p className="font-semibold">What happens next</p>
          <ol className="mt-4 grid gap-4">
            {[
              ["We check your request", isRemote(service) ? "We look over your brief and files." : "We check availability for your date and location."],
              ["You get a reply by email", `We'll write to ${form.getValues("email")} to confirm the details and final price.`],
              ["Nothing to pay yet", "Your booking is only final once you've agreed to the confirmation."]
            ].map(([title, copy], index) => (
              <li key={title} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sun-100 text-sm font-bold">{index + 1}</span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="block text-sm leading-6 text-ink-500">{copy}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/portfolio">Browse the portfolio</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const sending = status === "sending";
  const primaryLabel = isLast ? (sending ? "Sending…" : "Send booking request") : "Continue";

  return (
    <>
      <div ref={topRef} className="grid scroll-mt-24 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="min-w-0 rounded-[1.75rem] border border-line bg-white p-4 shadow-soft sm:p-6 md:p-8">
          <Stepper steps={steps} current={step} onJump={(index) => { setStepError(""); setStep(index); }} />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-6"
            >
              {current === "service" && (
                <section aria-labelledby="step-service">
                  <h2 id="step-service" className="font-display text-3xl font-semibold leading-tight md:text-4xl">What would you like to book?</h2>
                  <button
                    type="button"
                    onClick={() => setQuizOpen(true)}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-sun-100 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-sun-300"
                  >
                    <Sparkles className="h-4 w-4 text-coral-600" />
                    Not sure? Answer 5 quick questions
                  </button>
                  {[
                    ["Photo sessions", services.filter((item) => item.category === "Shooting")],
                    ["Editing — done remotely", services.filter((item) => item.category !== "Shooting")]
                  ].map(([group, items]) => (
                    <div key={group} className="mt-6">
                      <p className="mb-3 text-sm font-semibold text-ink-500">{group}</p>
                      <div role="radiogroup" aria-label={group} className="grid grid-cols-1 gap-2.5 xl:grid-cols-2">
                        {items.map((item) => (
                          <ServiceOption key={item.id} service={item} selected={service?.id === item.id} onSelect={selectService} />
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {current === "schedule" && (
                <section aria-labelledby="step-schedule">
                  <h2 id="step-schedule" className="font-display text-3xl font-semibold leading-tight md:text-4xl">When and where?</h2>
                  <p className="mt-2 text-ink-500">Pick your preferred date — we'll confirm availability by email.</p>
                  <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[auto_minmax(0,1fr)]">
                    <div className="calendar flex justify-center rounded-3xl border border-line bg-cream/60 p-2 sm:p-4">
                      <DayPicker
                        mode="single"
                        selected={booking.date}
                        defaultMonth={booking.date}
                        onSelect={(date) => {
                          update({ date });
                          if (date) setStepError("");
                        }}
                        disabled={{ before: startOfToday() }}
                        startMonth={startOfToday()}
                        aria-label="Preferred date"
                      />
                    </div>
                    <div className="grid content-start gap-6">
                      <div>
                        <p className="mb-2 text-sm font-semibold" id="time-label">
                          Preferred start time <span className="font-normal text-ink-500">(optional)</span>
                        </p>
                        <div role="radiogroup" aria-labelledby="time-label" className="flex flex-wrap gap-2">
                          {timeOptions.map((time) => (
                            <Chip key={time} selected={booking.time === time} onClick={() => update({ time: booking.time === time ? "" : time })}>
                              {time}
                            </Chip>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="location" optional>Location</Label>
                        <Input
                          id="location"
                          autoComplete="address-level2"
                          placeholder="City, venue or address"
                          value={booking.location}
                          onChange={(event) => update({ location: event.target.value })}
                        />
                        <p className="mt-1.5 text-sm text-ink-500">Not sure yet? Leave it blank — we can suggest places.</p>
                      </div>
                      <p className="flex items-center gap-2 rounded-2xl bg-sky-50 p-3 text-sm text-ink-700">
                        <Timer className="h-4 w-4 shrink-0 text-sky-500" />
                        Typical length for this session: <strong className="font-semibold">{service.duration}</strong>
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {current === "details" && (
                <form
                  aria-labelledby="step-details"
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault();
                    next();
                  }}
                >
                  <h2 id="step-details" className="font-display text-3xl font-semibold leading-tight md:text-4xl">Your details</h2>
                  <p className="mt-2 text-ink-500">So we can reply to confirm your booking.</p>
                  <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <Label htmlFor="fullName">Full name</Label>
                      <Input
                        id="fullName"
                        autoComplete="name"
                        placeholder="Your name"
                        invalid={Boolean(errors.fullName)}
                        aria-describedby={errors.fullName ? "fullName-error" : undefined}
                        {...form.register("fullName", { required: "Please enter your name.", validate: (v) => v.trim().length > 1 || "Please enter your name." })}
                      />
                      <FieldError id="fullName-error">{errors.fullName?.message}</FieldError>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        {...form.register("email", {
                          required: "We need your email to confirm the booking.",
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message: "That email doesn't look right." }
                        })}
                      />
                      <FieldError id="email-error">{errors.email?.message}</FieldError>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="phone" optional>Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+216 00 000 000"
                        invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                        {...form.register("phone", {
                          validate: (v) => !v || /^[+\d][\d\s().-]{5,}$/.test(v.trim()) || "Please check the phone number."
                        })}
                      />
                      <FieldError id="phone-error">{errors.phone?.message}</FieldError>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="notes" optional>Anything we should know?</Label>
                      <Textarea
                        id="notes"
                        placeholder={
                          isRemote(service)
                            ? "Links to your files, how many images, your deadline and where they'll be used."
                            : "The occasion, who'll be there, the mood you're after, any references…"
                        }
                        {...form.register("notes")}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <p className="mb-2 text-sm font-semibold" id="payment-label">
                        How would you prefer to pay? <span className="font-normal text-ink-500">(optional)</span>
                      </p>
                      <div role="radiogroup" aria-labelledby="payment-label" className="flex flex-wrap gap-2">
                        {paymentMethods.map((method) => (
                          <Chip
                            key={method.id}
                            selected={booking.payment === method.id}
                            onClick={() => update({ payment: booking.payment === method.id ? "" : method.id })}
                          >
                            {method.label}
                          </Chip>
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-ink-500">Nothing is charged now — payment is arranged after we confirm.</p>
                    </div>
                  </div>
                  <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
                </form>
              )}
            </motion.div>
          </AnimatePresence>

          {(stepError || status === "error") && (
            <p role="alert" className="mt-6 flex items-start gap-2 rounded-2xl bg-coral-50 p-3 text-sm font-medium text-coral-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {stepError || "Sorry — we couldn't send your request. Please check your connection and try again."}
            </p>
          )}

          {/* Actions: sticky bar on mobile, inline on desktop */}
          <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 shadow-[0_-8px_24px_-12px_rgba(28,43,46,.18)] backdrop-blur-md md:static md:z-auto md:mt-8 md:border-t md:bg-transparent md:px-0 md:pb-0 md:pt-6 md:shadow-none md:backdrop-blur-none">
            <div className="mx-auto flex max-w-3xl items-center gap-3 md:max-w-none">
              {step > 0 ? (
                <Button variant="outline" size="icon" className="h-12 w-12 shrink-0 md:w-auto md:px-5" onClick={back} aria-label="Back">
                  <ArrowLeft className="h-5 w-5" />
                  <span className="hidden md:inline">Back</span>
                </Button>
              ) : null}
              <div className="min-w-0 flex-1 md:hidden">
                {service ? (
                  <>
                    <p className="truncate text-sm font-semibold">{service.title}</p>
                    <p className="truncate text-sm text-ink-500">
                      from <span className="font-bold text-ink">{formatCurrency(service.price)}</span>
                      {booking.date && !isRemote(service) ? ` · ${formatShortDate(booking.date).replace(/^\w+, /, "")}` : ""}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-ink-500">Choose a session</p>
                )}
              </div>
              <div className="hidden flex-1 md:block" />
              <Button onClick={next} disabled={sending} className="h-12 shrink-0 px-5 md:px-7" aria-busy={sending}>
                {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLast && !sending ? (
                  <>
                    <span className="md:hidden">Send request</span>
                    <span className="hidden md:inline">Send booking request</span>
                  </>
                ) : (
                  primaryLabel
                )}
                {!isLast && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <aside className="hidden lg:block" aria-label="Booking summary">
          <div className="sticky top-24">
            <Summary service={service} booking={booking} />
          </div>
        </aside>
      </div>

      {/* Summary for small screens, below the form */}
      <div className="mt-6 lg:hidden">
        <Summary service={service} booking={booking} />
      </div>

      {quizOpen && <BookingQuiz onComplete={onQuizComplete} onClose={closeQuiz} />}
    </>
  );
}
