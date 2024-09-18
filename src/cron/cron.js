const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

cron.schedule("52 13 * * *", async () => {
  console.log(
    "Cron job running: Archiving completed tasks and cleaning up old records",
  );
  try {
    const archivedTasks = await prisma.task.updateMany({
      where: { status: "COMPLETED" },
      data: { status: "ARCHIVED" },
    });
    console.log("🚀 ~ cron.schedule ~ archivedTasks:", archivedTasks.count);
    // Cleanig up old records
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 30);

    const deletedTasks = await prisma.task.deleteMany({
      where: { createdAt: { lt: currentDate } },
    });
    console.log(`Deleted ${deletedTasks.count} old records`);
  } catch (error) {
    console.error("Error running cron job:", error);
  }
});
