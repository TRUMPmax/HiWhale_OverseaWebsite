/**
 * 数据库种子：后台超级管理员 + 全部 Mock 产品
 * 用法：pnpm db:seed（需 DATABASE_URL，读取 api/.env）
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // shared 包为 ESM（"type": "module"），CJS 脚本中用动态 import 加载
  const {
    MOCK_PRODUCTS,
    MOCK_SOLUTIONS,
    MOCK_CASES,
    getGroupOfCategory,
    PRODUCT_CATEGORY_GROUPS,
    PRODUCT_GROUP_LABELS,
    PRODUCT_CATEGORY_LABELS,
  } = await import("@hiwhale/shared/constants");
  // 后台超级管理员（密码从 SEED_ADMIN_PASSWORD 读取，默认 admin123 仅限本地开发，首次登录后立即改密）
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@hiwhale.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin123";
  const staff = await prisma.staffUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "系统管理员",
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: "SUPER_ADMIN",
    },
  });
  console.log(`[seed] staff super admin ready: ${staff.email} (role=${staff.role})`);

  // 产品分类体系（大类 + 品类）
  let groupOrder = 0;
  for (const { group, categories } of PRODUCT_CATEGORY_GROUPS) {
    groupOrder += 1;
    const g = await prisma.productGroupEntity.upsert({
      where: { key: group },
      update: { nameJson: PRODUCT_GROUP_LABELS[group], sort: groupOrder },
      create: { key: group, nameJson: PRODUCT_GROUP_LABELS[group], sort: groupOrder },
    });
    let catOrder = 0;
    for (const category of categories) {
      catOrder += 1;
      await prisma.productCategoryEntity.upsert({
        where: { key: category },
        update: { nameJson: PRODUCT_CATEGORY_LABELS[category], sort: catOrder, groupId: g.id },
        create: {
          key: category,
          nameJson: PRODUCT_CATEGORY_LABELS[category],
          sort: catOrder,
          groupId: g.id,
        },
      });
    }
  }
  console.log("[seed] taxonomy upserted: " + PRODUCT_CATEGORY_GROUPS.length + " groups");

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

  // 方案（按 slug upsert）
  let solutionCount = 0;
  for (const s of MOCK_SOLUTIONS) {
    const data = {
      slug: s.slug,
      industry: s.industry,
      title: s.title,
      summary: s.summary,
      description: s.description,
      painPoints: s.painPoints,
      productSlugs: s.productSlugs,
      process: s.process,
      results: s.results,
      imageName: s.imageName,
      status: "PUBLISHED",
    };
    await prisma.solution.upsert({ where: { slug: s.slug }, update: data, create: data });
    solutionCount++;
  }
  console.log(`[seed] solutions upserted: ${solutionCount}`);

  // 案例（按 slug upsert）
  let caseCount = 0;
  for (const c of MOCK_CASES) {
    const data = {
      slug: c.slug,
      industry: c.industry,
      clientName: c.clientName,
      project: c.project,
      background: c.background,
      challenge: c.challenge,
      solution: c.solution,
      equipment: c.equipment,
      productSlugs: c.productSlugs,
      duration: c.duration,
      results: c.results,
      testimonial: c.testimonial,
      logoName: c.logoName,
      imageName: c.imageName,
      status: "PUBLISHED",
    };
    await prisma.caseStudy.upsert({ where: { slug: c.slug }, update: data, create: data });
    caseCount++;
  }
  console.log(`[seed] cases upserted: ${caseCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
