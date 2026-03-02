import { prisma } from "@/lib/db";
import { getSession, json, error } from "@/lib/api-helpers";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);
  if (session.user.role !== "LANDLORD") return error("Forbidden", 403);

  const { id } = await params;

  const announcement = await prisma.announcement.findUnique({ where: { id } });
  if (!announcement) return error("Announcement not found", 404);
  if (announcement.landlordId !== session.user.id) return error("Forbidden", 403);

  await prisma.announcement.delete({ where: { id } });
  return json({ success: true });
}
