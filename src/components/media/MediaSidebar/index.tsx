'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  Compass,
  Film,
  Send,
  Heart,
  PlusSquare,
  User,
  ArrowLeft,
} from 'lucide-react';
import { MEDIA_USER } from '@/lib/media/mockData';

interface NavItem {
  label: string;
  href: string;
  Icon: React.ElementType;
}

const NAV: NavItem[] = [
  { label: 'Feed', href: '/media/feed', Icon: Home },
  { label: 'Search', href: '/media/search', Icon: Search },
  { label: 'Explore', href: '/media/explore', Icon: Compass },
  { label: 'Reels', href: '/media/reels', Icon: Film },
  { label: 'Messages', href: '/media/direct', Icon: Send },
  { label: 'Liked', href: '/media/liked', Icon: Heart },
  { label: 'Create', href: '/media/create', Icon: PlusSquare },
  { label: 'Profile', href: '/media/profile', Icon: User },
];

const MOBILE_LABELS = new Set(['Feed', 'Explore', 'Reels', 'Create', 'Profile']);

export default function MediaSidebar() {
  const path = usePathname() ?? '';

  const active = (href: string) =>
    href === '/media/feed' ? path === '/media' || path === '/media/feed' : path.startsWith(href);

  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-[244px] xl:w-[280px] flex-col border-r border-slate-200 bg-white z-40 px-3 py-6">
        <Link
          href="/portal"
          className="flex items-center gap-2 px-3 py-2 mb-3 text-sm text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to SIHU</span>
        </Link>

        <Link href="/media/feed" className="flex items-center gap-2 px-3 py-2 mb-5">
          <Image
            src="/images/logo-main.png"
            alt="SIHU"
            width={110}
            height={32}
            className="h-8 w-auto object-contain"
            priority
          />
          <span className="text-[12px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
            Media
          </span>
        </Link>

        <nav className="flex-1 flex flex-col gap-0.5">
          {NAV.map(({ label, href, Icon }) => {
            const on = active(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-4 px-3 py-3 rounded-xl text-[15px] transition-colors ${
                  on
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={22} strokeWidth={on ? 2.5 : 1.8} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-100">
          <Link
            href="/media/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Image
              src={MEDIA_USER.avatar_url}
              alt={MEDIA_USER.full_name}
              width={36}
              height={36}
              className="rounded-full object-cover ring-2 ring-sky-400"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slate-900 truncate">{MEDIA_USER.username}</p>
              <p className="text-[12px] text-slate-500 truncate">{MEDIA_USER.full_name}</p>
            </div>
          </Link>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex items-center justify-around px-2 h-14">
        {NAV.filter(n => MOBILE_LABELS.has(n.label)).map(({ label, href, Icon }) => {
          const on = active(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 ${
                on ? 'text-sky-600' : 'text-slate-500'
              }`}
            >
              <Icon size={22} strokeWidth={on ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
