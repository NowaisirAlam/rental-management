import { prisma } from "@/lib/db";
import { getSession, json, error } from "@/lib/api-helpers";
import { updateMaintenanceSchema } from "@/lib/validations";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);
  if (session.user.role !== "LANDLORD") return error("Forbidden", 403);

  const { id } = await params;

  const request = await prisma.maintenanceRequest.findUnique({
    where: { id },
    include: { property: { select: { ownerId: true } } },
  });
  if (!request) return error("Request not found", 404);
  if (request.property.ownerId !== session.user.id) return error("Forbidden", 403);

  const body = await req.json();
  const parsed = updateMaintenanceSchema.safeParse(body);
  if (!parsed.success) return error(parsed.error.issues[0].message, 400);

  const updated = await prisma.maintenanceRequest.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  return json(updated);
}