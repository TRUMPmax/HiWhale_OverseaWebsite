/**
 * 数据库种子：创建后台超级管理员
 * 用法：pnpm db:seed（需 DATABASE_URL，读取 api/.env）
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@hiwhale.com";
  const passwordHash = await bcrypt.hash("admin123", 10);

  const staff = await prisma.staffUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "系统管理员",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log(`[seed] staff super admin ready: ${staff.email} (role=${staff.role})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
