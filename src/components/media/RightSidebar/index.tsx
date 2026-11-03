import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck } from 'lucide-react';
import { MEDIA_USER, MEDIA_SUGGESTED_USERS } from '@/lib/media/mockData';

export default function RightSidebar() {
  return (
    <div className="sticky top-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/media/profile">
          <Image
            src={MEDIA_USER.avatar_url}
            alt={MEDIA_USER.full_name}
            width={48}
            height={48}
            className="rounded-full object-cover ring-2 ring-sky-400"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            href="/media/profile"
            className="text-[14px] font-semibold text-slate-900 hover:underline flex items-center gap-1"
          >
            {MEDIA_USER.username}
            {MEDIA_USER.is_verified && <BadgeCheck size={13} className="text-sky-500" />}
          </Link>
          <p className="text-[12px] text-slate-500 truncate">{MEDIA_USER.full_name}</p>
        </div>
        <Link href="/portal" className="text-[12px] font-semibold text-sky-600 hover:text-sky-700 shrink-0">
          News Portal
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-semibold text-slate-500">Suggested for you</span>
          <button className="text-[12px] font-semibold text-slate-900 hover:text-slate-600">
            See all
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {MEDIA_SUGGESTED_USERS.map(u => (
            <div key={u.id} className="flex items-center gap-3">
              <Image
                src={u.avatar_url}
                alt={u.full_name}
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-slate-900 flex items-center gap-1 leading-tight">
                  {u.username}
                  {u.is_verified && <BadgeCheck size={11} className="text-sky-500" />}
                </p>
                <p className="text-[11px] text-slate-500">
                  {u.mutual_count > 0 ? `${u.mutual_count} mutual` : 'Suggested'}
                </p>
              </div>
              <button className="text-[12px] font-semibold text-sky-600 hover:text-sky-700 transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="text-[11px] text-slate-400 space-y-1">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {['About', 'Help', 'Press', 'Privacy', 'Terms', 'Locations'].map(l => (
            <a key={l} href="#" className="hover:underline">
              {l}
            </a>
          ))}
        </div>
        <p className="mt-1">© 2026 SIHU Media · Sango Information Hub</p>
      </div>
    </div>
  );
}
