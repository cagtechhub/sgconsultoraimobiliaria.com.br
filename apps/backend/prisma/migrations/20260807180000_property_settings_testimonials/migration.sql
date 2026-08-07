-- AlterTable properties
ALTER TABLE "gutierres"."properties" ADD COLUMN "long_description" TEXT NOT NULL DEFAULT '';
ALTER TABLE "gutierres"."properties" ADD COLUMN "progress" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "gutierres"."properties" ADD COLUMN "highlights" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "gutierres"."properties" ADD COLUMN "floor_plan_url" TEXT;
ALTER TABLE "gutierres"."properties" ADD COLUMN "selected_on_home" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "properties_featured_idx" ON "gutierres"."properties"("featured");
CREATE INDEX "properties_selected_on_home_idx" ON "gutierres"."properties"("selected_on_home");

-- CreateTable site_settings
CREATE TABLE "gutierres"."site_settings" (
    "id" TEXT NOT NULL,
    "site_url" TEXT NOT NULL DEFAULT '',
    "site_name" TEXT NOT NULL DEFAULT 'Stefanny Gutierres',
    "seo_locality" TEXT NOT NULL DEFAULT 'Brasil',
    "no_index" BOOLEAN NOT NULL DEFAULT false,
    "business_address" TEXT NOT NULL DEFAULT '',
    "business_phone" TEXT NOT NULL DEFAULT '',
    "contact_email" TEXT NOT NULL DEFAULT '',
    "whatsapp_number" TEXT NOT NULL DEFAULT '',
    "whatsapp_message" TEXT NOT NULL DEFAULT '',
    "instagram_url" TEXT NOT NULL DEFAULT '',
    "facebook_url" TEXT NOT NULL DEFAULT '',
    "linkedin_url" TEXT NOT NULL DEFAULT '',
    "default_og_image_url" TEXT NOT NULL DEFAULT '',
    "ga4_measurement_id" TEXT NOT NULL DEFAULT '',
    "meta_pixel_id" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable testimonials
CREATE TABLE "gutierres"."testimonials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT '',
    "quote" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "testimonials_active_idx" ON "gutierres"."testimonials"("active");
CREATE INDEX "testimonials_sort_order_idx" ON "gutierres"."testimonials"("sort_order");
