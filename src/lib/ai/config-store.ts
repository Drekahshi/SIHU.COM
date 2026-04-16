import { decryptSecret, encryptSecret } from "@/lib/crypto/secrets";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type AIProvider = "openai" | "gemini" | "anthropic";

export interface AIConfig {
  activeProvider: AIProvider;
  models: Record<AIProvider, string>;
  keys: Partial<Record<AIProvider, string>>;
  updatedAt: string | null;
}

interface AIConfigUpdate {
  activeProvider?: AIProvider;
  models?: Partial<Record<AIProvider, string>>;
  keys?: Partial<Record<AIProvider, string>>;
  updatedAt?: string | null;
}

const defaultConfig: AIConfig = {
  activeProvider: "openai",
  models: {
    openai: "gpt-4.1-mini",
    gemini: "gemini-1.5-flash",
    anthropic: "claude-3-5-sonnet-latest",
  },
  keys: {},
  updatedAt: null,
};

function sanitizeConfig(raw: AIConfigUpdate | Partial<AIConfig> | null | undefined): AIConfig {
  return {
    activeProvider:
      raw?.activeProvider && ["openai", "gemini", "anthropic"].includes(raw.activeProvider)
        ? raw.activeProvider
        : defaultConfig.activeProvider,
    models: {
      openai: raw?.models?.openai || defaultConfig.models.openai,
      gemini: raw?.models?.gemini || defaultConfig.models.gemini,
      anthropic: raw?.models?.anthropic || defaultConfig.models.anthropic,
    },
    keys: {
      openai: raw?.keys?.openai || undefined,
      gemini: raw?.keys?.gemini || undefined,
      anthropic: raw?.keys?.anthropic || undefined,
    },
    updatedAt: raw?.updatedAt || null,
  };
}

function maskKey(provider: AIProvider, value?: string) {
  if (!value) return null;

  if (provider === "openai") return `sk-...${value.slice(-4)}`;
  if (provider === "gemini") return `AIza...${value.slice(-4)}`;
  return `sk-ant-...${value.slice(-4)}`;
}

export async function readAIConfig(): Promise<AIConfig> {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("ai_gateway_settings")
      .select("*")
      .eq("id", "global")
      .maybeSingle();

    if (error || !data) {
      return defaultConfig;
    }

    return sanitizeConfig({
      activeProvider: data.active_provider as AIProvider,
      models: data.models_json as Partial<Record<AIProvider, string>>,
      keys: {
        openai: decryptSecret(data.openai_key_encrypted),
        gemini: decryptSecret(data.gemini_key_encrypted),
        anthropic: decryptSecret(data.anthropic_key_encrypted),
      },
      updatedAt: data.updated_at as string | null,
    });
  } catch {
    return defaultConfig;
  }
}

export async function writeAIConfig(update: AIConfigUpdate): Promise<AIConfig> {
  const current = await readAIConfig();
  const next = sanitizeConfig({
    ...current,
    ...update,
    models: {
      ...current.models,
      ...update.models,
    },
    keys: {
      ...current.keys,
      ...update.keys,
    },
    updatedAt: new Date().toISOString(),
  });

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("ai_gateway_settings").upsert({
    id: "global",
    active_provider: next.activeProvider,
    models_json: next.models,
    openai_key_encrypted: next.keys.openai ? encryptSecret(next.keys.openai) : null,
    gemini_key_encrypted: next.keys.gemini ? encryptSecret(next.keys.gemini) : null,
    anthropic_key_encrypted: next.keys.anthropic ? encryptSecret(next.keys.anthropic) : null,
    updated_at: next.updatedAt,
  });

  if (error) {
    throw error;
  }

  return next;
}

export async function readPublicAIConfig() {
  const config = await readAIConfig();
  return {
    activeProvider: config.activeProvider,
    models: config.models,
    configured: {
      openai: !!config.keys.openai,
      gemini: !!config.keys.gemini,
      anthropic: !!config.keys.anthropic,
    },
    maskedKeys: {
      openai: maskKey("openai", config.keys.openai),
      gemini: maskKey("gemini", config.keys.gemini),
      anthropic: maskKey("anthropic", config.keys.anthropic),
    },
    updatedAt: config.updatedAt,
    storageMode: "supabase-encrypted",
  };
}
