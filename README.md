# rTriibe Tracker UAE

A live version of your recruitment command board: Next.js frontend, Supabase as the
database, deployed on Vercel. Six tabs (Dashboard, Pipeline, Vacancies, Candidates,
Schools, Daily Log), all reading and writing to real tables instead of hardcoded
arrays, gated by a shared password screen — same stack as the CV Extractor and LSA
platform (Next.js + Supabase + Vercel).

---

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → sign in → **New project**.
2. Name it `rtriibe-tracker-uae`, set a database password (save it somewhere), pick a region
   close to Dubai (e.g. `eu-central-1` or `ap-south-1`), and create it. Takes ~2 min.
3. Once it's ready, open the **SQL Editor** (left sidebar) → **New query**.
4. Paste the contents of `supabase/schema.sql` and click **Run**. This creates the
   `schools`, `vacancies`, `pipeline`, and `daily_log` tables.
5. Optional but recommended: open a second new query, paste `supabase/seed.sql`, and
   run it. This pre-loads the board with your current desk data (the same rows that
   were hardcoded in the HTML version) so it launches populated instead of empty.
6. Go to **Project Settings → API**. Copy two values, you'll need them in step 3:
   - **Project URL**
   - **anon public** key

> **Security note:** this app uses the Supabase **anon key** directly from the
> browser with open read/write policies, protected only by the app's shared
> password screen — not real user accounts. That's fine for a small internal desk
> tool, but anyone who has your deployed URL *and* the password can read/write the
> data (and technically the anon key is visible in the page source to anyone who
> gets past the password screen). Don't put anything in this board you wouldn't
> want a departing colleague to be able to export. If you want real per-user
> accounts and permissions later, that's a Supabase Auth upgrade — happy to help
> with that when you're ready.

---

## 2. Push the code to GitHub

From the folder you downloaded (`rtriibe-tracker-uae/`):

```bash
cd rtriibe-tracker-uae
git init
git add .
git commit -m "Initial commit: rTriibe Ops Command Board"
```

Create a new **empty** repo on GitHub (github.com → New repository → don't
initialize with a README), then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/rtriibe-tracker-uae.git
git branch -M main
git push -u origin main
```

(`.env.local` is already in `.gitignore` — your Supabase keys never get committed.)

---

## 3. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → sign in with GitHub → **Add New… → Project**.
2. Import the `rtriibe-tracker-uae` repo you just pushed.
3. Framework preset should auto-detect as **Next.js** — leave build settings as default.
4. Before deploying, open **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Supabase Project URL from step 1.6 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon public key from step 1.6 |
   | `NEXT_PUBLIC_BOARD_PASSWORD` | whatever password you want to gate the board with (keep `rtriibe2025` to match your other tools, or set your own) |

5. Click **Deploy**. In ~1 minute you'll get a live URL like
   `rtriibe-tracker-uae.vercel.app`.

Every time you `git push` to `main` after this, Vercel redeploys automatically.

---

## 4. Run it locally (optional, for making changes)

```bash
npm install
cp .env.local.example .env.local
# edit .env.local with your real Supabase URL/key + password
npm run dev
```

Open `http://localhost:3000`.

---

## What's in the board

- **Dashboard** — KPI tiles, a "Needs attention" panel (offers awaiting confirmation,
  candidates at interview, stale open vacancies 10+ days with no update), pipeline-
  by-stage bar chart, vacancies-by-status breakdown. All computed live from the data.
- **Pipeline** — every candidate/school deal. Click a stage pill to cycle it forward
  (Sourcing → Submitted → Interview → Offer → Placed → Rejected). "+ Add deal" to log
  a new one. ✕ to remove.
- **Vacancies** — every open role. Click the status pill to cycle
  (Open → Filled → On Hold → Closed).
- **Candidates** — read-only view of everyone currently in the pipeline.
- **Schools** — client list with key contacts and Signed/Pending status.
- **Daily Log** — free-text activity entries, newest first.

## Project structure

```
rtriibe-tracker-uae/
├── app/
│   ├── layout.js        root layout
│   ├── page.js           entry point (login gate + board)
│   └── globals.css       all styling
├── components/
│   ├── LoginGate.js       shared-password screen
│   └── Board.js           tabs, data fetching, all CRUD
├── lib/
│   └── supabaseClient.js  Supabase browser client
├── supabase/
│   ├── schema.sql          run this first in Supabase SQL Editor
│   └── seed.sql            optional — pre-loads current desk data
└── .env.local.example      copy to .env.local for local dev
```

## Next steps you might want

- Restrict the board to your and Paul's/Edward's own accounts with Supabase Auth
  instead of a shared password.
- Add a "days since last update" auto-flag on the Schools tab too, not just Vacancies.
- Wire the Daily Log to auto-log stage changes (e.g. "Sandra Kadoura moved to Offer")
  instead of typing them manually.
- Connect this to the CV Extractor / Candidate Database so pipeline rows can pull
  candidate details instead of just a name.

Ping me if you want any of these built out.
