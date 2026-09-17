import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { DashboardHeading } from "@/components/dashboard/DashboardShell";
import { ExpiryBadge, expiryState } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCurrentDriver } from "@/lib/mock";

export const Route = createFileRoute("/_authenticated/driver/documents")({
  component: DriverDocumentsPage,
});

function DriverDocumentsPage() {
  const driver = mockCurrentDriver;
  const attention = driver.documents.filter(
    (doc) => expiryState(doc.documentExpiryDate) !== "valid",
  );

  return (
    <div>
      <DashboardHeading
        title="Documents"
        description="Keep your licence, RC and insurance current to stay online."
      />
      {attention.length ? (
        <Card className="mb-6 border-accent">
          <CardContent className="pt-6 text-sm">
            {attention.length} document{attention.length > 1 ? "s" : ""} need attention. Re-upload
            before the expiry date to avoid being taken offline.
          </CardContent>
        </Card>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {driver.documents.map((doc) => (
          <Card key={doc.type}>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <CardTitle className="text-base">{doc.label}</CardTitle>
              <ExpiryBadge documentExpiryDate={doc.documentExpiryDate} />
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>File: {doc.fileName}</p>
              <p>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString("en-IN")}</p>
              <p>
                Expires:{" "}
                {doc.documentExpiryDate
                  ? new Date(doc.documentExpiryDate).toLocaleDateString("en-IN")
                  : "Not applicable"}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success(`${doc.label} re-uploaded (demo)`)}
              >
                Re-upload
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
