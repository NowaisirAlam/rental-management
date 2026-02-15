import { prisma } from "@/lib/db";
import { getSession, json, error } from "@/lib/api-helpers";
import { createPropertySchema } from "@/lib/validations";

export async function GET() {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);

  const { id, role } = session.user;

  if (role === "LANDLORD") {
    const properties = await prisma.property.findMany({
      where: { ownerId: id },
      orderBy: { createdAt: "desc" },
      include: {
        tenants: { select: { id: true, name: true, email: true } },
        _count: { select: { maintenanceRequests: true, rentPayments: true } },
      },
    });
    return json(properties);
  }

  // TENANT: return assigned property
  const user = await prisma.user.findUnique({
    where: { id },
    select: { propertyId: true },
  });
  if (!user?.propertyId) return json([]);

  const property = await prisma.property.findUnique({
    where: { id: user.propertyId },
  });
  return json(property ? [property] : []);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);
  if (session.user.role !== "LANDLORD") return error("Forbidden", 403);

  const body = await req.json();
  const parsed = createPropertySchema.safeParse(body);
  if (!parsed.success) return error(parsed.error.issues[0].message, 400);

  const property = await prisma.property.create({
    data: {
      name: parsed.data.name,
      address: parsed.data.address,
      ownerId: session.user.id,
    },
  });

  return json(property, 201);
}