import { Article, defaultArticles } from '../constants/articles';
import { articleService } from './articleService';

const hasSupabase =
  typeof process !== 'undefined' &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

export const supabaseArticleService = {
  getArticles: async (): Promise<Article[]> => {
    if (!hasSupabase) return articleService.getArticles();
    try {
      const { supabase } = await import('../utils/supabase/client');
      const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (error || !data) return articleService.getArticles();
      return data as Article[];
    } catch { return articleService.getArticles(); }
  },

  getArticleById: async (id: string): Promise<Article | undefined> => {
    if (!hasSupabase) return articleService.getArticleById(id);
    try {
      const { supabase } = await import('../utils/supabase/client');
      const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
      if (error || !data) return articleService.getArticleById(id);
      return data as Article;
    } catch { return articleService.getArticleById(id); }
  },

  addArticle: async (article: Article): Promise<void> => {
    if (!hasSupabase) { await articleService.addArticle(article); return; }
    try {
      const { supabase } = await import('../utils/supabase/client');
      const { error } = await supabase.from('articles').insert([article]);
      if (error) await articleService.addArticle(article);
    } catch { await articleService.addArticle(article); }
  },

  updateArticle: async (id: string, updated: Partial<Article>): Promise<void> => {
    if (!hasSupabase) { await articleService.updateArticle(id, updated); return; }
    try {
      const { supabase } = await import('../utils/supabase/client');
      const { error } = await supabase.from('articles').update(updated).eq('id', id);
      if (error) await articleService.updateArticle(id, updated);
    } catch { await articleService.updateArticle(id, updated); }
  },

  deleteArticle: async (id: string): Promise<void> => {
    if (!hasSupabase) { await articleService.deleteArticle(id); return; }
    try {
      const { supabase } = await import('../utils/supabase/client');
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) await articleService.deleteArticle(id);
    } catch { await articleService.deleteArticle(id); }
  },
};