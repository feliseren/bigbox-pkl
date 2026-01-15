/*
  Warnings:

  - Added the required column `jenis_pembayaran` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `jenis_pembayaran` VARCHAR(191) NOT NULL;
