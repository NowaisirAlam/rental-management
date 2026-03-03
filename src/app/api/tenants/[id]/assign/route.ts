import { prisma } from "@/lib/db";
import { getSession, json, error } from "@/lib/api-helpers";
import { z } from "zod";

const assignSchema = z.object({
  propertyId: z.string().nullable(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);
  if (session.user.role !== "LANDLORD") return error("Forbidden", 403);

  const { id } = await params;

  const tenant = await prisma.user.findUnique({ where: { id } });
  if (!tenant) return error("User not found", 404);
  if (tenant.role !== "TENANT") return error("User is not a tenant", 400);

  const body = await req.json();
  const parsed = assignSchema.safeParse(body);
  if (!parsed.success) return error(parsed.error.issues[0].message, 400);

  const { propertyId } = parsed.data;

  // If assigning to a property, verify the landlord owns it
  if (propertyId) {
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return error("Property not found", 404);
    if (property.ownerId !== session.user.id) return error("Forbidden", 403);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { propertyId },
    select: { id: true, name: true, email: true, phone: true, propertyId: true },
  });

  return json(updated);
}
