-- CreateTable
CREATE TABLE `Admin` (
    `adminId` INTEGER NOT NULL AUTO_INCREMENT,
    `telegramUserId` INTEGER NOT NULL,
    `adminName` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'SUPER_ADMIN', 'USER') NOT NULL DEFAULT 'ADMIN',

    UNIQUE INDEX `Admin_telegramUserId_key`(`telegramUserId`),
    UNIQUE INDEX `Admin_adminName_key`(`adminName`),
    PRIMARY KEY (`adminId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `telegramUserId` INTEGER NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `adminId` INTEGER NULL,
    `role` ENUM('ADMIN', 'SUPER_ADMIN', 'USER') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `User_telegramUserId_key`(`telegramUserId`),
    UNIQUE INDEX `User_userName_key`(`userName`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `locationId` INTEGER NOT NULL AUTO_INCREMENT,
    `locationName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Location_locationName_key`(`locationName`),
    PRIMARY KEY (`locationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Building` (
    `buildingId` INTEGER NOT NULL AUTO_INCREMENT,
    `buildingName` VARCHAR(191) NOT NULL,
    `locationId` INTEGER NOT NULL,

    UNIQUE INDEX `Building_buildingName_locationId_key`(`buildingName`, `locationId`),
    PRIMARY KEY (`buildingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Door` (
    `doorId` INTEGER NOT NULL AUTO_INCREMENT,
    `doorName` VARCHAR(191) NOT NULL,
    `buildingId` INTEGER NOT NULL,

    UNIQUE INDEX `Door_doorName_buildingId_key`(`doorName`, `buildingId`),
    PRIMARY KEY (`doorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserAccessMap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `entityId` INTEGER NOT NULL,
    `entityType` ENUM('LOCATION', 'BUILDING', 'DOOR') NOT NULL,

    UNIQUE INDEX `UserAccessMap_userId_entityId_entityType_key`(`userId`, `entityId`, `entityType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminAccessMap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminId` INTEGER NOT NULL,
    `entityId` INTEGER NOT NULL,
    `entityType` ENUM('LOCATION', 'BUILDING', 'DOOR') NOT NULL,

    UNIQUE INDEX `AdminAccessMap_adminId_entityId_entityType_key`(`adminId`, `entityId`, `entityType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`adminId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Building` ADD CONSTRAINT `Building_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`locationId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Door` ADD CONSTRAINT `Door_buildingId_fkey` FOREIGN KEY (`buildingId`) REFERENCES `Building`(`buildingId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAccessMap` ADD CONSTRAINT `UserAccessMap_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminAccessMap` ADD CONSTRAINT `AdminAccessMap_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`adminId`) ON DELETE RESTRICT ON UPDATE CASCADE;
