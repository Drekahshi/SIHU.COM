'use client';

import PostViewModal from '@/components/media/PostViewModal';
import NotificationsPanel from '@/components/media/NotificationsPanel';
import SearchPanel from '@/components/media/SearchPanel';

export default function MediaOverlays() {
  return (
    <>
      <PostViewModal />
      <NotificationsPanel />
      <SearchPanel />
    </>
  );
}
