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