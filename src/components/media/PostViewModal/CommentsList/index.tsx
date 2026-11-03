import type { MediaComment } from '@/lib/media/mockData';
import CommentItem from '@/components/media/PostViewModal/CommentItem';

interface Props {
  comments: MediaComment[];
}

export default function CommentsList({ comments }: Props) {
  if (comments.length === 0) {
    return (
      <p className="text-[13px] text-slate-400 text-center py-8">
        No comments yet. Be the first to comment.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map(c => (
        <div key={c.id}>
          <CommentItem comment={c} />
          {c.replies.map(r => (
            <div key={r.id} className="mt-3">
              <CommentItem comment={r} isReply />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
