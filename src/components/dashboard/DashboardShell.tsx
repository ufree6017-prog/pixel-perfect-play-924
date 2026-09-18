import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Truck } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { brand } from "@/lib/brand";
import { supabase } from "@/integrations/supabase/client";
import { useSessionRole } from "@/hooks/useSessionRole";

export interface DashboardNavItem {
  to: string;
  label: string;
}

export function DashboardShell({
  area,
  nav,
  children,
}: {
  area: string;
  nav: DashboardNavItem[];
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data } = useSessionRole();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <aside className="bg-sidebar text-sidebar-foreground lg:w-64 lg:shrink-0">
        <div className="flex items-center gap-2 px-4 py-4">
          <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Truck className="size-4" />
          </span>
          <div>
            <p className="font-display text-sm font-bold leading-tight">{brand.name}</p>
            <p className="text-xs text-sidebar-foreground/60">{area}</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-3 lg:flex-col lg:overflow-visible">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeProps={{
                className: "bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
              }}
              activeOptions={{ exact: item.to.split("/").length <= 2 }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden px-4 py-4 lg:block">
          <p className="truncate text-xs text-sidebar-foreground/60">{data?.user?.email}</p>
          <div className="mt-3 flex flex-col gap-2">
            <Button asChild variant="secondary" size="sm">
              <Link to="/">Back to website</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="mr-2 size-4" /> Sign out
            </Button>
          </div>
        </div>
      </aside>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
          <span className="text-sm font-semibold">{area}</span>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
      </div>
    </div>
  );
}

export function DashboardHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
