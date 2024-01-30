/*
  Warnings:

  - You are about to drop the column `gatewayId` on the `Door` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[doorMacId,buildingId,gatewayMacId]` on the table `Door` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Door_doorName_buildingId_key";

-- AlterTable
ALTER TABLE "Door" DROP COLUMN "gatewayId",
ADD COLUMN     "doorMacId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "gatewayMacId" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Door_doorMacId_buildingId_gatewayMacId_key" ON "Door"("doorMacId", "buildingId", "gatewayMacId");
