import { Search } from 'lucide-react';

export default function SearchPage() {
  return (
    <div className="px-4 py-6 max-w-2xl">
      <h1 className="text-xl font-bold text-slate-900 mb-4">Search</h1>
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search people, posts, topics..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-400 transition-all"
        />
      </div>
      <p className="text-slate-400 text-sm text-center pt-12">
        Search results will appear here
      </p>
    </div>
  );
}
