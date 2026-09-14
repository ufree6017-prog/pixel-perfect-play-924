import { Badge } from "@/components/ui/badge";
import { bookingStatusLabels } from "@/lib/mock/bookings";
import type { BookingStatus, DriverVerificationStatus, InvoiceStatus } from "@/lib/mock/types";

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const tone =
    status === "delivered"
      ? "bg-success/15 text-success"
      : status === "cancelled"
        ? "bg-destructive/15 text-destructive"
        : status === "in_transit"
          ? "bg-primary/15 text-primary"
          : "bg-accent/25 text-accent-foreground";
  return (
    <Badge variant="outline" className={`border-transparent ${tone}`}>
      {bookingStatusLabels[status]}
    </Badge>
  );
}

export function VerificationBadge({ status }: { status: DriverVerificationStatus }) {
  const map: Record<DriverVerificationStatus, { label: string; tone: string }> = {
    pending: { label: "Pending verification", tone: "bg-accent/25 text-accent-foreground" },
    approved: { label: "Verified", tone: "bg-success/15 text-success" },
    rejected: { label: "Rejected", tone: "bg-destructive/15 text-destructive" },
  };
  const entry = map[status];
  return (
    <Badge variant="outline" className={`border-transparent ${entry.tone}`}>
      {entry.label}
    </Badge>
  );
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const map: Record<InvoiceStatus, { label: string; tone: string }> = {
    pending_pod: { label: "Awaiting POD", tone: "bg-accent/25 text-accent-foreground" },
    ready: { label: "Ready to issue", tone: "bg-primary/15 text-primary" },
    issued: { label: "Invoice issued", tone: "bg-primary/15 text-primary" },
    paid: { label: "Paid", tone: "bg-success/15 text-success" },
  };
  const entry = map[status];
  return (
    <Badge variant="outline" className={`border-transparent ${entry.tone}`}>
      {entry.label}
    </Badge>
  );
}

export type ExpiryState = "valid" | "expiring_soon" | "expired";

export function expiryState(documentExpiryDate: string | null): ExpiryState {
  if (!documentExpiryDate) return "valid";
  const days = Math.round(
    (new Date(documentExpiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (days < 0) return "expired";
  if (days <= 45) return "expiring_soon";
  return "valid";
}

export function ExpiryBadge({ documentExpiryDate }: { documentExpiryDate: string | null }) {
  if (!documentExpiryDate) {
    return (
      <Badge variant="outline" className="border-transparent bg-muted text-muted-foreground">
        No expiry
      </Badge>
    );
  }
  const state = expiryState(documentExpiryDate);
  const map: Record<ExpiryState, { label: string; tone: string }> = {
    valid: { label: "Valid", tone: "bg-success/15 text-success" },
    expiring_soon: { label: "Expiring soon", tone: "bg-accent/25 text-accent-foreground" },
    expired: { label: "Expired", tone: "bg-destructive/15 text-destructive" },
  };
  const entry = map[state];
  return (
    <Badge variant="outline" className={`border-transparent ${entry.tone}`}>
      {entry.label}
    </Badge>
  );
}
