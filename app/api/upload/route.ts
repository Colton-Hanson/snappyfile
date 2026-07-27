import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Large uploads take longer than the 10s default on Vercel's hobby tier.
export const maxDuration = 60;

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

function generateSlug(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// Strips directory components and anything that isn't safe in a storage path.
function sanitizeFilename(name: string) {
  const base = name.replace(/[/\\]/g, "_");
  return base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-200) || "file";
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 100MB limit" }, { status: 400 });
    }

    const slug = generateSlug();
    const safeName = sanitizeFilename(file.name);
    const storagePath = `${slug}/${safeName}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(storagePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }

    const { error: dbError } = await supabase
      .from("files")
      .insert({
        slug,
        storage_path: storagePath,
        original_filename: file.name,
        expires_at: expiresAt,
      });

    if (dbError) {
      // Roll back the storage object so we don't leak orphaned files.
      await supabase.storage.from("uploads").remove([storagePath]);
      return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
    }

    const baseUrl = req.nextUrl.origin;
    return NextResponse.json({ downloadUrl: `${baseUrl}/f/${slug}`, slug });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
