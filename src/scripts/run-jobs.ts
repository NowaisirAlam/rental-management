import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);
  threeDaysLater.setHours(23, 59, 59, 999);

  const [upcomingRaw, overdueRaw] = await Promise.all([
    prisma.rentPayment.findMany({
      where: {
        status: "PENDING",
        dueDate: { gte: today, lte: threeDaysLater },
      },
      include: { property: { select: { name: true } } },
      orderBy: { dueDate: "asc" },
    }),
    prisma.rentPayment.findMany({
      where: {
        status: "PENDING",
        dueDate: { lt: today },
      },
      include: { property: { select: { name: true } } },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  console.log("=== Rent Reminder Check ===");
  console.log(`Date: ${today.toDateString()}\n`);

  if (upcomingRaw.length === 0) {
    console.log("Upcoming (next 3 days): none");
  } else {
    console.log(`Upcoming (next 3 days): ${upcomingRaw.length}`);
    for (const p of upcomingRaw) {
      console.log(
        `  - ${p.property.name}: $${p.amount} due ${new Date(p.dueDate).toDateString()}`
      );
    }
  }

  console.log();

  if (overdueRaw.length === 0) {
    console.log("Overdue: none");
  } else {
    console.log(`Overdue: ${overdueRaw.length}`);
    for (const p of overdueRaw) {
      const daysOverdue = Math.floor(
        (today.getTime() - new Date(p.dueDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      console.log(
        `  - ${p.property.name}: $${p.amount} due ${new Date(p.dueDate).toDateString()} (${daysOverdue} days overdue)`
      );
    }
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
