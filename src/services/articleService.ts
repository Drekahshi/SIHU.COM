import { supabase } from '../utils/supabase/client';
import { Article, defaultArticles } from '../constants/articles';

const STORAGE_KEY = 'sango_articles';

export const articleService = {
  getArticles: async (): Promise<Article[]> => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles from Supabase:', error);
        // Fallback to localStorage
        return getArticlesFromStorage();
      }

      // If data is empty array (database is empty), fallback to default
      if (data && data.length === 0) {
          const localData = getArticlesFromStorage();
          return localData && localData.length > 0 ? localData : defaultArticles;
      }

      return data || defaultArticles;
    } catch (error) {
      console.error('Error fetching articles from Supabase:', error);
      // Fallback to localStorage
      return getArticlesFromStorage();
    }
  },

  getArticleById: async (id: string): Promise<Article | undefined> => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        // `.maybeSingle()` should not error on 0 rows, but guard anyway.
        if ((error as any)?.code !== 'PGRST116') {
          console.error('Error fetching article from Supabase:', error);
        }
        return getArticleByIdFromStorage(id);
      }

      // If Supabase returns null (0 rows), fall back to local defaults.
      return data ?? getArticleByIdFromStorage(id);
    } catch (error) {
      console.error('Error fetching article from Supabase:', error);
      return getArticleByIdFromStorage(id);
    }
  },

  addArticle: async (article: Article): Promise<void> => {
    try {
      const { error } = await supabase
        .from('articles')
        .insert([article]);

      if (error) {
        console.error('Error adding article to Supabase:', error);
        // Fallback to localStorage
        addArticleToStorage(article);
      }
    } catch (error) {
      console.error('Error adding article to Supabase:', error);
      addArticleToStorage(article);
    }
  },

  updateArticle: async (id: string, updated: Partial<Article>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('articles')
        .update(updated)
        .eq('id', id);

      if (error) {
        console.error('Error updating article in Supabase:', error);
        updateArticleInStorage(id, updated);
      }
    } catch (error) {
      console.error('Error updating article in Supabase:', error);
      updateArticleInStorage(id, updated);
    }
  },

  deleteArticle: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting article from Supabase:', error);
        deleteArticleFromStorage(id);
      }
    } catch (error) {
      console.error('Error deleting article from Supabase:', error);
      deleteArticleFromStorage(id);
    }
  }
};

// Local storage fallback functions
const getArticlesFromStorage = (): Article[] => {
  if (typeof window === 'undefined') return defaultArticles;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : defaultArticles;
};

const getArticleByIdFromStorage = (id: string): Article | undefined => {
  return getArticlesFromStorage().find(a => a.id === id);
};

const addArticleToStorage = (article: Article) => {
  const articles = getArticlesFromStorage();
  saveArticlesToStorage([article, ...articles]);
};

const updateArticleInStorage = (id: string, updated: Partial<Article>) => {
  const articles = getArticlesFromStorage().map(a =>
    a.id === id ? { ...a, ...updated } : a
  );
  saveArticlesToStorage(articles);
};

const deleteArticleFromStorage = (id: string) => {
  const articles = getArticlesFromStorage().filter(a => a.id !== id);
  saveArticlesToStorage(articles);
};

const saveArticlesToStorage = (articles: Article[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }
};
