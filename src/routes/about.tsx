import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, HeartHandshake, Map, Users } from "lucide-react";

import { PageIntro, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/brand";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About ${brand.name} — a trucking marketplace built for India` },
      {
        name: "description",
        content:
          "We connect shippers with verified truck owners across 96 cities, with transparent pricing, driver-first payouts and GST-ready invoicing for business freight.",
      },
      { property: "og:title", content: `About ${brand.name}` },
      {
        property: "og:description",
        content:
          "A trucking marketplace connecting shippers with verified truck owners across India.",
      },
    ],
  }),
  component: AboutPage,
});

const stats = [
  { label: "Verified drivers", value: "18,400+" },
  { label: "Cities served", value: "96" },
  { label: "Loads moved monthly", value: "3.3 lakh" },
  { label: "Average driver rating", value: "4.7 / 5" },
];

const values = [
  {
    icon: BadgeCheck,
    title: "Verified before the first load",
    body: "Every driver clears licence, RC and insurance checks, and we track document expiry so a lapsed paper never carries your goods.",
  },
  {
    icon: Map,
    title: "Priced in the open",
    body: "You see base fare, distance charge and add-ons separately. Tolls and state taxes are called out as extra, never hidden in a round number.",
  },
  {
    icon: Users,
    title: "Driver-first economics",
    body: "Discounted return-trip loads keep trucks earning on the way home, and payouts, commission and wallet balances stay visible to the driver.",
  },
  {
    icon: HeartHandshake,
    title: "Built for repeat freight",
    body: "Business accounts get e-way bill capture, GST invoices raised against proof of delivery, and a freight desk that knows the route.",
  },
];

function AboutPage() {
  return (
    <SiteLayout>
      <PageIntro
        eyebrow={`About ${brand.name}`}
        title="India moves on trucks. We make that bookable."
        description="Most goods in India still move through phone calls and brokers. We put the same trucks behind an upfront estimate, a verified driver and a trackable trip."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="card-elevated p-6">
              <p className="font-display text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {values.map((value) => (
            <div key={value.title} className="card-elevated p-6">
              <value.icon className="size-6 text-primary" />
              <h2 className="mt-3 text-base font-semibold">{value.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{value.body}</p>
            </div>
          ))}
        </div>

        <div className="surface-hero mt-12 rounded-xl p-8">
          <h2 className="text-2xl font-bold">Own a truck? Put it to work.</h2>
          <p className="mt-2 max-w-2xl text-sm opacity-85">
            Register your vehicle, clear verification once, and start receiving city loads and
            discounted return trips with earnings you can see trip by trip.
          </p>
          <Button asChild variant="secondary" className="mt-6">
            <Link to="/auth" search={{ mode: "driver" }}>
              Register as a driver
            </Link>
          </Button>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          Registered GSTIN {brand.gstin}. Company details, registered address and insurance partner
          will be published once finalised.
        </p>
      </section>
    </SiteLayout>
  );
}
