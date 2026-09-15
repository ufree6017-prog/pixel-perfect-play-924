import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageIntro, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { brand, pricingPlaceholders } from "@/lib/brand";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact & support — ${brand.name}` },
      {
        name: "description",
        content:
          "Call, email or message our support desk about a live trip, a fare query, an invoice or driver onboarding. Answers to the most common questions too.",
      },
      { property: "og:title", content: `Contact & support — ${brand.name}` },
      {
        property: "og:description",
        content: "Reach our support desk about a trip, a fare, an invoice or driver onboarding.",
      },
    ],
  }),
  component: ContactPage,
});

const faqs = [
  {
    q: "Why is my final fare different from the estimate?",
    a: "The estimate uses the planned distance. If the route changes, waiting time runs long, or tolls and state taxes apply, those are added at actuals on the final bill.",
  },
  {
    q: "Can I cancel after booking?",
    a: `Yes. Cancellation is free within ${pricingPlaceholders.freeCancellationMinutes} minutes. After that a ₹${pricingPlaceholders.cancellationFee} fee applies because a driver has already started towards your pickup.`,
  },
  {
    q: "Do you provide loading and unloading labour?",
    a: `Add the loading helper option at checkout for a flat ₹${pricingPlaceholders.loadingHelperFee}. Without it, the driver is not expected to lift your goods.`,
  },
  {
    q: "How do I get a GST invoice?",
    a: "Business bookings capture your GSTIN and e-way bill number. Once proof of delivery is uploaded, the GST invoice becomes available to download from your trip.",
  },
];

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <SiteLayout>
      <PageIntro
        eyebrow="Contact & support"
        title="Talk to a human about your load"
        description="Live trip issues get priority. For anything commercial, our freight desk can quote routes and credit terms."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card-elevated p-5">
              <Phone className="size-5 text-primary" />
              <h2 className="mt-3 text-sm font-semibold">Support helpline</h2>
              <p className="mt-1 text-sm text-muted-foreground">{brand.supportPhone}</p>
            </div>
            <div className="card-elevated p-5">
              <Mail className="size-5 text-primary" />
              <h2 className="mt-3 text-sm font-semibold">Email us</h2>
              <p className="mt-1 break-all text-sm text-muted-foreground">{brand.supportEmail}</p>
            </div>
            <div className="card-elevated p-5">
              <MessageSquare className="size-5 text-primary" />
              <h2 className="mt-3 text-sm font-semibold">Live chat</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Use the Help button at the bottom right of any page.
              </p>
            </div>
            <div className="card-elevated p-5">
              <Clock className="size-5 text-primary" />
              <h2 className="mt-3 text-sm font-semibold">Hours</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Trip support 24×7. Freight desk 9 AM – 8 PM, Mon to Sat.
              </p>
            </div>
          </div>

          <h2 className="mt-10 text-xl font-bold">Common questions</h2>
          <Accordion type="single" collapsible className="mt-3">
            {faqs.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger className="text-left text-sm">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <Card className="h-fit">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Send us a message</h2>
            {sent ? (
              <div className="mt-4 rounded-lg bg-success/10 p-5 text-sm">
                <p className="font-semibold text-success">Message received</p>
                <p className="mt-1 text-muted-foreground">
                  Our support desk will reply on your email or phone. Reference numbers help — keep
                  your booking ID handy.
                </p>
                <Button variant="outline" className="mt-4" onClick={() => setSent(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form
                className="mt-4 space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSent(true);
                  toast.success("Message sent to support");
                }}
              >
                <div>
                  <Label htmlFor="contact-name">Your name</Label>
                  <Input id="contact-name" required className="mt-1" placeholder="Full name" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="contact-phone">Phone</Label>
                    <Input
                      id="contact-phone"
                      required
                      className="mt-1"
                      placeholder="+91 90000 00000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      required
                      className="mt-1"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contact-booking">Booking reference (optional)</Label>
                  <Input id="contact-booking" className="mt-1" placeholder="TS-24881" />
                </div>
                <div>
                  <Label htmlFor="contact-message">How can we help?</Label>
                  <Textarea id="contact-message" required rows={5} className="mt-1" />
                </div>
                <Button type="submit" className="w-full">
                  Send message
                </Button>
                <p className="text-xs text-muted-foreground">
                  This form is a demo and does not yet reach a live inbox.
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
