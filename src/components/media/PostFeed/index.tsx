'use client';

import { useState } from 'react';
import { MEDIA_POSTS } from '@/lib/media/mockData';
import MediaPostCard from '@/components/media/MediaPostCard';

const TABS = [
  { label: 'For You', value: 'home' },
  { label: 'Following', value: 'following' },
];

export default function PostFeed() {
  const [tab, setTab] = useState('home');

  return (
    <div>
      <div className="flex border-b border-slate-200 mb-6">
        {TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`flex-1 py-3 text-[14px] font-semibold transition-colors relative ${
              tab === t.value ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
            {tab === t.value && (
              <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-slate-900 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-0">
        {MEDIA_POSTS.map(p => (
          <MediaPostCard key={p.id} post={p} />
        ))}
        <div className="py-12 text-center text-slate-400 text-sm">You&apos;re all caught up ✓</div>
      </div>
    </div>
  );
}
