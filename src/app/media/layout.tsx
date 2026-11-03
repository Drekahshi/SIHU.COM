import type { Metadata } from 'next';
import MediaSidebar from '@/components/media/MediaSidebar';
import MediaOverlays from '@/components/media/MediaOverlays';

export const metadata: Metadata = {
  title: 'SIHU Media | Sango Information Hub',
  description: 'Share and discover photos, videos and stories from the Lake Victoria Basin community.',
};

export default function MediaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      <MediaSidebar />
      <main className="flex-1 ml-0 lg:ml-[244px] xl:ml-[280px] min-h-screen pb-14 lg:pb-0">
        {children}
      </main>
      <MediaOverlays />
    </div>
  );
}
