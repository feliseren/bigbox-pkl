const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const rows = await prisma.$queryRaw`SHOW TABLES LIKE 'whats_new'`;
  console.log(rows);
  await prisma.$disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
