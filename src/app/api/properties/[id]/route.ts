import { prisma } from "@/lib/db";
import { getSession, json, error } from "@/lib/api-helpers";
import { updatePropertySchema } from "@/lib/validations";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);
  if (session.user.role !== "LANDLORD") return error("Forbidden", 403);

  const { id } = await params;

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) return error("Property not found", 404);
  if (property.ownerId !== session.user.id) return error("Forbidden", 403);

  const body = await req.json();
  const parsed = updatePropertySchema.safeParse(body);
  if (!parsed.success) return error(parsed.error.issues[0].message, 400);

  const updated = await prisma.property.update({
    where: { id },
    data: parsed.data,
  });

  return json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);
  if (session.user.role !== "LANDLORD") return error("Forbidden", 403);

  const { id } = await params;

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) return error("Property not found", 404);
  if (property.ownerId !== session.user.id) return error("Forbidden", 403);

  await prisma.property.delete({ where: { id } });

  return json({ success: true });
}