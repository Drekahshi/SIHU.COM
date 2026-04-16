import { supabase } from '../utils/supabase/client';

export type TickerItem = {
  id: string;
  text: string;
  is_breaking: boolean;
  created_at?: string;
};

const STORAGE_KEY = 'sango_ticker';

export const tickerService = {
  getTickerItems: async (): Promise<TickerItem[]> => {
    try {
      const { data, error } = await supabase
        .from('ticker_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching ticker from Supabase:', error);
        return getTickerFromStorage();
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching ticker from Supabase:', error);
      return getTickerFromStorage();
    }
  },

  addTickerItem: async (text: string, isBreaking: boolean = false): Promise<void> => {
    try {
      const { error } = await supabase
        .from('ticker_items')
        .insert([{ text, is_breaking: isBreaking }]);

      if (error) {
        console.error('Error adding ticker to Supabase:', error);
        addTickerToStorage({ id: Date.now().toString(), text, is_breaking: isBreaking });
      }
    } catch (error) {
      console.error('Error adding ticker to Supabase:', error);
      addTickerToStorage({ id: Date.now().toString(), text, is_breaking: isBreaking });
    }
  },

  deleteTickerItem: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('ticker_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting ticker from Supabase:', error);
        deleteTickerFromStorage(id);
      }
    } catch (error) {
      console.error('Error deleting ticker from Supabase:', error);
      deleteTickerFromStorage(id);
    }
  }
};

// Local storage fallback
const getTickerFromStorage = (): TickerItem[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const addTickerToStorage = (item: TickerItem) => {
  const items = getTickerFromStorage();
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...items, item]));
  }
};

const deleteTickerFromStorage = (id: string) => {
  const items = getTickerFromStorage().filter(i => i.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
};
