import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, Banknote, Building2, CalendarDays, Check, Clock3, CreditCard, Loader2, MapPin, User } from "lucide-react";
import { Map as MapIcon } from "lucide-react";
import { Suspense, lazy, useCallback, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label } from "@/components/ui/Input";
import { getService, services } from "@/data/mockData";
import { sendBookingEmail } from "@/lib/email";
import { cn, formatCurrency, formatDate, parseISODate, toISODate } from "@/lib/utils";

/** Hosted checkout URL (Stripe Payment Link, PayPal, …). When unset, only offline payment is offered. */
const PAYMENT_LINK = import.meta.env.VITE_PAYMENT_LINK || "";

const paymentMethods = [
  PAYMENT_LINK && { id: "Card (online)", title: "Pay online by card", copy: "After confirming, you'll go to our secure checkout.", icon: CreditCard },
  { id: "Bank Transfer", title: "Bank transfer", copy: "We'll email you our bank details with your confirmation.", icon: Building2 },
  { id: "Cash on Session", title: "Cash on the day", copy: "Pay in person at your session.", icon: Banknote }
].filter(Boolean);

/** Map is loaded only when someone opens it. */
const MapPicker = lazy(() => import("@/components/booking/MapPicker"));

const DETAIL_FIELDS =["service", "otherEvent", "date", "time", "location", "fullName", "phone", "email"];

const OTHER = "other";

/** The chosen service, or a custom one when "Other" is picked (no fixed price). */
function resolveService(serviceId, otherEvent) {
  if (serviceId !== OTHER) return getService(serviceId);
  return {
    id: OTHER,
    title: otherEvent?.trim() || "Other",
    category: "Other",
    price: null,
    duration: "To be discussed",
    delivery: "To be discussed"
  };
}

function StepDots({ step }) {
  const steps = ["Details", "Payment"];
  return (
    <ol className="flex items-center gap-2 text-sm font-semibold" aria-label="Booking progress">
      {steps.map((label, index) => (
        <li key={label} className="flex items-center gap-2">
          {index > 0 && <span className="h-px w-6 bg-line" aria-hidden="true" />}
          <span
            className={cn(
              "grid h-6 w-6 place-items-center rounded-full text-xs",
              index < step ? "bg-sage-700 text-white" : index === step ? "bg-sage-200 text-sage-900" : "bg-sage-50 text-ink-500"
            )}
          >
            {index < step ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : index + 1}
          </span>
          <span className={index === step ? "text-ink" : "text-ink-500"} aria-current={index === step ? "step" : undefined}>
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}

function SummaryLine({ icon: Icon, children }) {
  return (
    <li className="flex items-start gap-3 py-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-sage-700" />
      <span className="min-w-0 break-words">{children}</span>
    </li>
  );
}

/**
 * Two short screens: (1) event type, date, time, location, contact → (2) payment → done.
 * Sends the booking to the studio through EmailJS (src/lib/email.js).
 */
export function BookingForm({ defaultServiceId, defaultDate, onDone, className }) {
  const uid = useId();
  const id = (name) => `${uid}-${name}`;
  const [step, setStep] = useState(0); // 0 details · 1 payment · 2 done
  const [status, setStatus] = useState("idle"); // idle | sending | error
  const [mapOpen, setMapOpen] = useState(false);
  const [pin, setPin] = useState(null); // { lat, lng, address } when chosen on the map

  const form = useForm({
    mode: "onTouched",
    defaultValues: {
      service: defaultServiceId === OTHER ? OTHER : getService(defaultServiceId)?.id || "",
      otherEvent: "",
      date: defaultDate || "",
      time: "",
      location: "",
      fullName: "",
      phone: "",
      email: "",
      payment: paymentMethods[0].id
    }
  });
  const { register, formState, watch } = form;
  const { errors } = formState;
  const values = watch();
  const service = resolveService(values.service, values.otherEvent);
  const minDate = toISODate(new Date());

  const closeMap = useCallback(() => setMapOpen(false), []);
  const onMapSelect = useCallback(
    (picked) => {
      setPin(picked);
      form.setValue("location", picked.address, { shouldValidate: true, shouldDirty: true });
      setMapOpen(false);
    },
    [form]
  );

  const toPayment = async () => {
    const ok = await form.trigger(DETAIL_FIELDS, { shouldFocus: true });
    if (ok) setStep(1);
  };

  const confirm = form.handleSubmit(async (data) => {
    setStatus("sending");
    try {
      await sendBookingEmail({
        service,
        date: parseISODate(data.date),
        time: data.time,
        // Pinned on the map → add a map link so the studio can find the exact spot
        location: pin ? `${data.location.trim()} (map: https://www.google.com/maps?q=${pin.lat.toFixed(6)},${pin.lng.toFixed(6)})` : data.location.trim(),
        duration: service.duration,
        customer: { fullName: data.fullName.trim(), email: data.email.trim(), phone: data.phone.trim(), notes: "" },
        payment: data.payment
      });
      setStatus("idle");
      setStep(2);
      onDone?.();
    } catch (error) {
      console.error("Booking email failed", error);
      setStatus("error");
    }
  });

  /* ---------- Done ---------- */
  if (step === 2) {
    const payOnline = values.payment === "Card (online)" && PAYMENT_LINK;
    return (
      <div className={cn("text-center", className)}>
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage-200 text-sage-900"
        >
          <Check className="h-8 w-8" strokeWidth={2.5} />
        </motion.div>
        <h3 className="mt-5 font-display text-3xl font-semibold leading-tight">Booking received!</h3>
        <p className="mx-auto mt-2 max-w-sm leading-7 text-ink-500">
          {service.title} on <strong className="text-ink">{formatDate(parseISODate(values.date))}</strong> at{" "}
          <strong className="text-ink">{values.time}</strong>. We'll confirm by email at {values.email}.
        </p>
        {payOnline ? (
          <Button asChild size="lg" variant="dark" className="mt-6 w-full sm:w-auto">
            <a href={PAYMENT_LINK} target="_blank" rel="noopener noreferrer">
              <CreditCard className="h-5 w-5" />
              Pay now securely
            </a>
          </Button>
        ) : (
          <p className="mx-auto mt-4 max-w-sm rounded-2xl bg-sage-50 p-3 text-sm text-ink-700">
            Payment: <strong>{paymentMethods.find((m) => m.id === values.payment)?.title}</strong>
          </p>
        )}
        <div className="mt-6">
          <Link to="/portfolio" className="font-semibold text-sage-700 underline-offset-4 hover:underline">
            Browse more work
          </Link>
        </div>
      </div>
    );
  }

  /* ---------- Steps 1 & 2 ---------- */
  return (
    <form
      noValidate
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        if (step === 0) toPayment();
        else confirm();
      }}
    >
      <StepDots step={step} />

      {step === 0 && (
        <div className="mt-6 grid gap-5">
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">Type of event</legend>
            <div className="grid grid-cols-2 gap-2">
              {[...services, { id: OTHER, title: "Other" }].map((item) => (
                <label key={item.id} className="relative cursor-pointer">
                  <input type="radio" value={item.id} className="peer sr-only" {...register("service", { required: "Please choose the type of event." })} />
                  <span className="flex h-full flex-col rounded-2xl border border-line bg-white px-3 py-2.5 transition hover:border-sage-400 peer-checked:border-sage-700 peer-checked:bg-sage-100 peer-focus-visible:ring-2 peer-focus-visible:ring-sage-700">
                    <span className="text-sm font-semibold leading-snug">{item.title}</span>
                  </span>
                </label>
              ))}
            </div>
            <FieldError>{errors.service?.message}</FieldError>
            {values.service === OTHER && (
              <div className="mt-3">
                <Label htmlFor={id("otherEvent")}>What kind of event?</Label>
                <Input
                  id={id("otherEvent")}
                  autoFocus
                  placeholder="e.g. Birthday, graduation, family reunion"
                  invalid={Boolean(errors.otherEvent)}
                  {...register("otherEvent", {
                    validate: (v, all) => all.service !== OTHER || v.trim().length > 1 || "Please tell us the type of event."
                  })}
                />
                <FieldError>{errors.otherEvent?.message}</FieldError>
              </div>
            )}
          </fieldset>

          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <Label htmlFor={id("date")}>Date</Label>
              <Input
                id={id("date")}
                type="date"
                min={minDate}
                invalid={Boolean(errors.date)}
                className="px-3"
                {...register("date", {
                  required: "Pick a date.",
                  validate: (v) => Boolean(parseISODate(v)) || "Choose a future date."
                })}
              />
              <FieldError>{errors.date?.message}</FieldError>
            </div>
            <div className="min-w-0">
              <Label htmlFor={id("time")}>Time</Label>
              <Input id={id("time")} type="time" invalid={Boolean(errors.time)} className="px-3" {...register("time", { required: "Pick a time." })} />
              <FieldError>{errors.time?.message}</FieldError>
            </div>
          </div>

          <div>
            <Label htmlFor={id("location")}>Location</Label>
            <div className="relative">
              <Input
                id={id("location")}
                placeholder="Type an address or pick on the map"
                autoComplete="address-level2"
                invalid={Boolean(errors.location)}
                className="pr-14"
                {...register("location", {
                  required: "Where will the shoot be?",
                  validate: (v) => v.trim().length > 1 || "Where will the shoot be?",
                  // Typing by hand replaces the map pin
                  onChange: () => setPin(null)
                })}
              />
              <button
                type="button"
                onClick={() => setMapOpen(true)}
                aria-label="Choose location on a map"
                title="Choose on map"
                className={cn(
                  "absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl transition",
                  pin ? "bg-sage-700 text-white" : "bg-sage-100 text-sage-800 hover:bg-sage-200"
                )}
              >
                <MapIcon className="h-[18px] w-[18px]" />
              </button>
            </div>
            <FieldError>{errors.location?.message}</FieldError>
          </div>

          <div className="grid gap-5 border-t border-line pt-5">
            <div>
              <Label htmlFor={id("fullName")}>Full name</Label>
              <Input
                id={id("fullName")}
                autoComplete="name"
                placeholder="Your name"
                invalid={Boolean(errors.fullName)}
                {...register("fullName", { required: "Please enter your name.", validate: (v) => v.trim().length > 1 || "Please enter your name." })}
              />
              <FieldError>{errors.fullName?.message}</FieldError>
            </div>
            <div>
              <Label htmlFor={id("phone")}>Phone</Label>
              <Input
                id={id("phone")}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+216 00 000 000"
                invalid={Boolean(errors.phone)}
                {...register("phone", {
                  required: "Please enter your phone number.",
                  validate: (v) => /^[+\d][\d\s().-]{5,}$/.test(v.trim()) || "Please check the phone number."
                })}
              />
              <FieldError>{errors.phone?.message}</FieldError>
            </div>
            <div>
              <Label htmlFor={id("email")}>Email</Label>
              <Input
                id={id("email")}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                invalid={Boolean(errors.email)}
                {...register("email", {
                  required: "Please enter your email.",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message: "That email doesn't look right." }
                })}
              />
              <FieldError>{errors.email?.message}</FieldError>
            </div>
          </div>

          <Button type="submit" variant="dark" size="lg" className="w-full">
            Continue to payment
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {step === 1 && service && (
        <div className="mt-6 grid gap-5">
          <div className="rounded-2xl bg-sage-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-xl font-semibold leading-tight">{service.title}</p>
              <button type="button" onClick={() => setStep(0)} className="text-sm font-semibold text-sage-700 underline-offset-4 hover:underline">
                Edit
              </button>
            </div>
            <ul className="mt-2 divide-y divide-line text-sm">
              <SummaryLine icon={CalendarDays}>{formatDate(parseISODate(values.date))}</SummaryLine>
              <SummaryLine icon={Clock3}>{values.time}</SummaryLine>
              <SummaryLine icon={MapPin}>{values.location}</SummaryLine>
              <SummaryLine icon={User}>
                {values.fullName} · {values.phone}
              </SummaryLine>
            </ul>
            <div className="mt-3 flex items-end justify-between border-t border-line pt-3">
              <span className="text-sm text-ink-500">Price</span>
              {service.price ? (
                <span className="text-right">
                  <span className="block text-xs text-ink-500">from</span>
                  <span className="font-display text-2xl font-semibold">{formatCurrency(service.price)}</span>
                </span>
              ) : (
                <span className="font-semibold">Quoted by email</span>
              )}
            </div>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold">How would you like to pay?</legend>
            <div className="grid gap-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <label key={method.id} className="cursor-pointer">
                    <input type="radio" value={method.id} className="peer sr-only" {...register("payment")} />
                    <span className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5 transition peer-checked:[&_.radio-dot]:border-[6px] peer-checked:[&_.radio-dot]:border-sage-700 hover:border-sage-400 peer-checked:border-sage-700 peer-checked:bg-sage-100 peer-focus-visible:ring-2 peer-focus-visible:ring-sage-700">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sage-200 text-sage-900">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">{method.title}</span>
                        <span className="block text-sm text-ink-500">{method.copy}</span>
                      </span>
                      <span className="radio-dot grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-ink-300 bg-white" aria-hidden="true" />
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {status === "error" && (
            <p role="alert" className="flex items-start gap-2 rounded-2xl bg-danger-50 p-3 text-sm font-medium text-danger-600">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              Sorry — we couldn't send your booking. Please check your connection and try again.
            </p>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="w-14 shrink-0 px-0" onClick={() => setStep(0)} aria-label="Back to details">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button type="submit" variant="dark" size="lg" className="flex-1" disabled={status === "sending"} aria-busy={status === "sending"}>
              {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
              {status === "sending" ? "Sending…" : "Confirm booking"}
            </Button>
          </div>
          <p className="-mt-2 text-center text-xs text-ink-500">The final amount is confirmed with you by email.</p>
        </div>
      )}

      {mapOpen && (
        <Suspense fallback={null}>
          <MapPicker initial={pin} onSelect={onMapSelect} onClose={closeMap} />
        </Suspense>
      )}
    </form>
  );
}
