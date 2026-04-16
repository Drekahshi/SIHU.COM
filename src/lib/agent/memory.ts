import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function getHistory(sessionId: string, limit = 10) {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("chat_history")
      .select("*")
      .eq("session_id", sessionId)
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Failed to read agent history:", error);
      return [];
    }

    return [...(data || [])].reverse();
  } catch (error) {
    console.error("Agent history unavailable:", error);
    return [];
  }
}

export async function storeHistory(params: {
  sessionId: string;
  userMessage: string;
  botResponse: string;
  intent: string;
}) {
  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("chat_history").insert({
      session_id: params.sessionId,
      user_message: params.userMessage,
      bot_response: params.botResponse,
      intent: params.intent,
      timestamp: new Date().toISOString(),
    });

    if (error) {
      console.error("Failed to store agent history:", error);
    }
  } catch (error) {
    console.error("Agent history store unavailable:", error);
  }
}
