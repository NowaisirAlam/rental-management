import { prisma } from "@/lib/db";
import { getSession, json, error } from "@/lib/api-helpers";
import { updateProfileSchema } from "@/lib/validations";

export async function GET() {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, phone: true, role: true, propertyId: true },
  });
  if (!user) return error("User not found", 404);

  return json(user);
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);

  const body = await req.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) return error(parsed.error.issues[0].message, 400);

  const { name, phone } = parsed.data;

  const data: { name?: string; phone?: string | null } = {};
  if (name !== undefined) data.name = name;
  if (phone !== undefined) data.phone = phone || null;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: { id: true, name: true, email: true, phone: true, role: true },
  });

  return json(user);
}
