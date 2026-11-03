import Image from 'next/image';
import { Heart } from 'lucide-react';
import type { MediaComment } from '@/lib/media/mockData';

function timeAgo(iso: string) {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

interface Props {
  comment: MediaComment;
  isReply?: boolean;
}

export default function CommentItem({ comment, isReply = false }: Props) {
  return (
    <div className={`flex gap-3 ${isReply ? 'ml-10' : ''}`}>
      <Image
        src={comment.user.avatar_url}
        alt={comment.user.username}
        width={isReply ? 28 : 32}
        height={isReply ? 28 : 32}
        className="rounded-full object-cover shrink-0 self-start mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-slate-800 leading-snug">
          <span className="font-semibold mr-1">{comment.user.username}</span>
          {comment.content}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[11px] text-slate-400">{timeAgo(comment.created_at)}</span>
          {comment.like_count > 0 && (
            <span className="text-[11px] text-slate-400">{comment.like_count} likes</span>
          )}
          <button className="text-[11px] font-semibold text-slate-400 hover:text-slate-700">
            Reply
          </button>
        </div>
      </div>
      <button className="shrink-0 self-start mt-1 text-slate-400 hover:text-slate-700">
        <Heart size={12} />
      </button>
    </div>
  );
}
