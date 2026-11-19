import { CalendarDays, Camera, CircleDollarSign, Settings2, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { dashboard, services } from "@/data/mockData";

function MiniChart() {
  const max = Math.max(...dashboard.chart);
  const points = dashboard.chart
    .map((value, index) => {
      const x = (index / (dashboard.chart.length - 1)) * 100;
      const y = 100 - (value / max) * 92;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-56 w-full overflow-visible" role="img" aria-label="Monthly booking value, trending upward over 12 months">
      <polygon fill="#E9F6F3" points={`0,100 ${points} 100,100`} />
      <polyline fill="none" stroke="#0F766E" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

const statusColor = {
  Confirmed: "bg-lagoon-50 text-lagoon-700",
  Planning: "bg-sun-100 text-ink",
  "Deposit Paid": "bg-sky-50 text-ink"
};

function PanelTitle({ icon: Icon, eyebrow, title }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        {eyebrow ? <p className="text-sm font-medium text-ink-500">{eyebrow}</p> : null}
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
      </div>
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-coral-50 text-coral-600">
        <Icon className="h-5 w-5" />
      </span>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="pb-20 pt-8 md:pt-12">
      <section className="container">
        <p className="eyebrow">Studio dashboard</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">Overview</h1>
        <p className="mt-2 text-ink-500">Sample analytics, bookings, customers and services (demo data).</p>
      </section>

      <section className="container mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {dashboard.metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent>
              <p className="text-sm text-ink-500">{metric.label}</p>
              <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
                <p className="font-display text-3xl font-semibold md:text-4xl">{metric.value}</p>
                <span className="rounded-full bg-lagoon-50 px-2.5 py-1 text-xs font-semibold text-lagoon-700">{metric.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="container mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)]">
        <Card>
          <CardContent>
            <PanelTitle icon={CircleDollarSign} eyebrow="Revenue" title="Monthly booking value" />
            <div className="mt-6">
              <MiniChart />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <PanelTitle icon={CalendarDays} eyebrow="Calendar" title="This month" />
            <div className="mt-6 grid grid-cols-7 gap-1.5">
              {Array.from({ length: 35 }, (_, index) => (
                <div
                  key={index}
                  className={`grid aspect-square place-items-center rounded-xl text-xs font-medium ${
                    [3, 8, 13, 20, 27].includes(index) ? "bg-coral-600 text-white" : "bg-cream text-ink-500"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <PanelTitle icon={Camera} title="Bookings" />
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="text-ink-500">
                  <tr>
                    <th className="pb-3 font-medium">Client</th>
                    <th className="pb-3 font-medium">Service</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 text-right font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.bookings.map((booking) => (
                    <tr key={booking.client} className="border-t border-line">
                      <td className="py-3.5 font-semibold">{booking.client}</td>
                      <td className="py-3.5 text-ink-700">{booking.service}</td>
                      <td className="py-3.5 text-ink-700">{booking.date}</td>
                      <td className="py-3.5">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor[booking.status] || "bg-cream"}`}>{booking.status}</span>
                      </td>
                      <td className="py-3.5 text-right font-semibold">{booking.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-4">
          <Card>
            <CardContent>
              <PanelTitle icon={Users} title="Customers" />
              <ul className="mt-5 grid gap-2">
                {dashboard.customers.map((customer) => (
                  <li key={customer} className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3 text-sm font-medium">
                    {customer}
                    <span className="h-2 w-2 rounded-full bg-lagoon-400" />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <PanelTitle icon={Settings2} title="Services" />
              <ul className="mt-5 grid gap-2">
                {services.map((service) => (
                  <li key={service.id} className="flex items-center justify-between rounded-2xl bg-cream px-4 py-3 text-sm">
                    <span className="font-medium">{service.title}</span>
                    <span className="text-ink-500">${service.price.toLocaleString("en-US")}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
