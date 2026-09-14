import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, Truck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { brand } from "@/lib/brand";
import { homePathForRole, useSessionRole } from "@/hooks/useSessionRole";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { to: "/book", label: "Book a truck" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/vehicles", label: "Vehicles & pricing" },
  { to: "/business", label: "For business" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Support" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { data } = useSessionRole();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const dashboardPath = homePathForRole(data?.role ?? null);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-navy text-navy-foreground">
            <Truck className="size-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">{brand.name}</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {data?.user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to={dashboardPath === "/" ? "/track" : dashboardPath}>
                  {data.role === "admin"
                    ? "Admin"
                    : data.role === "driver"
                      ? "Driver portal"
                      : "My trips"}
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/auth" search={{ mode: "driver" }}>
                  Drive with us
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth">Sign in</Link>
              </Button>
            </>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="mt-8 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-sm font-medium text-foreground hover:bg-secondary"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/track"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Track an order
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
