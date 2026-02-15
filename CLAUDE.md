# Claude Code Instructions — PropManager (Local-Only Hackathon)

## Non-Negotiable Constraint (Hackathon Rule)
- NO cloud services and NO managed platforms.
- No Vercel/Netlify/Firebase/Supabase/Railway/Render/Heroku.
- No hosted databases (Supabase Postgres, Atlas, etc.).
- Everything must run locally on a machine we control.

✅ Allowed:
- Next.js running locally
- SQLite database file in this repo
- Prisma ORM
- Local credential login (email/password)
- Local “jobs” triggered manually or via local scheduler script

---

## Tech Stack (Local Only)
- Next.js (App Router)
- Prisma ORM
- SQLite database (file: `prisma/dev.db`)
- Auth: NextAuth/Auth.js with **Credentials provider only**
  - NO Google/Facebook/Github OAuth

---

## Dev Commands
- Install: `npm install`
- Start: `npm run dev`
- Prisma:
  - `npx prisma migrate dev`
  - `npx prisma studio` (optional for viewing DB)
  - `npx prisma db seed` (demo data)

---

## Database Rules
- DB must be SQLite:
  - `.env`: `DATABASE_URL="file:./dev.db"`
  - `schema.prisma` datasource provider must be `sqlite`
- Store passwords hashed (bcryptjs). Never store raw passwords.

---

## Auth Rules
- Use Credentials login only.
- Roles: LANDLORD, TENANT (optionally MANAGER later).
- Protect routes:
  - `/landlord/*` only for LANDLORD
  - `/tenant/*` only for TENANT

---

## API Design Rules (Next.js Route Handlers)
All backend is inside Next.js under:
`src/app/api/**/route.ts`

Minimum required endpoints:
- POST `/api/auth/register`  → create user (hash password)
- NextAuth route: `/api/auth/[...nextauth]`
- Properties:
  - GET/POST `/api/properties`
  - PUT/DELETE `/api/properties/[id]`
- Maintenance:
  - GET/POST `/api/maintenance`
  - PUT `/api/maintenance/[id]` (status update)
- Payments:
  - GET `/api/payments`
  - PUT `/api/payments/[id]` (mark paid)

---

## UI Wiring Rules
- Replace mock arrays with real fetch calls to `/api/*`.
- Keep UI design the same; only change data source.
- Add basic loading + error + empty states.

---

## Local Jobs (No Cron Cloud)
If rent reminders/late fees are needed:
- Implement a manual endpoint:
  - POST `/api/jobs/run-reminders`
- OR implement a local script:
  - `npm run jobs`
No Vercel Cron.

---

## Pull Request Rules
- No mixed PRs:
  - Backend PR (Prisma + API + Auth) separate from Frontend wiring PR.
- Do not delete existing pages without reason.
- Provide API contract in PR description (request/response shapes).
