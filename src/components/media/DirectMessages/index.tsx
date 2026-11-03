'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Edit, ArrowLeft, Send } from 'lucide-react';
import { MEDIA_CONVERSATIONS, MEDIA_USER, type Conversation } from '@/lib/media/mockData';

function timeAgo(iso: string) {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (h < 1) return 'now';
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function ConversationList({
  conversations,
  selected,
  onSelect,
}: {
  conversations: Conversation[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col">
      {conversations.map(c => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left ${selected === c.id ? 'bg-slate-50' : ''}`}
        >
          <div className="relative shrink-0">
            <Image
              src={c.avatar_url}
              alt={c.username}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
            {c.unread && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-sky-500 border-2 border-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className={`text-[14px] truncate ${c.unread ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                {c.username}
              </p>
              <span className="text-[11px] text-slate-400 shrink-0 ml-2">
                {timeAgo(c.last_message_time)}
              </span>
            </div>
            <p className={`text-[13px] truncate ${c.unread ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
              {c.last_message}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

function ChatView({
  conversation,
  onBack,
}: {
  conversation: Conversation;
  onBack: () => void;
}) {
  const [messages, setMessages] = useState(conversation.messages);
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        content: text.trim(),
        sender_id: MEDIA_USER.id,
        created_at: new Date().toISOString(),
        is_own: true,
      },
    ]);
    setText('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 shrink-0">
        <button
          onClick={onBack}
          className="md:hidden p-1 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={20} />
        </button>
        <Image
          src={conversation.avatar_url}
          alt={conversation.username}
          width={36}
          height={36}
          className="rounded-full object-cover"
        />
        <p className="text-[15px] font-semibold text-slate-900">{conversation.username}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex ${m.is_own ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-[14px] leading-snug ${
                m.is_own
                  ? 'bg-sky-500 text-white rounded-br-sm'
                  : 'bg-slate-100 text-slate-900 rounded-bl-sm'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-slate-100 px-4 py-3 flex items-center gap-3">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Message..."
          className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-[14px] text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-400 transition-all"
        />
        <button
          onClick={send}
          className={`p-2 rounded-full transition-colors ${text.trim() ? 'text-sky-500 hover:text-sky-700' : 'text-slate-300'}`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

export default function DirectMessages() {
  const [selected, setSelected] = useState<string | null>(null);
  const activeConv = MEDIA_CONVERSATIONS.find(c => c.id === selected) ?? null;

  return (
    <div className="flex h-[calc(100vh-56px)] lg:h-screen border-l border-slate-200">
      {/* Sidebar list */}
      <div className={`w-full md:w-[360px] border-r border-slate-200 flex flex-col ${selected ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex items-center justify-between px-5 pt-6 pb-4 shrink-0">
          <h1 className="text-[18px] font-bold text-slate-900">{MEDIA_USER.username}</h1>
          <button className="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors">
            <Edit size={20} />
          </button>
        </div>
        <div className="px-4 mb-3">
          <p className="text-[14px] font-semibold text-slate-900">Messages</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            conversations={MEDIA_CONVERSATIONS}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex-1 ${!selected ? 'hidden md:flex' : 'flex'} flex-col`}>
        {activeConv ? (
          <ChatView conversation={activeConv} onBack={() => setSelected(null)} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
            <div className="w-20 h-20 rounded-full border-2 border-slate-900 flex items-center justify-center">
              <Send size={32} strokeWidth={1.5} className="text-slate-900" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Your messages</h2>
            <p className="text-slate-500 text-sm max-w-xs">
              Send private messages to share posts and connect with the community.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
