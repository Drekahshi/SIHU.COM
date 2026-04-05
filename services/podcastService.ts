import { Podcast, defaultPodcasts } from '../constants/articles';

const STORAGE_KEY = 'sango_podcasts';

export const podcastService = {
  getPodcasts: (): Podcast[] => {
    if (typeof window === 'undefined') return defaultPodcasts;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultPodcasts;
  },
  savePodcasts: (podcasts: Podcast[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(podcasts));
    }
  },
  addPodcast: (podcast: Podcast) => {
    const podcasts = podcastService.getPodcasts();
    podcastService.savePodcasts([podcast, ...podcasts]);
  },
  updatePodcast: (id: string, updated: Partial<Podcast>) => {
    const podcasts = podcastService.getPodcasts().map(p => 
      p.id === id ? { ...p, ...updated } : p
    );
    podcastService.savePodcasts(podcasts);
  },
  deletePodcast: (id: string) => {
    const podcasts = podcastService.getPodcasts().filter(p => p.id !== id);
    podcastService.savePodcasts(podcasts);
  }
};
