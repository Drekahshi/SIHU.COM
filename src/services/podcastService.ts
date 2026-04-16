import { supabase } from '../utils/supabase/client';
import { Podcast, defaultPodcasts } from '../constants/articles';

const STORAGE_KEY = 'sango_podcasts';

export const podcastService = {
  getPodcasts: async (): Promise<Podcast[]> => {
    try {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching podcasts from Supabase:', error);
        return getPodcastsFromStorage();
      }

      if (data && data.length === 0) {
          const localData = getPodcastsFromStorage();
          return localData && localData.length > 0 ? localData : defaultPodcasts;
      }

      // Map Supabase fields to Podcast type
      return data.map((p: any) => ({
        id: p.id,
        title: p.title,
        episode: p.episode || p.description, // Fallback
        duration: p.duration,
        image: p.image || p.image_url, // Handle rename
        type: 'podcast'
      })) || defaultPodcasts;
    } catch (error) {
      console.error('Error fetching podcasts from Supabase:', error);
      return getPodcastsFromStorage();
    }
  },

  addPodcast: async (podcast: Podcast): Promise<void> => {
    try {
      const { error } = await supabase
        .from('podcasts')
        .insert([{
          id: podcast.id,
          title: podcast.title,
          episode: podcast.episode,
          duration: podcast.duration,
          image: podcast.image,
          type: 'podcast'
        }]);

      if (error) {
        console.error('Error adding podcast to Supabase:', error);
        addPodcastToStorage(podcast);
      }
    } catch (error) {
      console.error('Error adding podcast to Supabase:', error);
      addPodcastToStorage(podcast);
    }
  },

  deletePodcast: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('podcasts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting podcast from Supabase:', error);
        deletePodcastFromStorage(id);
      }
    } catch (error) {
      console.error('Error deleting podcast from Supabase:', error);
      deletePodcastFromStorage(id);
    }
  }
};

// Local storage fallback
const getPodcastsFromStorage = (): Podcast[] => {
  if (typeof window === 'undefined') return defaultPodcasts;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : defaultPodcasts;
};

const addPodcastToStorage = (podcast: Podcast) => {
  const podcasts = getPodcastsFromStorage();
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([podcast, ...podcasts]));
  }
};

const deletePodcastFromStorage = (id: string) => {
  const podcasts = getPodcastsFromStorage().filter(p => p.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podcasts));
  }
};
