import { createClient } from "@/lib/supabase/server";

export async function requireEducator() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { authorized: false, profile: null, userId: null };
  }

  const { data: profile } = await supabase.from("profiles").select("role, educator_title, full_name").eq("id", user.id).single();

  if (!profile || !["educator", "admin", "super_admin"].includes(profile.role)) {
    return { authorized: false, profile: null, userId: null };
  }

  return { authorized: true, profile, userId: user.id };
}
