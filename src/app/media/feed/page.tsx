import PostFeed from '@/components/media/PostFeed';
import StoriesRow from '@/components/media/StoriesRow';
import RightSidebar from '@/components/media/RightSidebar';

export default function FeedPage() {
  return (
    <div className="flex justify-center gap-8 px-4 py-6">
      <div className="w-full max-w-[630px]">
        <StoriesRow />
        <PostFeed />
      </div>
      <aside className="hidden xl:block w-[330px] shrink-0 pt-2">
        <RightSidebar />
      </aside>
    </div>
  );
}
