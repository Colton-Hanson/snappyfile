import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function generateSlug(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function POST(req: NextRequest) {
  try {
    const { url, expiry = 24 } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    try { new URL(url); } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const validExpiry = [24, 48, 72].includes(Number(expiry)) ? Number(expiry) : 24;
    const expiresAt = new Date(Date.now() + validExpiry * 60 * 60 * 1000).toISOString();
    const slug = generateSlug();

    const { error } = await supabase
      .from("short_links")
      .insert({ slug, url, expires_at: expiresAt });

    if (error) {
      return NextResponse.json({ error: "Failed to save link" }, { status: 500 });
    }

    const baseUrl = req.nextUrl.origin;
    return NextResponse.json({ short: `${baseUrl}/s/${slug}`, slug });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
