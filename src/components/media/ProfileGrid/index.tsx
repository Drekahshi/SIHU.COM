'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Grid3X3, Film, Bookmark, Repeat2, BadgeCheck, Settings } from 'lucide-react';
import { MEDIA_USER, MEDIA_POSTS } from '@/lib/media/mockData';

const TABS = [
  { label: 'Posts', Icon: Grid3X3 },
  { label: 'Reels', Icon: Film },
  { label: 'Saved', Icon: Bookmark },
  { label: 'Reposts', Icon: Repeat2 },
];

export default function ProfileGrid() {
  const [tab, setTab] = useState('Posts');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 lg:pb-8">
      <div className="flex flex-col sm:flex-row gap-8 mb-8">
        <Image
          src={MEDIA_USER.avatar_url}
          alt={MEDIA_USER.full_name}
          width={96}
          height={96}
          className="rounded-full object-cover ring-4 ring-sky-300 sm:w-36 sm:h-36"
        />

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              {MEDIA_USER.username}
              {MEDIA_USER.is_verified && <BadgeCheck size={18} className="text-sky-500" />}
            </h1>
            <button className="px-4 py-1.5 rounded-lg border border-slate-300 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Edit profile
            </button>
            <button className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors">
              <Settings size={16} className="text-slate-700" />
            </button>
          </div>

          <div className="flex gap-6 mb-4">
            {[
              { label: 'posts', value: MEDIA_USER.posts },
              { label: 'followers', value: MEDIA_USER.followers },
              { label: 'following', value: MEDIA_USER.following },
            ].map(s => (
              <button key={s.label} className="text-center hover:opacity-70 transition-opacity">
                <span className="block text-[15px] font-bold text-slate-900">
                  {s.value.toLocaleString()}
                </span>
                <span className="text-[13px] text-slate-600">{s.label}</span>
              </button>
            ))}
          </div>

          <p className="text-[14px] font-semibold text-slate-900">{MEDIA_USER.full_name}</p>
          <p className="text-[14px] text-slate-700 mt-0.5 whitespace-pre-line">{MEDIA_USER.bio}</p>
          {MEDIA_USER.website && (
            <a
              href={MEDIA_USER.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-sky-600 font-semibold hover:underline mt-1 inline-block"
            >
              {MEDIA_USER.website.replace('https://', '')}
            </a>
          )}
        </div>
      </div>

      <div className="flex border-t border-slate-200">
        {TABS.map(({ label, Icon }) => (
          <button
            key={label}
            onClick={() => setTab(label)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[12px] font-semibold tracking-wider uppercase transition-colors border-t-2 -mt-px ${
              tab === label
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {tab === 'Posts' ? (
        <div className="grid grid-cols-3 gap-1 mt-1">
          {MEDIA_POSTS.map(p => (
            <div
              key={p.id}
              className="relative aspect-square bg-slate-100 overflow-hidden group"
            >
              <Image
                src={p.image_url}
                alt={p.caption}
                fill
                className="object-cover group-hover:brightness-75 transition-all"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-slate-400">
          <p className="text-lg">No {tab.toLowerCase()} yet</p>
        </div>
      )}
    </div>
  );
}
