-- AlterTable
ALTER TABLE "property_media" ALTER COLUMN "mime_type" DROP DEFAULT,
ALTER COLUMN "file_name" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "property_media_is_cover_idx" ON "property_media"("is_cover");

-- RenameForeignKey
ALTER TABLE "property_media" RENAME CONSTRAINT "property_images_property_id_fkey" TO "property_media_property_id_fkey";
