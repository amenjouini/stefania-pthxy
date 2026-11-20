import emailjs from "@emailjs/browser";
import { formatCurrency, formatDate } from "@/lib/utils";

const TO_EMAIL = "amen.jouini18@gmail.com";

export async function sendBookingEmail(booking) {
  const payload = {
    to_email: TO_EMAIL,
    subject: `New PHTXY booking: ${booking.service?.title}`,
    service: booking.service?.title,
    service_category: booking.service?.category,
    price_estimate: booking.service?.price ? formatCurrency(booking.service.price) : "To be quoted",
    delivery_estimate: booking.service?.delivery,
    session_date: formatDate(booking.date),
    session_time: booking.time || "Not required",
    location: booking.location || "Remote / To be confirmed",
    duration: booking.duration || booking.service?.duration,
    customer_name: booking.customer?.fullName,
    customer_email: booking.customer?.email,
    customer_phone: booking.customer?.phone,
    notes: booking.customer?.notes || "No notes supplied",
    payment_method: booking.payment,
    order_summary: JSON.stringify(
      {
        service: booking.service,
        schedule: {
          date: formatDate(booking.date),
          time: booking.time,
          location: booking.location,
          duration: booking.duration
        },
        customer: booking.customer,
        payment: booking.payment
      },
      null,
      2
    )
  };

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.info("EmailJS keys missing. Add them to .env. Prepared booking payload:", payload);
    return { simulated: true, payload };
  }

  return emailjs.send(serviceId, templateId, payload, { publicKey });
}
