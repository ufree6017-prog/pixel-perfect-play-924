import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, CheckCircle2, PackageCheck, Percent, ReceiptText } from "lucide-react";
import { toast } from "sonner";

import { PageIntro, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { brand } from "@/lib/brand";
import { vehiclesForFlow } from "@/lib/mock/vehicles";

export const Route = createFileRoute("/business")({
  head: () => ({
    meta: [
      { title: `Business & bulk freight enquiry — ${brand.name}` },
      {
        name: "description",
        content:
          "Containers, flatbeds and 40ft trailers for regular FTL freight, with GST invoices, POD tracking and return-load pricing.",
      },
      { property: "og:title", content: `Business & bulk freight — ${brand.name}` },
      {
        property: "og:description",
        content:
          "Tell us your routes and monthly volumes. Our freight team responds with a rate proposal.",
      },
    ],
  }),
  component: BusinessPage,
});

const benefits = [
  {
    icon: PackageCheck,
    title: "FTL capacity on demand",
    body: "20ft and 32ft containers, open flatbeds and 40ft trailers across major corridors.",
  },
  {
    icon: ReceiptText,
    title: "GST invoicing with POD",
    body: "Invoices are raised against the uploaded Proof of Delivery for every trip.",
  },
  {
    icon: Percent,
    title: "Return-load pricing",
    body: "Empty-return legs are offered at a discount, so recurring routes cost less.",
  },
  {
    icon: Building2,
    title: "Dedicated account desk",
    body: "One point of contact for allocations, escalations and monthly reconciliation.",
  },
];

function BusinessPage() {
  const [submitted, setSubmitted] = useState(false);
  const businessVehicles = vehiclesForFlow("business");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    toast.success("Enquiry received — our freight desk will call you.");
  }

  return (
    <SiteLayout>
      <PageIntro
        eyebrow="For business"
        title="Bulk and contract freight across India"
        description="Share your routes, load type and monthly volumes. We map available capacity and come back with indicative rates."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Tell us about your freight</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="rounded-lg border border-success/30 bg-success/10 p-6 text-center">
                  <CheckCircle2 className="mx-auto size-10 text-success" />
                  <h3 className="mt-3 text-lg font-semibold">Enquiry submitted</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    A demo confirmation — nothing is sent yet in this build. In the live product our
                    freight desk responds within one working day on {brand.supportPhone}.
                  </p>
                  <Button className="mt-5" variant="outline" onClick={() => setSubmitted(false)}>
                    Submit another enquiry
                  </Button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company name</Label>
                      <Input id="companyName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact person</Label>
                      <Input id="contactName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bizPhone">Mobile number</Label>
                      <Input id="bizPhone" required placeholder="+91 90000 00000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bizEmail">Work email</Label>
                      <Input id="bizEmail" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="route">Main route</Label>
                      <Input id="route" required placeholder="Morbi → Pune" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gstin">GSTIN (optional)</Label>
                      <Input id="gstin" placeholder="27AAAAA0000A1Z5" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Monthly loads</Label>
                      <Select defaultValue="5–10 loads / month">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["1–5 loads / month", "5–10 loads / month", "20–40 loads / month", "40+ loads / month"].map(
                            (option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Vehicle needed</Label>
                      <Select defaultValue={businessVehicles[0]?.id ?? ""}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {businessVehicles.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.name} · {vehicle.capacityLabel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">What are you moving?</Label>
                    <Textarea id="message" rows={4} placeholder="Goods type, packaging, loading support needed, credit terms…" />
                  </div>

                  <Button type="submit" size="lg" className="w-full sm:w-auto">
                    Submit enquiry
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Tolls, state taxes and permits are billed separately on all bulk movements.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            {benefits.map((benefit) => (
              <Card key={benefit.title}>
                <CardContent className="flex gap-4 pt-6">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <benefit.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{benefit.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{benefit.body}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="surface-amber">
              <CardContent className="pt-6">
                <p className="text-sm font-semibold">Talk to the freight desk</p>
                <p className="mt-1 text-sm">
                  {brand.supportPhone} · {brand.supportEmail}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
