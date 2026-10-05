import { Article, defaultArticles } from '../constants/articles';
import { publishingService } from './content/publishingService';
import { isKaiId, kaiArticle, kaiArticles } from './kaiHubService';

const STORAGE_KEY = 'sango_articles';
/** The flagship story shown first on the portal. */
const FEATURED_ID = 'circular-economy-water';

export const articleService = {
  getArticles: async (): Promise<Article[]> => {
    // Order on the portal:
    // 1. the site's flagship story (Victor and Marvin Bwire) stays on top,
    // 2. then the newest posts from the SIHU admin (KAI Information Hub),
    // 3. then stories submitted here, then the rest of the site's own stories.
    const fromHub = await kaiArticles().catch(() => [] as Article[]);
    const own = getArticlesFromStorage();
    let submitted: Article[] = [];
    try {
      const published = await publishingService.getPublishedArticles();
      submitted = published
        // The two built-in sample submissions are demo data, not real news.
        .filter(p => !p.id.startsWith('art_seed_'))
        .map(p => ({
          id: p.id,
          title: p.title,
          excerpt: p.summary,
          content: p.content,
          author: p.authorName,
          category: p.category,
          image: p.coverImageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80',
          time: '5 min read',
          type: 'article' as const,
        }));
    } catch { /* submissions are optional */ }
    const featured = own.find(a => a.id === FEATURED_ID) ?? own[0];
    const seen = new Set<string>();
    return [featured, ...fromHub, ...submitted, ...own].filter((a): a is Article => {
      if (!a || seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    });
  },

  getArticleById: async (id: string): Promise<Article | undefined> => {
    if (isKaiId(id)) {
      const fromHub = await kaiArticle(id).catch(() => undefined);
      if (fromHub) return fromHub;
    }
    try {
      const p = await publishingService.getArticleById(id);
      if (p) {
        return {
          id: p.id,
          title: p.title,
          excerpt: p.summary,
          content: p.content,
          author: p.authorName,
          category: p.category,
          image: p.coverImageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80',
          time: '5 min read',
          type: 'article' as const,
        };
      }
    } catch { /* fallback */ }
    return getArticleByIdFromStorage(id);
  },

  addArticle: async (article: Article): Promise<void> => {
    addArticleToStorage(article);
  },

  updateArticle: async (id: string, updated: Partial<Article>): Promise<void> => {
    updateArticleInStorage(id, updated);
  },

  deleteArticle: async (id: string): Promise<void> => {
    deleteArticleFromStorage(id);
  }
};

// Local storage storage functions
const getArticlesFromStorage = (): Article[] => {
  if (typeof window === 'undefined') return defaultArticles;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    saveArticlesToStorage(defaultArticles);
    return defaultArticles;
  }
  try {
    const parsed = JSON.parse(stored);
    return parsed && parsed.length > 0 ? parsed : defaultArticles;
  } catch {
    return defaultArticles;
  }
};

const getArticleByIdFromStorage = (id: string): Article | undefined => {
  return getArticlesFromStorage().find(a => a.id === id);
};

const addArticleToStorage = (article: Article) => {
  const articles = getArticlesFromStorage();
  saveArticlesToStorage([article, ...articles.filter(a => a.id !== article.id)]);
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
