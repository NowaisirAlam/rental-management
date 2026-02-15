import { prisma } from "@/lib/db";
import { getSession, json, error } from "@/lib/api-helpers";

export async function PUT(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);
  if (session.user.role !== "LANDLORD") return error("Forbidden", 403);

  const { id } = await params;

  const payment = await prisma.rentPayment.findUnique({
    where: { id },
    include: { property: { select: { ownerId: true } } },
  });
  if (!payment) return error("Payment not found", 404);
  if (payment.property.ownerId !== session.user.id) return error("Forbidden", 403);

  const updated = await prisma.rentPayment.update({
    where: { id },
    data: {
      status: "PAID",
      paidDate: new Date(),
    },
  });

  return json(updated);
}