# Claude Code Instructions — PropManager

## Project Overview

PropManager is a full-stack rental management SaaS for landlords and tenants.

**Landlord features:**
- Manage properties (create, edit, delete)
- Create leases, assign tenants to properties
- Track rent payments (mark paid, see history)
- View maintenance requests from tenants
- Post announcements (global or per-property)
- Update profile (name, phone, password)
- Run reminder job: `npm run jobs` → lists upcoming/overdue PENDING rent payments

**Tenant features:**
- View assigned lease (dates, rent, utilities, occupants)
- View rent payment history
- Submit maintenance requests
- Read landlord announcements
- Update profile (name, phone, password)

---

## Tech Stack

- **Next.js 16** (App Router)
- **Prisma 7** (ORM) with SQLite (better-sqlite3 adapter)
- **NextAuth 5** (JWT sessions, Credentials provider only)
- **bcryptjs** (password hashing)
- **Zod** (validation)
- **TailwindCSS 4** (styling)
- **TypeScript**

---

## Folder Structure

```
src/
  app/
    api/
      auth/
        register/route.ts              # POST: create user
        [...nextauth]/route.ts         # NextAuth session handler
      properties/
        route.ts                       # GET/POST properties
        [id]/route.ts                  # PUT/DELETE property
      leases/
        route.ts                       # GET/POST leases
        [id]/route.ts                  # PUT/DELETE lease
      maintenance/
        route.ts                       # GET/POST maintenance requests
        [id]/route.ts                  # PUT maintenance status
      payments/
        route.ts                       # GET rent payments
        [id]/route.ts                  # PUT mark payment paid
      announcements/
        route.ts                       # GET/POST announcements
        [id]/route.ts                  # DELETE announcement
      tenants/
        route.ts                       # GET all tenants
        [id]/assign/route.ts           # PUT assign tenant to property
      profile/
        route.ts                       # GET/PUT profile (name, phone)
        password/route.ts              # PUT change password
      dashboard/route.ts               # GET dashboard stats
      jobs/
        run-reminders/route.ts         # POST get upcoming/overdue payments
    landlord/
      layout.tsx                       # Landlord nav + routing
      dashboard/page.tsx
      properties/page.tsx
      leases/page.tsx
      payments/page.tsx
      maintenance/page.tsx
      announcements/page.tsx
      profile/page.tsx
      billing/page.tsx                 # (stub)
    tenant/
      layout.tsx                       # Tenant nav + routing
      dashboard/page.tsx
      lease/page.tsx
      payments/page.tsx
      maintenance/page.tsx
      announcements/page.tsx
      profile/page.tsx
    login/page.tsx                     # Login form
    register/page.tsx                  # Role picker
    register/[role]/page.tsx           # Register form (LANDLORD/TENANT)
    page.tsx                           # Home/redirect page
    layout.tsx                         # Root layout
  components/
    landlord/
      Sidebar.tsx                      # Left nav
      topbar.tsx                       # Top nav
      data-table.tsx                   # Reusable table
      stats-card.tsx                   # Dashboard card
      status-badge.tsx                 # Status display
    tenant/
      Sidebar.tsx                      # Left nav
    Navbar.tsx                         # Top nav (shared)
    Providers.tsx                      # React context providers
    DevPreviewButton.tsx               # (dev only)
    LandlordPreviewButton.tsx          # (dev only)
  contexts/
    ThemeContext.tsx                   # Dark mode toggle
  lib/
    auth.ts                            # NextAuth setup + Credentials provider
    auth.config.ts                     # NextAuth config (middleware, callbacks)
    auth-types.ts                      # Custom session.user types
    api-helpers.ts                     # json(), error(), getSession()
    api-client.ts                      # Frontend API fetch wrapper
    db.ts                              # Prisma client singleton
    validations.ts                     # Zod schemas for all endpoints
    types/index.ts                     # TS types
    mock/landlord.ts                   # (dev mock data)
  middleware.ts                        # NextAuth middleware (route protection)
  scripts/
    run-jobs.ts                        # CLI: upcoming/overdue payments reminder
prisma/
  schema.prisma                        # Database schema
  dev.db                               # SQLite database file (gitignored)
  seed.ts                              # Demo data script
  migrations/                          # Prisma migrations
```

---

## Database Schema

**User**
- id, email (unique), passwordHash, name, phone?, role (LANDLORD/TENANT), subscriptionStatus (FREE/ACTIVE), propertyId?, createdAt
- Relations: ownedProperties (Property), assignedProperty (Property), leases, maintenanceRequests, announcements

**Property**
- id, name, address, ownerId, createdAt
- Relations: owner (User), tenants (User[]), leases, maintenanceRequests, rentPayments, announcements

**Lease**
- id, propertyId, tenantId, startDate, endDate, rentAmount, depositAmount, status (ACTIVE/EXPIRED/PENDING/TERMINATED), utilities (JSON string), occupants (JSON string), createdAt, updatedAt
- Relations: property, tenant
- Note: utilities and occupants are stored as JSON strings (SQLite has no array type) → always parse/stringify

**RentPayment**
- id, propertyId, amount, dueDate, status (PENDING/PAID), paidDate?, createdAt
- Relations: property

**MaintenanceRequest**
- id, propertyId, createdById, title, description, status (OPEN/IN_PROGRESS/RESOLVED/CLOSED), createdAt, updatedAt
- Relations: property, createdBy (User)

**Announcement**
- id, landlordId, propertyId?, title, message, priority (INFO/WARNING/URGENT), createdAt
- Relations: landlord, property?
- Note: propertyId null = global announcement visible to all landlord's tenants

---

## API Contract

### Auth

**POST `/api/auth/register`**
```json
// Request
{ "name": "Jane Doe", "email": "jane@example.com", "password": "securepass123", "role": "LANDLORD" }
// Response (201)
{ "id": "...", "email": "jane@example.com", "name": "Jane Doe", "role": "LANDLORD" }
// Errors: 400 if email exists, password < 8 chars, missing fields; 500 on failure
```

**GET/POST `/api/auth/[...nextauth]`** — NextAuth session/callback handler

### Properties

**GET `/api/properties`** — LANDLORD: owned properties | TENANT: assigned property
- Response: Property[] with tenant count, maintenance count, payment count

**POST `/api/properties`** — LANDLORD only
```json
// Request
{ "name": "Maple Apartment", "address": "123 Main St" }
// Response (201)
{ "id": "...", "name": "Maple Apartment", "address": "123 Main St", "ownerId": "..." }
// Errors: 400 Zod validation; 403 if free plan limit reached
```

**PUT `/api/properties/[id]`** — LANDLORD only (update name/address)

**DELETE `/api/properties/[id]`** — LANDLORD only

### Leases

**GET `/api/leases`** — LANDLORD: all leases for owned properties | TENANT: their own lease

**POST `/api/leases`** — LANDLORD only
```json
// Request
{
  "propertyId": "...",
  "tenantId": "...",
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": "2026-01-01T00:00:00Z",
  "rentAmount": 1500,
  "depositAmount": 2000,
  "status": "ACTIVE",
  "utilities": ["Water", "Gas"],
  "occupants": [{ "name": "Jane", "role": "Spouse" }]
}
// Response (201) — utilities/occupants auto-stringified
// Errors: 400 Zod validation, end date ≤ start date; 403 forbidden property; 404 tenant not found
```

**PUT `/api/leases/[id]`** — LANDLORD only (update dates, rent, status, utilities, occupants)

**DELETE `/api/leases/[id]`** — LANDLORD only

### Payments

**GET `/api/payments`** — LANDLORD: all payments for owned properties | TENANT: payments for assigned property

**PUT `/api/payments/[id]`** — LANDLORD only
```json
// Request
{ "status": "PAID" }
// Sets paidDate to now, updates status
```

### Maintenance

**GET `/api/maintenance`** — LANDLORD: all for owned properties | TENANT: their own requests

**POST `/api/maintenance`** — TENANT only
```json
// Request
{ "title": "Leaky faucet", "description": "Bathroom sink drips" }
// Response (201)
// Errors: 400 if no property assigned
```

**PUT `/api/maintenance/[id]`** — LANDLORD only
```json
// Request
{ "status": "RESOLVED" }  // OPEN, IN_PROGRESS, RESOLVED, CLOSED
```

### Announcements

**GET `/api/announcements`** — LANDLORD: created announcements | TENANT: applicable announcements (property-specific or global from landlord)

**POST `/api/announcements`** — LANDLORD only
```json
// Request
{ "title": "...", "message": "...", "priority": "INFO", "propertyId": "..." }
// propertyId omitted = visible to all landlord's tenants
// Response (201)
// Errors: 400 Zod validation; 403 if property not owned
```

**DELETE `/api/announcements/[id]`** — LANDLORD only

### Tenants

**GET `/api/tenants`** — LANDLORD only: list all TENANT users

**PUT `/api/tenants/[id]/assign`** — LANDLORD only
```json
// Request
{ "propertyId": "..." }  // or null to unassign
```

### Profile

**GET `/api/profile`** — Returns current user profile (email, name, phone, role)

**PUT `/api/profile`** — Current user: update name/phone (email is read-only)
```json
// Request
{ "name": "Jane Smith", "phone": "+1 555 0100" }
// Errors: 400 Zod validation
```

**PUT `/api/profile/password`** — Current user: change password
```json
// Request
{ "currentPassword": "old", "newPassword": "newpass123" }
// Errors: 400 if current password wrong or new password < 8 chars
```

### Dashboard

**GET `/api/dashboard`** — Summary stats (properties, tenants, payments, maintenance)

### Jobs

**POST `/api/jobs/run-reminders`** — LANDLORD auth only
```json
// Response
{
  "upcoming": [
    { "propertyName": "Maple Apt", "amount": 1500, "dueDate": "2026-03-04T..." }
  ],
  "overdue": [
    { "propertyName": "Oak House", "amount": 1200, "dueDate": "2026-02-28T...", "daysOverdue": 2 }
  ],
  "upcomingCount": 1,
  "overdueCount": 1
}
```

---

## Coding Rules

### Minimal Changes
- Do not refactor surrounding code unless it directly unblocks the task.
- No premature abstractions (three similar lines is fine).
- No future-proofing.

### API Patterns
All route handlers follow:
1. `getSession()` → check session.user, validate role
2. Parse/validate with Zod (`safeParse`)
3. Prisma query (with appropriate filters for role)
4. Return `json()` (201 for POST) or `error(msg, status)`

Helpers in `src/lib/api-helpers.ts`:
- `getSession()` → gets current session or null
- `json(data, status?)` → NextResponse.json wrapper
- `error(msg, status?)` → NextResponse.json with error field

### Database
- Passwords always hashed with bcrypt (never raw).
- Lease `utilities` and `occupants` are JSON strings → always `JSON.parse()` before use, `JSON.stringify()` before save.
- Use Prisma for all DB access (no raw SQL).

### Validation
- All endpoint requests validated with Zod schemas in `src/lib/validations.ts`.
- Add schema for new endpoints immediately.
- Frontend should mirror validation (no API call on client-side error).

### Auth & Roles
- **LANDLORD**: manage own properties, leases, announcements, tenants.
- **TENANT**: view assigned property, make maintenance requests, read announcements.
- Protect routes with middleware (`src/middleware.ts`) + endpoint auth checks.
- Credentials provider only (email/password).

### Response Style
**Caveman style by default:**
- Short sentences, no filler.
- One-word summaries in commit messages (fix:, add:, chore:).
- Show the diff; assume reader can infer intent.

---

## Testing Checklist

### Auth
- [ ] Register LANDLORD → `/landlord/dashboard`
- [ ] Register TENANT → `/tenant/dashboard`
- [ ] Wrong password → login error
- [ ] TENANT visits `/landlord/*` → redirected

### Properties
- [ ] Create property → appears in list
- [ ] Edit property → name/address updated
- [ ] Delete property → removed from list

### Leases
- [ ] Create lease → tenant dropdown from DB
- [ ] Creating lease → auto-assigns tenant to property
- [ ] Edit lease (dates, rent, status) → persisted
- [ ] Delete lease → removed
- [ ] Tenant views `/tenant/lease` → sees active lease
- [ ] Tenant with no lease → "No lease on file"

### Payments
- [ ] Landlord sees all payments for owned properties
- [ ] Mark paid → status PAID, paidDate recorded
- [ ] Tenant sees only assigned property payments

### Maintenance
- [ ] Tenant submits → appears in landlord list
- [ ] Landlord updates status (OPEN → IN_PROGRESS → RESOLVED → CLOSED)
- [ ] Tenant sees updated status

### Announcements
- [ ] Global announcement (no propertyId) → visible to all landlord's tenants
- [ ] Property-specific announcement → only that property's tenants see it
- [ ] Delete announcement → removed
- [ ] Tenant marks read (client-side) → badge disappears

### Profile
- [ ] Profile loads real name/email/phone (no hardcoded)
- [ ] Email field read-only
- [ ] Update name/phone → persisted
- [ ] Wrong current password → error
- [ ] New password < 8 chars → error
- [ ] Mismatched confirm → client-side error (no API call)
- [ ] Successful change → login with new password

### Jobs
- [ ] `npm run jobs` → upcoming (≤3 days), overdue PENDING
- [ ] All PAID → "none"
- [ ] TENANT POST `/api/jobs/run-reminders` → 403
- [ ] Unauthenticated POST `/api/jobs/run-reminders` → 401

---

## Deployment

**Do NOT deploy to Vercel serverless.** SQLite requires persistent disk.

**Recommended platforms:**
- Railway
- Render
- Any cloud with persistent filesystem volume

**Setup:**
- `.env` file: `DATABASE_URL="file:./dev.db"` (already correct)
- Set env vars in platform dashboard (never commit `.env`)
- Prisma schema datasource: `provider = "sqlite"` (already correct)
- Run migrations on deploy: `npx prisma migrate deploy`

---

## Local Development

**Install:**
```bash
npm install
npx prisma generate
```

**Dev server:**
```bash
npm run dev
```
Open http://localhost:3000.

**Database:**
```bash
npx prisma migrate dev          # Create migration
npx prisma db seed              # Load demo data
npx prisma studio              # Optional: GUI
```

**Jobs (CLI):**
```bash
npm run jobs                    # Print upcoming/overdue payments to console
```

**Build:**
```bash
npm run build                   # Compiles Next.js + runs prisma generate
npm start                       # Run production build locally
```

---

## Key Architectural Decisions

| Decision | Reason |
|---|---|
| JSON strings for utilities/occupants | SQLite has no array type |
| Email read-only in profile API | Changing email invalidates JWT session |
| Announcement read/unread: local state only | Cosmetic UI concern, avoids DB column |
| Password change doesn't invalidate JWT | Acceptable for current scale |
| Tenant assignment separate from lease creation | Assignment links user to property; lease defines terms |
| `npm run jobs` queries DB directly | Avoids auth complexity in CLI |
| JWT sessions (not database sessions) | Stateless, easier to scale |
| Credentials provider only | Current product design (no social login) |
| Free plan limit 1 property | Encourages upgrade path |

---

## Files Not to Touch (Auto-generated)

- `.next/` → build output
- `node_modules/` → dependencies
- `.prisma/` → Prisma client generation
- `dist/` → type definitions
