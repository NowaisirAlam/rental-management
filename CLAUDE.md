# Claude Code Instructions — PropManager (Local-Only Hackathon)

## What's Built

PropManager is a full-stack rental management app for landlords and tenants.
Everything runs locally — no cloud, no SaaS, no managed databases.

**Landlord can:**
- Manage properties (create, edit, delete)
- Create and manage leases, assign tenants to properties
- Track rent payments and mark them paid
- Handle maintenance requests
- Post announcements to all tenants or a specific property
- Update their profile (name, phone, password)
- Run a local reminder check for upcoming/overdue payments (`npm run jobs`)

**Tenant can:**
- View their assigned lease (dates, rent, utilities, occupants)
- View rent payment history
- Submit and track maintenance requests
- Read landlord announcements
- Update their profile (name, phone, password)

---

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
- Local "jobs" triggered manually or via local scheduler script

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
- Jobs: `npm run jobs` (runs reminder check locally — no auth required)

---

## Database Rules
- DB must be SQLite:
  - `.env`: `DATABASE_URL="file:./dev.db"`
  - `schema.prisma` datasource provider must be `sqlite`
- Store passwords hashed (bcryptjs). Never store raw passwords.
- `utilities` and `occupants` on Lease are stored as JSON strings (SQLite has no array type). Always `JSON.parse()` before use; `JSON.stringify()` before save.

---

## Auth Rules
- Use Credentials login only.
- Roles: LANDLORD, TENANT (optionally MANAGER later).
- Protect routes:
  - `/landlord/*` only for LANDLORD
  - `/tenant/*` only for TENANT

---

## Database Models (Current Schema)

| Model | Key Fields |
|---|---|
| `User` | id, email, passwordHash, name, phone?, role, propertyId? |
| `Property` | id, name, address, ownerId |
| `MaintenanceRequest` | id, title, description, status, propertyId, createdById |
| `RentPayment` | id, propertyId, amount, dueDate, status, paidDate? |
| `Lease` | id, propertyId, tenantId, startDate, endDate, rentAmount, depositAmount, status, utilities (JSON string), occupants (JSON string) |
| `Announcement` | id, title, message, priority, propertyId?, landlordId |

---

## API Design Rules (Next.js Route Handlers)
All backend is inside Next.js under:
`src/app/api/**/route.ts`

### Auth pattern (mirror in all routes):
```
getSession() → check session.user → check role → validate with Zod → prisma query → json()/error()
```
Helpers: `src/lib/api-helpers.ts` → `getSession()`, `json()`, `error()`
Schemas: `src/lib/validations.ts`

---

## Full API Contract — All Endpoints ✅

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create user account |
| GET/POST | `/api/auth/[...nextauth]` | Public | NextAuth session |
| GET/POST | `/api/properties` | LANDLORD/TENANT | List / create properties |
| PUT/DELETE | `/api/properties/[id]` | LANDLORD | Update / delete property |
| GET/POST | `/api/maintenance` | LANDLORD/TENANT | List / create maintenance requests |
| PUT | `/api/maintenance/[id]` | LANDLORD | Update maintenance status |
| GET | `/api/payments` | LANDLORD/TENANT | List rent payments |
| PUT | `/api/payments/[id]` | LANDLORD | Mark payment paid |
| GET | `/api/dashboard` | LANDLORD/TENANT | Dashboard summary stats |
| GET/POST | `/api/leases` | LANDLORD/TENANT | List / create leases |
| PUT/DELETE | `/api/leases/[id]` | LANDLORD | Update / delete lease |
| GET/POST | `/api/announcements` | LANDLORD/TENANT | List / create announcements |
| DELETE | `/api/announcements/[id]` | LANDLORD | Delete announcement |
| GET | `/api/tenants` | LANDLORD | List all tenant users |
| PUT | `/api/tenants/[id]/assign` | LANDLORD | Assign tenant to a property |
| GET/PUT | `/api/profile` | Any | Get / update own profile (name, phone) |
| PUT | `/api/profile/password` | Any | Change own password |
| POST | `/api/jobs/run-reminders` | LANDLORD | Return upcoming + overdue PENDING payments |

### Key request/response shapes

**POST `/api/leases`**
```json
// Request
{ "propertyId": "...", "tenantId": "...", "startDate": "2025-01-01", "endDate": "2026-01-01",
  "rentAmount": 1500, "depositAmount": 2000, "status": "ACTIVE",
  "utilities": ["Water", "Gas"], "occupants": [{ "name": "Jane", "role": "Spouse" }] }
// Response: created Lease object (utilities/occupants as JSON strings)
```

**POST `/api/announcements`**
```json
// Request
{ "title": "...", "message": "...", "priority": "INFO", "propertyId": "..." }
// propertyId omitted = global (all tenants of that landlord)
// priority: "INFO" | "WARNING" | "URGENT"
```

**PUT `/api/tenants/[id]/assign`**
```json
// Request
{ "propertyId": "clxxx..." }   // or null to unassign
```

**PUT `/api/profile`**
```json
// Request — email is NOT accepted (read-only)
{ "name": "Jane Smith", "phone": "+1 555 0100" }
```

**PUT `/api/profile/password`**
```json
// Request
{ "currentPassword": "oldpass", "newPassword": "newpass123" }
// 400 if currentPassword is wrong; 400 if newPassword < 8 chars
```

**POST `/api/jobs/run-reminders`**
```json
// Response
{
  "upcoming": [{ "propertyName": "Maple Apt", "amount": 1500, "dueDate": "2026-03-04T..." }],
  "overdue":  [{ "propertyName": "Oak House", "amount": 1200, "dueDate": "2026-02-28T...", "daysOverdue": 2 }],
  "upcomingCount": 1,
  "overdueCount": 1
}
```

---

## Pages: API Status (All Wired ✅)

| Page | Status |
|---|---|
| `/landlord/dashboard` | ✅ Wired |
| `/landlord/properties` | ✅ Wired |
| `/landlord/payments` | ✅ Wired |
| `/landlord/maintenance` | ✅ Wired |
| `/landlord/leases` | ✅ Wired |
| `/landlord/announcements` | ✅ Wired |
| `/landlord/profile` | ✅ Wired |
| `/tenant/dashboard` | ✅ Wired |
| `/tenant/payments` | ✅ Wired |
| `/tenant/maintenance` | ✅ Wired |
| `/tenant/lease` | ✅ Wired |
| `/tenant/announcements` | ✅ Wired |
| `/tenant/profile` | ✅ Wired |

---

## Testing Checklist

### Auth
- [ ] Register as LANDLORD → lands on `/landlord/dashboard`
- [ ] Register as TENANT → lands on `/tenant/dashboard`
- [ ] Wrong password → login error shown
- [ ] TENANT tries to visit `/landlord/*` → redirected

### Properties (Landlord)
- [ ] Create property → appears in list
- [ ] Edit property name/address → saved
- [ ] Delete property → removed from list

### Leases (Landlord + Tenant)
- [ ] Create lease → tenant dropdown populated from real DB
- [ ] Creating lease auto-assigns tenant to property
- [ ] Edit lease (dates, rent, status) → changes persist
- [ ] Delete lease → removed from list
- [ ] Tenant views `/tenant/lease` → sees their active lease
- [ ] Tenant with no lease → sees "No lease on file" message

### Rent Payments
- [ ] Landlord sees all payments for their properties
- [ ] Mark payment paid → status changes to PAID, date recorded
- [ ] Tenant sees only payments for their property

### Maintenance
- [ ] Tenant submits request → appears in landlord list
- [ ] Landlord updates status (OPEN → IN_PROGRESS → RESOLVED → CLOSED)
- [ ] Tenant sees their own requests with updated status

### Announcements
- [ ] Landlord creates global announcement (no property) → visible to all tenants
- [ ] Landlord creates property-specific announcement → only tenants of that property see it
- [ ] Landlord deletes announcement → removed from list
- [ ] Tenant marks announcement as read → badge disappears

### Profile
- [ ] Profile loads real name/email/phone on mount (no hardcoded names)
- [ ] Email field is read-only
- [ ] Update name/phone → changes persist after page reload
- [ ] Change password with wrong current password → "Current password is incorrect"
- [ ] New password < 8 chars → validation error
- [ ] Mismatched confirm password → client-side error (no API call made)
- [ ] Successful password change → can log in with new password

### Reminder Job
- [ ] `npm run jobs` prints upcoming payments (due in ≤3 days)
- [ ] `npm run jobs` prints overdue payments (past due, still PENDING)
- [ ] All payments PAID → prints "none" for both lists
- [ ] `POST /api/jobs/run-reminders` as TENANT → 403 Forbidden
- [ ] `POST /api/jobs/run-reminders` unauthenticated → 401 Unauthorized

---

## Local Jobs (No Cron Cloud)
- `POST /api/jobs/run-reminders` — LANDLORD-auth protected HTTP endpoint; returns upcoming (≤3 days) and overdue PENDING payments, no DB writes
- `npm run jobs` — CLI script that queries DB directly (no auth needed) and prints results to console
- `src/scripts/run-jobs.ts` — the CLI implementation

---

## Architectural Decisions

| Decision | Reason |
|---|---|
| `utilities` and `occupants` stored as JSON strings | SQLite has no native array type |
| Email not updatable via profile API | Changing email would invalidate the active JWT session |
| Announcement read/unread state: local component state only | Avoids a DB column for a cosmetic UI concern |
| Password change does not invalidate JWT | Acceptable trade-off for a local hackathon |
| Tenant assignment and lease creation are separate operations | Assignment links the user to a property; the lease defines the terms — both must be done |
| `npm run jobs` queries DB directly (no HTTP) | Avoids session auth complexity in a CLI context |

---

## Pull Request Rules
- No mixed PRs:
  - Backend PR (Prisma + API + Auth) separate from Frontend wiring PR.
- Do not delete existing pages without reason.
- Provide API contract in PR description (request/response shapes).
