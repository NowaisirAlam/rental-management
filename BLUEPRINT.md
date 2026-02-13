# PropManager — Local MVP Blueprint

## Hackathon Constraint
This project must run fully locally.

- No cloud services (Supabase, Vercel, Firebase, etc.)
- Database: SQLite (local file: prisma/dev.db)
- Backend: Next.js API Routes
- Auth: NextAuth Credentials (email/password only)
- Runs with: npm run dev

---

## Tech Stack
- Next.js (App Router)
- TypeScript
- Prisma ORM
- SQLite
- NextAuth (credentials)
- Tailwind + shadcn/ui

---

## MVP Scope

### Roles
- Landlord
- Tenant

### Features

#### Authentication
- Register/Login
- Role stored in DB
- Route protection

#### Landlord
- Create properties
- View properties
- Edit/Delete properties
- View maintenance requests
- Mark rent as paid

#### Tenant
- View assigned property/unit
- Submit maintenance request
- View rent status

---

## Data Models (Simplified)
- User (id, email, passwordHash, role)
- Property (id, ownerId, name, address)
- MaintenanceRequest (id, propertyId, createdById, title, description, status)
- RentPayment (id, propertyId, dueDate, status, paidDate)

---

## Build Phases

### Phase 1 — Database
- Prisma setup
- SQLite schema
- Migration

### Phase 2 — Auth
- NextAuth credentials
- Register endpoint
- Middleware protection

### Phase 3 — API Routes
- /api/properties
- /api/maintenance
- /api/payments

### Phase 4 — UI Wiring
- Replace mock data with fetch
- Add loading states

### Phase 5 — Seed Data
- Demo landlord
- Demo tenant
- Sample properties and requests

---

## Out of Scope (Not for MVP)
- Cloud deployment
- Supabase/Postgres
- Vercel Cron
- Email/SMS
- Stripe payments
- Admin panel
- Activity logs
- CSV export
