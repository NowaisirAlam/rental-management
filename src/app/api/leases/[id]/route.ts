import { prisma } from "@/lib/db";
import { getSession, json, error } from "@/lib/api-helpers";
import { updateLeaseSchema } from "@/lib/validations";

async function getLeaseAndVerifyOwnership(leaseId: string, landlordId: string) {
  const lease = await prisma.lease.findUnique({
    where: { id: leaseId },
    include: { property: { select: { ownerId: true } } },
  });
  if (!lease) return { lease: null, err: error("Lease not found", 404) };
  if (lease.property.ownerId !== landlordId) return { lease: null, err: error("Forbidden", 403) };
  return { lease, err: null };
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) return error("Unauthorized", 401);
  if (session.user.role !== "LANDLORD") return error("Forbidden", 403);

  const { id } = await params;
  const { lease, err } = await getLeaseAndVerifyOwnership(id, session.user.id);
  if (err) return err;

  const body = await req.json();
  const parsed = updateLeaseSchema.safeParse(body);
  if (!parsed.success) return error(parsed.error.issues[0].message, 400);

  const { startDate, endDate, rentAmount, depositAmount, status, utilities, occupants } = parsed.data;

  const updated = await prisma.lease.update({
    where: { id: lease!.id },
    data: {
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
      ...(rentAmount !== undefined && { rentAmount }),
      ...(depositAmount !== undefined && { depositAmount }),
      ...(status && { status }),
      ...(utilities !== undefined && { utilities: JSON.stringify(utilities) }),
      ...(occupants !== undefined && { occupants: JSON.stringify(occupants) }),
    },
    include: {
      property: { select: { name: true, address: true } },
      tenant: { select: { id: true, name: true, email: true, phone: true } },
    },
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
  const { lease, err } = await getLeaseAndVerifyOwnership(id, session.user.id);
  if (err) return err;

  await prisma.lease.delete({ where: { id: lease!.id } });
  return json({ success: true });
}
