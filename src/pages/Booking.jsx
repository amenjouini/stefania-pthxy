import { useLocation } from "react-router-dom";
import { BookingFlow } from "@/components/booking/BookingFlow";

export default function Booking() {
  const { search } = useLocation();
  return (
    <div className="container pb-32 pt-6 md:pb-24 md:pt-10">
      <header className="mb-6 max-w-2xl md:mb-8">
        <p className="eyebrow">Book a session</p>
        <h1 className="mt-2 font-display text-[2.1rem] font-semibold leading-tight tracking-tight sm:text-5xl">Let's plan your photos.</h1>
        <p className="mt-2 text-ink-500 md:text-lg">A short request — no payment, no commitment until we confirm with you.</p>
      </header>
      {/* Re-mount when the query changes (e.g. arriving from another "Book" link) */}
      <BookingFlow key={search} />
    </div>
  );
}
