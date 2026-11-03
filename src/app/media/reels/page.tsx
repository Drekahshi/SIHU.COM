import Link from 'next/link';

export default function ReelsPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center px-6">
        <div className="text-6xl mb-6">🎬</div>
        <h1 className="text-2xl font-bold mb-3">Reels</h1>
        <p className="text-slate-400 max-w-sm text-sm mb-6">
          Short video reels from the Lake Victoria Basin community will appear here once video uploads are connected.
        </p>
        <Link
          href="/media/feed"
          className="inline-block px-6 py-2.5 bg-white text-black rounded-full font-semibold text-sm hover:bg-slate-100 transition-colors"
        >
          Back to Feed
        </Link>
      </div>
    </div>
  );
}
