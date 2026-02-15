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

    const [totalProperties, totalPaid, pendingPayments, openMaintenance] =
      await Promise.all([
        prisma.property.count({ where: { ownerId: id } }),
        prisma.rentPayment.aggregate({
          where: { propertyId: { in: propertyIds }, status: "PAID" },
          _sum: { amount: true },
        }),
        prisma.rentPayment.count({
          where: { propertyId: { in: propertyIds }, status: "PENDING" },
        }),
        prisma.maintenanceRequest.count({
          where: { propertyId: { in: propertyIds }, status: { in: ["OPEN", "IN_PROGRESS"] } },
        }),
      ]);

    const recentPayments = await prisma.rentPayment.findMany({
      where: { propertyId: { in: propertyIds } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { property: { select: { name: true } } },
    });

    const recentMaintenance = await prisma.maintenanceRequest.findMany({
      where: { propertyId: { in: propertyIds } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        property: { select: { name: true } },
        createdBy: { select: { name: true } },
      },
    });

    return json({
      role: "LANDLORD",
      stats: {
        totalProperties,
        totalRevenue: totalPaid._sum.amount ?? 0,
        pendingPayments,
        openMaintenance,
      },
      recentPayments,
      recentMaintenance,
    });
  }

  // TENANT
  const user = await prisma.user.findUnique({
    where: { id },
    select: { propertyId: true },
  });

  if (!user?.propertyId) {
    return json({
      role: "TENANT",
      stats: { propertyName: null, rentStatus: null, openMaintenance: 0 },
      recentPayments: [],
      recentMaintenance: [],
    });
  }

  const property = await prisma.property.findUnique({
    where: { id: user.propertyId },
    select: { name: true, address: true },
  });

  const [currentRent, openMaintenance] = await Promise.all([
    prisma.rentPayment.findFirst({
      where: { propertyId: user.propertyId },
      orderBy: { dueDate: "desc" },
    }),
    prisma.maintenanceRequest.count({
      where: { createdById: id, status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
  ]);

  const recentPayments = await prisma.rentPayment.findMany({
    where: { propertyId: user.propertyId },
    orderBy: { dueDate: "desc" },
    take: 5,
  });

  const recentMaintenance = await prisma.maintenanceRequest.findMany({
    where: { createdById: id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return json({
    role: "TENANT",
    stats: {
      propertyName: property?.name ?? null,
      propertyAddress: property?.address ?? null,
      rentStatus: currentRent?.status ?? null,
      rentAmount: currentRent?.amount ?? 0,
      rentDueDate: currentRent?.dueDate ?? null,
      openMaintenance,
    },
    recentPayments,
    recentMaintenance,
  });
}