import { useQuery } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export type AppRole = "customer" | "driver" | "admin";

export interface SessionRole {
  user: User | null;
  role: AppRole | null;
  fullName: string | null;
}

/**
 * Reads the signed-in user plus their role from `user_roles`.
 * Roles are stored in a dedicated table, never on the profile.
 */
export function useSessionRole() {
  return useQuery<SessionRole>({
    queryKey: ["session-role"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user ?? null;
      if (!user) return { user: null, role: null, fullName: null };

      const [{ data: roles }, { data: profile }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", user.id),
        supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
      ]);

      const rank: AppRole[] = ["admin", "driver", "customer"];
      const held = (roles ?? []).map((row) => row.role as AppRole);
      const role = rank.find((candidate) => held.includes(candidate)) ?? null;

      return {
        user,
        role,
        fullName: profile?.full_name ?? (user.user_metadata?.["full_name"] as string) ?? null,
      };
    },
    staleTime: 30_000,
  });
}

export function homePathForRole(role: AppRole | null): string {
  if (role === "admin") return "/admin";
  if (role === "driver") return "/driver";
  return "/";
}
