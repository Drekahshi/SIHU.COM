'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { EXPLORE_POSTS } from '@/lib/media/mockData';

const TABS = ['For You', 'Browse', 'Environment', 'Community', 'News'];

export default function ExploreGrid() {
  const [tab, setTab] = useState('For You');

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${
              tab === t
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1">
        {EXPLORE_POSTS.map((p, i) => {
          const tall = i % 5 === 2;
          return (
            <div
              key={p.id}
              className={`relative overflow-hidden rounded-sm bg-slate-100 group ${tall ? 'row-span-2' : ''}`}
              style={{ aspectRatio: tall ? '0.8' : '1' }}
            >
              <Image
                src={p.image_url}
                alt={p.caption}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                <span className="flex items-center gap-1 text-[13px] font-semibold">
                  <Heart size={16} fill="white" />
                  {p.like_count}
                </span>
                <span className="flex items-center gap-1 text-[13px] font-semibold">
                  <MessageCircle size={16} fill="white" />
                  {p.comment_count}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
