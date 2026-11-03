import { Heart } from 'lucide-react';

export default function LikedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-16 h-16 rounded-full border-2 border-slate-200 flex items-center justify-center mb-4">
        <Heart size={28} strokeWidth={1.5} className="text-slate-400" />
      </div>
      <h1 className="text-xl font-bold text-slate-900 mb-2">Liked Posts</h1>
      <p className="text-slate-500 text-sm max-w-xs">
        Posts you like will appear here.
      </p>
    </div>
  );
}
