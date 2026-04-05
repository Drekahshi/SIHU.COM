import { Article, defaultArticles } from '../constants/articles';

const STORAGE_KEY = 'sango_articles';

export const articleService = {
  getArticles: (): Article[] => {
    if (typeof window === 'undefined') return defaultArticles;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultArticles;
  },
  getArticleById: (id: string): Article | undefined => {
    return articleService.getArticles().find(a => a.id === id);
  },
  saveArticles: (articles: Article[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    }
  },
  addArticle: (article: Article) => {
    const articles = articleService.getArticles();
    articleService.saveArticles([article, ...articles]);
  },
  updateArticle: (id: string, updated: Partial<Article>) => {
    const articles = articleService.getArticles().map(a => 
      a.id === id ? { ...a, ...updated } : a
    );
    articleService.saveArticles(articles);
  },
  deleteArticle: (id: string) => {
    const articles = articleService.getArticles().filter(a => a.id !== id);
    articleService.saveArticles(articles);
  }
};
