import type { Article, Podcast, Event } from '../constants/articles';

/**
 * Content published by SIHU admins on the KAI platform (one database for
 * the whole ecosystem). Admins post news, stories, activities, photos,
 * videos and podcasts in the KAI Information Hub admin; this site shows
 * them next to its own stories, in its own design.
 *
 * Reads the public endpoint /api/hubs/sihu/items. If KAI cannot be
 * reached the site simply shows its own content.
 */

export const KAI_URL = (process.env.NEXT_PUBLIC_KAI_URL || 'https://avax-frontend-seven.vercel.app').replace(/\/+$/, '');
const HUB = 'sihu';

export type KaiKind = 'news' | 'story' | 'activity' | 'photo' | 'video' | 'podcast';
export interface KaiItem {
  id: string; kind: KaiKind; title: string; summary: string | null; url: string | null; hasImage: boolean; hasBody: boolean;
  happenedOn: string | null; authorName: string | null; createdAt: string; updatedAt: string; body?: string | null;
}

/** A photo or video for the media section. */
export interface MediaItem {
  id: string; kind: 'photo' | 'video'; title: string; caption: string | null; image: string | null; url: string | null;
  youtubeId: string | null; date: string;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
export const isKaiId = (id: string) => UUID.test(id);

const FALLBACK_IMAGE = '/images/lake-victoria-bg.png';
export const kaiImage = (it: Pick<KaiItem, 'id' | 'updatedAt' | 'hasImage'>) =>
  it.hasImage ? `${KAI_URL}/api/hubs/${HUB}/items/${it.id}/image?v=${encodeURIComponent(it.updatedAt)}` : null;
export const youtubeId = (url: string | null) =>
  url?.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)?.[1] ?? null;
const readTime = (text: string) => `${Math.max(1, Math.round(text.trim().split(/\s+/).length / 200))} min read`;
const dateWords = (iso: string) => new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' });

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const r = await fetch(`${KAI_URL}${path}`, { next: { revalidate: 60 } } as RequestInit);
    return r.ok ? ((await r.json()) as T) : null;
  } catch {
    return null;
  }
}

let cache: { at: number; items: KaiItem[] } | null = null;

/** All published items, newest first (cached for a minute in the browser). */
export async function kaiItems(): Promise<KaiItem[]> {
  if (cache && Date.now() - cache.at < 60_000) return cache.items;
  const d = await getJson<{ items: KaiItem[] }>(`/api/hubs/${HUB}/items?limit=200`);
  const items = d?.items ?? [];
  cache = { at: Date.now(), items };
  return items;
}

export function toArticle(it: KaiItem): Article {
  const text = it.body || it.summary || '';
  return {
    id: it.id,
    title: it.title,
    category: it.kind === 'story' ? 'Community' : 'Environment',
    excerpt: it.summary || text.slice(0, 220),
    content: text,
    image: kaiImage(it) || FALLBACK_IMAGE,
    author: it.authorName || 'SIHU Desk',
    time: readTime(text),
    type: 'article',
  };
}

export async function kaiArticles(): Promise<Article[]> {
  return (await kaiItems()).filter((it) => it.kind === 'news' || it.kind === 'story').map(toArticle);
}

/** One article or story with its full text (works on the server too). */
export async function kaiArticle(id: string): Promise<Article | undefined> {
  if (!isKaiId(id)) return undefined;
  const d = await getJson<{ item: KaiItem }>(`/api/hubs/${HUB}/items/${id}`);
  return d?.item && (d.item.kind === 'news' || d.item.kind === 'story') ? toArticle(d.item) : undefined;
}

export async function kaiPodcasts(): Promise<(Podcast & { url?: string })[]> {
  return (await kaiItems()).filter((it) => it.kind === 'podcast').map((it) => ({
    id: it.id, title: it.title, episode: it.summary || 'Listen now', duration: it.happenedOn ? dateWords(it.happenedOn) : 'New',
    image: kaiImage(it) || '/images/logo-300x300.jpg', type: 'podcast' as const, url: it.url ?? undefined,
  }));
}

export async function kaiEvents(): Promise<(Event & { url?: string })[]> {
  return (await kaiItems()).filter((it) => it.kind === 'activity').map((it) => ({
    id: it.id, title: it.title, date: it.happenedOn ? dateWords(it.happenedOn) : dateWords(it.createdAt),
    location: 'Lake Victoria Basin', image: kaiImage(it) || FALLBACK_IMAGE, description: it.summary || '',
    type: 'event' as const, url: it.url ?? undefined,
  }));
}

export async function kaiMedia(): Promise<MediaItem[]> {
  return (await kaiItems()).filter((it) => it.kind === 'photo' || it.kind === 'video').map((it) => {
    const yt = it.kind === 'video' ? youtubeId(it.url) : null;
    return {
      id: it.id, kind: it.kind as 'photo' | 'video', title: it.title, caption: it.summary, url: it.url, youtubeId: yt,
      image: kaiImage(it) || (yt ? `https://img.youtube.com/vi/${yt}/hqdefault.jpg` : null),
      date: dateWords(it.happenedOn || it.createdAt),
    };
  });
}
