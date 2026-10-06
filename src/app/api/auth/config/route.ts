import { NextResponse } from "next/server";

// Read the setting when the request comes in, not when the site is built.
export const dynamic = "force-dynamic";

const clean = (v: string | undefined) => (v ?? "").trim().replace(/^["']|["']$/g, "");

/**
 * The KAI platform's Privy app (one account for KAI and SIHU). A Privy app
 * id is public, not a secret: every browser that signs in on KAI receives
 * it. The Vercel setting NEXT_PUBLIC_PRIVY_APP_ID overrides it.
 */
const KAI_PRIVY_APP_ID = "cmu34xeik004s0djmn2iic24n";

/**
 * GET /api/auth/config -> { appId, set, length }
 * The Privy app id is public (it is sent to every browser that signs in);
 * `set` and `length` help check the Vercel setting without showing it.
 */
export async function GET() {
  const fromEnv = clean(process.env.NEXT_PUBLIC_PRIVY_APP_ID) || clean(process.env.PRIVY_APP_ID);
  const raw = fromEnv.length === 25 ? fromEnv : KAI_PRIVY_APP_ID;
  const valid = raw.length === 25;
  return NextResponse.json(
    { appId: valid ? raw : null, set: fromEnv.length > 0, length: fromEnv.length, source: fromEnv.length === 25 ? "vercel" : "kai-default" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
