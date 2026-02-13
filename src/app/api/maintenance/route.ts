import { prisma } from "@/lib/db";
import { getSession, json, error } from "@/lib/api-helpers";
import { createMaintenanceSchema } from "@/lib/validations";

export async function GET() {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);

  const { id, role } = session.user;

  if (role === "LANDLORD") {
    const properties = await prisma.property.findMany({
      where: { ownerId: id },
      select: { id: true },
    });
    const propertyIds = properties.map((p: { id: string }) => p.id);

    const requests = await prisma.maintenanceRequest.findMany({
      where: { propertyId: { in: propertyIds } },
      orderBy: { createdAt: "desc" },
      include: {
        property: { select: { name: true } },
        createdBy: { select: { name: true, email: true } },
      },
    });
    return json(requests);
  }

  // TENANT
  const requests = await prisma.maintenanceRequest.findMany({
    where: { createdById: id },
    orderBy: { createdAt: "desc" },
    include: {
      property: { select: { name: true } },
    },
  });
  return json(requests);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);
  if (session.user.role !== "TENANT") return error("Forbidden", 403);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { propertyId: true },
  });
  if (!user?.propertyId) return error("No property assigned", 400);

  const body = await req.json();
  const parsed = createMaintenanceSchema.safeParse(body);
  if (!parsed.success) return error(parsed.error.issues[0].message, 400);

  const request = await prisma.maintenanceRequest.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      propertyId: user.propertyId,
      createdById: session.user.id,
    },
  });

  return json(request, 201);
}