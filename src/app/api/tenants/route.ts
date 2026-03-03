import { prisma } from "@/lib/db";
import { getSession, json, error } from "@/lib/api-helpers";

export async function GET() {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);
  if (session.user.role !== "LANDLORD") return error("Forbidden", 403);

  const tenants = await prisma.user.findMany({
    where: { role: "TENANT" },
    select: { id: true, name: true, email: true, phone: true, propertyId: true },
    orderBy: { name: "asc" },
  });

  return json(tenants);
}
