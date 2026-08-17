import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function GoPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const admin = createAdminClient();

  const { data: link } = await admin.from("creator_links").select("*").eq("ref_code", code).single();

  if (!link) {
    redirect("/");
  }

  await admin.from("creator_links").update({ click_count: (link.click_count ?? 0) + 1 }).eq("id", link.id);

  if (link.link_type === "book" && link.book_id) {
    redirect(`/shop/book/${link.book_id}?ref=${link.user_id}`);
  }

  redirect(`/join?ref=${link.ref_code}`);
}
