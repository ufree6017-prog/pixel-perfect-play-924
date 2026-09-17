import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { DashboardHeading } from "@/components/dashboard/DashboardShell";
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
import { mockDriverTrips } from "@/lib/mock";

export const Route = createFileRoute("/_authenticated/driver/pod")({
  component: DriverPodPage,
});

function DriverPodPage() {
  const pending = mockDriverTrips.filter((trip) => !trip.podUploaded);
  const [reference, setReference] = useState(pending[0]?.bookingReference ?? "");
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div>
      <DashboardHeading
        title="Upload POD / Lorry Receipt"
        description="Proof of delivery unlocks invoicing. Files are not stored in this build."
      />
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>New upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Booking reference</Label>
            <Select value={reference} onValueChange={setReference}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a trip" />
              </SelectTrigger>
              <SelectContent>
                {mockDriverTrips.map((trip) => (
                  <SelectItem key={trip.id} value={trip.bookingReference}>
                    {trip.bookingReference} — {trip.route}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="pod-file">POD / Lorry receipt</Label>
            <Input
              id="pod-file"
              type="file"
              className="mt-1"
              onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
            />
            {fileName ? (
              <p className="mt-2 text-sm text-success">Selected: {fileName}</p>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">
                A clear photo of the signed receipt is enough.
              </p>
            )}
          </div>
          <Button
            className="w-full"
            disabled={!reference}
            onClick={() => toast.success(`POD uploaded for ${reference} (demo)`)}
          >
            <UploadCloud className="mr-2 size-4" /> Upload POD
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
