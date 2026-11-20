# PHTXY

Photography booking site — weddings, portraits, events, brands and editing. Built with React, Vite, Tailwind CSS, Framer Motion, React Router, React Hook Form, Lucide Icons and EmailJS.

## Run locally

```bash
npm install
npm run dev
```

## Structure

| Route | Page |
| --- | --- |
| `/` | Short intro, recent work, and the booking section right under the work |
| `/portfolio` | Full gallery, filterable (`?category=Weddings`), with lightbox |
| `/services` | Services & starting prices |
| `/about` | About, approach, testimonials (`/achievements` redirects here) |
| `/booking` | Standalone booking page (`?service=<id>&date=YYYY-MM-DD` pre-fill it) |
| `/admin` | Studio dashboard (demo data, linked from the footer) |

A floating **Book a session** button opens the booking panel from any page. It hides while an on-page booking button or the home booking section is visible (elements marked `data-hide-floating`).

Content (services, prices, portfolio, testimonials) lives in `src/data/mockData.js`.
Colors (built around the brand sage `#C1D9B6` = `sage-200`) and fonts live in `tailwind.config.js`.

## Booking flow

One form (`src/components/booking/BookingForm.jsx`), used in the panel, the home section and `/booking`:

1. **Details** — type of event, date, time, location, name, phone, email (all required).
2. **Payment** — summary with price, then choice of payment method → **Confirm booking**.

The booking is emailed to the studio through `src/lib/email.js`.

## Environment

Copy `.env.example` to `.env`:

```bash
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# Optional: hosted checkout link (Stripe Payment Link, PayPal, …)
VITE_PAYMENT_LINK=
```

- Without EmailJS keys, the app simulates success and logs the payload (local development).
- Without `VITE_PAYMENT_LINK`, the payment step offers bank transfer and cash on the day. With it, "Pay online by card" is added and the confirmation screen shows a **Pay now securely** button that opens the checkout.

## Deployment

`vercel.json` rewrites all routes to `index.html` so deep links work.
