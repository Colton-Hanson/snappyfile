# File Upload feature — changelog & setup

Added a file upload/download tool (`/tools/file-upload`) that works the same way the
URL shortener does: upload something, get a temporary link back. Built for arbitrary
files, with PDFs as the priority use case tonight.

## To go live tonight, in this order

1. **Run the SQL** in `supabase/file-upload.sql` via Supabase Dashboard → SQL Editor.
   Creates the `files` table and the private `uploads` storage bucket.
2. **Set env vars** — same two vars the URL shortener already needs, so if that
   feature works in prod today, these are already set on Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   For local dev, put them in `.env.local` (gitignored, not committed).
3. **Test one real PDF upload/download cycle yourself.** I verified the code compiles,
   lints clean, and handles malformed requests correctly (see "What I actually tested"
   below) — but I do not have your Supabase credentials, so I have not seen a real file
   go from browser → Supabase Storage → download link → back down. Do that once before
   trusting it live.

## What was built

| File | Purpose |
|---|---|
| `app/api/upload/route.ts` | Accepts multipart upload, validates size, generates slug, uploads to the `uploads` bucket, inserts a row into `files` |
| `app/f/[slug]/page.tsx` | Looks up the slug, 404s if missing/expired, else redirects to a 60s Supabase signed URL for the actual download |
| `app/tools/file-upload/page.tsx` | Upload UI — drag-and-drop or click-to-browse, upload button, copyable result link |
| `__tests__/file-upload-api.test.ts` | Unit tests for slug generation, size-limit boundary, and filename sanitization |
| `supabase/file-upload.sql` | SQL to create the `files` table + `uploads` storage bucket (run this yourself) |
| `app/page.tsx`, `app/components/Navbar.tsx` | Added a "File Tools" section / nav link pointing at the new tool |

Mirrors `app/api/shorten/route.ts` and `app/s/[slug]/page.tsx` conventions: same
`generateSlug()` pattern, same try/catch → `NextResponse.json({error}, {status})`
error shape, same server-component redirect/`notFound()` pattern for the slug lookup.

No file type restriction — any extension is accepted, stored byte-for-byte via
`file.arrayBuffer()` → `Buffer`, no re-encoding or transformation. Filenames are
sanitized (path separators and unsafe characters stripped) before being used in the
storage path, to prevent path traversal into the bucket.

## Known limitation — read this before relying on large files

**You asked me to build the API route so the file is uploaded straight through
Next.js (matching the URL shortener's pattern exactly), instead of having the
browser upload directly to Supabase Storage. I flagged this tradeoff before building
it, and you chose this option, so here's what it means in practice:**

Vercel's serverless functions (the Node.js runtime that runs Next.js API routes)
cap request bodies at **~4.5MB**. The 100MB limit enforced in the code
(`MAX_FILE_SIZE` in `app/api/upload/route.ts`) only ever gets a chance to run for
files small enough to make it through Vercel's platform-level limit first. In
practice, once deployed to Vercel:
- Files under ~4.5MB: work fine.
- Files over ~4.5MB (a lot of real-world PDFs): will fail with a `413` before your
  code ever runs — no clean error message, no `{error: ...}` JSON, just a rejected
  request.

**This only affects the production Vercel deployment — it will look like it works
fine in local dev (`npm run dev` has no such cap), which is exactly the kind of gap
that bites you later.** If tonight's PDFs are small, you're fine as-is. If any of
them are multi-megabyte, the fix is to switch the upload path to a Supabase signed
upload URL (browser uploads directly to Supabase, bypassing Vercel's function body
limit) — that's a real (small) rework of `app/api/upload/route.ts` and the upload
page's fetch call, not a config toggle. Ask if you want that swapped in.

## What I actually tested (and what I didn't)

Ran against this machine, with a placeholder Supabase URL (no real project):
- `npx jest` — all 34 tests pass, including the 10 new ones.
- `npx eslint` on all changed/added files — clean, no errors.
- `npm run build` (production Next.js build) — compiles, type-checks, and correctly
  registers `/api/upload` and `/f/[slug]` as dynamic routes, `/tools/file-upload` as
  static — same shape as the existing `/api/shorten` / `/s/[slug]` routes.
- Ran the dev server and hit `/api/upload` directly with `curl`:
  - No `file` field → `400 {"error":"No file provided"}`
  - Valid small file → passes validation, reaches the Supabase call, fails there
    cleanly with `500 {"error":"Failed to upload file"}` (expected, since the
    Supabase URL was a placeholder — confirms parsing/validation/slug logic all run
    correctly up to the network call)
  - `/f/nonexistent-slug` → `404`

**Not tested:** an actual successful upload + download against your real Supabase
project, because I don't have your credentials. That's step 3 above — do that
before considering this done-done.
