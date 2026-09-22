import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Download, MapPin, Phone, Star, Truck } from "lucide-react";
import { toast } from "sonner";

import { SiteLayout } from "@/components/site/SiteLayout";
import { BookingStatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { brand, pricingPlaceholders } from "@/lib/brand";
import { formatINR } from "@/lib/fare";
import { bookingStatusLabels, mockBookings, trackingSequence } from "@/lib/mock/bookings";
import { mockDrivers } from "@/lib/mock/drivers";
import type { BookingStatus } from "@/lib/mock/types";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: `Track your load — ${brand.name}` },
      {
        name: "description",
        content:
          "Follow your booking from driver assigned to delivered, share the delivery OTP and download the GST invoice.",
      },
      { property: "og:title", content: `Track your load — ${brand.name}` },
      {
        property: "og:description",
        content: "Live status, driver details and delivery OTP for your TruckSetu booking.",
      },
    ],
  }),
  component: TrackPage,
});

const activeBookings = mockBookings.filter((booking) => booking.status !== "cancelled");

function TrackPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lookup, setLookup] = useState("");
  const booking = activeBookings.find((item) => item.id === selectedId) ?? activeBookings[0]!;
  const driver = mockDrivers.find((item) => item.id === booking.driverId) ?? mockDrivers[0]!;

  function handleLookup(event: React.FormEvent) {
    event.preventDefault();
    const term = lookup.trim().toLowerCase();
    if (!term) {
      toast.error("Enter your booking ID or the phone number used to book.");
      return;
    }
    const match = activeBookings.find(
      (item) =>
        item.reference.toLowerCase().includes(term) ||
        item.reference.toLowerCase().replace(/[^a-z0-9]/g, "").includes(term.replace(/\D/g, "")),
    );
    if (!match) {
      toast.error("No booking found for that ID or number.");
      return;
    }
    setSelectedId(match.id);
  }

  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    setStatus(booking.status);
    setOtp("");
    setOtpVerified(false);
  }, [booking.id, booking.status]);

  const stepIndex = trackingSequence.indexOf(status);

  // Timer-simulated progress up to "arrived"; the OTP step advances it further.
  useEffect(() => {
    if (stepIndex < 0 || stepIndex >= trackingSequence.indexOf("arrived")) return;
    const timer = setTimeout(() => {
      setStatus(trackingSequence[stepIndex + 1]!);
    }, 6000);
    return () => clearTimeout(timer);
  }, [stepIndex]);

  function handleOtp(event: React.FormEvent) {
    event.preventDefault();
    if (otp.length !== 4) {
      toast.error("Enter the 4-digit OTP shown to the driver.");
      return;
    }
    setOtpVerified(true);
    if (status === "arrived") {
      setStatus("in_transit");
      toast.success("Loading confirmed — trip started.");
    } else if (status === "in_transit") {
      setStatus("delivered");
      toast.success("Delivery confirmed.");
    } else {
      toast.info("The OTP is used once the driver reaches the pickup point.");
    }
    setOtp("");
  }

  return (
    <SiteLayout>
      <section className="surface-hero">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h1 className="font-display text-3xl font-bold md:text-4xl">Track your load</h1>
          <p className="mt-2 text-sm opacity-85">
            Demo tracking on sample bookings. Status moves on a timer; the OTP step advances loading
            and delivery.
          </p>
        </div>
      </section>

      {selectedId === null ? (
      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-16">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Find your booking</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handleLookup}>
              <Label htmlFor="booking-lookup">Booking ID or phone number</Label>
              <Input
                id="booking-lookup"
                value={lookup}
                onChange={(event) => setLookup(event.target.value)}
                placeholder="TS-24881 or 90000 00000"
              />
              <Button type="submit" className="w-full">
                Track my load
              </Button>
            </form>
            <p className="mt-4 text-xs text-muted-foreground">
              No booking yet? <Link to="/book" search={{}} className="underline">Book a truck</Link>{" "}
              or call {brand.supportPhone} if you cannot find your booking ID.
            </p>
            <Separator className="my-5" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Sample bookings (demo build)
            </p>
            <div className="mt-2 space-y-2">
              {activeBookings.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className="w-full rounded-lg border border-border p-3 text-left transition-colors hover:bg-secondary"
                >
                  <p className="text-sm font-semibold">{item.reference}</p>
                  <p className="text-xs text-muted-foreground">{item.route}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
      ) : (
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="lg:col-span-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedId(null)}>
              Track a different booking
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Your bookings
            </p>
            {activeBookings.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  item.id === selectedId
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-secondary"
                }`}
              >
                <p className="text-sm font-semibold">{item.reference}</p>
                <p className="text-xs text-muted-foreground">{item.route}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.vehicleCategoryName} · {formatINR(item.fareEstimate)}
                </p>
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <Card className="card-elevated">
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle>{booking.reference}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {booking.pickupAddress} → {booking.dropAddress}
                  </p>
                </div>
                <BookingStatusBadge status={status} />
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {trackingSequence.map((entry, index) => {
                    const done = index <= stepIndex;
                    return (
                      <li key={entry} className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            done
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {done ? <Check className="size-4" /> : index + 1}
                        </span>
                        <div>
                          <p className={done ? "font-semibold" : "text-muted-foreground"}>
                            {bookingStatusLabels[entry]}
                          </p>
                          {index === stepIndex && status !== "delivered" ? (
                            <p className="text-xs text-muted-foreground">In progress…</p>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <Separator className="my-6" />

                <div className="flex flex-wrap items-center gap-4">
                  <img
                    src={driver.photoUrl}
                    alt={`${driver.name}, verified driver`}
                    className="size-14 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-40">
                    <p className="font-semibold">{driver.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {driver.vehicleCategoryName} · {driver.vehicleNumber}
                    </p>
                    <p className="flex items-center gap-1 text-sm">
                      <Star className="size-4 fill-accent text-accent" /> {driver.rating}
                    </p>
                  </div>
                  <Button variant="outline" className="ml-auto" asChild>
                    <a href={`tel:${driver.phone.replace(/\s/g, "")}`}>
                      <Phone className="mr-2 size-4" /> Call driver
                    </a>
                  </Button>
                </div>

                <div className="mt-6 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    <MapPin className="size-4" /> Map view coming soon
                  </p>
                  <p className="mt-1">
                    You get live status updates and ETA here today; on-map tracking lands in the next
                    release.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery OTP</CardTitle>
                </CardHeader>
                <CardContent>
                  {status === "delivered" ? (
                    <p className="text-sm text-muted-foreground">
                      Delivered and OTP verified. Proof of Delivery uploaded by the driver.
                    </p>
                  ) : (
                    <form className="space-y-3" onSubmit={handleOtp}>
                      <Label htmlFor="otp">Share this 4-digit OTP with the driver</Label>
                      <Input
                        id="otp"
                        inputMode="numeric"
                        maxLength={4}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="1234"
                      />
                      <Button type="submit" className="w-full">
                        Verify OTP
                      </Button>
                      {otpVerified ? (
                        <p className="text-xs text-success">OTP verified.</p>
                      ) : null}
                    </form>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fare & documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated fare</span>
                    <span className="font-medium">{formatINR(booking.fareEstimate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment</span>
                    <span className="font-medium">
                      {booking.paymentMethod === "online" ? "Paid online" : "Pay driver directly"}
                    </span>
                  </div>
                  {booking.eWayBillNumber ? (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">E-Way Bill</span>
                      <span className="font-medium">{booking.eWayBillNumber}</span>
                    </div>
                  ) : null}
                  <Badge
                    variant="outline"
                    className="border-accent/40 bg-accent/15 text-accent-foreground"
                  >
                    Tolls & State Taxes Extra
                  </Badge>
                  <p className="pt-2 text-xs text-muted-foreground">
                    Free cancellation within {pricingPlaceholders.freeCancellationMinutes} minutes;
                    {" "}
                    {formatINR(pricingPlaceholders.cancellationFee)} after that.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={() =>
                      toast.info("Demo build — GST invoice PDFs arrive in a later pass.")
                    }
                  >
                    <Download className="mr-2 size-4" /> Download GST invoice
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="surface-amber">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Truck className="size-5" /> Need another truck today?
                </p>
                <Button asChild variant="secondary">
                  <Link to="/book" search={{}}>Book a truck</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      )}
    </SiteLayout>
  );
}
