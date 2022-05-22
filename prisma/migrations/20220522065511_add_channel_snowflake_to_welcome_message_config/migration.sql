/*
  Warnings:

  - Added the required column `channelSnowflake` to the `WelcomeMessageConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `WelcomeMessageConfig` ADD COLUMN `channelSnowflake` VARCHAR(64) NOT NULL;
