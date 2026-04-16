import { defaultArticles } from "@/constants/articles";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { AgentKnowledgeItem } from "@/lib/agent/types";

const HOME_CONTEXT: AgentKnowledgeItem[] = [
  {
    source: "home:about",
    type: "home",
    content:
      "Sango Information Hub (SIHU) is a registered community media initiative focused on knowledge management, information sharing, natural resources, environmental protection, and development around the Lake Victoria Basin in Kenya.",
  },
  {
    source: "home:mission",
    type: "home",
    content:
      "SIHU works through community involvement in radio content production, digital information gathering and sharing, and restoration of community information and traditional knowledge.",
  },
  {
    source: "home:coverage",
    type: "home",
    content:
      "The platform highlights environmental governance, development news, Lake Victoria Basin protection, climate resilience, and community knowledge.",
  },
];

function tokenize(text: string) {
  return new Set((text.toLowerCase().match(/[a-z0-9]+/g) || []).filter((token) => token.length > 2));
}

function scoreMatch(query: string, text: string) {
  const queryTokens = tokenize(query);
  const textTokens = tokenize(text);
  let score = 0;

  for (const token of queryTokens) {
    if (textTokens.has(token)) score += 1;
  }

  return score;
}

async function retrieveKnowledgeBase(query: string, topK: number) {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("knowledge_base").select("*").limit(30);

    if (error || !data) return [];

    return data
      .map((item) => ({
        source: item.source || "knowledge_base",
        type: item.type || "knowledge",
        content: item.content || "",
        score: scoreMatch(query, item.content || ""),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, topK);
  } catch {
    return [];
  }
}

async function retrieveArticles(query: string, topK: number): Promise<AgentKnowledgeItem[]> {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("articles").select("*").limit(50);
    const rows = error || !data || data.length === 0 ? defaultArticles : data;

    return rows
      .map((article) => {
        const combined = [
          article.title,
          article.excerpt,
          article.content,
          article.category,
          article.author,
        ]
          .filter(Boolean)
          .join(" ");

        return {
          source: `article:${article.id}`,
          type: "article",
          title: article.title,
          content: `${article.title}: ${article.excerpt}\n${String(article.content || "").slice(0, 1200)}`.trim(),
          score: scoreMatch(query, combined),
        };
      })
      .filter((item) => (item.score || 0) > 0)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, topK);
  } catch {
    return defaultArticles
      .map((article) => ({
        source: `article:${article.id}`,
        type: "article",
        title: article.title,
        content: `${article.title}: ${article.excerpt}\n${String(article.content || "").slice(0, 1200)}`.trim(),
        score: scoreMatch(query, `${article.title} ${article.excerpt} ${article.content} ${article.category} ${article.author}`),
      }))
      .filter((item) => (item.score || 0) > 0)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, topK);
  }
}

function retrieveHome(query: string) {
  return HOME_CONTEXT.map((item) => ({
    ...item,
    score: scoreMatch(query, item.content),
  }))
    .filter((item) => (item.score || 0) > 0)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 2);
}

export async function retrieveKnowledge(query: string, topK = 3): Promise<AgentKnowledgeItem[]> {
  const [knowledgeBase, articles] = await Promise.all([
    retrieveKnowledgeBase(query, topK),
    retrieveArticles(query, topK),
  ]);

  const merged = [...knowledgeBase, ...articles, ...retrieveHome(query)]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, topK);

  return merged;
}
