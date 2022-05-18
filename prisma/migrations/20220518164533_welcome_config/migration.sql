/*
  Warnings:

  - A unique constraint covering the columns `[configId]` on the table `Guild` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Guild` ADD COLUMN `configId` INTEGER UNSIGNED NULL;

-- CreateTable
CREATE TABLE `GuildConfig` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `welcomeMessageEnabled` BOOLEAN NOT NULL DEFAULT false,
    `welcomeMessageConfigId` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `GuildConfig_welcomeMessageConfigId_key`(`welcomeMessageConfigId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WelcomeMessageConfig` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `format` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Guild_configId_key` ON `Guild`(`configId`);

-- AddForeignKey
ALTER TABLE `Guild` ADD CONSTRAINT `Guild_configId_fkey` FOREIGN KEY (`configId`) REFERENCES `GuildConfig`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildConfig` ADD CONSTRAINT `GuildConfig_welcomeMessageConfigId_fkey` FOREIGN KEY (`welcomeMessageConfigId`) REFERENCES `WelcomeMessageConfig`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
