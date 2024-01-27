/*
  Warnings:

  - Changed the type of `telegramUserId` on the `Admin` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `telegramUserId` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "telegramUserId",
ADD COLUMN     "telegramUserId" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "telegramUserId",
ADD COLUMN     "telegramUserId" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_telegramUserId_key" ON "Admin"("telegramUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramUserId_key" ON "User"("telegramUserId");
