import { redirect } from "next/navigation";

// This will be replaced with a Supabase lookup
export default function ShortLinkRedirect({ params }: { params: { slug: string } }) {
  redirect("/");
}
