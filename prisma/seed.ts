import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  // Create landlord
  const landlord = await prisma.user.upsert({
    where: { email: "landlord@demo.com" },
    update: {},
    create: {
      email: "landlord@demo.com",
      name: "Demo Landlord",
      passwordHash,
      role: "LANDLORD",
    },
  });

  // Create properties
  const maplewood = await prisma.property.upsert({
    where: { id: "prop-maplewood" },
    update: {},
    create: {
      id: "prop-maplewood",
      name: "Maplewood Residences",
      address: "123 Maple Ave, Toronto",
      ownerId: landlord.id,
    },
  });

  const oakview = await prisma.property.upsert({
    where: { id: "prop-oakview" },
    update: {},
    create: {
      id: "prop-oakview",
      name: "Oakview Apartments",
      address: "456 Oak St, Toronto",
      ownerId: landlord.id,
    },
  });

  // Create tenant assigned to maplewood
  await prisma.user.upsert({
    where: { email: "tenant@demo.com" },
    update: {},
    create: {
      email: "tenant@demo.com",
      name: "Sarah Johnson",
      passwordHash,
      role: "TENANT",
      propertyId: maplewood.id,
    },
  });

  const tenant = await prisma.user.findUnique({
    where: { email: "tenant@demo.com" },
  });

  // Maintenance requests
  const maintenanceData = [
    {
      id: "maint-1",
      title: "Leaking pipe under sink",
      description: "Water dripping from the pipe under the kitchen sink. Getting worse.",
      status: "OPEN",
      propertyId: maplewood.id,
      createdById: tenant!.id,
    },
    {
      id: "maint-2",
      title: "Broken window lock",
      description: "The lock on the bedroom window is broken and won't secure.",
      status: "IN_PROGRESS",
      propertyId: maplewood.id,
      createdById: tenant!.id,
    },
    {
      id: "maint-3",
      title: "HVAC not working",
      description: "Heating unit stopped working, room is freezing.",
      status: "OPEN",
      propertyId: oakview.id,
      createdById: tenant!.id,
    },
    {
      id: "maint-4",
      title: "Light bulb replacement",
      description: "Hallway light bulb burnt out.",
      status: "RESOLVED",
      propertyId: maplewood.id,
      createdById: tenant!.id,
    },
  ];

  for (const m of maintenanceData) {
    await prisma.maintenanceRequest.upsert({
      where: { id: m.id },
      update: {},
      create: m,
    });
  }

  // Rent payments
  const paymentData = [
    { id: "pay-1", propertyId: maplewood.id, amount: 1850, dueDate: new Date("2026-02-01"), status: "PENDING" },
    { id: "pay-2", propertyId: maplewood.id, amount: 1850, dueDate: new Date("2026-01-01"), status: "PAID", paidDate: new Date("2026-01-01") },
    { id: "pay-3", propertyId: maplewood.id, amount: 1850, dueDate: new Date("2025-12-01"), status: "PAID", paidDate: new Date("2025-12-02") },
    { id: "pay-4", propertyId: oakview.id, amount: 2100, dueDate: new Date("2026-02-01"), status: "PENDING" },
    { id: "pay-5", propertyId: oakview.id, amount: 2100, dueDate: new Date("2026-01-01"), status: "PAID", paidDate: new Date("2026-01-03") },
    { id: "pay-6", propertyId: maplewood.id, amount: 1850, dueDate: new Date("2025-11-01"), status: "PAID", paidDate: new Date("2025-11-01") },
  ];

  for (const p of paymentData) {
    await prisma.rentPayment.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    });
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());