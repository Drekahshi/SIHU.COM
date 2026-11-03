'use client';

import { useState } from 'react';
import { Smile, Send } from 'lucide-react';

interface Props {
  onSubmit?: (text: string) => void;
}

export default function CommentInput({ onSubmit }: Props) {
  const [text, setText] = useState('');

  const submit = () => {
    if (!text.trim()) return;
    onSubmit?.(text.trim());
    setText('');
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-t border-slate-100">
      <button className="text-slate-400 hover:text-slate-700 shrink-0">
        <Smile size={22} />
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
        placeholder="Add a comment…"
        className="flex-1 text-[14px] text-slate-800 placeholder:text-slate-400 bg-transparent outline-none"
      />
      {text.trim() && (
        <button
          onClick={submit}
          className="text-sky-500 font-semibold text-[13px] hover:text-sky-700 transition-colors shrink-0"
        >
          Post
        </button>
      )}
    </div>
  );
}
