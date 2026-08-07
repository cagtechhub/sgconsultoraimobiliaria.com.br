-- CreateTable
CREATE TABLE "gutierres"."property_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "property_categories_slug_key" ON "gutierres"."property_categories"("slug");

-- CreateIndex
CREATE INDEX "property_categories_active_idx" ON "gutierres"."property_categories"("active");

-- CreateIndex
CREATE INDEX "property_categories_sort_order_idx" ON "gutierres"."property_categories"("sort_order");

-- AlterTable
ALTER TABLE "gutierres"."properties" ADD COLUMN "category_id" TEXT;

-- CreateIndex
CREATE INDEX "properties_category_id_idx" ON "gutierres"."properties"("category_id");

-- AddForeignKey
ALTER TABLE "gutierres"."properties" ADD CONSTRAINT "properties_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "gutierres"."property_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
