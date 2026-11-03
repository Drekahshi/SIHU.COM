import Image from 'next/image';
import { Plus } from 'lucide-react';
import { MEDIA_STORIES, MEDIA_USER } from '@/lib/media/mockData';

export default function StoriesRow() {
  return (
    <div className="mb-6 border border-slate-200 rounded-2xl bg-white p-4">
      <div className="flex gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="relative">
            <Image
              src={MEDIA_USER.avatar_url}
              alt="Your story"
              width={56}
              height={56}
              className="rounded-full object-cover border-2 border-slate-200"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center border-2 border-white">
              <Plus size={11} strokeWidth={3} className="text-white" />
            </span>
          </div>
          <span className="text-[11px] text-slate-600 font-medium w-14 text-center truncate">
            Your story
          </span>
        </div>

        {MEDIA_STORIES.map(s => (
          <div key={s.userId} className="flex flex-col items-center gap-1.5 shrink-0">
            <div
              className={`p-[2px] rounded-full ${
                s.hasUnseen
                  ? 'bg-gradient-to-tr from-sky-400 to-emerald-400'
                  : 'bg-slate-300'
              }`}
            >
              <Image
                src={s.avatarUrl}
                alt={s.username}
                width={52}
                height={52}
                className="rounded-full object-cover border-2 border-white"
              />
            </div>
            <span className="text-[11px] text-slate-600 font-medium w-14 text-center truncate">
              {s.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
