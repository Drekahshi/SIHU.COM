import { create } from 'zustand';
import type { MediaPost } from '@/lib/media/mockData';

// ─── Generic modal factory ────────────────────────────────────────────────────

interface ModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

function createModalStore() {
  return create<ModalStore>(set => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  }));
}

interface ModalStoreWithData<T> {
  isOpen: boolean;
  data: T | null;
  open: (data: T) => void;
  close: () => void;
}

function createModalStoreWithData<T>() {
  return create<ModalStoreWithData<T>>(set => ({
    isOpen: false,
    data: null,
    open: (data: T) => set({ isOpen: true, data }),
    close: () => set({ isOpen: false, data: null }),
  }));
}

// ─── Modal instances ──────────────────────────────────────────────────────────

export const useMediaSearchStore = createModalStore();
export const useMediaNotificationsStore = createModalStore();
export const useCreateStoryStore = createModalStore();

export type CreatePostMode = 'post' | 'reel';

interface CreatePostStore {
  isOpen: boolean;
  mode: CreatePostMode;
  open: (mode?: CreatePostMode) => void;
  close: () => void;
}

export const useCreatePostStore = create<CreatePostStore>(set => ({
  isOpen: false,
  mode: 'post',
  open: (mode = 'post') => set({ isOpen: true, mode }),
  close: () => set({ isOpen: false }),
}));

export const useSharePostStore = createModalStoreWithData<string>();

// ─── Post view modal ──────────────────────────────────────────────────────────

interface PostViewStore {
  isOpen: boolean;
  post: MediaPost | null;
  initialIndex: number;
  open: (post: MediaPost, initialIndex?: number) => void;
  close: () => void;
}

export const usePostViewStore = create<PostViewStore>(set => ({
  isOpen: false,
  post: null,
  initialIndex: 0,
  open: (post, initialIndex = 0) => set({ isOpen: true, post, initialIndex }),
  close: () => set({ isOpen: false, post: null, initialIndex: 0 }),
}));

// ─── Follow list modal ────────────────────────────────────────────────────────

export type FollowListType = 'followers' | 'following';

interface FollowListStore {
  isOpen: boolean;
  type: FollowListType;
  userId: string;
  open: (type: FollowListType, userId: string) => void;
  close: () => void;
}

export const useFollowListStore = create<FollowListStore>(set => ({
  isOpen: false,
  type: 'followers',
  userId: '',
  open: (type, userId) => set({ isOpen: true, type, userId }),
  close: () => set({ isOpen: false }),
}));
