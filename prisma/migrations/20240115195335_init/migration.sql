/*
  Warnings:

  - Added the required column `gatewayId` to the `Door` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Door" ADD COLUMN     "gatewayId" INTEGER NOT NULL;
