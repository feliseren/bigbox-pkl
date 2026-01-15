/*
  Warnings:

  - Added the required column `durasi_produk` to the `big_assistant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durasi_produk` to the `big_legal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durasi_produk` to the `big_social` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durasi_produk` to the `big_vision` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `big_assistant` ADD COLUMN `durasi_produk` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `big_legal` ADD COLUMN `durasi_produk` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `big_social` ADD COLUMN `durasi_produk` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `big_vision` ADD COLUMN `durasi_produk` VARCHAR(191) NOT NULL;
