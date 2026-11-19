import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="font-display text-7xl font-semibold text-coral-500">404</p>
        <h1 className="mt-3 font-display text-3xl font-semibold">This page is out of frame.</h1>
        <p className="mt-2 text-ink-500">The link may be old or mistyped.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/booking">Book a session</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/">Go to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
