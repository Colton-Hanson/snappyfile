import { redirect, notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function ShortLinkRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("links")
    .select("url, expires_at")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    notFound();
  }

  if (new Date(data.expires_at) < new Date()) {
    notFound();
  }

  redirect(data.url);
}
