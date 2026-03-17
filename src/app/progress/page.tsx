import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import ProgressPageClient from "./ProgressPageClient";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const { data: progressList } = await supabase
    .from("course_progress")
    .select("*, courses(*)")
    .eq("user_id", userId)
    .order("last_accessed_at", { ascending: false });

  return <ProgressPageClient progressList={progressList || []} />;
}
