/**
 * 数据库种子：后台超级管理员 + 全部 Mock 产品
 * 用法：pnpm db:seed（需 DATABASE_URL，读取 api/.env）
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // shared 包为 ESM（"type": "module"），CJS 脚本中用动态 import 加载
  const { MOCK_PRODUCTS, MOCK_SOLUTIONS, MOCK_CASES, getGroupOfCategory } =
    await import("@hiwhale/shared/constants");
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

  // 销售团队（询盘分配候选人）
  const salesStaff = [
    { name: "张三", email: "zhangsan@hiwhale.com" },
    { name: "李四", email: "lisi@hiwhale.com" },
    { name: "王五", email: "wangwu@hiwhale.com" },
    { name: "Mia", email: "mia@hiwhale.com" },
  ];
  const salesPassword = await bcrypt.hash("staff123", 10);
  for (const s of salesStaff) {
    await prisma.staffUser.upsert({
      where: { email: s.email },
      update: {},
      create: { ...s, passwordHash: salesPassword, role: "SALES" },
    });
  }
  console.log(`[seed] sales staff upserted: ${salesStaff.length}`);

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
      equipment: s.equipment,
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

  // 门户用户（Mock：密码均为 user123）
  const portalUsers = [
    {
      name: "Thomas Müller",
      company: "Bavaria Logistics GmbH",
      email: "t.mueller@bavaria-logistics.de",
      country: "德国",
      aiUsageCount: 34,
    },
    {
      name: "Sarah Johnson",
      company: "Midwest Fulfillment Inc.",
      email: "sarah.j@midwestfulfill.com",
      country: "美国",
      aiUsageCount: 57,
    },
    {
      name: "Kenji Tanaka",
      company: "Tanaka Seiki Co., Ltd.",
      email: "tanaka@tanakaseiki.jp",
      country: "日本",
      aiUsageCount: 12,
    },
    {
      name: "Ahmad Rahman",
      company: "HarborLink Terminal",
      email: "a.rahman@harborlink.sg",
      country: "新加坡",
      aiUsageCount: 89,
    },
    {
      name: "Emma Dubois",
      company: "FraisChaîne SAS",
      email: "emma.dubois@fraischaine.fr",
      country: "法国",
      aiUsageCount: 8,
    },
    {
      name: "Carlos Mendes",
      company: "Mercado Sul Logística",
      email: "carlos@mercadosul.com.br",
      country: "巴西",
      aiUsageCount: 21,
    },
    {
      name: "Anna Kowalska",
      company: "PolPharma Distribution",
      email: "a.kowalska@polpharma.pl",
      country: "波兰",
      aiUsageCount: 45,
    },
    {
      name: "James Wilson",
      company: "Outback Parts Pty Ltd",
      email: "jwilson@outbackparts.com.au",
      country: "澳大利亚",
      aiUsageCount: 6,
    },
    {
      name: "Fatima Al-Sayed",
      company: "Gulf Cold Chain LLC",
      email: "fatima@gulfcoldchain.ae",
      country: "阿联酋",
      aiUsageCount: 18,
    },
    {
      name: "Luca Rossi",
      company: "Rossi Automotive SpA",
      email: "l.rossi@rossiauto.it",
      country: "意大利",
      aiUsageCount: 63,
    },
  ];
  const userPassword = await bcrypt.hash("user123", 10);
  let userCount = 0;
  for (const u of portalUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash: userPassword },
    });
    userCount++;
  }
  console.log(`[seed] portal users upserted: ${userCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
