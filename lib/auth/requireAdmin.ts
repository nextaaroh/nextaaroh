import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { authorized: false, reason: "not_logged_in" as const, profile: null };
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (!profile || (profile.role !== "admin" && profile.role !== "super_admin" && profile.role !== "moderator")) {
    return { authorized: false, reason: "not_admin" as const, profile: null };
  }

  return { authorized: true, reason: null, profile };
}
