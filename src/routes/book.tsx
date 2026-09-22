import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Download, Info, MapPin, Star } from "lucide-react";
import { toast } from "sonner";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { brand, pricingPlaceholders } from "@/lib/brand";
import { estimateFare, formatINR, mockDistanceKm, mockDriverEtaMinutes } from "@/lib/fare";
import { mockCurrentDriver } from "@/lib/mock/drivers";
import { vehiclesForFlow } from "@/lib/mock/vehicles";
import type { BookingFlow, PaymentMethod } from "@/lib/mock/types";

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>): { pickup?: string; drop?: string } => {
    const pickup = typeof search["pickup"] === "string" ? search["pickup"] : "";
    const drop = typeof search["drop"] === "string" ? search["drop"] : "";
    return {
      ...(pickup ? { pickup } : {}),
      ...(drop ? { drop } : {}),
    };
  },
  head: () => ({
    meta: [
      { title: `Book a truck — ${brand.name}` },
      {
        name: "description",
        content:
          "Enter pickup and drop, pick a vehicle and see an upfront estimate. Add a loading helper or transit insurance before you confirm.",
      },
      { property: "og:title", content: `Book a truck — ${brand.name}` },
      {
        property: "og:description",
        content: "Upfront estimates, verified drivers and transparent add-ons across India.",
      },
    ],
  }),
  component: BookPage,
});

type Step = 1 | 2 | 3 | 4;

function BookPage() {
  const search = Route.useSearch();
  const [step, setStep] = useState<Step>(1);
  const [flow, setFlow] = useState<BookingFlow>("retail");
  const [pickup, setPickup] = useState(search.pickup ?? "");
  const [drop, setDrop] = useState(search.drop ?? "");
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [helperRequested, setHelperRequested] = useState(false);
  const [insuranceOptedIn, setInsuranceOptedIn] = useState(false);
  const [declaredGoodsValue, setDeclaredGoodsValue] = useState("50000");
  const [eWayBillNumber, setEWayBillNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [reference] = useState(() => `TS-${Math.floor(24900 + Math.random() * 90)}`);

  const vehicles = vehiclesForFlow(flow);
  const vehicle = vehicles.find((item) => item.id === vehicleId) ?? null;
  const distanceKm = useMemo(
    () => (pickup && drop ? mockDistanceKm(pickup, drop) : 0),
    [pickup, drop],
  );

  const fare = vehicle
    ? estimateFare({
        vehicle,
        distanceKm,
        helperRequested,
        insuranceOptedIn,
        declaredGoodsValue: Number(declaredGoodsValue) || 0,
      })
    : null;

  const etaMinutes = pickup ? mockDriverEtaMinutes(pickup) : 8;

  function goToVehicles(event: React.FormEvent) {
    event.preventDefault();
    if (!pickup.trim() || !drop.trim()) {
      toast.error("Add both a pickup and a drop address.");
      return;
    }
    setStep(2);
  }

  return (
    <SiteLayout>
      <section className="surface-hero">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <h1 className="font-display text-3xl font-bold md:text-4xl">Book a truck</h1>
          <p className="mt-2 text-sm opacity-85">
            Estimates below use placeholder rates for this demo. Tolls and state taxes are always
            extra.
          </p>
          <ol className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
            {["Addresses", "Vehicle", "Add-ons & payment", "Confirmed"].map((label, index) => {
              const value = (index + 1) as Step;
              const done = step > value;
              return (
                <li
                  key={label}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${
                    step === value
                      ? "bg-accent text-accent-foreground"
                      : done
                        ? "bg-white/20"
                        : "bg-white/10 opacity-70"
                  }`}
                >
                  {done ? <Check className="size-3.5" /> : <span>{value}</span>}
                  {label}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-14">
        {step === 1 ? (
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Where is the load going?</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={flow} onValueChange={(value) => { setFlow(value as BookingFlow); setVehicleId(null); }}>
                <TabsList className="grid w-full max-w-sm grid-cols-2">
                  <TabsTrigger value="retail">Personal / shop</TabsTrigger>
                  <TabsTrigger value="business">Business / bulk</TabsTrigger>
                </TabsList>
              </Tabs>
              {flow === "business" ? (
                <div className="mt-4 rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm">
                  <p className="font-semibold">Bulk loads are quoted, not instantly booked</p>
                  <p className="mt-1 text-muted-foreground">
                    You can see an indicative estimate for containers, flatbeds and trailers here.
                    Final rates, credit terms and GST invoicing are confirmed by our freight desk.
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-3">
                    <Link to="/business">Request a bulk quote</Link>
                  </Button>
                </div>
              ) : null}
              <form className="mt-6 space-y-4" onSubmit={goToVehicles}>
                <div className="space-y-2">
                  <Label htmlFor="pickup">Pickup address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="pickup"
                      className="pl-9"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      placeholder="Building, area, city"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="drop">Drop address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-accent" />
                    <Input
                      id="drop"
                      className="pl-9"
                      value={drop}
                      onChange={(e) => setDrop(e.target.value)}
                      placeholder="Building, area, city"
                    />
                  </div>
                </div>
                {distanceKm ? (
                  <p className="text-sm text-muted-foreground">
                    Estimated distance: <strong>{distanceKm} km</strong> (mock — no live routing in
                    this build)
                  </p>
                ) : null}
                <Button type="submit" size="lg">
                  See vehicles <ArrowRight className="ml-2 size-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Choose a vehicle</h2>
                <p className="text-sm text-muted-foreground">
                  {pickup} → {drop} · {distanceKm} km
                </p>
              </div>
              <Button variant="outline" onClick={() => setStep(1)}>
                Edit addresses
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {vehicles.map((item) => {
                const quote = estimateFare({
                  vehicle: item,
                  distanceKm,
                  helperRequested: false,
                  insuranceOptedIn: false,
                  declaredGoodsValue: 0,
                });
                const selected = vehicleId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setVehicleId(item.id)}
                    className={`rounded-xl border p-4 text-left transition-colors ${
                      selected ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        {item.localName ? (
                          <p className="text-xs text-muted-foreground">{item.localName}</p>
                        ) : null}
                        <p className="mt-1 text-xs text-muted-foreground">
                          Up to {item.capacityLabel} · {item.bestFor}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-bold">{formatINR(quote.subtotal)}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {formatINR(item.perKmRate)}/km
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Tolls & state taxes extra. Waiting charges apply after the free loading window.
            </p>
            {flow === "business" ? (
              <p className="text-xs text-muted-foreground">
                Indicative bulk rates. For a firm quote with credit terms,{" "}
                <Link to="/business" className="underline">
                  raise a business enquiry
                </Link>
                .
              </p>
            ) : null}
            <Button size="lg" disabled={!vehicle} onClick={() => setStep(3)}>
              Continue <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        ) : null}

        {step === 3 && vehicle && fare ? (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Add-ons</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">Driver helper needed</p>
                      <p className="text-sm text-muted-foreground">
                        Loading and unloading support — flat{" "}
                        {formatINR(pricingPlaceholders.loadingHelperFee)}.
                      </p>
                    </div>
                    <Switch checked={helperRequested} onCheckedChange={setHelperRequested} />
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">Add transit insurance</p>
                        <p className="text-sm text-muted-foreground">
                          {(pricingPlaceholders.insuranceRateOfDeclaredValue * 100).toFixed(1)}% of
                          your declared goods value.
                        </p>
                      </div>
                      <Switch checked={insuranceOptedIn} onCheckedChange={setInsuranceOptedIn} />
                    </div>
                    {insuranceOptedIn ? (
                      <div className="space-y-2">
                        <Label htmlFor="declaredValue">Declared goods value (₹)</Label>
                        <Input
                          id="declaredValue"
                          inputMode="numeric"
                          value={declaredGoodsValue}
                          onChange={(e) => setDeclaredGoodsValue(e.target.value.replace(/\D/g, ""))}
                        />
                      </div>
                    ) : null}
                  </div>
                  {flow === "business" ? (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <Label htmlFor="eway">E-Way Bill number</Label>
                        <Input
                          id="eway"
                          value={eWayBillNumber}
                          onChange={(e) => setEWayBillNumber(e.target.value)}
                          placeholder="1234 5678 9012"
                        />
                        <p className="text-xs text-muted-foreground">
                          Required for taxable consignments above the statutory value.
                        </p>
                      </div>
                    </>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment method</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      { value: "online", title: "Pay online", body: "UPI, card or netbanking" },
                      {
                        value: "pay_driver",
                        title: "Pay the driver directly",
                        body: "Cash or UPI on delivery",
                      },
                    ] as { value: PaymentMethod; title: string; body: string }[]
                  ).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPaymentMethod(option.value)}
                      className={`rounded-lg border p-4 text-left transition-colors ${
                        paymentMethod === option.value
                          ? "border-primary bg-primary/5"
                          : "border-input hover:bg-secondary"
                      }`}
                    >
                      <p className="font-medium">{option.title}</p>
                      <p className="text-xs text-muted-foreground">{option.body}</p>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your driver</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <img
                    src={mockCurrentDriver.photoUrl}
                    alt={`${mockCurrentDriver.name}, verified TruckSetu driver`}
                    className="size-14 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold">{mockCurrentDriver.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.name} · {mockCurrentDriver.vehicleNumber}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm">
                      <Star className="size-4 fill-accent text-accent" /> {mockCurrentDriver.rating}
                      <span className="text-muted-foreground">
                        · arrives in ~{etaMinutes} min
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="card-elevated h-fit lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle>Fare estimate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label={`Base fare (${vehicle.name})`} value={formatINR(fare.baseFare)} />
                <Row
                  label={`Distance ${fare.distanceKm} km × ${formatINR(vehicle.perKmRate)}`}
                  value={formatINR(fare.distanceCharge)}
                />
                {fare.helperFee ? <Row label="Loading helper" value={formatINR(fare.helperFee)} /> : null}
                {fare.insurancePremium ? (
                  <Row label="Transit insurance" value={formatINR(fare.insurancePremium)} />
                ) : null}
                <Separator className="my-3" />
                <div className="flex items-center justify-between text-base font-bold">
                  <span>Estimated total</span>
                  <span>{formatINR(fare.subtotal)}</span>
                </div>
                <Badge variant="outline" className="mt-2 border-accent/40 bg-accent/15 text-accent-foreground">
                  Tolls & State Taxes Extra
                </Badge>
                <p className="flex gap-2 pt-3 text-xs text-muted-foreground">
                  <Info className="size-4 shrink-0" />
                  Free cancellation within {pricingPlaceholders.freeCancellationMinutes} minutes of
                  booking. After that a {formatINR(pricingPlaceholders.cancellationFee)} fee applies.
                </p>
                <Button size="lg" className="mt-4 w-full" onClick={() => setStep(4)}>
                  Confirm booking
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => setStep(2)}>
                  Back to vehicles
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {step === 4 && vehicle && fare ? (
          <Card className="card-elevated mx-auto max-w-2xl text-center">
            <CardContent className="pt-8">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="size-7" />
              </span>
              <h2 className="mt-4 font-display text-2xl font-bold">Booking confirmed</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Reference <strong>{reference}</strong> · {vehicle.name} · {formatINR(fare.subtotal)}{" "}
                (tolls & state taxes extra)
              </p>
              <div className="mt-6 rounded-lg border border-border p-4 text-left text-sm">
                <p className="font-medium">{pickup}</p>
                <p className="text-muted-foreground">→ {drop}</p>
                <p className="mt-3 text-muted-foreground">
                  {mockCurrentDriver.name} · {mockCurrentDriver.vehicleNumber} · arriving in ~
                  {etaMinutes} min
                </p>
                <p className="mt-1 text-muted-foreground">
                  Payment: {paymentMethod === "online" ? "Paid online" : "Pay the driver directly"}
                  {eWayBillNumber ? ` · E-Way Bill ${eWayBillNumber}` : ""}
                </p>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <Link to="/track">Track this load</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => toast.info("Demo build — GST invoice PDFs arrive in a later pass.")}
                >
                  <Download className="mr-2 size-4" /> Download GST invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </section>
    </SiteLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
