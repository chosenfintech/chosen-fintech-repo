-- AlterTable
ALTER TABLE "GalleryPhoto" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "GalleryPhoto_isPublished_idx" ON "GalleryPhoto"("isPublished");
