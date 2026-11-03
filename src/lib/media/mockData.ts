// ─── Types ────────────────────────────────────────────────────────────────────

export interface MediaUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  is_verified: boolean;
  is_private: boolean;
}

export interface MediaComment {
  id: string;
  content: string;
  created_at: string;
  like_count: number;
  user: { id: string; username: string; avatar_url: string };
  replies: MediaComment[];
}

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
  images: { id: string; url: string; width: number; height: number; alt_text: string }[];
  videos: { id: string; url: string; width: number; height: number }[];
  user: MediaUser;
  comments: MediaComment[];
  is_liked: boolean;
  is_saved: boolean;
  is_reposted: boolean;
}

export interface StoryGroup {
  userId: string;
  username: string;
  avatarUrl: string;
  hasUnseen: boolean;
}

export interface SuggestedUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  is_verified: boolean;
  mutual_count: number;
}

// ─── Auth user ────────────────────────────────────────────────────────────────

export const MEDIA_USER: MediaUser & {
  bio: string;
  website: string;
  followers: number;
  following: number;
  posts: number;
} = {
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

// ─── Posts ────────────────────────────────────────────────────────────────────

function makeUser(seed: number): MediaUser {
  return {
    id: `user-${seed}`,
    username: `member_${seed}`,
    full_name: `Community Member ${seed}`,
    avatar_url: `https://picsum.photos/seed/u${seed}/48/48`,
    is_verified: seed % 6 === 0,
    is_private: false,
  };
}

function makeComment(seed: number, postSeed: number): MediaComment {
  const comments = [
    'Great content! 🙌',
    'Amazing work by the community 💪',
    'This is so important for our lake 🌊',
    'Sharing this with everyone I know!',
    'Keep up the great work SIHU! 👏',
    'This needs more attention 🔥',
  ];
  return {
    id: `comment-${postSeed}-${seed}`,
    content: comments[seed % comments.length],
    created_at: `2026-11-0${Math.max(1, seed)}T10:00:00Z`,
    like_count: seed * 3,
    user: {
      id: `commenter-${seed}`,
      username: `reader_${seed}`,
      avatar_url: `https://picsum.photos/seed/c${seed}/32/32`,
    },
    replies: [],
  };
}

function makePost(
  seed: number,
  caption: string,
  created: string,
  category: string,
): MediaPost {
  return {
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
    images: [
      {
        id: `img-${seed}`,
        url: `https://picsum.photos/seed/sihu${seed}/800/800`,
        width: 800,
        height: seed % 3 === 0 ? 1000 : 800,
        alt_text: caption,
      },
    ],
    videos: [],
    user: makeUser(seed),
    comments: Array.from({ length: Math.min(seed, 4) }, (_, i) => makeComment(i + 1, seed)),
    is_liked: false,
    is_saved: false,
    is_reposted: false,
  };
}

export const MEDIA_POSTS: MediaPost[] = [
  makePost(1, 'Water hyacinth removal efforts are making a visible impact along the shores 🌿', '2026-11-01T18:00:00Z', 'environment'),
  makePost(2, 'Community radio broadcast reaching 50,000 listeners this week 📻', '2026-11-01T14:00:00Z', 'news'),
  makePost(3, 'Fish catch data: populations recovering in protected zones 🐟', '2026-11-01T09:00:00Z', 'environment'),
  makePost(4, 'Youth empowerment workshop draws 200 participants from Busia County 💪', '2026-10-31T19:00:00Z', 'community'),
  makePost(5, 'New wetland conservation project launches with local government support 🌱', '2026-10-31T13:00:00Z', 'environment'),
  makePost(6, 'Digital skills training for women entrepreneurs — registrations open 📱', '2026-10-30T17:00:00Z', 'community'),
  makePost(7, 'Drone footage reveals improved water clarity in Winam Gulf 🚁', '2026-10-30T10:00:00Z', 'environment'),
  makePost(8, 'Annual clean-up drive removes 3 tonnes of plastic from the lake shore 🧹', '2026-10-29T15:00:00Z', 'community'),
  makePost(9, 'SIHU podcast episode 24 — climate change and smallholder farmers 🎙️', '2026-10-29T08:00:00Z', 'news'),
  makePost(10, 'Solar-powered water pump installation completes for Sio Port village ☀️', '2026-10-28T16:00:00Z', 'community'),
];

// ─── Stories ──────────────────────────────────────────────────────────────────

export const MEDIA_STORIES: StoryGroup[] = Array.from({ length: 8 }, (_, i) => ({
  userId: `story-user-${i + 1}`,
  username: `member_${i + 1}`,
  avatarUrl: `https://picsum.photos/seed/sm${i + 1}/48/48`,
  hasUnseen: i < 5,
}));

// ─── Suggestions ──────────────────────────────────────────────────────────────

export const MEDIA_SUGGESTED_USERS: SuggestedUser[] = Array.from({ length: 5 }, (_, i) => ({
  id: `suggested-${i + 1}`,
  username: `lake_reporter_${i + 1}`,
  full_name: `Reporter ${i + 1}`,
  avatar_url: `https://picsum.photos/seed/sug${i + 1}/48/48`,
  is_verified: i === 0,
  mutual_count: i * 2,
}));

// ─── Explore ──────────────────────────────────────────────────────────────────

export const EXPLORE_POSTS = MEDIA_POSTS.map((p, i) => ({
  ...p,
  id: `explore-${p.id}`,
  images: [{
    ...p.images[0],
    url: `https://picsum.photos/seed/exp${i + 10}/400/${i % 2 === 0 ? 500 : 400}`,
    height: i % 2 === 0 ? 500 : 400,
  }],
}));

// ─── Notifications ────────────────────────────────────────────────────────────

export interface MediaNotification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  actor: { username: string; avatar_url: string };
  text: string;
  post_image?: string;
  created_at: string;
  read: boolean;
}

export const MEDIA_NOTIFICATIONS: MediaNotification[] = [
  { id: 'n1', type: 'like', actor: { username: 'reader_1', avatar_url: 'https://picsum.photos/seed/n1/40/40' }, text: 'liked your photo.', post_image: 'https://picsum.photos/seed/sihu1/40/40', created_at: '2026-11-02T09:00:00Z', read: false },
  { id: 'n2', type: 'comment', actor: { username: 'reader_2', avatar_url: 'https://picsum.photos/seed/n2/40/40' }, text: 'commented: "Great content! 🙌"', post_image: 'https://picsum.photos/seed/sihu2/40/40', created_at: '2026-11-02T08:00:00Z', read: false },
  { id: 'n3', type: 'follow', actor: { username: 'lake_reporter_1', avatar_url: 'https://picsum.photos/seed/n3/40/40' }, text: 'started following you.', created_at: '2026-11-01T20:00:00Z', read: true },
  { id: 'n4', type: 'like', actor: { username: 'member_3', avatar_url: 'https://picsum.photos/seed/n4/40/40' }, text: 'liked your photo.', post_image: 'https://picsum.photos/seed/sihu3/40/40', created_at: '2026-11-01T15:00:00Z', read: true },
  { id: 'n5', type: 'mention', actor: { username: 'member_4', avatar_url: 'https://picsum.photos/seed/n5/40/40' }, text: 'mentioned you in a comment.', post_image: 'https://picsum.photos/seed/sihu4/40/40', created_at: '2026-10-31T10:00:00Z', read: true },
];

// ─── Conversations ────────────────────────────────────────────────────────────

export interface Conversation {
  id: string;
  username: string;
  avatar_url: string;
  last_message: string;
  last_message_time: string;
  unread: boolean;
  is_group: boolean;
  messages: {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
    is_own: boolean;
  }[];
}

export const MEDIA_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    username: 'lake_reporter_1',
    avatar_url: 'https://picsum.photos/seed/conv1/48/48',
    last_message: 'Great story about the hyacinth removal!',
    last_message_time: '2026-11-02T10:00:00Z',
    unread: true,
    is_group: false,
    messages: [
      { id: 'm1', content: 'Hey, loved your latest post!', sender_id: 'conv-1', created_at: '2026-11-02T09:50:00Z', is_own: false },
      { id: 'm2', content: 'Thanks! Working on more stories about the basin.', sender_id: 'sihu-demo-001', created_at: '2026-11-02T09:55:00Z', is_own: true },
      { id: 'm3', content: 'Great story about the hyacinth removal!', sender_id: 'conv-1', created_at: '2026-11-02T10:00:00Z', is_own: false },
    ],
  },
  {
    id: 'conv-2',
    username: 'member_4',
    avatar_url: 'https://picsum.photos/seed/conv2/48/48',
    last_message: 'Can I contribute a story?',
    last_message_time: '2026-11-01T18:00:00Z',
    unread: false,
    is_group: false,
    messages: [
      { id: 'm4', content: 'Hi SIHU team, I have a story idea.', sender_id: 'conv-2', created_at: '2026-11-01T17:55:00Z', is_own: false },
      { id: 'm5', content: 'Can I contribute a story?', sender_id: 'conv-2', created_at: '2026-11-01T18:00:00Z', is_own: false },
    ],
  },
  {
    id: 'conv-3',
    username: 'member_7',
    avatar_url: 'https://picsum.photos/seed/conv3/48/48',
    last_message: 'You: See you at the clean-up drive!',
    last_message_time: '2026-10-31T12:00:00Z',
    unread: false,
    is_group: false,
    messages: [
      { id: 'm6', content: 'Are you attending the clean-up drive?', sender_id: 'conv-3', created_at: '2026-10-31T11:55:00Z', is_own: false },
      { id: 'm7', content: 'See you at the clean-up drive!', sender_id: 'sihu-demo-001', created_at: '2026-10-31T12:00:00Z', is_own: true },
    ],
  },
];
