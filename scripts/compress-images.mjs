/**
 * 站点图片批量压缩：>200KB 的 PNG 限制宽度 1920px + 调色板量化（保持 .png 文件名与素材槽映射不变）
 * 用法：node scripts/compress-images.mjs
 */
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = "apps/portal/public/images";
const MIN_SIZE = 200 * 1024;
const MAX_WIDTH = 1920;

let totalBefore = 0;
let totalAfter = 0;
let count = 0;

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(p);
      continue;
    }
    if (!entry.name.endsWith(".png")) continue;
    const { size } = await stat(p);
    if (size < MIN_SIZE) continue;
    try {
      const img = sharp(p);
      const meta = await img.metadata();
      if (meta.width > MAX_WIDTH) img.resize({ width: MAX_WIDTH });
      const out = await img
        .png({ palette: true, quality: 85, compressionLevel: 9 })
        .toBuffer();
      if (out.length < size) {
        await sharp(out).toFile(p);
        count++;
        totalBefore += size;
        totalAfter += out.length;
        console.log(
          `${path.relative(ROOT, p)}: ${(size / 1048576).toFixed(1)}MB → ${(out.length / 1048576).toFixed(1)}MB`,
        );
      }
    } catch (e) {
      console.warn(`跳过 ${p}: ${e.message}`);
    }
  }
}

await walk(ROOT);
console.log(
  `\n压缩 ${count} 张：${(totalBefore / 1048576).toFixed(1)}MB → ${(totalAfter / 1048576).toFixed(1)}MB（省 ${Math.round((1 - totalAfter / totalBefore) * 100)}%）`,
);
