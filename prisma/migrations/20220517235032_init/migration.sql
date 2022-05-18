/*
  Warnings:

  - You are about to drop the column `last_interaction` on the `GuildMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `GuildMember` DROP COLUMN `last_interaction`,
    ADD COLUMN `lastInteraction` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);
