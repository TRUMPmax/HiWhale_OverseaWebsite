/**
 * 数据库种子：后台超级管理员 + 全部 Mock 产品
 * 用法：pnpm db:seed（需 DATABASE_URL，读取 api/.env）
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // shared 包为 ESM（"type": "module"），CJS 脚本中用动态 import 加载
  const { MOCK_PRODUCTS, getGroupOfCategory } = await import("@hiwhale/shared/constants");
  // 后台超级管理员
  const email = "admin@hiwhale.com";
  const staff = await prisma.staffUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "系统管理员",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "SUPER_ADMIN",
    },
  });
  console.log(`[seed] staff super admin ready: ${staff.email} (role=${staff.role})`);

  // 产品（按 slug upsert）
  let count = 0;
  for (const p of MOCK_PRODUCTS) {
    const data = {
      slug: p.slug,
      model: p.model,
      category: p.category,
      group: getGroupOfCategory(p.category),
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      quickSpecs: p.quickSpecs,
      specGroups: p.specGroups,
      features: p.features,
      scenarios: p.scenarios,
      imageName: p.imageName,
      status: "ON",
    };
    await prisma.product.upsert({ where: { slug: p.slug }, update: data, create: data });
    count++;
  }
  console.log(`[seed] products upserted: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
