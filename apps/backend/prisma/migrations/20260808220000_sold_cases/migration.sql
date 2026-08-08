-- CreateTable sold_cases
CREATE TABLE "gutierres"."sold_cases" (
    "id" TEXT NOT NULL,
    "property_title" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "cover_url" TEXT,
    "cover_storage_path" TEXT,
    "client_name" TEXT NOT NULL,
    "client_role" TEXT NOT NULL DEFAULT '',
    "quote" TEXT NOT NULL,
    "sold_at" TIMESTAMP(3),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sold_cases_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "sold_cases_active_idx" ON "gutierres"."sold_cases"("active");
CREATE INDEX "sold_cases_sort_order_idx" ON "gutierres"."sold_cases"("sort_order");
