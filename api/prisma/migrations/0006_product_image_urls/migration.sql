-- AlterTable
ALTER TABLE "products" ADD COLUMN "image_urls" JSONB NOT NULL DEFAULT '[]'::jsonb;
