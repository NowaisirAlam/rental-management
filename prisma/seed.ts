import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const landlord = await prisma.user.upsert({
    where: { email: "landlord@demo.com" },
    update: {},
    create: {
      email: "landlord@demo.com",
      passwordHash,
      name: "Demo Landlord",
      role: "LANDLORD",
    },
  });

  const property = await prisma.property.upsert({
    where: { id: "demo-property-1" },
    update: {},
    create: {
      id: "demo-property-1",
      name: "Maple Apartments",
      address: "123 Maple Street, Springfield",
      ownerId: landlord.id,
    },
  });

  const tenant = await prisma.user.upsert({
    where: { email: "tenant@demo.com" },
    update: {},
    create: {
      email: "tenant@demo.com",
      passwordHash,
      name: "Demo Tenant",
      role: "TENANT",
      propertyId: property.id,
    },
  });

  await prisma.lease.upsert({
    where: { id: "demo-lease-1" },
    update: {},
    create: {
      id: "demo-lease-1",
      propertyId: property.id,
      tenantId: tenant.id,
      startDate: new Date("2025-01-01"),
      endDate: new Date("2026-01-01"),
      rentAmount: 1500,
      depositAmount: 2000,
      status: "ACTIVE",
      utilities: JSON.stringify(["Water", "Gas"]),
      occupants: JSON.stringify([{ name: "Demo Tenant", role: "Primary" }]),
    },
  });

  for (const payment of [
    { id: "demo-payment-1", propertyId: property.id, amount: 1500, dueDate: new Date("2026-04-01"), status: "PENDING" },
    { id: "demo-payment-2", propertyId: property.id, amount: 1500, dueDate: new Date("2026-03-01"), status: "PAID", paidDate: new Date("2026-03-01") },
  ]) {
    const exists = await prisma.rentPayment.findUnique({ where: { id: payment.id } });
    if (!exists) await prisma.rentPayment.create({ data: payment });
  }

  console.log("Seed complete.");
  console.log("  Landlord: landlord@demo.com / password123");
  console.log("  Tenant:   tenant@demo.com   / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
