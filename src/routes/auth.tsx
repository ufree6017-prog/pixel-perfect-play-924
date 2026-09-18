import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Truck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { brand } from "@/lib/brand";
import { supabase } from "@/integrations/supabase/client";
import { homePathForRole } from "@/hooks/useSessionRole";

type Mode = "customer" | "driver";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode?: Mode } =>
    search["mode"] === "driver" ? { mode: "driver" } : {},
  head: () => ({
    meta: [
      { title: `Sign in or create an account — ${brand.name}` },
      {
        name: "description",
        content:
          "Sign in to book a truck, track a load or manage your driver account with TruckSetu.",
      },
      { property: "og:title", content: `Sign in — ${brand.name}` },
      {
        property: "og:description",
        content: "Customer, driver and admin sign-in for the TruckSetu transport marketplace.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<"signin" | "signup">(mode === "driver" ? "signup" : "signin");
  const [role, setRole] = useState<Mode>(mode === "driver" ? "driver" : "customer");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await queryClient.invalidateQueries();
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    let nextRole: "customer" | "driver" | "admin" = "customer";
    if (userId) {
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      const held = (roles ?? []).map((row) => row.role as typeof nextRole);
      nextRole = held.includes("admin") ? "admin" : held.includes("driver") ? "driver" : "customer";
    }
    toast.success("Signed in");
    navigate({ to: homePathForRole(nextRole) === "/" ? "/track" : homePathForRole(nextRole) });
  }

  async function handleSignUp(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
        data: { full_name: fullName, phone, requested_role: role },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) {
      toast.success("Account created. Check your email to confirm, then sign in.");
      setTab("signin");
      return;
    }
    await queryClient.invalidateQueries();
    navigate({ to: role === "driver" ? "/driver" : "/track" });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="surface-hero hidden flex-col justify-between p-10 lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Truck className="size-5" />
          </span>
          <span className="font-display text-lg font-bold">{brand.name}</span>
        </Link>
        <div className="max-w-md">
          <h2 className="font-display text-3xl font-bold">{brand.tagline}</h2>
          <p className="mt-3 text-sm opacity-85">
            One account for booking loads, tracking deliveries and — if you own a truck — earning on
            the platform with verified documents.
          </p>
        </div>
        <p className="text-xs opacity-70">
          Demo build. Fares, wallets and invoices shown in the app are placeholders.
        </p>
      </div>

      <div className="flex items-center justify-center bg-background px-4 py-12">
        <Card className="w-full max-w-md card-elevated">
          <CardHeader>
            <CardTitle className="text-2xl">
              {tab === "signin" ? "Welcome back" : "Create your account"}
            </CardTitle>
            <CardDescription>
              {tab === "signin"
                ? "Sign in to book, track or manage loads."
                : "Sign up as a customer or register your truck as a driver."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(value) => setTab(value as "signin" | "signup")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>
            </Tabs>

            {tab === "signin" ? (
              <form className="mt-6 space-y-4" onSubmit={handleSignIn}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null} Sign in
                </Button>
              </form>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={handleSignUp}>
                <div className="grid grid-cols-2 gap-2">
                  {(["customer", "driver"] as Mode[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRole(option)}
                      className={`rounded-lg border px-3 py-3 text-left text-sm transition-colors ${
                        role === option
                          ? "border-primary bg-primary/5 font-semibold text-primary"
                          : "border-input text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {option === "customer" ? "I need a truck" : "I drive a truck"}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile number</Label>
                  <Input
                    id="phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 90000 00000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupEmail">Email</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupPassword">Password</Label>
                  <Input
                    id="signupPassword"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null} Create account
                </Button>
                <p className="text-xs text-muted-foreground">
                  Drivers continue to document upload after signing up. Verification is reviewed by
                  our team before you can accept loads.
                </p>
              </form>
            )}

            <p className="mt-6 text-center text-xs text-muted-foreground">
              <Link to="/" className="underline">
                Back to website
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
