-- CreateEnum
CREATE TYPE "gutierres"."media_kind" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT');

-- AlterTable property_images → property_media com metadados
ALTER TABLE "gutierres"."property_images" ADD COLUMN "kind" "gutierres"."media_kind" NOT NULL DEFAULT 'IMAGE';
ALTER TABLE "gutierres"."property_images" ADD COLUMN "mime_type" TEXT NOT NULL DEFAULT 'image/jpeg';
ALTER TABLE "gutierres"."property_images" ADD COLUMN "file_name" TEXT NOT NULL DEFAULT 'file';
ALTER TABLE "gutierres"."property_images" ADD COLUMN "is_cover" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "gutierres"."property_images" RENAME TO "property_media";

-- Rename FK / indexes if needed (Postgres keeps constraint names)
ALTER INDEX IF EXISTS "gutierres"."property_images_property_id_idx" RENAME TO "property_media_property_id_idx";
ALTER INDEX IF EXISTS "gutierres"."property_images_pkey" RENAME TO "property_media_pkey";
