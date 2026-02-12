// TODO: Replace all mock data with Prisma/SQLite queries when database is connected

import type {
  Property,
  Unit,
  Tenant,
  RentPayment,
  MaintenanceRequest,
  ActivityItem,
  DashboardStats,
} from "@/lib/types";

// ─── Properties ───────────────────────────────────

export const mockProperties: Property[] = [
  {
    id: "prop-1",
    name: "Sunset Apartments",
    address: "123 Sunset Blvd",
    city: "Austin",
    state: "TX",
    zipCode: "78701",
    type: "APARTMENT",
    createdAt: "2025-06-15",
    units: [
      { id: "u-1", unitNumber: "101", bedrooms: 2, bathrooms: 1, sqft: 850, rentAmount: 1200, isOccupied: true, propertyId: "prop-1" },
      { id: "u-2", unitNumber: "102", bedrooms: 1, bathrooms: 1, sqft: 650, rentAmount: 950, isOccupied: true, propertyId: "prop-1" },
      { id: "u-3", unitNumber: "103", bedrooms: 2, bathrooms: 2, sqft: 900, rentAmount: 1350, isOccupied: false, propertyId: "prop-1" },
      { id: "u-4", unitNumber: "201", bedrooms: 3, bathrooms: 2, sqft: 1100, rentAmount: 1600, isOccupied: true, propertyId: "prop-1" },
      { id: "u-5", unitNumber: "202", bedrooms: 1, bathrooms: 1, sqft: 600, rentAmount: 900, isOccupied: false, propertyId: "prop-1" },
      { id: "u-6", unitNumber: "203", bedrooms: 2, bathrooms: 1, sqft: 850, rentAmount: 1200, isOccupied: true, propertyId: "prop-1" },
    ],
  },
  {
    id: "prop-2",
    name: "Oak Street Houses",
    address: "456 Oak St",
    city: "Austin",
    state: "TX",
    zipCode: "78702",
    type: "HOUSE",
    createdAt: "2025-08-01",
    units: [
      { id: "u-7", unitNumber: "A", bedrooms: 3, bathrooms: 2, sqft: 1400, rentAmount: 1800, isOccupied: true, propertyId: "prop-2" },
      { id: "u-8", unitNumber: "B", bedrooms: 3, bathrooms: 2, sqft: 1350, rentAmount: 1750, isOccupied: false, propertyId: "prop-2" },
      { id: "u-9", unitNumber: "C", bedrooms: 2, bathrooms: 1, sqft: 1000, rentAmount: 1300, isOccupied: true, propertyId: "prop-2" },
    ],
  },
  {
    id: "prop-3",
    name: "Downtown Lofts",
    address: "789 Main Ave",
    city: "Austin",
    state: "TX",
    zipCode: "78703",
    type: "CONDO",
    createdAt: "2025-09-10",
    units: [
      { id: "u-10", unitNumber: "L1", bedrooms: 1, bathrooms: 1, sqft: 750, rentAmount: 1500, isOccupied: true, propertyId: "prop-3" },
      { id: "u-11", unitNumber: "L2", bedrooms: 2, bathrooms: 2, sqft: 1050, rentAmount: 2200, isOccupied: true, propertyId: "prop-3" },
      { id: "u-12", unitNumber: "L3", bedrooms: 1, bathrooms: 1, sqft: 700, rentAmount: 1400, isOccupied: false, propertyId: "prop-3" },
      { id: "u-13", unitNumber: "L4", bedrooms: 2, bathrooms: 1, sqft: 950, rentAmount: 1900, isOccupied: true, propertyId: "prop-3" },
    ],
  },
  {
    id: "prop-4",
    name: "Maple Court",
    address: "321 Maple Dr",
    city: "Austin",
    state: "TX",
    zipCode: "78704",
    type: "APARTMENT",
    createdAt: "2025-11-20",
    units: [
      { id: "u-14", unitNumber: "1A", bedrooms: 2, bathrooms: 1, sqft: 800, rentAmount: 1100, isOccupied: true, propertyId: "prop-4" },
      { id: "u-15", unitNumber: "1B", bedrooms: 1, bathrooms: 1, sqft: 550, rentAmount: 850, isOccupied: true, propertyId: "prop-4" },
      { id: "u-16", unitNumber: "2A", bedrooms: 3, bathrooms: 2, sqft: 1200, rentAmount: 1550, isOccupied: true, propertyId: "prop-4" },
      { id: "u-17", unitNumber: "2B", bedrooms: 2, bathrooms: 1, sqft: 800, rentAmount: 1100, isOccupied: false, propertyId: "prop-4" },
      { id: "u-18", unitNumber: "3A", bedrooms: 1, bathrooms: 1, sqft: 550, rentAmount: 850, isOccupied: true, propertyId: "prop-4" },
    ],
  },
];

// ─── Tenants ──────────────────────────────────────

export const mockTenants: Tenant[] = [
  { id: "t-1", name: "Jane Doe", email: "jane@email.com", phone: "512-555-0101", propertyName: "Sunset Apartments", unitNumber: "101", leaseStart: "2025-07-01", leaseEnd: "2026-06-30", leaseStatus: "ACTIVE", monthlyRent: 1200 },
  { id: "t-2", name: "Marcus Chen", email: "marcus@email.com", phone: "512-555-0102", propertyName: "Sunset Apartments", unitNumber: "102", leaseStart: "2025-09-01", leaseEnd: "2026-08-31", leaseStatus: "ACTIVE", monthlyRent: 950 },
  { id: "t-3", name: "Sarah Williams", email: "sarah@email.com", phone: "512-555-0103", propertyName: "Oak Street Houses", unitNumber: "A", leaseStart: "2025-08-15", leaseEnd: "2026-08-14", leaseStatus: "ACTIVE", monthlyRent: 1800 },
  { id: "t-4", name: "David Kim", email: "david@email.com", phone: null, propertyName: "Downtown Lofts", unitNumber: "L1", leaseStart: "2025-10-01", leaseEnd: "2026-09-30", leaseStatus: "ACTIVE", monthlyRent: 1500 },
  { id: "t-5", name: "Emily Rodriguez", email: "emily@email.com", phone: "512-555-0105", propertyName: "Downtown Lofts", unitNumber: "L2", leaseStart: "2025-11-01", leaseEnd: "2026-10-31", leaseStatus: "ACTIVE", monthlyRent: 2200 },
  { id: "t-6", name: "James Thompson", email: "james@email.com", phone: "512-555-0106", propertyName: "Maple Court", unitNumber: "1A", leaseStart: "2025-06-01", leaseEnd: "2026-01-31", leaseStatus: "EXPIRED", monthlyRent: 1100 },
];

// ─── Rent Payments ────────────────────────────────

export const mockRentPayments: RentPayment[] = [
  { id: "rp-1", tenantName: "Jane Doe", propertyName: "Sunset Apartments", unitNumber: "101", amount: 1200, dueDate: "2026-02-01", paidDate: "2026-01-30", status: "PAID", lateFee: 0, periodLabel: "February 2026" },
  { id: "rp-2", tenantName: "Marcus Chen", propertyName: "Sunset Apartments", unitNumber: "102", amount: 950, dueDate: "2026-02-01", paidDate: "2026-02-01", status: "PAID", lateFee: 0, periodLabel: "February 2026" },
  { id: "rp-3", tenantName: "Sarah Williams", propertyName: "Oak Street Houses", unitNumber: "A", amount: 1800, dueDate: "2026-02-01", paidDate: null, status: "PENDING", lateFee: 0, periodLabel: "February 2026" },
  { id: "rp-4", tenantName: "David Kim", propertyName: "Downtown Lofts", unitNumber: "L1", amount: 1500, dueDate: "2026-02-01", paidDate: "2026-02-03", status: "PAID", lateFee: 0, periodLabel: "February 2026" },
  { id: "rp-5", tenantName: "Emily Rodriguez", propertyName: "Downtown Lofts", unitNumber: "L2", amount: 2200, dueDate: "2026-02-01", paidDate: null, status: "LATE", lateFee: 50, periodLabel: "February 2026" },
  { id: "rp-6", tenantName: "James Thompson", propertyName: "Maple Court", unitNumber: "1A", amount: 1100, dueDate: "2026-02-01", paidDate: null, status: "LATE", lateFee: 50, periodLabel: "February 2026" },
  { id: "rp-7", tenantName: "Jane Doe", propertyName: "Sunset Apartments", unitNumber: "101", amount: 1200, dueDate: "2026-01-01", paidDate: "2025-12-30", status: "PAID", lateFee: 0, periodLabel: "January 2026" },
  { id: "rp-8", tenantName: "Sarah Williams", propertyName: "Oak Street Houses", unitNumber: "A", amount: 1800, dueDate: "2026-01-01", paidDate: "2026-01-05", status: "PAID", lateFee: 50, periodLabel: "January 2026" },
];

// ─── Maintenance Requests ─────────────────────────

export const mockMaintenanceRequests: MaintenanceRequest[] = [
  { id: "mr-1", title: "Leaking faucet in kitchen", description: "Kitchen faucet drips constantly. Water pooling under sink.", priority: "MEDIUM", status: "OPEN", propertyName: "Sunset Apartments", unitNumber: "101", createdBy: "Jane Doe", createdAt: "2026-02-05", updatedAt: "2026-02-05" },
  { id: "mr-2", title: "Broken AC unit", description: "AC unit stopped working. Very hot inside.", priority: "HIGH", status: "IN_PROGRESS", propertyName: "Downtown Lofts", unitNumber: "L2", createdBy: "Emily Rodriguez", createdAt: "2026-02-03", updatedAt: "2026-02-06" },
  { id: "mr-3", title: "Pest control needed", description: "Noticed roaches in the bathroom area.", priority: "MEDIUM", status: "OPEN", propertyName: "Maple Court", unitNumber: "1A", createdBy: "James Thompson", createdAt: "2026-02-07", updatedAt: "2026-02-07" },
  { id: "mr-4", title: "Garage door stuck", description: "Garage door won't open. Tried remote and manual.", priority: "LOW", status: "RESOLVED", propertyName: "Oak Street Houses", unitNumber: "A", createdBy: "Sarah Williams", createdAt: "2026-01-20", updatedAt: "2026-01-25" },
  { id: "mr-5", title: "Water heater issue", description: "Water heater making loud banging noises. No hot water in mornings.", priority: "HIGH", status: "OPEN", propertyName: "Sunset Apartments", unitNumber: "201", createdBy: "Marcus Chen", createdAt: "2026-02-08", updatedAt: "2026-02-08" },
  { id: "mr-6", title: "Window crack in bedroom", description: "Small crack in the bedroom window. Cold air coming in.", priority: "EMERGENCY", status: "IN_PROGRESS", propertyName: "Downtown Lofts", unitNumber: "L4", createdBy: "David Kim", createdAt: "2026-02-01", updatedAt: "2026-02-04" },
];

// ─── Dashboard Stats ──────────────────────────────

export const mockDashboardStats: DashboardStats = {
  totalProperties: 4,
  totalTenants: 6,
  rentCollected: 7850,
  rentExpected: 9600,
  openMaintenance: 3,
  vacantUnits: 5,
};

// ─── Recent Activity ──────────────────────────────

export const mockRecentActivity: ActivityItem[] = [
  { id: "a-1", text: "Jane Doe paid rent for Unit 101", time: "2 hours ago", type: "payment" },
  { id: "a-2", text: "New maintenance request: Leaking faucet — Unit 101", time: "5 hours ago", type: "maintenance" },
  { id: "a-3", text: "David Kim paid rent for Unit L1", time: "1 day ago", type: "payment" },
  { id: "a-4", text: "Lease expired for James Thompson — Unit 1A", time: "2 days ago", type: "lease" },
  { id: "a-5", text: "Window crack reported at Downtown Lofts L4", time: "3 days ago", type: "maintenance" },
];

// ─── Vacant Units (derived) ──────────────────────

export interface VacantUnit extends Pick<Unit, "id" | "unitNumber" | "bedrooms" | "bathrooms" | "sqft" | "rentAmount"> {
  propertyName: string;
  propertyAddress: string;
}

export const mockVacantUnits: VacantUnit[] = mockProperties.flatMap((p) =>
  p.units
    .filter((u) => !u.isOccupied)
    .map((u) => ({
      id: u.id,
      unitNumber: u.unitNumber,
      bedrooms: u.bedrooms,
      bathrooms: u.bathrooms,
      sqft: u.sqft,
      rentAmount: u.rentAmount,
      propertyName: p.name,
      propertyAddress: `${p.address}, ${p.city}, ${p.state}`,
    }))
);
