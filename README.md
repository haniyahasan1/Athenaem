# Athenaem
### *Think deeper.*

Athenaem is a weekly article digest that texts students one research article from outside their field — paired with an AI-generated hook designed to make them actually want to read it.

Built for curious people who want to think beyond their discipline.

---

## How it works

1. Sign up with your phone number (verified via SMS)
2. Pick the fields you're curious about
3. Every week, receive a text with one article and a hook written by Claude

---

## Tech Stack

- **Framework** — Next.js 14 (App Router)
- **Database** — Supabase (PostgreSQL)
- **Auth** — Twilio Verify (SMS OTP) + httpOnly cookies
- **AI** — Anthropic Claude (generates article hooks)
- **Articles** — CrossRef API (open academic database)
- **SMS** — Twilio Messages
- **Deployment** — Vercel

---

## Features

- Phone number authentication with OTP
- Interest picker across 26+ academic fields
- Weekly AI-generated article hooks using Claude
- Password-gated access (private beta)
- 100-user cap to control costs
- Per-user article history tracked in dashboard
- Rate-limited OTP endpoint

---

## Environment Variables

Create a `.env.local` file with the following:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_VERIFY_SERVICE_SID=
TWILIO_PHONE_NUMBER=

ANTHROPIC_API_KEY=

CRON_SECRET=
SITE_PASSWORD=
CONTACT_EMAIL=
NEXT_PUBLIC_BASE_URL=
```

---

## Running Locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

To trigger the weekly digest manually:

```bash
curl -X POST http://localhost:3000/api/weekly-digest \
  -H "x-cron-secret: YOUR_CRON_SECRET"
```

---

## Database Schema

Run the following in your Supabase SQL editor:

```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  name text,
  created_at timestamptz default now()
);

create table user_interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  field_id text not null,
  field_name text not null,
  sub_topic text
);

create table articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text unique not null,
  field text,
  sub_topic text,
  source text,
  abstract text,
  ai_hook text,
  published_at timestamptz
);

create table user_articles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  article_id uuid references articles(id) on delete cascade,
  sent_at timestamptz default now()
);
```

---

*Built by Haniyah Hassan*
