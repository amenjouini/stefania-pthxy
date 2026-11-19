# PHTXY

Photography booking site — weddings, portraits, fashion, events, products and editing. Built with React, Vite, Tailwind CSS, Framer Motion, React Router, React Hook Form, Lucide Icons, React Day Picker and EmailJS.

## Run locally

```bash
npm install
npm run dev
```

## Structure

| Route | Page |
| --- | --- |
| `/` | Home: hero with quick-book bar, services, recent work, how booking works, testimonials |
| `/services` | Services & prices |
| `/portfolio` | Filterable gallery (`?category=Weddings`) with lightbox |
| `/achievements` | About & awards |
| `/booking` | Booking request flow (`?service=<id>&date=YYYY-MM-DD` pre-fill it) |
| `/admin` | Studio dashboard (demo data, linked from the footer) |

Content (services, prices, portfolio, testimonials, awards) lives in `src/data/mockData.js`.
Design tokens (colors, fonts, shadows) live in `tailwind.config.js`.

## Booking flow

1. **Service** — skipped when a service is passed in the URL. Includes an optional 5-question "help me choose" quiz.
2. **Date & place** — only for photo sessions; remote editing services skip it.
3. **Your details** — name and email required; phone, notes and payment preference optional.

No payment is taken online. The request is emailed to the studio through `src/lib/email.js`.

## EmailJS setup

Copy `.env.example` to `.env` and add your EmailJS keys:

```bash
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

If the keys are missing, the app simulates success and logs the prepared payload for local development.
If sending fails, the customer sees an error and can retry.

## Deployment

`vercel.json` rewrites all routes to `index.html` so deep links like `/booking?service=wedding-coverage` work.
