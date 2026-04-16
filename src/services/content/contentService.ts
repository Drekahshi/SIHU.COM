/**
 * Content Service
 * Handles all content operations (articles, podcasts, events)
 * Integrates with Supabase for data persistence
 */

import { supabase } from '@/utils/supabase/client';
import { Article, Podcast, Event, ApiResponse } from '@/types';

export const contentService = {
  /**
   * Get all articles
   */
  async getArticles(): Promise<ApiResponse<Article[]>> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as Article[],
      };
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      return {
        success: false,
        error: 'Failed to fetch articles',
      };
    }
  },

  /**
   * Get article by ID
   */
  async getArticleById(id: string): Promise<ApiResponse<Article>> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as Article,
      };
    } catch (error) {
      console.error('Failed to fetch article:', error);
      return {
        success: false,
        error: 'Failed to fetch article',
      };
    }
  },

  /**
   * Get all podcasts
   */
  async getPodcasts(): Promise<ApiResponse<Podcast[]>> {
    try {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as Podcast[],
      };
    } catch (error) {
      console.error('Failed to fetch podcasts:', error);
      return {
        success: false,
        error: 'Failed to fetch podcasts',
      };
    }
  },

  /**
   * Get all events
   */
  async getEvents(): Promise<ApiResponse<Event[]>> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as Event[],
      };
    } catch (error) {
      console.error('Failed to fetch events:', error);
      return {
        success: false,
        error: 'Failed to fetch events',
      };
    }
  },

  /**
   * Create new article (admin only)
   */
  async createArticle(
    article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<Article>> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .insert([
          {
            ...article,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as Article,
      };
    } catch (error) {
      console.error('Failed to create article:', error);
      return {
        success: false,
        error: 'Failed to create article',
      };
    }
  },

  /**
   * Update article (admin only)
   */
  async updateArticle(
    id: string,
    updates: Partial<Article>
  ): Promise<ApiResponse<Article>> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as Article,
      };
    } catch (error) {
      console.error('Failed to update article:', error);
      return {
        success: false,
        error: 'Failed to update article',
      };
    }
  },

  /**
   * Delete article (admin only)
   */
  async deleteArticle(id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data: null,
      };
    } catch (error) {
      console.error('Failed to delete article:', error);
      return {
        success: false,
        error: 'Failed to delete article',
      };
    }
  },
};
