import { prisma } from "@/lib/db";
import { getSession, json, error } from "@/lib/api-helpers";
import { changePasswordSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);

  const body = await req.json();
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) return error(parsed.error.issues[0].message, 400);

  const { currentPassword, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true },
  });
  if (!user) return error("User not found", 404);

  const correct = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!correct) return error("Current password is incorrect", 400);

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash },
  });

  return json({ ok: true });
}
