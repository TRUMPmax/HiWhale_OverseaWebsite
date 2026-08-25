-- CreateTable
CREATE TABLE "product_groups" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "name_json" JSONB NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "group_id" UUID NOT NULL,
    "name_json" JSONB NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_groups_key_key" ON "product_groups"("key");

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_key_key" ON "product_categories"("key");

-- CreateIndex
CREATE INDEX "product_categories_group_id_idx" ON "product_categories"("group_id");

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "product_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
