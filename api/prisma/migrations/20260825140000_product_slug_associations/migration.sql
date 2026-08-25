-- AlterTable
ALTER TABLE "case_studies" ADD COLUMN     "product_slugs" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "solutions" DROP COLUMN "equipment",
ADD COLUMN     "product_slugs" TEXT[] DEFAULT ARRAY[]::TEXT[];
