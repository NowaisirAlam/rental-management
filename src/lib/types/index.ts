// ─── Enums ────────────────────────────────────────
export type PropertyType = "APARTMENT" | "HOUSE" | "CONDO" | "COMMERCIAL";
export type LeaseStatus = "ACTIVE" | "EXPIRED" | "TERMINATED" | "PENDING";
export type PaymentStatus = "PENDING" | "PAID" | "LATE" | "PARTIAL";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

// ─── Core Entities ────────────────────────────────

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: PropertyType;
  units: Unit[];
  createdAt: string;
}

export interface Unit {
  id: string;
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number | null;
  rentAmount: number;
  isOccupied: boolean;
  propertyId: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  propertyName: string;
  unitNumber: string;
  leaseStart: string;
  leaseEnd: string;
  leaseStatus: LeaseStatus;
  monthlyRent: number;
}

export interface RentPayment {
  id: string;
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: PaymentStatus;
  lateFee: number;
  periodLabel: string;
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  propertyName: string;
  unitNumber: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  text: string;
  time: string;
  type: "payment" | "maintenance" | "lease" | "property";
}

export interface DashboardStats {
  totalProperties: number;
  totalTenants: number;
  rentCollected: number;
  rentExpected: number;
  openMaintenance: number;
  vacantUnits: number;
}
