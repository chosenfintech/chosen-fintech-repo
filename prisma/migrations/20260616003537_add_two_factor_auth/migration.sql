-- CreateEnum
CREATE TYPE "UserSecurityTokenType" AS ENUM ('TWO_FACTOR_LOGIN', 'TWO_FACTOR_SETUP');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "UserSecurityToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "type" "UserSecurityTokenType" NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSecurityToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSecurityToken_tokenHash_key" ON "UserSecurityToken"("tokenHash");

-- CreateIndex
CREATE INDEX "UserSecurityToken_userId_type_idx" ON "UserSecurityToken"("userId", "type");

-- CreateIndex
CREATE INDEX "UserSecurityToken_expiresAt_idx" ON "UserSecurityToken"("expiresAt");

-- AddForeignKey
ALTER TABLE "UserSecurityToken" ADD CONSTRAINT "UserSecurityToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
