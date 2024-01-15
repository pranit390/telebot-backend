-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('LOCATION', 'BUILDING', 'DOOR');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPER_ADMIN', 'USER');

-- CreateTable
CREATE TABLE "Admin" (
    "adminId" SERIAL NOT NULL,
    "telegramUserId" INTEGER NOT NULL,
    "adminName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminId")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "telegramUserId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "adminId" INTEGER,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Location" (
    "locationId" SERIAL NOT NULL,
    "locationName" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("locationId")
);

-- CreateTable
CREATE TABLE "Building" (
    "buildingId" SERIAL NOT NULL,
    "buildingName" TEXT NOT NULL,
    "locationId" INTEGER,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("buildingId")
);

-- CreateTable
CREATE TABLE "Door" (
    "doorId" SERIAL NOT NULL,
    "doorName" TEXT NOT NULL,
    "buildingId" INTEGER,

    CONSTRAINT "Door_pkey" PRIMARY KEY ("doorId")
);

-- CreateTable
CREATE TABLE "UserAccessMap" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "entityId" INTEGER NOT NULL,
    "entityType" "EntityType" NOT NULL,

    CONSTRAINT "UserAccessMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAccessMap" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER,
    "entityId" INTEGER NOT NULL,
    "entityType" "EntityType" NOT NULL,

    CONSTRAINT "AdminAccessMap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_telegramUserId_key" ON "Admin"("telegramUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_adminName_key" ON "Admin"("adminName");

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramUserId_key" ON "User"("telegramUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Location_locationName_key" ON "Location"("locationName");

-- CreateIndex
CREATE UNIQUE INDEX "Building_buildingName_locationId_key" ON "Building"("buildingName", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "Door_doorName_buildingId_key" ON "Door"("doorName", "buildingId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccessMap_userId_entityId_entityType_key" ON "UserAccessMap"("userId", "entityId", "entityType");

-- CreateIndex
CREATE UNIQUE INDEX "AdminAccessMap_adminId_entityId_entityType_key" ON "AdminAccessMap"("adminId", "entityId", "entityType");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("adminId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Building" ADD CONSTRAINT "Building_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("locationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Door" ADD CONSTRAINT "Door_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("buildingId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccessMap" ADD CONSTRAINT "UserAccessMap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAccessMap" ADD CONSTRAINT "AdminAccessMap_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("adminId") ON DELETE SET NULL ON UPDATE CASCADE;
