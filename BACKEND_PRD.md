# SIHU.COM — Backend Integration PRD
## Making the App Fully Operational

> Stack: Next.js 16 · Neon Postgres · Cloudflare R2 · NextAuth (Google OAuth) · Drizzle ORM

---

## 1. Current State vs Target State

| Feature | Now (Demo) | Target (Operational) |
|---|---|---|
| Articles | Static `defaultArticles` in `articles.ts` | Stored in Neon, fetched via API |
| Podcasts | Hardcoded `defaultPodcasts` | Stored in Neon, audio files in R2 |
| Events | Hardcoded `defaultEvents` | Stored in Neon |
| Media posts | Mock data in `mockData.ts` | Stored in Neon, images in R2 |
| Auth | Mock `SihuAuth` (always logged out) | Google OAuth via NextAuth |
| Image uploads | URL paste only | Direct upload → R2 → public URL |
| Admin panel | Hardcoded password | Google OAuth, role-based access |
| Article submission | Frontend form, `console.log` | Saves to Neon, admin reviews |
| Podcast submission | Frontend form, `console.log` | Saves to Neon, audio link stored |
| Event submission | Frontend form, `console.log` | Saves to Neon |
| Ticker | localStorage only | Neon table, admin-managed |

---

## 2. Architecture

```
Browser
  │
  ├── /api/auth/[...nextauth]   ← NextAuth Google OAuth
  ├── /api/upload               ← Presigned R2 upload
  ├── /api/articles             ← CRUD via Drizzle → Neon
  ├── /api/podcasts             ← CRUD via Drizzle → Neon
  ├── /api/events               ← CRUD via Drizzle → Neon
  ├── /api/media                ← Media section posts
  ├── /api/admin/ticker         ← Ticker management
  └── /api/admin/approve        ← Content moderation
        │
        ├── Neon Postgres       ← All structured data
        └── Cloudflare R2       ← Images, audio, video files
```

---

## 3. Auth Integration (Google OAuth)

### What changes

The current `SihuAuth.tsx` mock is replaced with a real NextAuth session.
The interface stays identical — all call sites using `useSihuAuth()` continue
working with zero changes elsewhere.

### File: `src/lib/auth/config.ts`

```ts
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await db.insert(users)
        .values({
          id: user.id!,
          email: user.email!,
          name: user.name,
          avatar_url: user.image,
          role: 'member',
        })
        .onConflictDoUpdate({
          target: users.email,
          set: { name: user.name, avatar_url: user.image },
        });
      return true;
    },
    async session({ session, token }) {
      const dbUser = await db.select()
        .from(users)
        .where(eq(users.email, session.user.email!))
        .limit(1);
      session.user.role = dbUser[0]?.role ?? 'member';
      session.user.id = dbUser[0]?.id ?? '';
      return session;
    },
  },
});
```

### Replace `SihuAuth.tsx`

```tsx
'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import { createContext, useContext } from 'react';

const Ctx = createContext<SihuAuth>(OFF);
export const useSihuAuth = () => useContext(Ctx);

export default function SihuAuthProvider({ children }) {
  const { data: session, status } = useSession();
  const value: SihuAuth = {
    ready: status !== 'loading',
    available: true,
    signedIn: !!session,
    email: session?.user?.email ?? null,
    name: session?.user?.name ?? null,
    signInWithGoogle: () => signIn('google'),
    signInWithEmail: () => signIn('email'),
    signOut: () => signOut(),
    getAccessToken: async () => session?.accessToken ?? null,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
```

### Set admin role

Run directly in Neon SQL Editor:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@gmail.com';
```

Admin check in API routes:

```ts
const session = await auth();
if (session?.user?.role !== 'admin') {
  return Response.json({ error: 'Forbidden' }, { status: 403 });
}
```

---

## 4. Database Schema (Drizzle + Neon)

### Install

```bash
npm install drizzle-orm drizzle-kit @neondatabase/serverless
```

### File: `src/lib/db/schema.ts`

```ts
import { pgTable, text, boolean, integer, date, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  avatar_url: text('avatar_url'),
  role: text('role').default('member'),
  created_at: timestamp('created_at').defaultNow(),
});

export const articles = pgTable('articles', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  summary: text('summary'),
  content: text('content'),
  category: text('category'),
  author_id: text('author_id').references(() => users.id),
  author_name: text('author_name'),
  image_url: text('image_url'),
  status: text('status').default('pending'), // pending | published | rejected
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const podcasts = pgTable('podcasts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  episode: text('episode'),
  duration: text('duration'),
  category: text('category'),
  description: text('description'),
  audio_url: text('audio_url'),
  cover_url: text('cover_url'),
  host_name: text('host_name'),
  host_id: text('host_id').references(() => users.id),
  status: text('status').default('pending'),
  created_at: timestamp('created_at').defaultNow(),
});

export const events = pgTable('events', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category'),
  date: date('date'),
  time: text('time'),
  end_date: date('end_date'),
  location: text('location'),
  county: text('county'),
  organiser_name: text('organiser_name'),
  organiser_id: text('organiser_id').references(() => users.id),
  registration_url: text('registration_url'),
  cover_url: text('cover_url'),
  is_free: boolean('is_free').default(true),
  status: text('status').default('pending'),
  created_at: timestamp('created_at').defaultNow(),
});

export const media_posts = pgTable('media_posts', {
  id: text('id').primaryKey(),
  caption: text('caption'),
  category: text('category'),
  location_name: text('location_name'),
  like_count: integer('like_count').default(0),
  comment_count: integer('comment_count').default(0),
  author_id: text('author_id').references(() => users.id),
  author_name: text('author_name'),
  image_url: text('image_url'),
  image_r2_key: text('image_r2_key'),
  status: text('status').default('published'),
  created_at: timestamp('created_at').defaultNow(),
});

export const ticker_items = pgTable('ticker_items', {
  id: text('id').primaryKey(),
  text: text('text').notNull(),
  is_breaking: boolean('is_breaking').default(false),
  created_at: timestamp('created_at').defaultNow(),
});
```

### File: `src/lib/db/index.ts`

```ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

### File: `drizzle.config.ts` (project root)

```ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### Run migrations

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

## 5. API Routes

### Articles — `src/app/api/articles/route.ts`

```
GET  /api/articles              → published articles (public)
GET  /api/articles?status=all   → all articles (admin only)
POST /api/articles              → create submission (authenticated)
```

```ts
import { db } from '@/lib/db';
import { articles } from '@/lib/db/schema';
import { auth } from '@/lib/auth/config';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('status') === 'all';

  const session = await auth();
  if (all && session?.user?.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const data = await db.select().from(articles)
    .where(all ? undefined : eq(articles.status, 'published'))
    .orderBy(desc(articles.created_at));
  return Response.json(data);
}

export async function POST(req: Request) {
  const session = await auth();
  const body = await req.json();
  const id = crypto.randomUUID();
  await db.insert(articles).values({
    id,
    ...body,
    author_id: session?.user?.id ?? null,
    status: 'pending',
  });
  return Response.json({ id });
}
```

### Podcasts — `src/app/api/podcasts/route.ts`

Same pattern as articles. Status flow: `pending → published`.

### Events — `src/app/api/events/route.ts`

Same pattern. Add date filter to only show future events:

```ts
import { gte } from 'drizzle-orm';

.where(gte(events.date, new Date().toISOString().slice(0, 10)))
```

### Admin approve — `src/app/api/admin/approve/route.ts`

```ts
export async function PATCH(req: Request) {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id, type, status } = await req.json();
  const table = type === 'article' ? articles
              : type === 'podcast' ? podcasts
              : events;

  await db.update(table)
    .set({ status })
    .where(eq(table.id, id));

  return Response.json({ ok: true });
}
```

### Ticker — `src/app/api/admin/ticker/route.ts`

```
GET    /api/admin/ticker        → all items
POST   /api/admin/ticker        → add item (admin)
DELETE /api/admin/ticker?id=x   → remove item (admin)
```

---

## 6. R2 File Upload

### Flow

```
1. Browser sends filename + content-type to /api/upload
2. Server returns a presigned PUT URL + final public URL
3. Browser uploads file directly to R2 (no server bandwidth)
4. Browser saves the public URL in the form
```

### Install

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### File: `src/app/api/upload/route.ts`

```ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { auth } from '@/lib/auth/config';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { filename, contentType } = await req.json();
  const key = `uploads/${Date.now()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });

  const presignedUrl = await getSignedUrl(r2, command, { expiresIn: 60 });
  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

  return Response.json({ presignedUrl, publicUrl, key });
}
```

### File: `src/lib/upload.ts`

```ts
export async function uploadToR2(file: File): Promise<string> {
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
    headers: { 'Content-Type': 'application/json' },
  });
  const { presignedUrl, publicUrl } = await res.json();

  await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });

  return publicUrl;
}
```

### Add to forms (replace URL-paste input)

```tsx
import { uploadToR2 } from '@/lib/upload';

const [uploading, setUploading] = useState(false);

<input
  type="file"
  accept="image/*,audio/*"
  onChange={async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadToR2(file);
    set('coverImageUrl', url);
    setUploading(false);
  }}
/>
{uploading && <p className="text-sm text-slate-400">Uploading…</p>}
```

---

## 7. Replacing Mock Data with Live Data

### `articleService.ts`

```ts
// Replace localStorage reads with fetch:
getArticles: async () => {
  const res = await fetch('/api/articles');
  return res.json();
},
getArticleById: async (id) => {
  const res = await fetch(`/api/articles/${id}`);
  return res.json();
},
```

### `podcastService.ts`

```ts
getPodcasts: async () => {
  const res = await fetch('/api/podcasts');
  return res.json();
},
```

### `eventService.ts`

```ts
getEvents: async () => {
  const res = await fetch('/api/events');
  return res.json();
},
```

### Media section posts

`src/lib/media/mockData.ts` stays for local dev fallback.
In production, swap in `PostFeed`:

```ts
// src/app/api/media/route.ts
export async function GET() {
  const data = await db.select().from(media_posts)
    .where(eq(media_posts.status, 'published'))
    .orderBy(desc(media_posts.created_at));
  return Response.json(data);
}
```

```tsx
// PostFeed component
useEffect(() => {
  fetch('/api/media').then(r => r.json()).then(setPosts);
}, []);
```

### Ticker

```ts
// NewsPortal.tsx — replace localStorage read:
const res = await fetch('/api/admin/ticker');
const data = await res.json();
setTickerItems(data);
```

---

## 8. Wire Submission Forms to API

### Article — `src/app/portal/submit/page.tsx`

```ts
// Replace the fake timeout with:
const res = await fetch('/api/articles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
});
if (!res.ok) throw new Error('Submission failed');
```

### Podcast — `src/app/portal/submit/podcast/page.tsx`

```ts
const res = await fetch('/api/podcasts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
});
```

### Event — `src/app/portal/submit/event/page.tsx`

```ts
const res = await fetch('/api/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
});
```

---

## 9. Admin Panel — Content Moderation Tab

Add a **Moderation** section to the existing `/admin` page:

```
Admin Panel tabs:
  ├── Dashboard    (existing stats)
  ├── Articles     pending → approve / reject / delete
  ├── Podcasts     pending → approve / reject
  ├── Events       pending → approve / reject
  ├── Media Posts  review user uploads
  ├── Ticker       add / remove breaking news items live
  └── Users        view members, promote to admin
```

Each pending row:
- Title + author + submitted date
- **Publish** → `PATCH /api/admin/approve { id, type, status: 'published' }`
- **Reject** → `PATCH /api/admin/approve { id, type, status: 'rejected' }`
- **Delete** → `DELETE /api/admin/approve?id=x&type=article`

---

## 10. Environment Variables

Add to `.env.local` and Vercel dashboard → Settings → Environment Variables:

```env
# Neon Postgres
DATABASE_URL=postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/sihu-db?sslmode=require

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate-with: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx

# Cloudflare R2
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret
R2_BUCKET_NAME=sihu-media
R2_PUBLIC_URL=https://pub-xxx.r2.dev

# Admin
NEXT_PUBLIC_ADMIN_PASSWORD=change-me-in-env
AI_SETTINGS_SECRET=any-random-string
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

---

## 11. Implementation Order

Do these phases in sequence — each one unlocks the next.

### Phase 1 — Foundation (1–2 hrs)
1. Create Neon project → copy `DATABASE_URL`
2. Add to `.env.local`
3. Install Drizzle: `npm install drizzle-orm drizzle-kit @neondatabase/serverless`
4. Create `src/lib/db/schema.ts` and `src/lib/db/index.ts`
5. Run `npx drizzle-kit generate && npx drizzle-kit migrate`
6. Verify in Neon dashboard — tables appear

### Phase 2 — Auth (1 hr)
1. Create Google OAuth credentials at console.cloud.google.com
2. Install: `npm install next-auth`
3. Create `src/lib/auth/config.ts`
4. Create `src/app/api/auth/[...nextauth]/route.ts`
5. Replace `SihuAuth.tsx` mock with real session
6. Wrap root `layout.tsx` in `<SessionProvider>`
7. Test: sign in with Google → user row appears in Neon

### Phase 3 — Content APIs (2–3 hrs)
1. Create `/api/articles`, `/api/podcasts`, `/api/events`
2. Wire all 3 submission forms to POST endpoints
3. Replace `articleService`, `podcastService`, `eventService` with fetch
4. Test: submit article → row in Neon with `status=pending`

### Phase 4 — R2 uploads (1–2 hrs)
1. Create R2 bucket → copy credentials
2. Install: `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`
3. Create `/api/upload` presigned URL route
4. Create `src/lib/upload.ts` helper
5. Swap URL-paste inputs with file pickers in all forms
6. Test: upload image → public R2 URL stored in Neon

### Phase 5 — Admin moderation (1–2 hrs)
1. Add Moderation tab to `/admin` page
2. Create `/api/admin/approve`
3. Wire approve/reject buttons
4. Test: submit → admin approves → content appears publicly

### Phase 6 — Ticker live (30 min)
1. Create `/api/admin/ticker` (GET / POST / DELETE)
2. Replace `tickerService` localStorage logic with fetch
3. Add ticker manager to admin panel
4. Test: add ticker item in admin → appears on news portal live

### Phase 7 — Media section live (1–2 hrs)
1. Create `/api/media` CRUD routes
2. Replace `MEDIA_POSTS` mock in `PostFeed` with API fetch
3. Add create-post flow with R2 image upload
4. Test: signed-in user posts photo → appears in feed

---

## 12. What Becomes Operational After All Phases

| Feature | Result |
|---|---|
| Sign in | Google account → user stored in Neon, session active |
| Submit article | Saves to Neon, admin reviews, publishes to portal |
| Submit podcast | Saves to Neon, audio URL stored, admin publishes |
| Submit event | Saves to Neon, admin publishes, future events shown |
| Upload images | Browser → presigned URL → R2 CDN — server never handles bytes |
| News portal | Reads live from Neon, no hardcoded content |
| Ticker | Admin adds/removes breaking news in real time |
| Admin panel | Role-gated, full moderation queue |
| Media feed | Real user posts from Neon, images on R2 |
| User profiles | Pulled from Neon users table, avatar from Google |
