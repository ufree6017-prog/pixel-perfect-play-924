import { createFileRoute } from "@tanstack/react-router";

import { PageIntro, SiteLayout } from "@/components/site/SiteLayout";
import { brand } from "@/lib/brand";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Privacy policy — ${brand.name}` },
      {
        name: "description",
        content:
          "What personal data we collect from customers and drivers, why we collect it, who we share it with, how long we keep it and the rights you have over it.",
      },
      { property: "og:title", content: `Privacy policy — ${brand.name}` },
      {
        property: "og:description",
        content: "How we collect, use, share and protect customer and driver data.",
      },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  {
    title: "Information we collect",
    body: "Customers: name, phone number, email, pickup and drop addresses, goods description and declared value, GSTIN and e-way bill number for business bookings, and payment status. Drivers: name, photo, phone, address, vehicle registration details, driving licence, registration certificate, insurance documents, bank or wallet details and trip history.",
  },
  {
    title: "Why we use it",
    body: "To match your load with a suitable verified driver, calculate and display fares, enable tracking and delivery confirmation, verify driver documents and expiry, prevent fraud and misuse, issue invoices and meet tax obligations, and provide support when something goes wrong.",
  },
  {
    title: "Location data",
    body: "Driver location is used during an active trip to show trip progress and estimated arrival to the customer. Customer addresses are shared with the assigned driver only for that trip.",
  },
  {
    title: "Who we share it with",
    body: "The assigned driver receives the pickup and drop details and your contact number for the trip. We also share data with payment processors, insurance partners where you opt in, verification providers, and government authorities where the law requires it. We do not sell personal data.",
  },
  {
    title: "How long we keep it",
    body: "Booking, invoice and tax records are retained for the period required by Indian tax and company law. Driver verification documents are retained while the account is active and for a limited period afterwards. Support conversations are retained to resolve disputes.",
  },
  {
    title: "Security",
    body: "Access to personal data is restricted to staff who need it, documents are stored in access-controlled storage, and data is transmitted over encrypted connections. No system is perfectly secure, so please report anything suspicious to our support desk.",
  },
  {
    title: "Your rights",
    body: `You can request access to your data, correction of inaccurate details, deletion of data we are not obliged to retain, and withdrawal of consent for optional processing. Write to ${brand.supportEmail} and we will respond within a reasonable period.`,
  },
  {
    title: "Cookies and analytics",
    body: "We use cookies and similar technologies to keep you signed in, remember preferences and understand how the site is used so we can improve it. You can clear or block cookies in your browser, though some features may stop working.",
  },
];

function PrivacyPage() {
  return (
    <SiteLayout>
      <PageIntro
        eyebrow="Legal"
        title="Privacy policy"
        description="What we collect, why we collect it, and the control you have over it."
      />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}. Placeholder
          copy for the demo build; a final policy will be published before launch.
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
