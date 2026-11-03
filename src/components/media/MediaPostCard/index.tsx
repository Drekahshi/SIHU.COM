'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Heart, MessageCircle, Repeat2, Send, Bookmark, MoreHorizontal, MapPin, BadgeCheck } from 'lucide-react';
import MediaCarousel from '@/components/media/MediaCarousel';
import { usePostViewStore } from '@/store/media/modalStores';
import type { MediaPost } from '@/lib/media/mockData';

function timeAgo(iso: string) {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function formatCount(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

interface Props {
  post: MediaPost;
}

export default function MediaPostCard({ post }: Props) {
  const [liked, setLiked] = useState(post.is_liked);
  const [saved, setSaved] = useState(post.is_saved);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const { open: openModal } = usePostViewStore();

  const handleLike = () => {
    setLiked(v => !v);
    setLikeCount(c => (liked ? c - 1 : c + 1));
  };

  const openPost = () => openModal(post);

  return (
    <article className="border-b border-slate-100 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-4 pb-3">
        <Link href={`/media/profile/${post.user.username}`} className="flex items-center gap-3">
          <Image
            src={post.user.avatar_url}
            alt={post.user.username}
            width={40}
            height={40}
            className="rounded-full object-cover ring-2 ring-sky-300"
          />
          <div>
            <p className="text-[14px] font-semibold text-slate-900 leading-tight flex items-center gap-1">
              {post.user.username}
              {post.user.is_verified && <BadgeCheck size={13} className="text-sky-500" />}
            </p>
            <p className="text-[12px] text-slate-500 leading-tight">
              {timeAgo(post.created_at)}
              {post.location_name && (
                <> · <MapPin size={10} className="inline" /> {post.location_name}</>
              )}
            </p>
          </div>
        </Link>
        <button className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Media */}
      <MediaCarousel
        post={post}
        aspectRatio={`${post.images[0]?.width ?? 1} / ${post.images[0]?.height ?? 1}`}
        dotsBelow
        onDoubleClick={handleLike}
        onClick={openPost}
      />

      {/* Actions */}
      <div className="flex items-center gap-1 px-1 mt-2">
        <button
          onClick={handleLike}
          className={`p-2 rounded-full transition-colors ${liked ? 'text-red-500' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Heart size={22} fill={liked ? 'currentColor' : 'none'} strokeWidth={1.8} />
        </button>
        <button
          onClick={openPost}
          className="p-2 rounded-full text-slate-500 hover:text-slate-800 transition-colors"
        >
          <MessageCircle size={22} strokeWidth={1.8} />
        </button>
        <button className="p-2 rounded-full text-slate-500 hover:text-slate-800 transition-colors">
          <Repeat2 size={22} strokeWidth={1.8} />
        </button>
        <button className="p-2 rounded-full text-slate-500 hover:text-slate-800 transition-colors">
          <Send size={22} strokeWidth={1.8} />
        </button>
        <button
          onClick={() => setSaved(v => !v)}
          className={`p-2 rounded-full ml-auto transition-colors ${saved ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <Bookmark size={22} fill={saved ? 'currentColor' : 'none'} strokeWidth={1.8} />
        </button>
      </div>

      {/* Stats + caption */}
      <div className="px-1 space-y-0.5">
        {!post.hide_likes && (
          <p className="text-[13px] font-semibold text-slate-900">{formatCount(likeCount)} likes</p>
        )}
        <p className="text-[14px] text-slate-800 leading-snug">
          <Link href={`/media/profile/${post.user.username}`} className="font-semibold mr-1 hover:underline">
            {post.user.username}
          </Link>
          {post.caption}
        </p>
        {!post.comments_off && post.comment_count > 0 && (
          <button
            onClick={openPost}
            className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors"
          >
            View all {post.comment_count} comments
          </button>
        )}
        {post.comments[0] && (
          <p className="text-[13px] text-slate-700">
            <span className="font-semibold">{post.comments[0].user.username}</span>{' '}
            {post.comments[0].content}
          </p>
        )}
        <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 capitalize">
          #{post.category}
        </span>
      </div>
    </article>
  );
}
