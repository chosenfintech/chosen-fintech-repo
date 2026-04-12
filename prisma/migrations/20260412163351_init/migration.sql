-- CreateTable
CREATE TABLE "GalleryCategory" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryPhoto" (
    "id" TEXT NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "altText" VARCHAR(255),
    "caption" VARCHAR(500),
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GalleryCategory_name_key" ON "GalleryCategory"("name");

-- CreateIndex
CREATE INDEX "GalleryCategory_id_idx" ON "GalleryCategory"("id");

-- CreateIndex
CREATE INDEX "GalleryCategory_name_idx" ON "GalleryCategory"("name");

-- CreateIndex
CREATE INDEX "GalleryCategory_isFeatured_idx" ON "GalleryCategory"("isFeatured");

-- CreateIndex
CREATE INDEX "GalleryPhoto_id_idx" ON "GalleryPhoto"("id");

-- CreateIndex
CREATE INDEX "GalleryPhoto_categoryId_idx" ON "GalleryPhoto"("categoryId");

-- AddForeignKey
ALTER TABLE "GalleryPhoto" ADD CONSTRAINT "GalleryPhoto_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GalleryCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
