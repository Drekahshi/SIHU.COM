import { supabase } from '../utils/supabase/client';
import { Article, defaultArticles } from '../constants/articles';

export const supabaseArticleService = {
  // Get all articles from Supabase
  getArticles: async (): Promise<Article[]> => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        // Fallback to localStorage if Supabase fails
        return articleService.getArticles();
      }

      return data || defaultArticles;
    } catch (error) {
      console.error('Error fetching articles:', error);
      // Fallback to localStorage
      return articleService.getArticles();
    }
  },

  // Get article by ID
  getArticleById: async (id: string): Promise<Article | undefined> => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching article:', error);
        return articleService.getArticleById(id);
      }

      return data;
    } catch (error) {
      console.error('Error fetching article:', error);
      return articleService.getArticleById(id);
    }
  },

  // Add new article
  addArticle: async (article: Article): Promise<void> => {
    try {
      const { error } = await supabase
        .from('articles')
        .insert([article]);

      if (error) {
        console.error('Error adding article:', error);
        // Fallback to localStorage
        articleService.addArticle(article);
      }
    } catch (error) {
      console.error('Error adding article:', error);
      articleService.addArticle(article);
    }
  },

  // Update article
  updateArticle: async (id: string, updated: Partial<Article>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('articles')
        .update(updated)
        .eq('id', id);

      if (error) {
        console.error('Error updating article:', error);
        articleService.updateArticle(id, updated);
      }
    } catch (error) {
      console.error('Error updating article:', error);
      articleService.updateArticle(id, updated);
    }
  },

  // Delete article
  deleteArticle: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting article:', error);
        articleService.deleteArticle(id);
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      articleService.deleteArticle(id);
    }
  }
};

// Import the existing service for fallback
import { articleService } from './articleService';