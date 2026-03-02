import { prisma } from "@/lib/db";
import { getSession, json, error } from "@/lib/api-helpers";
import { createAnnouncementSchema } from "@/lib/validations";

export async function GET() {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);

  const { id, role } = session.user;

  if (role === "LANDLORD") {
    const announcements = await prisma.announcement.findMany({
      where: { landlordId: id },
      orderBy: { createdAt: "desc" },
      include: { property: { select: { name: true } } },
    });
    return json(announcements);
  }

  // TENANT: see announcements for their property OR global ones from their landlord
  const user = await prisma.user.findUnique({
    where: { id },
    select: { propertyId: true },
  });

  if (!user?.propertyId) return json([]);

  const announcements = await prisma.announcement.findMany({
    where: {
      OR: [
        { propertyId: user.propertyId },
        {
          propertyId: null,
          landlord: { ownedProperties: { some: { id: user.propertyId } } },
        },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: { property: { select: { name: true } } },
  });

  return json(announcements);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);
  if (session.user.role !== "LANDLORD") return error("Forbidden", 403);

  const body = await req.json();
  const parsed = createAnnouncementSchema.safeParse(body);
  if (!parsed.success) return error(parsed.error.issues[0].message, 400);

  const { title, message, priority, propertyId } = parsed.data;

  // If scoped to a property, verify ownership
  if (propertyId) {
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return error("Property not found", 404);
    if (property.ownerId !== session.user.id) return error("Forbidden", 403);
  }

  const announcement = await prisma.announcement.create({
    data: {
      title,
      message,
      priority,
      propertyId: propertyId ?? null,
      landlordId: session.user.id,
    },
    include: { property: { select: { name: true } } },
  });

  return json(announcement, 201);
}
