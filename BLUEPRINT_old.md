## Local-Only Constraint (Hackathon)

This project must run completely locally.

- No cloud services (Supabase, Vercel, Firebase, etc.)
- Database: SQLite (local file)
- Backend: Next.js API Routes
- Auth: NextAuth Credentials (email/password only)
- Jobs: Manual local endpoints (no cloud cron)
- App runs with: npm run dev








# PropManager MVP — Complete Project Blueprint
> **Generated**: 2026-02-06
> **Target**: Portfolio/demo project, built by a CS student
> **Timeline**: 2–4 weeks to MVP
> **Budget**: $0 (all free tiers)

---
## A) Assumptions

| # | Assumption | Rationale |
|---|-----------|-----------|
| 1 | **Auth: email/password** (not magic link) | Simpler to implement, better for demo. Magic link needs email service. |
| 2 | **Single database** (Postgres on Supabase free tier) | Free, generous limits, built-in auth option if you want it later. |
| 3 | **No real payments** in MVP | Stripe integration is complex. We'll track rent status manually (paid/unpaid/late). |
| 4 | **No file uploads** in MVP | Maintenance tickets use text descriptions only. Image uploads = Phase 2. |
| 5 | **3 roles**: Manager (admin), Landlord, Tenant | Manager is the "super admin." Landlord owns properties. Tenant is invited by landlord. |
| 6 | **In-app notifications only** | No email service needed. Notification bell + dashboard. Email = Phase 2. |
| 7 | **Single-tenant app** (one deployment = one management company) | Multi-tenancy (multiple orgs) = Phase 2. |
| 8 | **Demo seed data** included | Script to populate fake properties, tenants, tickets for portfolio demos. |
| 9 | **Responsive web app** (not native mobile) | Works on phone browsers. No React Native needed. |
| 10 | **English only** | i18n = Phase 2. |

---

## B) MVP Scope

### IN (MVP — Weeks 1–4)

| Feature | Description |
|---------|------------|
| **Auth + Roles** | Register/login with email+password. 3 roles: manager, landlord, tenant. |
| **Property Management** | CRUD properties (address, units, type, status). |
| **Unit Management** | Each property has units. Assign tenants to units. |
| **Tenant Directory** | View all tenants, their unit, lease dates, contact info. |
| **Lease Tracking** | Basic lease records: start/end date, rent amount, status. |
| **Rent Tracking** | Monthly rent status per tenant (paid/unpaid/overdue). Manual marking. |
| **Rent Reminders** | Auto-generated in-app notifications 5 days before due, on due date, and 3 days after. |
| **Late Fee Logic** | Simple: if rent not marked paid by due date + grace period (3 days), flag as "late" and add flat fee. |
| **Maintenance Tickets** | Tenants submit tickets. Landlord/manager reviews, assigns status (open → in-progress → resolved → closed). |
| **In-App Notifications** | Bell icon, notification list. Auto-created for: rent reminders, ticket updates, lease expiry warnings. |
| **Activity Logs** | Timestamped log of all actions (who did what, when). Viewable by manager. |
| **Dashboard** | Role-specific: Manager sees everything. Landlord sees their properties. Tenant sees their unit + tickets. |
| **Admin Tools** | Manager can: export CSV, view logs, disable/enable users, moderate tickets. |
| **Seed Data** | One command populates demo data for portfolio showcase. |

### OUT (Phase 2 Roadmap)

| Feature | When |
|---------|------|
| Email/SMS notifications (Resend/Twilio) | Phase 2a |
| File uploads (maintenance photos, lease PDFs) | Phase 2a |
| Online rent payment (Stripe) | Phase 2b |
| Multi-property portfolio dashboard + analytics | Phase 2b |
| Tenant self-service portal (pay rent, view lease) | Phase 2b |
| Document management (lease templates, signing) | Phase 2c |
| Multi-tenancy (multiple management companies) | Phase 2c |
| Mobile app (React Native or PWA) | Phase 2d |
| Advanced reporting (charts, rent roll, vacancy rate) | Phase 2d |
| Approval workflows (maintenance spend > $X needs approval) | Phase 2d |

---

## C) Recommended Tech Stack

### PRIMARY STACK (Recommended)

| Layer | Tech | Why |
|-------|------|-----|
| **Framework** | Next.js 14+ (App Router) | Full-stack in one project. SSR, API routes, middleware. Huge community. |
| **Language** | TypeScript | Catches bugs early. Industry standard. |
| **Database** | PostgreSQL (Supabase free tier) | Free, 500MB, connection pooling, dashboard to inspect data. |
| **ORM** | Prisma | Best DX for beginners. Auto-generates types. Visual schema. |
| **Auth** | NextAuth.js (Auth.js v5) | Email/password + easy to add Google/GitHub OAuth later. |
| **Styling** | Tailwind CSS + shadcn/ui | Pre-built components, looks professional fast. |
| **State** | React Query (TanStack Query) | Handles API caching, loading, error states. |
| **Cron/Jobs** | Vercel Cron (free, 1/day) + API routes | Good enough for daily rent reminders. |
| **Deployment** | Vercel (free tier) | Zero-config Next.js deployment. Auto-deploys from GitHub. |
| **Testing** | Vitest + React Testing Library | Fast, modern, good DX. |

### Alternatives (brief)

| If you prefer... | Use instead |
|------------------|-------------|
| Separate backend | Express/Fastify + separate React app (more work, more control) |
| Different DB hosting | Railway Postgres or Neon (both have free tiers) |
| Different ORM | Drizzle ORM (newer, more SQL-like, also great) |
| Different UI | MUI or Chakra UI (more opinionated, larger bundle) |
| Different hosting | Railway or Render (free tiers, good for full-stack) |

---

## D) Data Model (Database Schema)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── AUTH & USERS ────────────────────────────────

enum Role {
  MANAGER
  LANDLORD
  TENANT
}

model User {
  id             String    @id @default(cuid())
  email          String    @unique
  hashedPassword String
  name           String
  role           Role      @default(TENANT)
  phone          String?
  isActive       Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  // Relations
  ownedProperties Property[]     @relation("PropertyOwner")
  leases          Lease[]        @relation("TenantLease")
  ticketsCreated  MaintenanceTicket[] @relation("TicketCreator")
  ticketsAssigned MaintenanceTicket[] @relation("TicketAssignee")
  notifications   Notification[]
  activityLogs    ActivityLog[]
  rentPayments    RentPayment[]

  @@index([email])
  @@index([role])
}

// ─── PROPERTIES & UNITS ──────────────────────────

enum PropertyType {
  APARTMENT
  HOUSE
  CONDO
  COMMERCIAL
}

model Property {
  id        String       @id @default(cuid())
  name      String          // "Sunset Apartments"
  address   String
  city      String
  state     String
  zipCode   String
  type      PropertyType @default(APARTMENT)
  ownerId   String
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt

  owner Owner @relation("PropertyOwner", fields: [ownerId], references: [id])
  units Unit[]

  @@index([ownerId])
}

model Unit {
  id         String   @id @default(cuid())
  unitNumber String      // "101", "A", "Suite 3"
  bedrooms   Int      @default(1)
  bathrooms  Float    @default(1)
  sqft       Int?
  rentAmount Decimal  @db.Decimal(10, 2)
  isOccupied Boolean  @default(false)
  propertyId String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  property Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  leases   Lease[]
  tickets  MaintenanceTicket[]

  @@unique([propertyId, unitNumber])
  @@index([propertyId])
}

// ─── LEASES ──────────────────────────────────────

enum LeaseStatus {
  ACTIVE
  EXPIRED
  TERMINATED
  PENDING
}

model Lease {
  id           String      @id @default(cuid())
  unitId       String
  tenantId     String
  startDate    DateTime
  endDate      DateTime
  monthlyRent  Decimal     @db.Decimal(10, 2)
  depositAmount Decimal    @db.Decimal(10, 2) @default(0)
  status       LeaseStatus @default(PENDING)
  rentDueDay   Int         @default(1)    // Day of month rent is due
  gracePeriod  Int         @default(3)    // Days after due before "late"
  lateFee      Decimal     @db.Decimal(10, 2) @default(50)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  unit    Unit          @relation(fields: [unitId], references: [id])
  tenant  User          @relation("TenantLease", fields: [tenantId], references: [id])
  payments RentPayment[]

  @@index([unitId])
  @@index([tenantId])
  @@index([status])
}

// ─── RENT PAYMENTS ───────────────────────────────

enum PaymentStatus {
  PENDING
  PAID
  LATE
  PARTIAL
}

model RentPayment {
  id          String        @id @default(cuid())
  leaseId     String
  tenantId    String
  amount      Decimal       @db.Decimal(10, 2)
  dueDate     DateTime
  paidDate    DateTime?
  status      PaymentStatus @default(PENDING)
  lateFee     Decimal       @db.Decimal(10, 2) @default(0)
  notes       String?
  periodStart DateTime       // First day of the rent period
  periodEnd   DateTime       // Last day of the rent period
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  lease  Lease @relation(fields: [leaseId], references: [id])
  tenant User  @relation(fields: [tenantId], references: [id])

  @@unique([leaseId, periodStart])
  @@index([leaseId])
  @@index([tenantId])
  @@index([status])
  @@index([dueDate])
}

// ─── MAINTENANCE ─────────────────────────────────

enum TicketPriority {
  LOW
  MEDIUM
  HIGH
  EMERGENCY
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}

model MaintenanceTicket {
  id          String         @id @default(cuid())
  title       String
  description String
  priority    TicketPriority @default(MEDIUM)
  status      TicketStatus   @default(OPEN)
  unitId      String
  createdById String
  assignedToId String?
  resolvedAt  DateTime?
  closedAt    DateTime?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  unit       Unit  @relation(fields: [unitId], references: [id])
  createdBy  User  @relation("TicketCreator", fields: [createdById], references: [id])
  assignedTo User? @relation("TicketAssignee", fields: [assignedToId], references: [id])
  comments   TicketComment[]

  @@index([unitId])
  @@index([status])
  @@index([createdById])
}

model TicketComment {
  id        String   @id @default(cuid())
  content   String
  authorId  String
  ticketId  String
  createdAt DateTime @default(now())

  ticket MaintenanceTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)

  @@index([ticketId])
}

// ─── NOTIFICATIONS ───────────────────────────────

enum NotificationType {
  RENT_REMINDER
  RENT_OVERDUE
  TICKET_UPDATE
  LEASE_EXPIRING
  SYSTEM
}

model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  message   String
  isRead    Boolean          @default(false)
  link      String?           // Optional URL to navigate to
  createdAt DateTime         @default(now())

  user User @relation(fields: [userId], references: [id])

  @@index([userId, isRead])
  @@index([createdAt])
}

// ─── ACTIVITY LOGS ───────────────────────────────

model ActivityLog {
  id         String   @id @default(cuid())
  userId     String?
  action     String      // "CREATED_TICKET", "MARKED_RENT_PAID", etc.
  entityType String      // "Property", "Ticket", "RentPayment", etc.
  entityId   String
  details    String?     // JSON string with extra context
  ipAddress  String?
  createdAt  DateTime @default(now())

  user User? @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([entityType, entityId])
  @@index([createdAt])
}
```

### Schema Diagram (simplified)

```
User (1) ──── owns ────→ (many) Property
Property (1) ── has ──→ (many) Unit
Unit (1) ──── has ────→ (many) Lease
User (1) ──── has ────→ (many) Lease  (as tenant)
Lease (1) ─── has ────→ (many) RentPayment
Unit (1) ──── has ────→ (many) MaintenanceTicket
User (1) ──── has ────→ (many) Notification
User (1) ──── has ────→ (many) ActivityLog
```

---

## E) API Design (REST Endpoints)

### Auth

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

**POST /api/auth/register**
```json
// Request
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "name": "John Smith",
  "role": "LANDLORD"
}

// Response 201
{
  "id": "clx1abc...",
  "email": "john@example.com",
  "name": "John Smith",
  "role": "LANDLORD"
}

// Response 400
{ "error": "Email already registered" }
```

**POST /api/auth/login**
```json
// Request
{ "email": "john@example.com", "password": "SecurePass123!" }

// Response 200  (sets httpOnly cookie)
{
  "user": { "id": "clx1abc...", "email": "john@example.com", "role": "LANDLORD" },
  "message": "Login successful"
}
```

### Properties

```
GET    /api/properties              — List properties (filtered by role)
POST   /api/properties              — Create property (LANDLORD, MANAGER)
GET    /api/properties/:id          — Get property details
PUT    /api/properties/:id          — Update property
DELETE /api/properties/:id          — Delete property (MANAGER only)
```

**POST /api/properties**
```json
// Request (auth required, role: LANDLORD or MANAGER)
{
  "name": "Sunset Apartments",
  "address": "123 Main St",
  "city": "Austin",
  "state": "TX",
  "zipCode": "78701",
  "type": "APARTMENT"
}

// Response 201
{
  "id": "clx2def...",
  "name": "Sunset Apartments",
  "address": "123 Main St",
  "city": "Austin",
  "state": "TX",
  "zipCode": "78701",
  "type": "APARTMENT",
  "ownerId": "clx1abc...",
  "createdAt": "2026-02-06T..."
}
```

### Units

```
GET    /api/properties/:propertyId/units         — List units
POST   /api/properties/:propertyId/units         — Create unit
GET    /api/units/:id                             — Get unit details
PUT    /api/units/:id                             — Update unit
DELETE /api/units/:id                             — Delete unit
```

**POST /api/properties/:propertyId/units**
```json
// Request
{
  "unitNumber": "101",
  "bedrooms": 2,
  "bathrooms": 1,
  "sqft": 850,
  "rentAmount": 1200.00
}

// Response 201
{
  "id": "clx3ghi...",
  "unitNumber": "101",
  "bedrooms": 2,
  "bathrooms": 1,
  "sqft": 850,
  "rentAmount": 1200.00,
  "isOccupied": false,
  "propertyId": "clx2def..."
}
```

### Leases

```
GET    /api/leases                    — List leases (filtered by role)
POST   /api/leases                    — Create lease
GET    /api/leases/:id                — Get lease details
PUT    /api/leases/:id                — Update lease
PATCH  /api/leases/:id/terminate      — Terminate lease early
```

**POST /api/leases**
```json
// Request
{
  "unitId": "clx3ghi...",
  "tenantId": "clx4jkl...",
  "startDate": "2026-03-01",
  "endDate": "2027-02-28",
  "monthlyRent": 1200.00,
  "depositAmount": 1200.00,
  "rentDueDay": 1,
  "gracePeriod": 3,
  "lateFee": 50.00
}

// Response 201
{
  "id": "clx5mno...",
  "status": "ACTIVE",
  "unit": { "unitNumber": "101", "property": { "name": "Sunset Apartments" } },
  "tenant": { "name": "Jane Doe", "email": "jane@example.com" },
  ...
}
```

### Rent Payments

```
GET    /api/rent-payments                     — List payments (filtered)
GET    /api/rent-payments?leaseId=X           — Payments for a lease
PATCH  /api/rent-payments/:id/mark-paid       — Mark as paid
GET    /api/rent-payments/summary             — Rent roll summary
```

**PATCH /api/rent-payments/:id/mark-paid**
```json
// Request
{
  "paidDate": "2026-03-01",
  "amount": 1200.00,
  "notes": "Paid via check #1234"
}

// Response 200
{
  "id": "clx6pqr...",
  "status": "PAID",
  "paidDate": "2026-03-01T...",
  "lateFee": 0
}
```

### Maintenance Tickets

```
GET    /api/tickets                     — List tickets (filtered by role)
POST   /api/tickets                     — Create ticket (TENANT, MANAGER)
GET    /api/tickets/:id                 — Get ticket details + comments
PATCH  /api/tickets/:id/status          — Update status
PATCH  /api/tickets/:id/assign          — Assign to user
POST   /api/tickets/:id/comments        — Add comment
```

**POST /api/tickets**
```json
// Request (auth required, typically TENANT)
{
  "title": "Leaking faucet in kitchen",
  "description": "The kitchen faucet has been dripping for 2 days. Water pools under the sink.",
  "priority": "MEDIUM",
  "unitId": "clx3ghi..."
}

// Response 201
{
  "id": "clx7stu...",
  "title": "Leaking faucet in kitchen",
  "status": "OPEN",
  "priority": "MEDIUM",
  "createdBy": { "name": "Jane Doe" },
  "unit": { "unitNumber": "101" },
  "createdAt": "2026-02-06T..."
}
```

**PATCH /api/tickets/:id/status**
```json
// Request
{ "status": "IN_PROGRESS" }

// Response 200 (also creates notification for tenant)
{ "id": "clx7stu...", "status": "IN_PROGRESS", "updatedAt": "..." }
```

### Notifications

```
GET    /api/notifications                — List my notifications
PATCH  /api/notifications/:id/read       — Mark as read
PATCH  /api/notifications/read-all       — Mark all as read
GET    /api/notifications/unread-count    — Get unread count
```

### Admin / Manager

```
GET    /api/admin/users                  — List all users
PATCH  /api/admin/users/:id/toggle       — Enable/disable user
GET    /api/admin/logs                   — View activity logs
GET    /api/admin/export/tenants         — Export tenants CSV
GET    /api/admin/export/payments        — Export payments CSV
GET    /api/admin/export/tickets         — Export tickets CSV
GET    /api/admin/dashboard              — Dashboard stats
```

**GET /api/admin/dashboard**
```json
// Response 200
{
  "totalProperties": 3,
  "totalUnits": 24,
  "occupancyRate": 87.5,
  "totalTenants": 21,
  "openTickets": 5,
  "overdueRents": 3,
  "revenueThisMonth": 25200.00,
  "expiringLeases": 2
}
```

### Cron / Automation

```
POST   /api/cron/rent-reminders          — Generate rent reminders (called by Vercel Cron)
POST   /api/cron/late-fees               — Flag late payments & apply fees
POST   /api/cron/lease-expiry            — Warn about expiring leases (30 days out)
```

These are protected with a `CRON_SECRET` header so only Vercel's cron scheduler can call them.

---

## F) Page-by-Page UI Plan

### Public Pages

| Page | Route | What It Does |
|------|-------|-------------|
| **Landing** | `/` | Hero section, feature list, CTA to register/login. Shows this is a PropManager demo. |
| **Login** | `/login` | Email + password form. Link to register. |
| **Register** | `/register` | Name, email, password, role picker (Landlord or Tenant). Manager accounts created by seed only. |

### Shared (All Roles)

| Page | Route | What It Does |
|------|-------|-------------|
| **Dashboard** | `/dashboard` | Role-aware home page. Stats cards, recent activity, quick actions. |
| **Notifications** | `/notifications` | List of all notifications. Mark as read. Click to navigate to relevant item. |
| **Profile** | `/profile` | Edit name, phone, password. |

### Manager Pages

| Page | Route | What It Does |
|------|-------|-------------|
| **All Properties** | `/properties` | Table of all properties across all landlords. Search + filter. |
| **All Tenants** | `/tenants` | Table of all tenants. Search, filter by property. |
| **All Tickets** | `/tickets` | All maintenance tickets. Filter by status/priority. Bulk actions. |
| **Rent Overview** | `/rent` | Rent roll: all payments this month. Filter by status (paid/overdue/pending). |
| **User Management** | `/admin/users` | List users, toggle active/inactive, view role. |
| **Activity Logs** | `/admin/logs` | Searchable log of all system actions. Filter by user, action type, date. |
| **Reports / Export** | `/admin/reports` | Export buttons for CSV (tenants, payments, tickets). Basic stats. |

### Landlord Pages

| Page | Route | What It Does |
|------|-------|-------------|
| **My Properties** | `/properties` | List of landlord's own properties. Add new property button. |
| **Property Detail** | `/properties/[id]` | Property info + list of units. Add/edit units. |
| **Unit Detail** | `/properties/[id]/units/[unitId]` | Unit info, current tenant, lease details, ticket history. |
| **My Tenants** | `/tenants` | Tenants in this landlord's properties only. |
| **My Tickets** | `/tickets` | Tickets for this landlord's properties. Assign, update status. |
| **Rent Tracking** | `/rent` | Rent status for this landlord's tenants. Mark paid button. |
| **Add Lease** | `/leases/new` | Form: pick unit, pick/invite tenant, set dates and rent. |

### Tenant Pages

| Page | Route | What It Does |
|------|-------|-------------|
| **My Home** | `/dashboard` | Current unit info, rent status, lease end date, recent notifications. |
| **My Rent** | `/rent` | Payment history. Current month status. (No pay button in MVP — manual tracking.) |
| **My Tickets** | `/tickets` | Tenant's own maintenance tickets. Submit new ticket button. |
| **New Ticket** | `/tickets/new` | Form: title, description, priority. Pre-filled with tenant's unit. |
| **Ticket Detail** | `/tickets/[id]` | Ticket status timeline, comments thread. Add comment. |

### UI Component Plan

```
Layout
├── Sidebar (navigation, role-aware menu items)
├── TopBar (app name, notification bell with count, user avatar/menu)
└── Main Content Area
    ├── PageHeader (title, breadcrumbs, action buttons)
    ├── StatsCards (dashboard only — 4 cards in a row)
    ├── DataTable (reusable: sortable, filterable, paginated)
    ├── Forms (reusable form components with validation)
    ├── Modal (confirm dialogs, quick edits)
    └── EmptyState (friendly message when no data)
```

---

## G) Step-by-Step Build Checklist

### WEEK 0: Setup (Day 1)

- [ ] **0.1** Install Node.js (LTS version, v20+): https://nodejs.org
- [ ] **0.2** Install VS Code extensions: ESLint, Prettier, Tailwind CSS IntelliSense, Prisma
- [ ] **0.3** Open terminal in VS Code. Verify: `node -v` and `npm -v`
- [ ] **0.4** Create GitHub repo called `propmanager` (public, for portfolio)
- [ ] **0.5** Create Supabase account: https://supabase.com (free tier)
  - Create new project → note down the **connection string** (Settings → Database → Connection string → URI)
- [ ] **0.6** Create Vercel account: https://vercel.com (sign in with GitHub)

### WEEK 1: Foundation (Days 2–5)

#### Milestone 1: Scaffold (Day 2)

- [ ] **1.1** Create Next.js app:
  ```bash
  npx create-next-app@latest propmanager --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
  cd propmanager
  ```
- [ ] **1.2** Install core dependencies:
  ```bash
  npm install prisma @prisma/client
  npm install next-auth@beta @auth/prisma-adapter
  npm install bcryptjs
  npm install zod
  npm install @tanstack/react-query
  npm install -D @types/bcryptjs vitest @testing-library/react
  ```
- [ ] **1.3** Install shadcn/ui:
  ```bash
  npx shadcn@latest init
  npx shadcn@latest add button card input label table badge dialog dropdown-menu toast tabs separator avatar sheet
  ```
- [ ] **1.4** Initialize Prisma:
  ```bash
  npx prisma init
  ```
- [ ] **1.5** Create `.env.local`:
  ```
  DATABASE_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"
  NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
  NEXTAUTH_URL="http://localhost:3000"
  CRON_SECRET="generate-another-random-string"
  ```
- [ ] **1.6** Paste the schema from Section D into `prisma/schema.prisma`
- [ ] **1.7** Fix the schema — the Property owner relation should reference User:
  Change `Owner` to `User` on the Property.owner relation
- [ ] **1.8** Push schema to database:
  ```bash
  npx prisma db push
  ```
- [ ] **1.9** Generate Prisma client: `npx prisma generate`
- [ ] **1.10** Create `src/lib/prisma.ts` (singleton):
  ```ts
  import { PrismaClient } from '@prisma/client'
  const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
  export const prisma = globalForPrisma.prisma || new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
  ```
- [ ] **1.11** Verify: `npx prisma studio` → opens browser, you see empty tables
- [ ] **1.12** Git init + first commit:
  ```bash
  git init
  git add .
  git commit -m "chore: scaffold Next.js + Prisma + shadcn"
  git remote add origin https://github.com/YOUR_USERNAME/propmanager.git
  git push -u origin main
  ```
- [ ] **1.13** **What you should see**: App runs on localhost:3000 with default Next.js page. Prisma Studio shows your tables.

#### Milestone 2: Auth (Days 3–4)

- [ ] **2.1** Create `src/lib/auth.ts` — NextAuth config with CredentialsProvider
  - Hash passwords with bcryptjs on register
  - Verify password on login
  - Include `role` and `id` in the JWT token and session
- [ ] **2.2** Create `src/app/api/auth/[...nextauth]/route.ts` — NextAuth route handler
- [ ] **2.3** Create `src/app/api/auth/register/route.ts`:
  - Validate input with Zod (email format, password min 8 chars, valid role)
  - Check for duplicate email
  - Hash password, create user
  - Return user (without password)
- [ ] **2.4** Create `src/lib/validations/auth.ts` — Zod schemas for register/login
- [ ] **2.5** Create `src/app/(auth)/login/page.tsx` — Login form
- [ ] **2.6** Create `src/app/(auth)/register/page.tsx` — Register form with role picker
- [ ] **2.7** Create `src/middleware.ts` — Protect `/dashboard` and all app routes
- [ ] **2.8** Create `src/lib/auth-utils.ts` — Helper: `requireAuth()`, `requireRole()`
- [ ] **2.9** Test: Register as LANDLORD → redirected to /dashboard. Login/logout works.
- [ ] **2.10** Git commit: `feat: add auth with NextAuth credentials provider`

#### Milestone 3: Layout + Dashboard Shell (Day 5)

- [ ] **3.1** Create `src/app/(dashboard)/layout.tsx` — Sidebar + TopBar layout
- [ ] **3.2** Create `src/components/layout/sidebar.tsx` — Role-aware navigation links
- [ ] **3.3** Create `src/components/layout/topbar.tsx` — App name, notification bell, user menu
- [ ] **3.4** Create `src/components/layout/stats-card.tsx` — Reusable stat card component
- [ ] **3.5** Create `src/app/(dashboard)/dashboard/page.tsx` — Dashboard with placeholder stats
- [ ] **3.6** Test: Login → see sidebar with role-appropriate links, dashboard with stat cards
- [ ] **3.7** Git commit: `feat: add dashboard layout with role-aware sidebar`

### WEEK 2: Core Features (Days 6–10)

#### Milestone 4: Properties + Units CRUD (Days 6–7)

- [ ] **4.1** Create `src/app/api/properties/route.ts` — GET (list) + POST (create)
- [ ] **4.2** Create `src/app/api/properties/[id]/route.ts` — GET, PUT, DELETE
- [ ] **4.3** Create `src/app/api/properties/[id]/units/route.ts` — GET + POST
- [ ] **4.4** Create `src/app/api/units/[id]/route.ts` — GET, PUT, DELETE
- [ ] **4.5** Add Zod validation schemas for properties and units
- [ ] **4.6** Create `src/app/(dashboard)/properties/page.tsx` — Properties list with DataTable
- [ ] **4.7** Create `src/app/(dashboard)/properties/new/page.tsx` — Add property form
- [ ] **4.8** Create `src/app/(dashboard)/properties/[id]/page.tsx` — Property detail + units list
- [ ] **4.9** Create reusable `src/components/data-table.tsx` — Sortable, filterable table
- [ ] **4.10** Test: Create property, add units, edit, delete. Table shows data correctly.
- [ ] **4.11** Git commit: `feat: add property and unit CRUD`

#### Milestone 5: Leases + Tenant Management (Days 8–9)

- [ ] **5.1** Create `src/app/api/leases/route.ts` — GET + POST
- [ ] **5.2** Create `src/app/api/leases/[id]/route.ts` — GET, PUT
- [ ] **5.3** Create `src/app/api/leases/[id]/terminate/route.ts` — PATCH
- [ ] **5.4** Lease creation logic: auto-set unit.isOccupied = true, create first RentPayment record
- [ ] **5.5** Create `src/app/(dashboard)/leases/new/page.tsx` — Lease form (pick unit + tenant)
- [ ] **5.6** Create `src/app/(dashboard)/tenants/page.tsx` — Tenant directory
- [ ] **5.7** Add tenant info to unit detail page
- [ ] **5.8** Test: Create lease, see tenant assigned to unit, unit shows occupied.
- [ ] **5.9** Git commit: `feat: add lease and tenant management`

#### Milestone 6: Rent Tracking (Day 10)

- [ ] **6.1** Create `src/app/api/rent-payments/route.ts` — GET (list, filter by lease/status/month)
- [ ] **6.2** Create `src/app/api/rent-payments/[id]/mark-paid/route.ts` — PATCH
- [ ] **6.3** Create `src/app/api/rent-payments/summary/route.ts` — Rent roll summary
- [ ] **6.4** Create `src/app/(dashboard)/rent/page.tsx` — Rent overview table
  - Shows: tenant name, unit, amount due, due date, status, "Mark Paid" button
  - Filter tabs: All | Pending | Paid | Overdue
- [ ] **6.5** Create rent generation utility: when a lease is created, auto-generate monthly RentPayment records
- [ ] **6.6** Test: Create lease → rent records appear. Mark as paid → status updates.
- [ ] **6.7** Git commit: `feat: add rent tracking with mark-paid`

### WEEK 3: Automation + Tickets (Days 11–15)

#### Milestone 7: Maintenance Tickets (Days 11–12)

- [ ] **7.1** Create `src/app/api/tickets/route.ts` — GET + POST
- [ ] **7.2** Create `src/app/api/tickets/[id]/route.ts` — GET (with comments)
- [ ] **7.3** Create `src/app/api/tickets/[id]/status/route.ts` — PATCH
- [ ] **7.4** Create `src/app/api/tickets/[id]/assign/route.ts` — PATCH
- [ ] **7.5** Create `src/app/api/tickets/[id]/comments/route.ts` — POST
- [ ] **7.6** Create `src/app/(dashboard)/tickets/page.tsx` — Tickets list with filters
- [ ] **7.7** Create `src/app/(dashboard)/tickets/new/page.tsx` — New ticket form
- [ ] **7.8** Create `src/app/(dashboard)/tickets/[id]/page.tsx` — Ticket detail + comments + status timeline
- [ ] **7.9** Auto-create notification when ticket status changes
- [ ] **7.10** Test: Tenant creates ticket → Landlord sees it → Updates status → Tenant gets notification.
- [ ] **7.11** Git commit: `feat: add maintenance ticket system with comments`

#### Milestone 8: Notifications + Activity Logs (Day 13)

- [ ] **8.1** Create `src/app/api/notifications/route.ts` — GET
- [ ] **8.2** Create `src/app/api/notifications/[id]/read/route.ts` — PATCH
- [ ] **8.3** Create `src/app/api/notifications/read-all/route.ts` — PATCH
- [ ] **8.4** Create `src/app/api/notifications/unread-count/route.ts` — GET
- [ ] **8.5** Create `src/lib/notifications.ts` — Helper: `createNotification(userId, type, title, message, link?)`
- [ ] **8.6** Create `src/lib/activity-log.ts` — Helper: `logActivity(userId, action, entityType, entityId, details?)`
- [ ] **8.7** Add activity logging calls to all existing API routes (property CRUD, lease, rent, ticket)
- [ ] **8.8** Update TopBar notification bell: show unread count, dropdown with recent notifications
- [ ] **8.9** Create `src/app/(dashboard)/notifications/page.tsx` — Full notification list
- [ ] **8.10** Test: Perform actions → logs appear. Notifications show in bell and page.
- [ ] **8.11** Git commit: `feat: add notifications and activity logging`

#### Milestone 9: Automations — Cron Jobs (Day 14)

- [ ] **9.1** Create `src/app/api/cron/rent-reminders/route.ts`:
  - Find all PENDING rent payments where dueDate is in 5 days, today, or 3 days ago
  - Create notification for each tenant
  - Secured with CRON_SECRET header check
- [ ] **9.2** Create `src/app/api/cron/late-fees/route.ts`:
  - Find PENDING payments where dueDate + gracePeriod has passed
  - Update status to LATE, add lateFee amount
  - Notify tenant and landlord
- [ ] **9.3** Create `src/app/api/cron/lease-expiry/route.ts`:
  - Find ACTIVE leases ending within 30 days
  - Notify tenant and landlord
- [ ] **9.4** Create `vercel.json` with cron config:
  ```json
  {
    "crons": [
      { "path": "/api/cron/rent-reminders", "schedule": "0 9 * * *" },
      { "path": "/api/cron/late-fees", "schedule": "0 10 * * *" },
      { "path": "/api/cron/lease-expiry", "schedule": "0 8 * * 1" }
    ]
  }
  ```
- [ ] **9.5** Test locally: Call the cron endpoints manually with the secret header using curl/Postman
- [ ] **9.6** Git commit: `feat: add automated rent reminders, late fees, and lease expiry warnings`

#### Milestone 10: Admin Tools (Day 15)

- [ ] **10.1** Create `src/app/api/admin/users/route.ts` — GET all users
- [ ] **10.2** Create `src/app/api/admin/users/[id]/toggle/route.ts` — PATCH enable/disable
- [ ] **10.3** Create `src/app/api/admin/logs/route.ts` — GET with filters (user, action, date range)
- [ ] **10.4** Create `src/app/api/admin/export/[type]/route.ts` — GET returns CSV (tenants, payments, tickets)
- [ ] **10.5** Create `src/app/api/admin/dashboard/route.ts` — GET aggregated stats
- [ ] **10.6** Create `src/app/(dashboard)/admin/users/page.tsx` — User management table
- [ ] **10.7** Create `src/app/(dashboard)/admin/logs/page.tsx` — Activity logs viewer
- [ ] **10.8** Create `src/app/(dashboard)/admin/reports/page.tsx` — Export buttons + basic stats
- [ ] **10.9** Add role guard: only MANAGER can access `/admin/*` routes
- [ ] **10.10** Test: Manager can see all users, disable a tenant, view logs, download CSV.
- [ ] **10.11** Git commit: `feat: add admin panel with user management, logs, and exports`

### WEEK 4: Polish + Deploy (Days 16–20)

#### Milestone 11: Seed Data + Demo Mode (Day 16)

- [ ] **11.1** Create `prisma/seed.ts`:
  - 1 Manager account (admin@propmanager.com / demo123)
  - 2 Landlord accounts
  - 5 Tenant accounts
  - 3 Properties with 2-4 units each
  - Active leases for most tenants
  - Mix of PAID, PENDING, LATE rent payments
  - 8-10 maintenance tickets in various statuses
  - Some notifications and activity logs
- [ ] **11.2** Add seed script to package.json: `"prisma": { "seed": "tsx prisma/seed.ts" }`
- [ ] **11.3** Install tsx: `npm install -D tsx`
- [ ] **11.4** Run: `npx prisma db seed`
- [ ] **11.5** Test: Login as each role, verify realistic data appears
- [ ] **11.6** Add demo login buttons on login page (one-click login as each role)
- [ ] **11.7** Git commit: `feat: add seed data and demo login`

#### Milestone 12: Security Hardening (Day 17)

- [ ] **12.1** Add rate limiting to auth routes: use a simple in-memory counter or `next-rate-limit`
- [ ] **12.2** Add input validation (Zod) to ALL API routes — review each one
- [ ] **12.3** Add CSRF protection (NextAuth handles this, verify it's working)
- [ ] **12.4** Add role-based API middleware: create `src/lib/api-utils.ts`:
  ```ts
  export async function withAuth(req, allowedRoles: Role[]) { ... }
  ```
- [ ] **12.5** Sanitize all user text inputs (ticket descriptions, comments) — prevent XSS
- [ ] **12.6** Add `.env.local` to `.gitignore` (should already be there)
- [ ] **12.7** Review: no secrets in client code, no raw SQL, no unvalidated IDs
- [ ] **12.8** Git commit: `chore: security hardening — rate limiting, validation, role guards`

#### Milestone 13: Polish + Responsive (Day 18)

- [ ] **13.1** Add loading states to all pages (skeleton loaders)
- [ ] **13.2** Add error boundaries and user-friendly error messages
- [ ] **13.3** Add empty states (no properties yet, no tickets, etc.)
- [ ] **13.4** Make sidebar collapsible on mobile (sheet/drawer)
- [ ] **13.5** Test all pages on mobile viewport (Chrome DevTools)
- [ ] **13.6** Add page titles and meta descriptions
- [ ] **13.7** Git commit: `chore: polish UI — loading states, errors, responsive`

#### Milestone 14: Testing (Day 19)

- [ ] **14.1** Create `vitest.config.ts`
- [ ] **14.2** Write unit tests for utility functions (auth helpers, validation schemas, date utils)
- [ ] **14.3** Write unit tests for rent reminder logic (which tenants should get reminded)
- [ ] **14.4** Write unit tests for late fee calculation logic
- [ ] **14.5** Write integration tests for key API routes (register, create property, create ticket)
- [ ] **14.6** Run all tests: `npm test`
- [ ] **14.7** Git commit: `test: add unit and integration tests`

#### Milestone 15: Deploy (Day 20)

- [ ] **15.1** Push latest code to GitHub
- [ ] **15.2** Go to Vercel → Import Git Repository → select `propmanager`
- [ ] **15.3** Add environment variables in Vercel dashboard:
  - `DATABASE_URL` (Supabase connection string — use the **pooler** connection string for Vercel)
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL` = `https://your-app.vercel.app`
  - `CRON_SECRET`
- [ ] **15.4** Deploy. Fix any build errors.
- [ ] **15.5** Run seed on production DB:
  ```bash
  # Temporarily set DATABASE_URL to production, then:
  npx prisma db push
  npx prisma db seed
  ```
- [ ] **15.6** Verify: Visit your Vercel URL, login with demo accounts, test all features.
- [ ] **15.7** Add the Vercel URL to your GitHub repo description.
- [ ] **15.8** Git commit: `chore: deployment configuration`

---

## H) File/Folder Structure

```
propmanager/
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── seed.ts                    # Demo data seed script
├── src/
│   ├── app/
│   │   ├── (auth)/                # Auth pages (no sidebar)
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/           # App pages (with sidebar)
│   │   │   ├── layout.tsx         # Sidebar + TopBar wrapper
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx       # List
│   │   │   │   ├── new/page.tsx   # Create form
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx   # Detail + units
│   │   │   ├── tenants/page.tsx
│   │   │   ├── leases/
│   │   │   │   └── new/page.tsx
│   │   │   ├── rent/page.tsx
│   │   │   ├── tickets/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── notifications/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   └── admin/
│   │   │       ├── users/page.tsx
│   │   │       ├── logs/page.tsx
│   │   │       └── reports/page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts
│   │   │   │   └── register/route.ts
│   │   │   ├── properties/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── units/route.ts
│   │   │   ├── units/[id]/route.ts
│   │   │   ├── leases/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── terminate/route.ts
│   │   │   ├── rent-payments/
│   │   │   │   ├── route.ts
│   │   │   │   ├── summary/route.ts
│   │   │   │   └── [id]/mark-paid/route.ts
│   │   │   ├── tickets/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       ├── status/route.ts
│   │   │   │       ├── assign/route.ts
│   │   │   │       └── comments/route.ts
│   │   │   ├── notifications/
│   │   │   │   ├── route.ts
│   │   │   │   ├── unread-count/route.ts
│   │   │   │   ├── read-all/route.ts
│   │   │   │   └── [id]/read/route.ts
│   │   │   ├── admin/
│   │   │   │   ├── users/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/toggle/route.ts
│   │   │   │   ├── logs/route.ts
│   │   │   │   ├── export/[type]/route.ts
│   │   │   │   └── dashboard/route.ts
│   │   │   └── cron/
│   │   │       ├── rent-reminders/route.ts
│   │   │       ├── late-fees/route.ts
│   │   │       └── lease-expiry/route.ts
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Landing page
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                    # shadcn components (auto-generated)
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── topbar.tsx
│   │   │   └── stats-card.tsx
│   │   ├── data-table.tsx         # Reusable table component
│   │   ├── forms/
│   │   │   ├── property-form.tsx
│   │   │   ├── unit-form.tsx
│   │   │   ├── lease-form.tsx
│   │   │   └── ticket-form.tsx
│   │   └── providers.tsx          # React Query + Session providers
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── auth.ts                # NextAuth configuration
│   │   ├── auth-utils.ts          # requireAuth, requireRole helpers
│   │   ├── api-utils.ts           # API response helpers, error handling
│   │   ├── notifications.ts       # createNotification helper
│   │   ├── activity-log.ts        # logActivity helper
│   │   └── validations/
│   │       ├── auth.ts            # Zod schemas for auth
│   │       ├── property.ts
│   │       ├── lease.ts
│   │       ├── ticket.ts
│   │       └── rent.ts
│   └── types/
│       └── index.ts               # Shared TypeScript types
├── tests/
│   ├── unit/
│   │   ├── validations.test.ts
│   │   ├── rent-reminders.test.ts
│   │   └── late-fees.test.ts
│   └── integration/
│       ├── auth.test.ts
│       ├── properties.test.ts
│       └── tickets.test.ts
├── .env.local                     # Local environment variables (git-ignored)
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json                    # Cron configuration
└── vitest.config.ts
```

---

## I) Core User Stories

### Manager (Admin)

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| M1 | As a manager, I can view all properties across all landlords | Dashboard shows total properties, can click to see list |
| M2 | As a manager, I can see all open maintenance tickets | Tickets page shows all tickets, filterable by status |
| M3 | As a manager, I can disable a user account | User management page, toggle button, disabled user can't login |
| M4 | As a manager, I can view activity logs | Logs page shows who did what and when, searchable |
| M5 | As a manager, I can export data as CSV | Reports page has export buttons, downloads valid CSV |
| M6 | As a manager, I can see a dashboard with key metrics | Dashboard: properties, units, occupancy %, open tickets, overdue rents |

### Landlord

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| L1 | As a landlord, I can add properties and units | Form creates property, can add units to it |
| L2 | As a landlord, I can create a lease for a tenant | Lease form assigns tenant to unit, sets rent and dates |
| L3 | As a landlord, I can mark rent as paid | Rent page shows "Mark Paid" button, updates status |
| L4 | As a landlord, I can review maintenance tickets for my properties | Tickets page filtered to my properties |
| L5 | As a landlord, I can update ticket status | Can move ticket through workflow: open → in-progress → resolved |
| L6 | As a landlord, I can see which leases are expiring | Dashboard shows expiring leases count |

### Tenant

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| T1 | As a tenant, I can see my unit info and lease details | Dashboard shows current unit, rent amount, lease end date |
| T2 | As a tenant, I can submit a maintenance ticket | Form: title, description, priority. Creates ticket for my unit. |
| T3 | As a tenant, I can comment on my tickets | Ticket detail page has comment form, shows thread |
| T4 | As a tenant, I can see my rent payment history | Rent page shows all months, status for each |
| T5 | As a tenant, I receive rent reminder notifications | Notification bell shows reminders before due date |
| T6 | As a tenant, I get notified when my ticket is updated | Status change creates notification I can see |

---

## J) Claude Usage Guide + Milestone Prompts

### Ground Rules for Using Claude to Generate Code

**Rule 1: ONE milestone at a time.**
Don't ask Claude to build the whole app. Go milestone by milestone.

**Rule 2: Always provide context.**
Paste your current file structure, schema, and any existing code that the new code needs to connect to.

**Rule 3: Read before you run.**
Always read Claude's generated code before pasting it into your project. Look for:
- Hardcoded values that should be environment variables
- Missing error handling
- Imports that reference files you haven't created yet
- Logic that doesn't match your schema

**Rule 4: Test after each milestone.**
Run the app, try the feature, check for errors. Don't stack multiple untested milestones.

**Rule 5: Commit after each milestone works.**
Git commit = save point. You can always go back.

**Rule 6: Don't blindly accept "improvements."**
If Claude suggests refactoring existing working code while adding a feature, be cautious. Only accept changes that are directly needed for the new feature.

**Rule 7: Use this prompt format:**

```
I'm building a Next.js property management app (TypeScript, Prisma, NextAuth, shadcn/ui).

CURRENT STATE:
[Paste relevant file contents or describe what's built so far]

TASK:
[Exactly what you want Claude to build — reference the milestone]

CONSTRAINTS:
- Follow my existing code patterns
- Use Prisma for all database operations
- Use Zod for input validation
- Use shadcn/ui components for the UI
- Include error handling
- TypeScript strict mode

OUTPUT:
Give me the complete file contents for each file I need to create or modify.
Label each file with its path.
```

### Milestone Prompts

Below are the exact prompts to use for each milestone. Copy-paste these into Claude, filling in the `[brackets]`.

---

**PROMPT 1: Scaffold + Prisma Setup** (after running create-next-app and npm installs)

```
I just created a new Next.js app with TypeScript, Tailwind, and App Router.
I've installed Prisma, NextAuth, bcryptjs, zod, @tanstack/react-query, and shadcn/ui.

Here is my Prisma schema:
[paste the full schema from Section D]

Create these files for me:

1. src/lib/prisma.ts — Prisma client singleton (handle Next.js hot reload)
2. src/types/index.ts — Export useful TypeScript types derived from Prisma models
3. src/lib/api-utils.ts — Helper functions:
   - successResponse(data, status?) — returns NextResponse with JSON
   - errorResponse(message, status) — returns NextResponse with error
   - parseBody(request) — safely parses JSON body with try/catch

Use strict TypeScript throughout.
```

---

**PROMPT 2: Authentication**

```
I'm building a Next.js 14 app (App Router) with Prisma and shadcn/ui.

Here is my Prisma schema (User model):
[paste User model + Role enum]

Here is my existing prisma.ts:
[paste src/lib/prisma.ts]

Build the complete authentication system:

1. src/lib/auth.ts — NextAuth v5 config with CredentialsProvider
   - Verify email + hashed password (bcryptjs)
   - Include id, role, name in the JWT and session
   - Session strategy: jwt

2. src/app/api/auth/[...nextauth]/route.ts — Route handler

3. src/app/api/auth/register/route.ts — POST endpoint
   - Validate with Zod: email (valid format), password (min 8, must have number), name (min 2), role (LANDLORD or TENANT only, not MANAGER)
   - Check duplicate email
   - Hash password
   - Return user without password

4. src/lib/validations/auth.ts — Zod schemas for register and login

5. src/middleware.ts — Protect all routes under /(dashboard). Redirect to /login if not authenticated.

6. src/lib/auth-utils.ts — Helpers:
   - getCurrentUser(req) — get user from session
   - requireAuth(req) — throw 401 if not authenticated
   - requireRole(req, roles: Role[]) — throw 403 if wrong role

7. src/app/(auth)/login/page.tsx — Login form using shadcn/ui Input, Button, Card. Show errors. Redirect to /dashboard on success.

8. src/app/(auth)/register/page.tsx — Register form with role picker (dropdown: Landlord or Tenant). Redirect to /login on success.

9. src/components/providers.tsx — SessionProvider + QueryClientProvider wrapper

10. Update src/app/layout.tsx to wrap with Providers

CONSTRAINTS:
- Use server actions or fetch for form submissions
- Handle all error states in the UI
- Use shadcn/ui components
- Passwords must be hashed with bcryptjs (cost factor 12)
- No secrets in client-side code
```

---

**PROMPT 3: Dashboard Layout**

```
I have a working Next.js auth system (NextAuth, Prisma). Users have roles: MANAGER, LANDLORD, TENANT.

Build the dashboard layout:

1. src/app/(dashboard)/layout.tsx — Layout with Sidebar + TopBar
   - Get current user session
   - Pass role to Sidebar for conditional nav links

2. src/components/layout/sidebar.tsx — Left sidebar
   - Logo/app name at top
   - Navigation links based on role:
     MANAGER: Dashboard, Properties, Tenants, Tickets, Rent, Admin (Users, Logs, Reports)
     LANDLORD: Dashboard, My Properties, My Tenants, Tickets, Rent, Leases
     TENANT: Dashboard, My Rent, My Tickets
   - Active link highlighting
   - Collapsible on mobile (use shadcn Sheet)

3. src/components/layout/topbar.tsx — Top bar
   - Hamburger menu (mobile only, toggles sidebar)
   - Notification bell icon with unread count badge (hardcode 0 for now)
   - User avatar with dropdown: Profile, Logout

4. src/components/layout/stats-card.tsx — Reusable card showing: icon, label, value, optional trend

5. src/app/(dashboard)/dashboard/page.tsx — Dashboard home
   - Role-specific greeting: "Welcome back, [Name]"
   - Stats cards row (use placeholder data for now):
     MANAGER: Total Properties, Total Tenants, Open Tickets, Overdue Rent
     LANDLORD: My Properties, My Tenants, Open Tickets, Pending Rent
     TENANT: Rent Due, Open Tickets, Lease Ends In, Notifications

Use Tailwind for layout (sidebar 256px, main content with padding).
Use shadcn/ui components. Make it look clean and professional.
Sidebar should be dark/navy colored, main content light gray background.
```

---

**PROMPT 4: Properties + Units CRUD**

```
I have a working Next.js app with auth and dashboard layout.

My Prisma models: [paste Property, Unit models]
My auth helper: [paste auth-utils.ts]
My api helper: [paste api-utils.ts]

Build complete Properties + Units CRUD:

API Routes:
1. src/app/api/properties/route.ts — GET (list, filtered by role: manager sees all, landlord sees own) + POST (create, landlord/manager only)
2. src/app/api/properties/[id]/route.ts — GET, PUT, DELETE (with ownership checks)
3. src/app/api/properties/[id]/units/route.ts — GET (list units) + POST (create unit)
4. src/app/api/units/[id]/route.ts — GET, PUT, DELETE

Validation:
5. src/lib/validations/property.ts — Zod schemas for property and unit create/update

Pages:
6. src/app/(dashboard)/properties/page.tsx — Properties list table. Columns: Name, Address, Type, Units Count, Actions (edit/delete). "Add Property" button.
7. src/app/(dashboard)/properties/new/page.tsx — Create property form
8. src/app/(dashboard)/properties/[id]/page.tsx — Property detail: info card + units table. "Add Unit" button opens dialog/modal.

Shared:
9. src/components/data-table.tsx — Reusable data table with: sorting, search/filter input, pagination (10 per page)
10. src/components/forms/property-form.tsx — Reusable property form (used for both create and edit)
11. src/components/forms/unit-form.tsx — Reusable unit form

IMPORTANT:
- All API routes must check authentication and role
- Landlords can only see/edit their own properties
- Manager can see/edit all
- Use React Query for data fetching on the frontend
- Use toast notifications for success/error feedback
- Include loading and empty states
```

---

**PROMPT 5: Leases + Tenants**

```
[Same context pattern — paste relevant existing code]

Build leases and tenant management. When a lease is created:
1. Set unit.isOccupied = true
2. Generate RentPayment records for each month of the lease
3. Set lease status to ACTIVE

[Specify the API routes, pages, and forms needed — reference checklist items 5.1–5.8]
```

---

**PROMPT 6: Rent Tracking**

```
[Same context pattern]

Build the rent tracking page and mark-paid functionality.
[Reference checklist items 6.1–6.6]
Key: the rent overview should show a table of all tenants' rent for the current month,
with status badges (green=paid, yellow=pending, red=overdue) and a "Mark Paid" button.
```

---

**PROMPT 7: Maintenance Tickets**

```
[Same context pattern]

Build the full maintenance ticket system with comments.
[Reference checklist items 7.1–7.9]
Key: ticket detail page should show a status timeline (visual progress bar: open → in-progress → resolved → closed)
and a comments section like a chat thread.
```

---

**PROMPT 8: Notifications + Logs**

```
[Same context pattern]

Build the notification system and activity logging.
[Reference checklist items 8.1–8.10]
Key: integrate createNotification calls into existing ticket and rent routes.
Create the TopBar notification dropdown with real data.
```

---

**PROMPT 9: Cron Automations**

```
[Same context pattern]

Build the cron job API routes for rent reminders, late fee processing, and lease expiry warnings.
[Reference checklist items 9.1–9.5]
Include the vercel.json cron configuration.
Each endpoint must verify the CRON_SECRET header.
```

---

**PROMPT 10: Admin Tools**

```
[Same context pattern]

Build the admin panel: user management, activity logs viewer, CSV export, and dashboard stats.
[Reference checklist items 10.1–10.9]
CSV export should use proper escaping and include headers.
```

---

**PROMPT 11: Seed Data**

```
[Same context pattern — paste full schema]

Create prisma/seed.ts with realistic demo data:
- 1 Manager: admin@propmanager.com / demo123
- 2 Landlords: landlord1@demo.com, landlord2@demo.com / demo123
- 5 Tenants: tenant1@demo.com through tenant5@demo.com / demo123
- 3 Properties (Sunset Apartments, Oak Street Houses, Downtown Lofts) with 2-4 units each
- Active leases for most tenants
- Rent payments: mix of PAID, PENDING, LATE across recent months
- 8-10 maintenance tickets in various statuses with comments
- Some notifications and activity logs

Use realistic-sounding names and addresses.
Hash all passwords with bcryptjs.
Use Prisma's createMany where possible for performance.
```

---

## K) Deployment + Environment Variables

### Environment Variables List

| Variable | Where to Get It | Example |
|----------|----------------|---------|
| `DATABASE_URL` | Supabase → Settings → Database → Connection string (use **Transaction pooler** for Vercel) | `postgresql://postgres.xxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres` |
| `DIRECT_URL` | Supabase → Settings → Database → Connection string (use **Session mode** for migrations) | `postgresql://postgres.xxxx:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres` |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` (or use a random string generator) | `Kx7j3mP9...` |
| `NEXTAUTH_URL` | Your deployment URL | `http://localhost:3000` (local) or `https://propmanager.vercel.app` (prod) |
| `CRON_SECRET` | Generate: another random string | `cron_secret_abc123...` |

### Deployment Steps

```bash
# 1. Ensure everything is committed and pushed
git add .
git commit -m "ready to deploy"
git push origin main

# 2. Go to vercel.com → "Add New Project"
# 3. Import your GitHub repo: propmanager
# 4. Framework Preset: Next.js (auto-detected)
# 5. Add environment variables (copy from table above)
# 6. Click "Deploy"

# 7. After deploy succeeds, push schema to production DB:
#    (Set DATABASE_URL temporarily to production pooler URL)
npx prisma db push

# 8. Seed production database:
npx prisma db seed

# 9. Verify: visit your Vercel URL, login with demo accounts
```

### Prisma + Supabase Config

Add to `prisma/schema.prisma` datasource block for Vercel:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### Vercel Cron (Free Tier)

Free tier allows 1 cron job per day. If you need more frequency, upgrade or use a free external cron service (cron-job.org) to hit your API endpoints.

The `vercel.json` from Milestone 9 configures the cron jobs.

---

## L) Testing + Acceptance Checklist

### Testing Plan

#### Unit Tests (Vitest)

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**What to test:**
1. **Validation schemas** — Zod schemas accept valid data, reject invalid data
2. **Rent reminder logic** — Correctly identifies tenants who need reminders (5 days before, on due date, 3 days after)
3. **Late fee logic** — Correctly flags payments as late after grace period, calculates fee
4. **Auth helpers** — requireRole throws for wrong roles, passes for correct roles
5. **CSV export** — Generates valid CSV with proper escaping

#### Integration Tests

**What to test:**
1. **Register** → creates user with hashed password, correct role
2. **Login** → returns session for valid creds, rejects invalid
3. **Create Property** → LANDLORD can create, TENANT cannot
4. **Create Ticket** → TENANT can create for their unit, cannot create for other units
5. **Mark Rent Paid** → Updates status, records paid date

### Acceptance Checklist

Run through this entire checklist before considering the MVP complete:

#### Auth
- [ ] Can register as Landlord
- [ ] Can register as Tenant
- [ ] Cannot register as Manager (only seeded)
- [ ] Can login with valid credentials
- [ ] Cannot login with wrong password
- [ ] Disabled users cannot login
- [ ] Redirected to /login when not authenticated
- [ ] JWT contains correct role

#### Properties (Landlord)
- [ ] Can create a property
- [ ] Can add units to a property
- [ ] Can edit property details
- [ ] Can edit unit details
- [ ] Cannot see other landlords' properties
- [ ] Properties list is searchable

#### Properties (Manager)
- [ ] Can see ALL properties across all landlords
- [ ] Can delete a property

#### Leases
- [ ] Can create a lease (assigns tenant to unit)
- [ ] Unit shows as occupied after lease creation
- [ ] Rent payment records auto-generated for lease period
- [ ] Can terminate a lease early
- [ ] Expired leases show correct status

#### Rent
- [ ] Rent overview shows all tenants' current month status
- [ ] Can mark rent as paid → status changes to PAID
- [ ] Can filter by status (pending/paid/overdue)
- [ ] Late rent shows correct status after grace period
- [ ] Landlord only sees their own tenants' rent

#### Maintenance Tickets
- [ ] Tenant can create a ticket for their unit
- [ ] Ticket appears in landlord's ticket list
- [ ] Landlord can update ticket status (open → in-progress → resolved → closed)
- [ ] Can assign ticket to a user
- [ ] Tenant and landlord can add comments
- [ ] Status change creates notification for tenant

#### Notifications
- [ ] Unread count shows in TopBar bell
- [ ] Clicking bell shows recent notifications
- [ ] Can mark individual notification as read
- [ ] Can mark all as read
- [ ] Notification links navigate to relevant page

#### Automations
- [ ] Rent reminder cron creates notifications 5 days before due
- [ ] Late fee cron flags overdue payments and adds fee
- [ ] Lease expiry cron warns about leases ending in 30 days
- [ ] Cron endpoints reject requests without valid CRON_SECRET

#### Admin (Manager only)
- [ ] Can view all users
- [ ] Can disable/enable a user
- [ ] Can view activity logs with filters
- [ ] Can export tenants as CSV (downloads valid file)
- [ ] Can export payments as CSV
- [ ] Can export tickets as CSV
- [ ] Dashboard shows correct aggregate stats

#### Security
- [ ] Tenant cannot access /admin routes
- [ ] Landlord cannot access /admin routes
- [ ] API returns 401 for unauthenticated requests
- [ ] API returns 403 for unauthorized role
- [ ] Passwords are hashed in database
- [ ] No secrets visible in client-side code
- [ ] SQL injection: tested with `'; DROP TABLE users; --` in form fields
- [ ] XSS: tested with `<script>alert('xss')</script>` in ticket descriptions

#### Responsive
- [ ] Sidebar collapses on mobile
- [ ] Tables are scrollable on mobile
- [ ] Forms are usable on mobile
- [ ] Dashboard cards stack on mobile

#### Demo
- [ ] Seed data populates correctly
- [ ] Demo login buttons work on login page
- [ ] All three roles show appropriate data after login

---

## M) Phase 2 Roadmap (After MVP)

### Phase 2a (Weeks 5–6): Communication
- Email notifications via Resend (free tier: 100 emails/day)
- File uploads for maintenance tickets (Supabase Storage, free 1GB)
- Lease document upload (PDF)

### Phase 2b (Weeks 7–9): Payments + Analytics
- Stripe integration for online rent payment
- Payment history and receipts
- Charts dashboard (rent collection trends, occupancy rates)
- Multi-property portfolio view with comparison

### Phase 2c (Weeks 10–12): Scale
- Multi-tenancy (multiple management companies on one deployment)
- Lease template builder
- Document e-signing (HelloSign or DocuSign API)
- Tenant screening integration

### Phase 2d (Weeks 13+): Advanced
- PWA or React Native mobile app
- AI-powered maintenance ticket categorization
- Predictive analytics (vacancy risk, maintenance cost forecasting)
- Tenant portal (self-service pay, view documents, request features)
- Approval workflows (spending thresholds, maintenance vendor management)

---

*This blueprint is your single source of truth. Follow the checklist, use the Claude prompts, and build one milestone at a time. You've got this.*
