import { prisma } from "@/lib/db";
import { getSession, json, error } from "@/lib/api-helpers";
import { createLeaseSchema } from "@/lib/validations";

export async function GET() {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);

  const { id, role } = session.user;

  if (role === "LANDLORD") {
    const leases = await prisma.lease.findMany({
      where: { property: { ownerId: id } },
      orderBy: { createdAt: "desc" },
      include: {
        property: { select: { name: true, address: true } },
        tenant: { select: { id: true, name: true, email: true, phone: true } },
      },
    });
    return json(leases);
  }

  // TENANT: return their own lease
  const lease = await prisma.lease.findFirst({
    where: { tenantId: id },
    include: {
      property: { select: { name: true, address: true } },
    },
  });
  return json(lease ? [lease] : []);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);
  if (session.user.role !== "LANDLORD") return error("Forbidden", 403);

  const body = await req.json();
  const parsed = createLeaseSchema.safeParse(body);
  if (!parsed.success) return error(parsed.error.issues[0].message, 400);

  const { propertyId, tenantId, startDate, endDate, rentAmount, depositAmount, status, utilities, occupants } = parsed.data;

  // Verify property belongs to this landlord
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) return error("Property not found", 404);
  if (property.ownerId !== session.user.id) return error("Forbidden", 403);

  // Verify tenant exists and is a TENANT role
  const tenant = await prisma.user.findUnique({ where: { id: tenantId } });
  if (!tenant) return error("Tenant not found", 404);
  if (tenant.role !== "TENANT") return error("User is not a tenant", 400);

  const lease = await prisma.lease.create({
    data: {
      propertyId,
      tenantId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      rentAmount,
      depositAmount,
      status,
      utilities: JSON.stringify(utilities),
      occupants: JSON.stringify(occupants),
    },
    include: {
      property: { select: { name: true, address: true } },
      tenant: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  return json(lease, 201);
}
