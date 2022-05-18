-- CreateTable
CREATE TABLE `Guild` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `snowflake` VARCHAR(64) NOT NULL,
    `name` VARCHAR(255) NULL,

    UNIQUE INDEX `Guild_snowflake_key`(`snowflake`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildMember` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `snowflake` VARCHAR(64) NOT NULL,
    `name` VARCHAR(255) NULL,
    `identifier` VARCHAR(255) NULL,
    `birthday` DATE NULL,
    `last_interaction` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `active` BOOLEAN NOT NULL DEFAULT true,
    `guildId` INTEGER UNSIGNED NOT NULL,

    INDEX `GuildMember_guildId_idx`(`guildId`),
    UNIQUE INDEX `GuildMember_snowflake_guildId_key`(`snowflake`, `guildId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommandList` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `options` JSON NOT NULL,
    `guildId` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `CommandList_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommandInvocation` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `guildId` INTEGER UNSIGNED NULL,
    `guildMemberId` INTEGER UNSIGNED NULL,
    `commandName` VARCHAR(255) NOT NULL,

    INDEX `CommandInvocation_guildId_idx`(`guildId`),
    INDEX `CommandInvocation_guildMemberId_idx`(`guildMemberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommandFlowGroup` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `guildId` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `type` TINYINT NOT NULL,
    `messageId` VARCHAR(255) NOT NULL,
    `channelId` VARCHAR(255) NOT NULL,
    `messageText` TEXT NOT NULL,
    `reactions` JSON NOT NULL,

    INDEX `CommandFlowGroup_guildId_idx`(`guildId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommandFlow` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `onType` TINYINT NOT NULL,
    `buildingBlockType` TINYINT NOT NULL,
    `checkType` TINYINT NULL,
    `checkValue` VARCHAR(255) NULL,
    `options` VARCHAR(255) NOT NULL,
    `order` INTEGER NOT NULL,
    `commandFlowGroupId` INTEGER UNSIGNED NOT NULL,

    INDEX `CommandFlow_commandFlowGroupId_idx`(`commandFlowGroupId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Report` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `guildMemberId` INTEGER UNSIGNED NULL,
    `channelId` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `reportedGuildMemberId` INTEGER UNSIGNED NULL,
    `anonymous` BOOLEAN NOT NULL DEFAULT true,
    `resolved` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Report_guildMemberId_idx`(`guildMemberId`),
    INDEX `Report_reportedGuildMemberId_idx`(`reportedGuildMemberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GuildMember` ADD CONSTRAINT `GuildMember_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommandList` ADD CONSTRAINT `CommandList_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommandInvocation` ADD CONSTRAINT `CommandInvocation_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommandInvocation` ADD CONSTRAINT `CommandInvocation_guildMemberId_fkey` FOREIGN KEY (`guildMemberId`) REFERENCES `GuildMember`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommandFlowGroup` ADD CONSTRAINT `CommandFlowGroup_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `Guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommandFlow` ADD CONSTRAINT `CommandFlow_commandFlowGroupId_fkey` FOREIGN KEY (`commandFlowGroupId`) REFERENCES `CommandFlowGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_guildMemberId_fkey` FOREIGN KEY (`guildMemberId`) REFERENCES `GuildMember`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_reportedGuildMemberId_fkey` FOREIGN KEY (`reportedGuildMemberId`) REFERENCES `GuildMember`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
