import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { DashboardHeading } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockBusinessEnquiries } from "@/lib/mock";
import type { BusinessEnquiry } from "@/lib/mock/types";

export const Route = createFileRoute("/_authenticated/admin/enquiries")({
  component: AdminEnquiriesPage,
});

const tone: Record<BusinessEnquiry["status"], string> = {
  new: "bg-accent/25 text-accent-foreground",
  contacted: "bg-primary/15 text-primary",
  closed: "bg-success/15 text-success",
};

function AdminEnquiriesPage() {
  const [statuses, setStatuses] = useState<Record<string, BusinessEnquiry["status"]>>(
    Object.fromEntries(mockBusinessEnquiries.map((enq) => [enq.id, enq.status])),
  );

  function setStatus(id: string, status: BusinessEnquiry["status"]) {
    setStatuses((prev) => ({ ...prev, [id]: status }));
    toast.success(`Enquiry marked ${status} (demo)`);
  }

  return (
    <div>
      <DashboardHeading
        title="Business & bulk queries"
        description="Enquiries submitted from the public website."
      />
      <div className="space-y-4">
        {mockBusinessEnquiries.map((enq) => (
          <Card key={enq.id}>
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">{enq.companyName}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {enq.contactName} · {enq.phone} · {enq.email}
                </p>
              </div>
              <Badge variant="outline" className={`border-transparent ${tone[statuses[enq.id]!]}`}>
                {statuses[enq.id]}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid gap-2 text-muted-foreground sm:grid-cols-3">
                <p>Route: {enq.route}</p>
                <p>Volume: {enq.monthlyLoads}</p>
                <p>Vehicle: {enq.vehicleCategoryName}</p>
              </div>
              <p>{enq.message}</p>
              <p className="text-xs text-muted-foreground">
                Submitted {new Date(enq.submittedAt).toLocaleString("en-IN")}
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setStatus(enq.id, "contacted")}>
                  Mark contacted
                </Button>
                <Button size="sm" variant="outline" onClick={() => setStatus(enq.id, "closed")}>
                  Close enquiry
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
