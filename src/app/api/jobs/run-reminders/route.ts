import { prisma } from "@/lib/db";
import { getSession, json, error } from "@/lib/api-helpers";

export async function POST() {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);
  if (session.user.role !== "LANDLORD") return error("Forbidden", 403);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);
  threeDaysLater.setHours(23, 59, 59, 999);

  const properties = await prisma.property.findMany({
    where: { ownerId: session.user.id },
    select: { id: true },
  });
  const propertyIds = properties.map((p: { id: string }) => p.id);

  if (propertyIds.length === 0) {
    return json({ upcoming: [], overdue: [], upcomingCount: 0, overdueCount: 0 });
  }

  const [upcomingRaw, overdueRaw] = await Promise.all([
    prisma.rentPayment.findMany({
      where: {
        propertyId: { in: propertyIds },
        status: "PENDING",
        dueDate: { gte: today, lte: threeDaysLater },
      },
      include: { property: { select: { name: true } } },
      orderBy: { dueDate: "asc" },
    }),
    prisma.rentPayment.findMany({
      where: {
        propertyId: { in: propertyIds },
        status: "PENDING",
        dueDate: { lt: today },
      },
      include: { property: { select: { name: true } } },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  const upcoming = upcomingRaw.map((p: any) => ({
    propertyName: p.property.name,
    amount: p.amount,
    dueDate: p.dueDate,
  }));

  const overdue = overdueRaw.map((p) => ({
    propertyName: p.property.name,
    amount: p.amount,
    dueDate: p.dueDate,
    daysOverdue: Math.floor(
      (today.getTime() - new Date(p.dueDate).getTime()) / (1000 * 60 * 60 * 24)
    ),
  }));

  return json({
    upcoming,
    overdue,
    upcomingCount: upcoming.length,
    overdueCount: overdue.length,
  });
}
