import { z } from "zod";

export const createPropertySchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
});

export const updatePropertySchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
});

export const createMaintenanceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export const updateMaintenanceSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});

export const createLeaseSchema = z
  .object({
    propertyId: z.string().min(1, "Property is required"),
    tenantId: z.string().min(1, "Tenant is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    rentAmount: z.number().positive("Rent amount must be positive"),
    depositAmount: z.number().min(0).default(0),
    status: z.enum(["ACTIVE", "EXPIRED", "PENDING", "TERMINATED"]).default("ACTIVE"),
    utilities: z.array(z.string()).default([]),
    occupants: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
        })
      )
      .default([]),
  })
  .refine((d) => new Date(d.endDate) > new Date(d.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const updateLeaseSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  rentAmount: z.number().positive().optional(),
  depositAmount: z.number().min(0).optional(),
  status: z.enum(["ACTIVE", "EXPIRED", "PENDING", "TERMINATED"]).optional(),
  utilities: z.array(z.string()).optional(),
  occupants: z
    .array(z.object({ name: z.string(), role: z.string() }))
    .optional(),
});

export const createAnnouncementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  priority: z.enum(["INFO", "WARNING", "URGENT"]).default("INFO"),
  propertyId: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  phone: z.string().nullable().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});