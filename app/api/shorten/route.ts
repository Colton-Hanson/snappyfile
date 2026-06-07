import { NextRequest, NextResponse } from "next/server";

// Simple in-memory store for now — will be replaced with Supabase
const store = new Map<string, string>();

function generateSlug(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Basic URL validation
    try { new URL(url); } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const slug = generateSlug();
    store.set(slug, url);

    const baseUrl = req.nextUrl.origin;
    return NextResponse.json({ short: `${baseUrl}/s/${slug}`, slug });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
