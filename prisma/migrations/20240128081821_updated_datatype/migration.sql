-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "telegramUserId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "telegramUserId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ADD CONSTRAINT "UniqueTelegramUserAdmin" UNIQUE ("telegramUserId", "adminId");

-- AlterTable
ALTER TABLE "Door" ADD COLUMN "isActive" INT DEFAULT 0;
