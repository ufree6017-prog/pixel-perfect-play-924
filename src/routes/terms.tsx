import { createFileRoute } from "@tanstack/react-router";

import { PageIntro, SiteLayout } from "@/components/site/SiteLayout";
import { brand, pricingPlaceholders } from "@/lib/brand";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: `Terms & conditions — ${brand.name}` },
      {
        name: "description",
        content:
          "Terms governing bookings, fares, tolls and state taxes, prohibited goods, driver obligations and liability limits for goods transport bookings.",
      },
      { property: "og:title", content: `Terms & conditions — ${brand.name}` },
      {
        property: "og:description",
        content: "The terms that govern bookings, fares, liability and prohibited goods.",
      },
    ],
  }),
  component: TermsPage,
});

const sections = [
  {
    title: "1. What we do",
    body: `${brand.name} is a technology marketplace that connects customers who need goods moved with independent truck owners and drivers. We do not own the vehicles and we are not a common carrier. The transport contract is between you and the driver, facilitated by us.`,
  },
  {
    title: "2. Fares and estimates",
    body: `Fares shown before booking are estimates based on the planned distance, the vehicle category and the add-ons you select. Tolls, state entry taxes, permits, parking and waiting charges are billed extra at actuals and are never included in the estimate.`,
  },
  {
    title: "3. Booking and cancellation",
    body: `A booking is confirmed once a driver is assigned. Cancellation is free within ${pricingPlaceholders.freeCancellationMinutes} minutes of confirmation. After that a cancellation fee of ₹${pricingPlaceholders.cancellationFee} applies. Repeated cancellations may restrict your account.`,
  },
  {
    title: "4. Goods you may not book",
    body: "Hazardous, explosive, inflammable, radioactive, perishable-without-cold-chain, illegal, smuggled, live animal and human remains consignments are not accepted. Cash, jewellery, bullion and negotiable instruments must not be handed to a driver.",
  },
  {
    title: "5. Your responsibilities",
    body: "You must declare the true nature, weight and value of the goods, arrange packing suitable for road transport, hold a valid e-way bill where the law requires one, and ensure someone is available at pickup and delivery.",
  },
  {
    title: "6. Loading, unloading and helpers",
    body: `Drivers are not obliged to load or unload. A loading helper can be added at booking for a flat fee of ₹${pricingPlaceholders.loadingHelperFee}. Any labour you arrange yourself is at your own risk.`,
  },
  {
    title: "7. Insurance and liability",
    body: "Transit insurance is optional and priced on the declared goods value. Without it, liability for loss or damage is limited to the amounts prescribed under applicable Indian law and our published policy. We are not liable for indirect or consequential loss, or for delay caused by traffic, weather, strikes, checkposts or force majeure.",
  },
  {
    title: "8. Payments and invoicing",
    body: "You may pay online or pay the driver directly, as selected at booking. GST invoices for business bookings are issued against proof of delivery, using the GSTIN and e-way bill details you provide.",
  },
  {
    title: "9. Driver terms",
    body: "Drivers must maintain a valid licence, registration certificate, fitness and insurance, keep documents current in the app, follow all road and load regulations, and maintain the wallet balance needed to accept trips. Platform commission is deducted per completed trip.",
  },
  {
    title: "10. Changes and governing law",
    body: "We may update these terms as the service evolves; the version shown at the time of your booking applies to that booking. These terms are governed by Indian law and disputes are subject to the exclusive jurisdiction of the courts at our registered office.",
  },
];

function TermsPage() {
  return (
    <SiteLayout>
      <PageIntro
        eyebrow="Legal"
        title="Terms & conditions"
        description="Please read these terms before booking a vehicle or registering as a driver."
      />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}. This is
          placeholder legal copy for the demo build and must be reviewed by counsel before launch.
        </p>
        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
