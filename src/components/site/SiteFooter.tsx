import { Link } from "@tanstack/react-router";
import { Mail, Phone, Truck } from "lucide-react";

import { brand } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Truck className="size-5" />
            </span>
            <span className="font-display text-lg font-bold">{brand.name}</span>
          </div>
          <p className="mt-4 text-sm text-navy-foreground/70">
            Intracity and intercity goods transport across India. Verified drivers, transparent
            pricing, GST invoicing for businesses.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-accent">Services</h4>
          <ul className="mt-4 space-y-2 text-sm text-navy-foreground/75">
            <li>
              <Link to="/book">Book a truck</Link>
            </li>
            <li>
              <Link to="/vehicles">Vehicles &amp; pricing</Link>
            </li>
            <li>
              <Link to="/business">Business &amp; bulk freight</Link>
            </li>
            <li>
              <Link to="/track">Track an order</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-accent">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-navy-foreground/75">
            <li>
              <Link to="/about">About us</Link>
            </li>
            <li>
              <Link to="/how-it-works">How it works</Link>
            </li>
            <li>
              <Link to="/auth" search={{ mode: "driver" }}>
                Drive with us
              </Link>
            </li>
            <li>
              <Link to="/contact">Contact &amp; support</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-accent">Legal</h4>
          <ul className="mt-4 space-y-2 text-sm text-navy-foreground/75">
            <li>
              <Link to="/terms">Terms &amp; conditions</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy policy</Link>
            </li>
            <li>
              <Link to="/cancellation-policy">Cancellation policy</Link>
            </li>
          </ul>
          <div className="mt-5 space-y-2 text-sm text-navy-foreground/75">
            <p className="flex items-center gap-2">
              <Phone className="size-4 text-accent" /> {brand.supportPhone}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="size-4 text-accent" /> {brand.supportEmail}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10 py-5 text-center text-xs text-navy-foreground/60">
        © {new Date().getFullYear()} {brand.name}. Pan-India goods transport. Tolls and state taxes
        are billed extra on all trips.
      </div>
    </footer>
  );
}
