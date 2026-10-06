import { NextResponse } from "next/server";

// Read the setting when the request comes in, not when the site is built.
export const dynamic = "force-dynamic";

const clean = (v: string | undefined) => (v ?? "").trim().replace(/^["']|["']$/g, "");

/**
 * GET /api/auth/config -> { appId, set, length }
 * The Privy app id is public (it is sent to every browser that signs in);
 * `set` and `length` help check the Vercel setting without showing it.
 */
export async function GET() {
  const raw = clean(process.env.NEXT_PUBLIC_PRIVY_APP_ID) || clean(process.env.PRIVY_APP_ID);
  const valid = raw.length === 25;
  return NextResponse.json(
    { appId: valid ? raw : null, set: raw.length > 0, length: raw.length },
    { headers: { "Cache-Control": "no-store" } },
  );
}
