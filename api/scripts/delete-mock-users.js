/**
 * 一次性清理脚本：删除 seed 曾写入的 10 个 Mock 门户用户
 * 用法：cd api && node scripts/delete-mock-users.js（PrismaClient 自动读取 api/.env）
 * 关联的收藏 / AI 会话随 schema onDelete: Cascade 自动清除
 */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const MOCK_USER_EMAILS = [
  "t.mueller@bavaria-logistics.de",
  "sarah.j@midwestfulfill.com",
  "tanaka@tanakaseiki.jp",
  "a.rahman@harborlink.sg",
  "emma.dubois@fraischaine.fr",
  "carlos@mercadosul.com.br",
  "a.kowalska@polpharma.pl",
  "jwilson@outbackparts.com.au",
  "fatima@gulfcoldchain.ae",
  "l.rossi@rossiauto.it",
];

async function main() {
  const { count } = await prisma.user.deleteMany({
    where: { email: { in: MOCK_USER_EMAILS } },
  });
  console.log(`[cleanup] mock portal users deleted: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
