-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "role" VARCHAR(150) NOT NULL,
    "bio" VARCHAR(1000),
    "imageUrl" VARCHAR(500) NOT NULL,
    "email" VARCHAR(255),
    "facebookUrl" VARCHAR(500),
    "twitterUrl" VARCHAR(500),
    "linkedinUrl" VARCHAR(500),
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TeamMember_id_idx" ON "TeamMember"("id");

-- CreateIndex
CREATE INDEX "TeamMember_name_idx" ON "TeamMember"("name");

-- CreateIndex
CREATE INDEX "TeamMember_isPublished_idx" ON "TeamMember"("isPublished");

-- CreateIndex
CREATE INDEX "TeamMember_displayOrder_idx" ON "TeamMember"("displayOrder");
