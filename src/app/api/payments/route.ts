import { prisma } from "@/lib/db";
import { getSession, json, error } from "@/lib/api-helpers";

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

    const payments = await prisma.rentPayment.findMany({
      where: { propertyId: { in: propertyIds } },
      orderBy: { dueDate: "desc" },
      include: {
        property: {
          select: {
            name: true,
            tenants: { select: { name: true, email: true } },
          },
        },
      },
    });
    return json(payments);
  }

  // TENANT
  const user = await prisma.user.findUnique({
    where: { id },
    select: { propertyId: true },
  });
  if (!user?.propertyId) return json([]);

  const payments = await prisma.rentPayment.findMany({
    where: { propertyId: user.propertyId },
    orderBy: { dueDate: "desc" },
    include: {
      property: { select: { name: true } },
    },
  });
  return json(payments);
}