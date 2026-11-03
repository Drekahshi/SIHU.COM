export const MEDIA_USER = {
  id: 'sihu-demo-001',
  username: 'sihu_hub',
  full_name: 'SIHU Hub',
  avatar_url: 'https://picsum.photos/seed/sihu/80/80',
  bio: 'Sango Information Hub\nKnowledge · Community · Environment 🌊',
  website: 'https://sangoinformationhub.com',
  is_verified: true,
  is_private: false,
  followers: 1240,
  following: 88,
  posts: 10,
};

export interface MediaPost {
  id: string;
  type: 'post' | 'reel';
  caption: string;
  category: string;
  created_at: string;
  aspect_ratio: number;
  hide_likes: boolean;
  comments_off: boolean;
  location_name: string | null;
  like_count: number;
  comment_count: number;
  image_url: string;
  image_width: number;
  image_height: number;
  user: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    is_verified: boolean;
  };
  first_comment: {
    username: string;
    content: string;
  } | null;
}

const post = (
  seed: number,
  caption: string,
  created: string,
  category: string,
): MediaPost => ({
  id: `post-${seed}`,
  type: 'post',
  caption,
  category,
  created_at: created,
  aspect_ratio: seed % 3 === 0 ? 0.8 : 1,
  hide_likes: false,
  comments_off: false,
  location_name: seed % 4 === 0 ? 'Lake Victoria, Kenya' : null,
  like_count: seed * 13,
  comment_count: seed * 3,
  image_url: `https://picsum.photos/seed/sihu${seed}/800/800`,
  image_width: 800,
  image_height: seed % 3 === 0 ? 1000 : 800,
  user: {
    id: `user-${seed}`,
    username: `member_${seed}`,
    full_name: `Community Member ${seed}`,
    avatar_url: `https://picsum.photos/seed/u${seed}/40/40`,
    is_verified: seed % 6 === 0,
  },
  first_comment:
    seed % 2 === 0
      ? { username: `fan_${seed}`, content: 'Great content! 🙌' }
      : null,
});

export const MEDIA_POSTS: MediaPost[] = [
  post(1, 'Water hyacinth removal efforts are making a visible impact along the shores 🌿', '2026-11-01T18:00:00Z', 'environment'),
  post(2, 'Community radio broadcast reaching 50,000 listeners this week 📻', '2026-11-01T14:00:00Z', 'news'),
  post(3, 'Fish catch data: populations recovering in protected zones 🐟', '2026-11-01T09:00:00Z', 'environment'),
  post(4, 'Youth empowerment workshop draws 200 participants from Busia County 💪', '2026-10-31T19:00:00Z', 'community'),
  post(5, 'New wetland conservation project launches with local government support 🌱', '2026-10-31T13:00:00Z', 'environment'),
  post(6, 'Digital skills training for women entrepreneurs — registrations open 📱', '2026-10-30T17:00:00Z', 'community'),
  post(7, 'Drone footage reveals improved water clarity in Winam Gulf 🚁', '2026-10-30T10:00:00Z', 'environment'),
  post(8, 'Annual clean-up drive removes 3 tonnes of plastic from the lake shore 🧹', '2026-10-29T15:00:00Z', 'community'),
  post(9, 'SIHU podcast episode 24 — climate change and smallholder farmers 🎙️', '2026-10-29T08:00:00Z', 'news'),
  post(10, 'Solar-powered water pump installation completes for Sio Port village ☀️', '2026-10-28T16:00:00Z', 'community'),
];

export interface StoryGroup {
  userId: string;
  username: string;
  avatarUrl: string;
  hasUnseen: boolean;
}

export const MEDIA_STORIES: StoryGroup[] = Array.from({ length: 8 }, (_, i) => ({
  userId: `story-user-${i + 1}`,
  username: `member_${i + 1}`,
  avatarUrl: `https://picsum.photos/seed/sm${i + 1}/40/40`,
  hasUnseen: i < 5,
}));

export interface SuggestedUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  is_verified: boolean;
  mutual_count: number;
}

export const MEDIA_SUGGESTED_USERS: SuggestedUser[] = Array.from({ length: 5 }, (_, i) => ({
  id: `suggested-${i + 1}`,
  username: `lake_reporter_${i + 1}`,
  full_name: `Reporter ${i + 1}`,
  avatar_url: `https://picsum.photos/seed/sug${i + 1}/40/40`,
  is_verified: i === 0,
  mutual_count: i * 2,
}));

export const EXPLORE_POSTS = MEDIA_POSTS.map((p, i) => ({
  ...p,
  id: `explore-${p.id}`,
  image_url: `https://picsum.photos/seed/exp${i + 10}/400/${i % 2 === 0 ? 500 : 400}`,
  image_height: i % 2 === 0 ? 500 : 400,
}));
