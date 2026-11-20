import { useLocation, useSearchParams } from "react-router-dom";
import { BookingForm } from "@/components/booking/BookingForm";

/** Standalone booking page — handy for Instagram bio links (/booking?service=wedding-coverage). */
export default function Booking() {
  const { search } = useLocation();
  const [params] = useSearchParams();
  return (
    <div className="container max-w-xl pb-24 pt-8 md:pt-14">
      <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Book a session</h1>
      <p className="mt-2 text-lg text-ink-500">Choose your event, date and place. It takes about two minutes.</p>
      <div className="mt-6 rounded-3xl border border-line bg-white p-5 shadow-soft sm:p-7">
        <BookingForm key={search} defaultServiceId={params.get("service")} defaultDate={params.get("date") || ""} />
      </div>
    </div>
  );
}
