import { createAdminClient } from "@/lib/supabase/admin";

export async function awardPoints(profileId: string, action: string, points: number, note?: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("points_ledger").insert({
    profile_id: profileId,
    action,
    points,
    note: note ?? null,
  });
  if (error) {
    return false;
  }
  await supabase.rpc("increment_points_balance", { p_profile_id: profileId, p_points: points });
  return true;
}