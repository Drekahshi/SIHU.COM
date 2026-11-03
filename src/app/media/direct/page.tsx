import Link from 'next/link';
import { Send } from 'lucide-react';

export default function DirectPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      <div className="w-20 h-20 rounded-full border-2 border-slate-900 flex items-center justify-center mb-6">
        <Send size={32} strokeWidth={1.5} className="text-slate-900" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Your Messages</h1>
      <p className="text-slate-500 max-w-xs mb-6 text-sm">
        Send private messages and share posts with community members.
      </p>
      <button className="px-6 py-2.5 bg-sky-500 text-white rounded-full font-semibold text-sm hover:bg-sky-600 transition-colors">
        Send Message
      </button>
      <Link href="/media/feed" className="mt-4 text-sm text-slate-500 hover:text-slate-700">
        Back to feed
      </Link>
    </div>
  );
}
