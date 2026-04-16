/**
 * /api/keys — Secure AI API Key Storage
 * In production, replace the in-memory store with encrypted
 * DB storage (e.g. Supabase with RLS or AWS Secrets Manager).
 */

import { NextRequest, NextResponse } from "next/server";

// In-memory store – replace with a real secure backend in production
const keyStore: { openai?: string; gemini?: string; anthropic?: string } = {};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { openai, gemini, anthropic } = body as {
      openai?: string;
      gemini?: string;
      anthropic?: string;
    };

    if (openai) keyStore.openai = openai;
    if (gemini) keyStore.gemini = gemini;
    if (anthropic) keyStore.anthropic = anthropic;

    return NextResponse.json({ success: true, message: "Keys saved." }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }
}

export async function GET() {
  // Return masked keys so the UI can show which providers are configured
  return NextResponse.json({
    openai: keyStore.openai ? `sk-...${keyStore.openai.slice(-4)}` : null,
    gemini: keyStore.gemini ? `AIza...${keyStore.gemini.slice(-4)}` : null,
    anthropic: keyStore.anthropic ? `sk-ant-...${keyStore.anthropic.slice(-4)}` : null,
  });
}
