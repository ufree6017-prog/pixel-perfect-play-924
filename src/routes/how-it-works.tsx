import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardCheck, MapPin, PackageCheck, ShieldCheck, Truck, Wallet } from "lucide-react";

import { PageIntro, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { brand, pricingPlaceholders } from "@/lib/brand";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: `How booking a truck works — ${brand.name}` },
      {
        name: "description",
        content:
          "From pickup and drop entry to fare estimate, driver assignment, pickup OTP and delivery proof — see exactly how a truck booking works step by step.",
      },
      { property: "og:title", content: `How it works — ${brand.name}` },
      {
        property: "og:description",
        content:
          "Enter pickup and drop, pick a vehicle, confirm with a clear estimate, share the pickup OTP and track till delivery.",
      },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  {
    icon: MapPin,
    title: "Enter pickup and drop",
    body: "We calculate the trip distance and show an estimate before you commit. Tolls and state taxes are always shown as extra, never bundled into the estimate.",
  },
  {
    icon: Truck,
    title: "Choose a vehicle",
    body: "Tempos and mini trucks for city loads, containers and trailers for long-haul freight. Each option lists capacity and what it is best suited to carry.",
  },
  {
    icon: ClipboardCheck,
    title: "Add what you need",
    body: "Request a loading helper, add transit insurance on your declared goods value, and enter an e-way bill number for business consignments.",
  },
  {
    icon: ShieldCheck,
    title: "Driver assigned",
    body: "You see the driver's name, photo, vehicle number and rating along with an arrival estimate before the trip starts.",
  },
  {
    icon: Wallet,
    title: "Pay your way",
    body: "Pay online or pay the driver directly at delivery. Business accounts get a GST invoice raised against proof of delivery.",
  },
  {
    icon: PackageCheck,
    title: "Track till delivery",
    body: "Share the pickup OTP with the driver, follow each status change, and download your invoice once the trip is delivered.",
  },
];

function HowItWorks() {
  return (
    <SiteLayout>
      <PageIntro
        eyebrow="How it works"
        title="Six steps from enquiry to delivered load"
        description="No phone calls, no haggling. Everything from the estimate to proof of delivery happens in one place."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title} className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <step.icon className="size-5" />
                  </span>
                  <span className="font-display text-2xl font-bold text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h2 className="mt-4 text-base font-semibold">{step.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold md:text-3xl">Good to know before you book</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="card-elevated p-5">
              <h3 className="text-base font-semibold">Free cancellation window</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Cancel free within {pricingPlaceholders.freeCancellationMinutes} minutes of booking.
                After that a ₹{pricingPlaceholders.cancellationFee} fee applies to cover the
                driver&apos;s trip to your pickup point.
              </p>
            </div>
            <div className="card-elevated p-5">
              <h3 className="text-base font-semibold">Tolls and state taxes</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Intercity trips cross state borders. Tolls, permits and state entry taxes are billed
                at actuals on top of the fare estimate.
              </p>
            </div>
            <div className="card-elevated p-5">
              <h3 className="text-base font-semibold">Loading and unloading</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Drivers drive. Add a loading helper for a flat ₹
                {pricingPlaceholders.loadingHelperFee} if you need hands for lifting at either end.
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="mt-8">
            <Link to="/book">Get a fare estimate</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
