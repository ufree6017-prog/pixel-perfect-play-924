import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Clock,
  IndianRupee,
  MapPin,
  ReceiptText,
  ShieldCheck,
  Truck,
} from "lucide-react";

import heroTruck from "@/assets/hero-truck.jpg";
import { PageIntro, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { brand } from "@/lib/brand";
import { mockVehicleCategories } from "@/lib/mock/vehicles";
import { formatINR } from "@/lib/fare";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${brand.name} — Book a truck for shifting & freight in India` },
      {
        name: "description",
        content:
          "Book a tempo, Chota Hathi, pickup, Eicher or container in minutes. Intracity shifting and intercity freight across India with verified drivers and upfront estimates.",
      },
      { property: "og:title", content: `${brand.name} — Trucks on demand across India` },
      {
        property: "og:description",
        content:
          "Intracity shifting and intercity freight with verified drivers, upfront estimates and live tracking.",
      },
    ],
  }),
  component: Home,
});

const trustPoints = [
  {
    icon: BadgeCheck,
    title: "Verified drivers only",
    body: "Licence, RC and insurance checked before a driver can accept a load.",
  },
  {
    icon: IndianRupee,
    title: "Upfront estimate",
    body: "See the fare before you book. Tolls and state taxes are always shown separately.",
  },
  {
    icon: ShieldCheck,
    title: "Optional transit cover",
    body: "Add insurance on your declared goods value at checkout.",
  },
  {
    icon: ReceiptText,
    title: "GST invoicing for business",
    body: "E-way bill capture and GST invoices for bulk and intercity freight.",
  },
];

function Home() {
  const intracity = mockVehicleCategories.filter((v) => v.segment === "intracity").slice(0, 4);

  return (
    <SiteLayout>
      <section className="surface-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              <Truck className="size-3.5" /> Intracity &amp; intercity · Pan-India
            </p>
            <h1 className="mt-5 text-3xl font-bold leading-tight md:text-5xl">
              Book a truck in minutes. Shift a home or move a full load.
            </h1>
            <p className="mt-4 max-w-xl text-sm opacity-85 md:text-base">
              Mini trucks and tempos for city shifting and raw material, containers and trailers for
              long-haul freight. Fixed estimate before you book, live tracking after.
            </p>

            <Card className="mt-8 border-0 shadow-lift">
              <CardContent className="p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      className="text-xs font-semibold text-muted-foreground"
                      htmlFor="home-pickup"
                    >
                      Pickup
                    </label>
                    <div className="mt-1 flex items-center gap-2 rounded-md border border-input px-3">
                      <MapPin className="size-4 text-primary" />
                      <Input
                        id="home-pickup"
                        placeholder="Area, city"
                        className="border-0 px-0 shadow-none focus-visible:ring-0"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="text-xs font-semibold text-muted-foreground"
                      htmlFor="home-drop"
                    >
                      Drop
                    </label>
                    <div className="mt-1 flex items-center gap-2 rounded-md border border-input px-3">
                      <MapPin className="size-4 text-accent" />
                      <Input
                        id="home-drop"
                        placeholder="Area, city"
                        className="border-0 px-0 shadow-none focus-visible:ring-0"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="lg" className="flex-1">
                    <Link to="/book" search={{}}>
                      Get fare estimate <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/business">
                      <Building2 className="mr-2 size-4" /> Bulk / business load
                    </Link>
                  </Button>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Estimates exclude tolls and state taxes. Free cancellation within 5 minutes.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <img
              src={heroTruck}
              alt="Loaders placing cartons into a small goods carrier truck on an Indian city street"
              width={1600}
              height={1104}
              className="w-full rounded-2xl object-cover shadow-lift"
            />
            <div className="absolute bottom-4 left-4 rounded-xl bg-card/95 px-4 py-3 text-card-foreground shadow-card">
              <p className="text-xs text-muted-foreground">Live now</p>
              <p className="text-sm font-semibold">18,400+ verified drivers across 96 cities</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Pick the right vehicle</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Instant booking covers small and medium city loads. Containers and trailers are quoted
              through our business desk.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/vehicles">See all vehicles &amp; rates</Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {intracity.map((vehicle) => (
            <Card key={vehicle.id} className="h-full">
              <CardContent className="p-5">
                <Truck className="size-6 text-primary" />
                <h3 className="mt-3 text-base font-semibold">{vehicle.name}</h3>
                {vehicle.localName ? (
                  <p className="text-xs text-muted-foreground">{vehicle.localName}</p>
                ) : null}
                <p className="mt-2 text-sm text-muted-foreground">{vehicle.capacityLabel}</p>
                <p className="mt-3 text-sm font-semibold text-primary">
                  From {formatINR(vehicle.baseFare)} + {formatINR(vehicle.perKmRate)}/km
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{vehicle.bestFor}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold md:text-3xl">Built for how India moves goods</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((point) => (
              <div key={point.title} className="card-elevated p-5">
                <point.icon className="size-6 text-primary" />
                <h3 className="mt-3 text-base font-semibold">{point.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-3">
        <div className="card-elevated p-6 lg:col-span-2">
          <h2 className="text-2xl font-bold">Three steps, no phone calls</h2>
          <ol className="mt-5 grid gap-5 sm:grid-cols-3">
            {[
              { step: "01", title: "Enter pickup & drop", body: "We show distance and a fare estimate instantly." },
              { step: "02", title: "Choose your vehicle", body: "Add a loading helper or transit insurance if needed." },
              { step: "03", title: "Track till delivery", body: "Share the pickup OTP with the driver and follow the trip." },
            ].map((item) => (
              <li key={item.step}>
                <span className="font-display text-2xl font-bold text-accent">{item.step}</span>
                <h3 className="mt-1 text-base font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ol>
          <Button asChild className="mt-6">
            <Link to="/how-it-works">Read the full process</Link>
          </Button>
        </div>

        <div className="surface-hero flex flex-col justify-between rounded-xl p-6">
          <div>
            <Clock className="size-6 text-accent" />
            <h2 className="mt-3 text-xl font-bold">Drive with {brand.name}</h2>
            <p className="mt-2 text-sm opacity-85">
              Get city loads and discounted return trips on your way home. Wallet, commission and
              payouts all visible in one place.
            </p>
          </div>
          <Button asChild variant="secondary" className="mt-6 w-full">
            <Link to="/auth" search={{ mode: "driver" }}>
              Register as a driver
            </Link>
          </Button>
        </div>
      </section>

      <PageIntro
        eyebrow="Business freight"
        title="Regular loads, credit terms and GST invoices"
        description="Tell us your route and monthly volume. Our freight desk quotes containers, flatbeds and trailers, captures your e-way bill and issues GST invoices against POD."
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Button asChild size="lg">
          <Link to="/business">Raise a business enquiry</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}
