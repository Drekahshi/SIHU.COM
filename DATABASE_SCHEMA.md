# SIHU.COM — Database Schema
## Neon Postgres · Drizzle ORM

---

## Overview

```
users
  ├── articles          (author_id → users.id)
  ├── podcasts          (host_id → users.id)
  ├── events            (organiser_id → users.id)
  ├── media_posts       (author_id → users.id)
  │     └── media_comments  (author_id → users.id, post_id → media_posts.id)
  └── media_likes       (user_id → users.id, post_id → media_posts.id)

ticker_items            (standalone — admin managed)
```

---

## Tables

---

### `users`
Populated automatically on first Google sign-in via NextAuth.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Google user ID |
| `email` | TEXT | UNIQUE NOT NULL | Google email |
| `name` | TEXT | | Display name |
| `avatar_url` | TEXT | | Google profile photo URL |
| `role` | TEXT | DEFAULT `'member'` | `member` or `admin` |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | When they first signed in |

**To make someone admin:**
```sql
UPDATE users SET role = 'admin' WHERE email = 'their@gmail.com';
```

---

### `articles`
Community news submissions. Created with `status = pending`, published by admin.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID generated on creation |
| `title` | TEXT | NOT NULL | Article headline |
| `summary` | TEXT | | Short description (2–3 sentences) shown in previews |
| `content` | TEXT | | Full article body (plain text or Markdown) |
| `category` | TEXT | | Environment / Community / News / Governance / etc. |
| `author_id` | TEXT | FK → users.id | ID of signed-in user who submitted |
| `author_name` | TEXT | | Name as entered in the form |
| `image_url` | TEXT | | Public R2 URL of cover image |
| `image_r2_key` | TEXT | | R2 object key (for deletion) |
| `status` | TEXT | DEFAULT `'pending'` | `pending` · `published` · `rejected` |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Submission time |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last admin action time |

**Status flow:**
```
submitted → pending → [admin reviews] → published (appears on /portal)
                                      → rejected  (hidden, not deleted)
```

---

### `podcasts`
Audio content submissions.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID |
| `title` | TEXT | NOT NULL | Podcast / episode title |
| `episode` | TEXT | | e.g. "Episode 12" or "Season 2, Ep 3" |
| `duration` | TEXT | | e.g. "45 min" |
| `category` | TEXT | | Content category |
| `description` | TEXT | | Episode summary |
| `audio_url` | TEXT | | Link to audio (Spotify / SoundCloud / direct URL) |
| `cover_url` | TEXT | | Public R2 URL of cover image |
| `host_name` | TEXT | | Host/producer name |
| `host_id` | TEXT | FK → users.id | Signed-in user who submitted |
| `status` | TEXT | DEFAULT `'pending'` | `pending` · `published` · `rejected` |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |

---

### `events`
Community event listings.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID |
| `title` | TEXT | NOT NULL | Event name |
| `description` | TEXT | | What the event is about |
| `category` | TEXT | | Community / Environment / Governance / etc. |
| `date` | DATE | | Start date (YYYY-MM-DD) |
| `time` | TEXT | | Start time e.g. "10:00 AM" |
| `end_date` | DATE | | End date for multi-day events |
| `location` | TEXT | | Venue / address |
| `county` | TEXT | | Kenyan county |
| `organiser_name` | TEXT | | Organisation or person running the event |
| `organiser_id` | TEXT | FK → users.id | Signed-in user who submitted |
| `registration_url` | TEXT | | Link to Eventbrite / Google Form / external page |
| `cover_url` | TEXT | | Public R2 URL of cover image |
| `is_free` | BOOLEAN | DEFAULT TRUE | Whether entry is free |
| `status` | TEXT | DEFAULT `'pending'` | `pending` · `published` · `rejected` |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |

**Important:** When fetching events for the public portal, only return events where `date >= TODAY`. Past events are hidden automatically.

---

### `media_posts`
Instagram-style posts in the `/media` section.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID |
| `caption` | TEXT | | Post caption text |
| `category` | TEXT | | environment / community / news / etc. |
| `location_name` | TEXT | | Optional location tag e.g. "Lake Victoria, Kenya" |
| `like_count` | INTEGER | DEFAULT 0 | Cached like count (updated on like/unlike) |
| `comment_count` | INTEGER | DEFAULT 0 | Cached comment count |
| `author_id` | TEXT | FK → users.id | Who posted |
| `author_name` | TEXT | | Display name at time of posting |
| `image_url` | TEXT | | Public R2 URL of the image |
| `image_r2_key` | TEXT | | R2 object key (needed to delete the file from R2) |
| `status` | TEXT | DEFAULT `'published'` | `published` · `removed` |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |

---

### `media_comments`
Comments on media posts.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID |
| `post_id` | TEXT | FK → media_posts.id | Which post this belongs to |
| `author_id` | TEXT | FK → users.id | Who wrote the comment |
| `author_name` | TEXT | | Display name at time of comment |
| `author_avatar` | TEXT | | Avatar URL at time of comment |
| `content` | TEXT | NOT NULL | Comment text |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |

When a comment is inserted, also run:
```sql
UPDATE media_posts SET comment_count = comment_count + 1 WHERE id = :post_id;
```

---

### `media_likes`
Tracks which user liked which post. One row per user per post.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `user_id` | TEXT | FK → users.id | Who liked |
| `post_id` | TEXT | FK → media_posts.id | What they liked |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | |

**Primary key:** `(user_id, post_id)` — composite. Prevents duplicate likes.

When a like is inserted:
```sql
UPDATE media_posts SET like_count = like_count + 1 WHERE id = :post_id;
```
When a like is deleted (unlike):
```sql
UPDATE media_posts SET like_count = like_count - 1 WHERE id = :post_id;
```

---

### `ticker_items`
Breaking news items shown in the scrolling ticker bar on the news portal. Admin manages these directly.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | UUID |
| `text` | TEXT | NOT NULL | The ticker message |
| `is_breaking` | BOOLEAN | DEFAULT FALSE | Shows a "LIVE" badge if true |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Newest items scroll first |

---

## Full SQL to Run in Neon

Copy and paste this entire block into the Neon SQL Editor and run it once:

```sql
-- Users
CREATE TABLE users (
  id          TEXT PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  avatar_url  TEXT,
  role        TEXT DEFAULT 'member',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Articles
CREATE TABLE articles (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  summary         TEXT,
  content         TEXT,
  category        TEXT,
  author_id       TEXT REFERENCES users(id) ON DELETE SET NULL,
  author_name     TEXT,
  image_url       TEXT,
  image_r2_key    TEXT,
  status          TEXT DEFAULT 'pending',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Podcasts
CREATE TABLE podcasts (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  episode      TEXT,
  duration     TEXT,
  category     TEXT,
  description  TEXT,
  audio_url    TEXT,
  cover_url    TEXT,
  host_name    TEXT,
  host_id      TEXT REFERENCES users(id) ON DELETE SET NULL,
  status       TEXT DEFAULT 'pending',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id                TEXT PRIMARY KEY,
  title             TEXT NOT NULL,
  description       TEXT,
  category          TEXT,
  date              DATE,
  time              TEXT,
  end_date          DATE,
  location          TEXT,
  county            TEXT,
  organiser_name    TEXT,
  organiser_id      TEXT REFERENCES users(id) ON DELETE SET NULL,
  registration_url  TEXT,
  cover_url         TEXT,
  is_free           BOOLEAN DEFAULT TRUE,
  status            TEXT DEFAULT 'pending',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Media posts
CREATE TABLE media_posts (
  id             TEXT PRIMARY KEY,
  caption        TEXT,
  category       TEXT,
  location_name  TEXT,
  like_count     INTEGER DEFAULT 0,
  comment_count  INTEGER DEFAULT 0,
  author_id      TEXT REFERENCES users(id) ON DELETE SET NULL,
  author_name    TEXT,
  image_url      TEXT,
  image_r2_key   TEXT,
  status         TEXT DEFAULT 'published',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Media comments
CREATE TABLE media_comments (
  id             TEXT PRIMARY KEY,
  post_id        TEXT NOT NULL REFERENCES media_posts(id) ON DELETE CASCADE,
  author_id      TEXT REFERENCES users(id) ON DELETE SET NULL,
  author_name    TEXT,
  author_avatar  TEXT,
  content        TEXT NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Media likes (composite PK prevents duplicates)
CREATE TABLE media_likes (
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id     TEXT NOT NULL REFERENCES media_posts(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

-- Ticker
CREATE TABLE ticker_items (
  id           TEXT PRIMARY KEY,
  text         TEXT NOT NULL,
  is_breaking  BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_articles_status    ON articles(status);
CREATE INDEX idx_articles_created   ON articles(created_at DESC);
CREATE INDEX idx_podcasts_status    ON podcasts(status);
CREATE INDEX idx_events_date        ON events(date);
CREATE INDEX idx_events_status      ON events(status);
CREATE INDEX idx_media_posts_author ON media_posts(author_id);
CREATE INDEX idx_media_posts_status ON media_posts(status);
CREATE INDEX idx_media_comments_post ON media_comments(post_id);
```

---

## Drizzle Schema File

Save this as `src/lib/db/schema.ts` in the project:

```ts
import {
  pgTable, text, boolean, integer,
  date, timestamp, primaryKey,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id:         text('id').primaryKey(),
  email:      text('email').unique().notNull(),
  name:       text('name'),
  avatar_url: text('avatar_url'),
  role:       text('role').default('member'),
  created_at: timestamp('created_at').defaultNow(),
});

export const articles = pgTable('articles', {
  id:           text('id').primaryKey(),
  title:        text('title').notNull(),
  summary:      text('summary'),
  content:      text('content'),
  category:     text('category'),
  author_id:    text('author_id').references(() => users.id),
  author_name:  text('author_name'),
  image_url:    text('image_url'),
  image_r2_key: text('image_r2_key'),
  status:       text('status').default('pending'),
  created_at:   timestamp('created_at').defaultNow(),
  updated_at:   timestamp('updated_at').defaultNow(),
});

export const podcasts = pgTable('podcasts', {
  id:          text('id').primaryKey(),
  title:       text('title').notNull(),
  episode:     text('episode'),
  duration:    text('duration'),
  category:    text('category'),
  description: text('description'),
  audio_url:   text('audio_url'),
  cover_url:   text('cover_url'),
  host_name:   text('host_name'),
  host_id:     text('host_id').references(() => users.id),
  status:      text('status').default('pending'),
  created_at:  timestamp('created_at').defaultNow(),
});

export const events = pgTable('events', {
  id:               text('id').primaryKey(),
  title:            text('title').notNull(),
  description:      text('description'),
  category:         text('category'),
  date:             date('date'),
  time:             text('time'),
  end_date:         date('end_date'),
  location:         text('location'),
  county:           text('county'),
  organiser_name:   text('organiser_name'),
  organiser_id:     text('organiser_id').references(() => users.id),
  registration_url: text('registration_url'),
  cover_url:        text('cover_url'),
  is_free:          boolean('is_free').default(true),
  status:           text('status').default('pending'),
  created_at:       timestamp('created_at').defaultNow(),
});

export const media_posts = pgTable('media_posts', {
  id:            text('id').primaryKey(),
  caption:       text('caption'),
  category:      text('category'),
  location_name: text('location_name'),
  like_count:    integer('like_count').default(0),
  comment_count: integer('comment_count').default(0),
  author_id:     text('author_id').references(() => users.id),
  author_name:   text('author_name'),
  image_url:     text('image_url'),
  image_r2_key:  text('image_r2_key'),
  status:        text('status').default('published'),
  created_at:    timestamp('created_at').defaultNow(),
});

export const media_comments = pgTable('media_comments', {
  id:            text('id').primaryKey(),
  post_id:       text('post_id').notNull().references(() => media_posts.id),
  author_id:     text('author_id').references(() => users.id),
  author_name:   text('author_name'),
  author_avatar: text('author_avatar'),
  content:       text('content').notNull(),
  created_at:    timestamp('created_at').defaultNow(),
});

export const media_likes = pgTable('media_likes', {
  user_id:    text('user_id').notNull().references(() => users.id),
  post_id:    text('post_id').notNull().references(() => media_posts.id),
  created_at: timestamp('created_at').defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.user_id, table.post_id] }),
}));

export const ticker_items = pgTable('ticker_items', {
  id:          text('id').primaryKey(),
  text:        text('text').notNull(),
  is_breaking: boolean('is_breaking').default(false),
  created_at:  timestamp('created_at').defaultNow(),
});
```

---

## Relationships Summary

```
users 1──────────────────────────────────────────────────────────── *
      │                                                              │
      ├──< articles         (author_id)   status: pending/published │
      ├──< podcasts         (host_id)     status: pending/published │
      ├──< events           (organiser_id)status: pending/published │
      ├──< media_posts      (author_id)   status: published/removed │
      │       │                                                      │
      │       ├──< media_comments  (post_id + author_id)            │
      │       └──< media_likes     (post_id + user_id) composite PK │
      └──────────────────────────────────────────────────────────────

ticker_items  (no foreign keys — admin-only standalone table)
```

---

## Status Values

| Table | Possible values | Notes |
|---|---|---|
| `articles` | `pending` `published` `rejected` | Set by admin |
| `podcasts` | `pending` `published` `rejected` | Set by admin |
| `events` | `pending` `published` `rejected` | Set by admin |
| `media_posts` | `published` `removed` | Published immediately, admin can remove |
| `users` | n/a | Role field: `member` or `admin` |

---

## Quick Reference — Common Queries

### Get all published articles (newest first)
```sql
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC;
```

### Get all pending content for admin review
```sql
SELECT 'article' AS type, id, title, author_name, created_at FROM articles WHERE status = 'pending'
UNION ALL
SELECT 'podcast', id, title, host_name, created_at FROM podcasts WHERE status = 'pending'
UNION ALL
SELECT 'event', id, title, organiser_name, created_at FROM events WHERE status = 'pending'
ORDER BY created_at DESC;
```

### Get upcoming events only
```sql
SELECT * FROM events
WHERE status = 'published' AND date >= CURRENT_DATE
ORDER BY date ASC;
```

### Get media feed (newest first)
```sql
SELECT * FROM media_posts
WHERE status = 'published'
ORDER BY created_at DESC
LIMIT 20;
```

### Check if a user has liked a post
```sql
SELECT 1 FROM media_likes
WHERE user_id = :userId AND post_id = :postId;
```

### Promote user to admin
```sql
UPDATE users SET role = 'admin' WHERE email = 'their@gmail.com';
```
