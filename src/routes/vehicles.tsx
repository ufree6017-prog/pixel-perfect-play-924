import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck } from "lucide-react";

import { PageIntro, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { brand } from "@/lib/brand";
import { formatINR } from "@/lib/fare";
import { mockVehicleCategories } from "@/lib/mock/vehicles";
import type { VehicleCategory } from "@/lib/mock/types";

export const Route = createFileRoute("/vehicles")({
  head: () => ({
    meta: [
      { title: `Vehicles & pricing — tempo to 40ft trailer | ${brand.name}` },
      {
        name: "description",
        content:
          "Compare capacity and indicative rates for three-wheelers, Tata Ace, pickups, Eicher trucks, 20ft and 32ft containers, flatbeds and 40ft trailers across India.",
      },
      { property: "og:title", content: `Vehicles & pricing — ${brand.name}` },
      {
        property: "og:description",
        content:
          "Capacity, base fare and per-km rates for every vehicle type, from a chhota tempo to a 40ft trailer.",
      },
    ],
  }),
  component: VehiclesPage,
});

function RateTable({ rows }: { rows: VehicleCategory[] }) {
  return (
    <div className="card-elevated mt-6 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead className="text-right">Base fare</TableHead>
            <TableHead className="text-right">Per km</TableHead>
            <TableHead>Best for</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell className="font-medium">
                {vehicle.name}
                {vehicle.localName ? (
                  <span className="block text-xs text-muted-foreground">{vehicle.localName}</span>
                ) : null}
              </TableCell>
              <TableCell>{vehicle.capacityLabel}</TableCell>
              <TableCell className="text-right">{formatINR(vehicle.baseFare)}</TableCell>
              <TableCell className="text-right">{formatINR(vehicle.perKmRate)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{vehicle.bestFor}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function VehicleGrid({ rows }: { rows: VehicleCategory[] }) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((vehicle) => (
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
  );
}

function VehiclesPage() {
  const retail = mockVehicleCategories.filter((v) => v.flows.includes("retail"));
  const business = mockVehicleCategories.filter((v) => v.flows.includes("business"));

  return (
    <SiteLayout>
      <PageIntro
        eyebrow="Vehicles & pricing"
        title="Pick a vehicle by weight, not by guesswork"
        description="Indicative base fares and per-km rates. Final fare depends on the actual distance; tolls and state taxes are billed extra."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <Tabs defaultValue="retail">
          <TabsList>
            <TabsTrigger value="retail">City & shifting</TabsTrigger>
            <TabsTrigger value="business">Bulk & intercity</TabsTrigger>
          </TabsList>
          <TabsContent value="retail">
            <p className="mt-6 text-sm text-muted-foreground">
              Book these instantly online. Ideal for home shifting, shop stock, hardware and market
              runs within the city.
            </p>
            <VehicleGrid rows={retail} />
            <RateTable rows={retail} />
            <Button asChild size="lg" className="mt-6">
              <Link to="/book" search={{}}>Book a city load</Link>
            </Button>
          </TabsContent>
          <TabsContent value="business">
            <p className="mt-6 text-sm text-muted-foreground">
              Containers, flatbeds and trailers are quoted by our freight desk so we can factor
              route, permits and return-load availability.
            </p>
            <VehicleGrid rows={business} />
            <RateTable rows={business} />
            <Button asChild size="lg" className="mt-6">
              <Link to="/business">Request a freight quote</Link>
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-10 rounded-xl border border-border bg-secondary/50 p-5">
          <h2 className="text-base font-semibold">What is not included in the estimate</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Tolls, state entry taxes and permits — billed at actuals.</li>
            <li>Loading or unloading labour unless you add a helper.</li>
            <li>Waiting charges beyond the free waiting time at pickup.</li>
            <li>Transit insurance premium, if you opt in at checkout.</li>
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
