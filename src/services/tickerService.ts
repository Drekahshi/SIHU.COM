export type TickerItem = {
  id: string;
  text: string;
  is_breaking: boolean;
  created_at?: string;
};

const STORAGE_KEY = 'sango_ticker';

const hasSupabase =
  typeof process !== 'undefined' &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

export const tickerService = {
  getTickerItems: async (): Promise<TickerItem[]> => {
    if (!hasSupabase) return getTickerFromStorage();
    try {
      const { supabase } = await import('../utils/supabase/client');
      const { data, error } = await supabase.from('ticker_items').select('*').order('created_at', { ascending: false });
      if (error || !data) return getTickerFromStorage();
      return data as TickerItem[];
    } catch { return getTickerFromStorage(); }
  },

  addTickerItem: async (text: string, isBreaking = false): Promise<void> => {
    if (!hasSupabase) { addTickerToStorage({ id: Date.now().toString(), text, is_breaking: isBreaking }); return; }
    try {
      const { supabase } = await import('../utils/supabase/client');
      const { error } = await supabase.from('ticker_items').insert([{ text, is_breaking: isBreaking }]);
      if (error) addTickerToStorage({ id: Date.now().toString(), text, is_breaking: isBreaking });
    } catch { addTickerToStorage({ id: Date.now().toString(), text, is_breaking: isBreaking }); }
  },

  deleteTickerItem: async (id: string): Promise<void> => {
    if (!hasSupabase) { deleteTickerFromStorage(id); return; }
    try {
      const { supabase } = await import('../utils/supabase/client');
      const { error } = await supabase.from('ticker_items').delete().eq('id', id);
      if (error) deleteTickerFromStorage(id);
    } catch { deleteTickerFromStorage(id); }
  },
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
