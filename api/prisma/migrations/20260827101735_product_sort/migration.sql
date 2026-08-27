-- DropIndex
DROP INDEX "product_categories_group_id_idx";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "sort" INTEGER NOT NULL DEFAULT 0;
