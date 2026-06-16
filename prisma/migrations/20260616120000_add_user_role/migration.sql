-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR');

-- AlterTable: add role, backfill from isAdmin, then drop isAdmin
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'EDITOR';
UPDATE "User" SET "role" = 'ADMIN' WHERE "isAdmin" = true;
ALTER TABLE "User" DROP COLUMN "isAdmin";
