# SIHU.COM — Developer Brief
## What I Need Built

Hey, I have a Next.js web app already built and deployed on Vercel. The frontend is complete and working. I need you to connect it to a real database and make it fully operational. Here is everything you need to know.

---

## The App

**SIHU.COM** is a community media platform for the Sango Information Hub — a news and information organisation based in Busia, Kenya that covers the Lake Victoria Basin.

The app has three main sections:

1. **News Portal** — articles, podcasts, events, a live news ticker
2. **Media Section** — an Instagram-style feed where community members post photos and videos
3. **Admin Panel** — for the SIHU team to manage and publish content

The frontend is fully built. Everything currently runs on hardcoded mock data. Your job is to connect it to a real backend so it actually works.

**Live repo:** `https://github.com/Drekahshi/new-sihu.git`
**Deployed at:** Vercel (auto-deploys from the repo above)

---

## The Stack You Will Use

I have already chosen these services. Please use exactly these:

| What | Service | Why |
|---|---|---|
| Database | **Neon** (neon.tech) | Serverless Postgres, free tier |
| File storage | **Cloudflare R2** | Images, audio, video — S3-compatible, cheap |
| Authentication | **NextAuth.js + Google OAuth** | Sign in with Google |
| ORM | **Drizzle ORM** | TypeScript-first, works with Neon |
| Hosting | **Vercel** (already set up) | Auto-deploy on push |

---

## Part 1 — Authentication

I want users to sign in with their Google account only. No email/password. No other providers.

### What needs to happen:

- Install `next-auth`
- Create Google OAuth credentials (I will give you the Client ID and Secret once I set them up at console.cloud.google.com)
- Replace the file `src/components/auth/SihuAuth.tsx` — it currently contains a mock that always returns "logged out". Replace it with a real NextAuth session. The interface (the `useSihuAuth()` hook) must stay exactly the same so nothing else breaks
- When a user signs in for the first time, save their details (id, email, name, avatar) to the `users` table in Neon
- Add a `role` field to the user. Default is `member`. Admin users have `role = admin`
- To make someone an admin, run this SQL directly in Neon: `UPDATE users SET role = 'admin' WHERE email = 'their@gmail.com'`
- The admin panel at `/admin` should only be accessible to users with `role = admin`
- Create the route: `src/app/api/auth/[...nextauth]/route.ts`

---

## Part 2 — Database Setup

### Step 1 — Create the tables

Go to neon.tech, create a project called `sihu-db`, open the SQL Editor and run this:

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  category TEXT,
  author_id TEXT REFERENCES users(id),
  author_name TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE podcasts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  episode TEXT,
  duration TEXT,
  category TEXT,
  description TEXT,
  audio_url TEXT,
  cover_url TEXT,
  host_name TEXT,
  host_id TEXT REFERENCES users(id),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  date DATE,
  time TEXT,
  end_date DATE,
  location TEXT,
  county TEXT,
  organiser_name TEXT,
  organiser_id TEXT REFERENCES users(id),
  registration_url TEXT,
  cover_url TEXT,
  is_free BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE media_posts (
  id TEXT PRIMARY KEY,
  caption TEXT,
  category TEXT,
  location_name TEXT,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  author_id TEXT REFERENCES users(id),
  author_name TEXT,
  image_url TEXT,
  image_r2_key TEXT,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ticker_items (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  is_breaking BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Step 2 — Set up Drizzle ORM

- Install: `npm install drizzle-orm drizzle-kit @neondatabase/serverless`
- Create `src/lib/db/schema.ts` — the TypeScript version of the tables above using Drizzle's schema builder
- Create `src/lib/db/index.ts` — the database connection using `@neondatabase/serverless`
- Create `drizzle.config.ts` at the project root
- Run `npx drizzle-kit generate` and `npx drizzle-kit migrate`

---

## Part 3 — File Uploads (Cloudflare R2)

I want all images, audio files, and videos uploaded to Cloudflare R2 — not to the server, not to Vercel.

### How it should work:

1. User picks a file in the browser
2. Browser calls our API: `POST /api/upload` with the filename and file type
3. Our API generates a **presigned URL** from R2 and sends it back
4. Browser uploads the file **directly to R2** using that presigned URL (the file never goes through our server)
5. R2 stores the file and returns a public URL
6. That public URL gets saved into the form and eventually into the database

### What needs to be built:

- Install: `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`
- Create `src/app/api/upload/route.ts` — generates presigned URLs using the R2 credentials I will provide
- Create `src/lib/upload.ts` — a client-side helper function `uploadToR2(file)` that handles the two-step upload and returns the public URL
- In all three submission forms (article, podcast, event), replace the "paste a URL" text input with a real file picker that calls `uploadToR2()`
- I will create the R2 bucket and give you: Account ID, Access Key ID, Secret Access Key, Bucket Name, and Public URL

---

## Part 4 — API Routes

These are the backend routes that need to be created. All of them live under `src/app/api/`.

### Articles

| Method | Route | Who can use it | What it does |
|---|---|---|---|
| GET | `/api/articles` | Everyone | Returns published articles |
| GET | `/api/articles?status=all` | Admin only | Returns all articles including pending |
| POST | `/api/articles` | Signed-in users | Creates a new article submission with `status=pending` |
| PATCH | `/api/articles/[id]` | Admin only | Update any field including status |
| DELETE | `/api/articles/[id]` | Admin only | Delete an article |

### Podcasts

Same pattern as articles. Routes under `/api/podcasts`.

### Events

Same pattern as articles. Routes under `/api/events`. Add a filter so the public GET only returns events with a date in the future.

### Media posts

| Method | Route | Who | What |
|---|---|---|---|
| GET | `/api/media` | Everyone | Returns published posts, newest first |
| POST | `/api/media` | Signed-in users | Create a post (image goes to R2 first) |
| DELETE | `/api/media/[id]` | Post owner or admin | Delete post and its R2 file |

### Admin — approve/reject

| Method | Route | Who | What |
|---|---|---|---|
| PATCH | `/api/admin/approve` | Admin only | Set status to `published` or `rejected` |

Request body: `{ id: string, type: 'article' | 'podcast' | 'event', status: 'published' | 'rejected' }`

### Admin — ticker

| Method | Route | Who | What |
|---|---|---|---|
| GET | `/api/admin/ticker` | Everyone | Returns all ticker items |
| POST | `/api/admin/ticker` | Admin only | Add a new ticker item |
| DELETE | `/api/admin/ticker?id=x` | Admin only | Remove a ticker item |

---

## Part 5 — Replace Mock Data with Live Data

There are three service files that currently read from `localStorage` or hardcoded arrays. Replace them with API calls:

### `src/services/articleService.ts`
- `getArticles()` → `GET /api/articles`
- `getArticleById(id)` → `GET /api/articles/[id]`
- `addArticle(article)` → `POST /api/articles`

### `src/services/podcastService.ts`
- `getPodcasts()` → `GET /api/podcasts`

### `src/services/eventService.ts`
- `getEvents()` → `GET /api/events`

### `src/components/media/PostFeed/index.tsx`
- Currently reads from `MEDIA_POSTS` in `mockData.ts`
- Change it to `useEffect` → `fetch('/api/media')` → `setPosts(data)`

### `src/components/portal/NewsPortal.tsx`
- The ticker currently reads from `localStorage`
- Change it to `fetch('/api/admin/ticker')` → `setTickerItems(data)`

---

## Part 6 — Wire the Submission Forms

These three pages already have fully built forms. They currently fake a submission with a timeout. Replace the fake with a real API call:

| Page | Replace timeout with |
|---|---|
| `src/app/portal/submit/page.tsx` | `POST /api/articles` |
| `src/app/portal/submit/podcast/page.tsx` | `POST /api/podcasts` |
| `src/app/portal/submit/event/page.tsx` | `POST /api/events` |

Each form should also upload the cover image to R2 using the `uploadToR2()` helper before saving the URL to the form.

---

## Part 7 — Admin Panel Moderation Tab

The admin panel at `/admin` already exists. I need you to add a **Content Moderation** section with these tabs:

- **Articles** — list of pending articles with Publish / Reject buttons
- **Podcasts** — list of pending podcasts with Publish / Reject buttons
- **Events** — list of pending events with Publish / Reject buttons
- **Ticker** — text input to add a breaking news item, list of current items with a delete button
- **Users** — list of all users, button to toggle `role` between `member` and `admin`

Approve/reject calls: `PATCH /api/admin/approve`
Ticker calls: `POST /api/admin/ticker` and `DELETE /api/admin/ticker?id=x`

---

## Environment Variables

Once you have all credentials, add these to `.env.local` and also to the Vercel project under Settings → Environment Variables:

```
DATABASE_URL=postgresql://...@...neon.tech/sihu-db?sslmode=require

NEXTAUTH_URL=https://your-vercel-url.vercel.app
NEXTAUTH_SECRET=generate this with: openssl rand -base64 32

GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx

R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret
R2_BUCKET_NAME=sihu-media
R2_PUBLIC_URL=https://pub-xxx.r2.dev

NEXT_PUBLIC_ADMIN_PASSWORD=change-me-in-env
NEXT_PUBLIC_SITE_URL=https://your-vercel-url.vercel.app
```

I will provide all credential values. You set up the code structure.

---

## Order of Work

Please do these in this exact order. Each phase should work on its own before moving to the next:

1. **Database** — Neon tables + Drizzle setup + migrations working
2. **Auth** — Google sign-in working, user saved to Neon on first login
3. **Content APIs** — all routes working, submission forms save to Neon
4. **R2 uploads** — file picker in forms, uploads go to R2, URL saved to DB
5. **Admin moderation** — approve/reject queue working
6. **Ticker live** — admin can add/remove breaking news, portal shows it live
7. **Media feed live** — posts come from Neon, images from R2

---

## What I Do Not Want Changed

- Do not change any UI — the frontend is done
- Do not change any page layouts or components other than the three service files and the submission forms listed above
- Do not add any new npm packages outside of what is listed in this brief
- Do not change the `useSihuAuth()` interface — only the internal implementation of `SihuAuth.tsx`

---

## How to Test Each Phase

| Phase | How to know it works |
|---|---|
| Database | Tables visible in Neon dashboard |
| Auth | Sign in with Google → user row appears in Neon `users` table |
| Content APIs | Submit article form → row in Neon with `status=pending` |
| R2 uploads | Upload image in form → file visible in Cloudflare R2 dashboard |
| Admin moderation | Admin clicks Publish → article appears on `/portal` |
| Ticker | Admin adds item → ticker on `/portal` updates without page reload |
| Media feed | Create post as signed-in user → post appears in `/media/feed` |

---

## Questions?

Message me before starting each phase. I will provide the credentials you need.
Start with Phase 1 (Database) as soon as you have the Neon connection string from me.
