import { PlusSquare, Image as ImageIcon, Film, Mic } from 'lucide-react';

const CREATE_OPTIONS = [
  { label: 'Photo / Post', desc: 'Share a photo or multi-image post', Icon: ImageIcon },
  { label: 'Reel', desc: 'Share a short video reel', Icon: Film },
  { label: 'Podcast clip', desc: 'Share an audio clip', Icon: Mic },
];

export default function CreatePage() {
  return (
    <div className="px-4 py-10 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <PlusSquare size={28} className="text-sky-500" />
        <h1 className="text-xl font-bold text-slate-900">Create</h1>
      </div>

      <div className="flex flex-col gap-3">
        {CREATE_OPTIONS.map(({ label, desc, Icon }) => (
          <button
            key={label}
            className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-50 group-hover:bg-sky-100 flex items-center justify-center transition-colors shrink-0">
              <Icon size={22} className="text-sky-500" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-slate-900">{label}</p>
              <p className="text-[12px] text-slate-500">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
