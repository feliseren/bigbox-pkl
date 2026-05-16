/*
  Warnings:

  - You are about to drop the column `product_type` on the `archived_products` table. All the data in the column will be lost.
  - You are about to drop the column `owner` on the `archived_projects` table. All the data in the column will be lost.
  - You are about to drop the column `author_name` on the `archived_whats_new` table. All the data in the column will be lost.
  - You are about to drop the column `bukti_pembayaran` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `jenis_pembayaran` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `product_type` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `password_reset_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `password_reset_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `tokenHash` on the `password_reset_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `usedAt` on the `password_reset_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `password_reset_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `author_name` on the `whats_new` table. All the data in the column will be lost.
  - You are about to drop the `big_assistant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `big_legal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `big_social` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `big_vision` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `consultation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `test` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[token_hash]` on the table `password_reset_tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `archived_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employee_id` to the `archived_projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employee_id` to the `archived_whats_new` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `customer_contacts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `password_reset_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_hash` to the `password_reset_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `password_reset_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employee_id` to the `whats_new` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `news_reviews` DROP FOREIGN KEY `news_reviews_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `password_reset_tokens` DROP FOREIGN KEY `password_reset_tokens_userId_fkey`;

-- DropIndex
DROP INDEX `news_reviews_user_id_fkey` ON `news_reviews`;

-- DropIndex
DROP INDEX `orders_user_id_fkey` ON `orders`;

-- DropIndex
DROP INDEX `password_reset_tokens_tokenHash_key` ON `password_reset_tokens`;

-- DropIndex
DROP INDEX `password_reset_tokens_userId_fkey` ON `password_reset_tokens`;

-- AlterTable
ALTER TABLE `archived_products` DROP COLUMN `product_type`,
    ADD COLUMN `category_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `archived_projects` DROP COLUMN `owner`,
    ADD COLUMN `employee_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `archived_whats_new` DROP COLUMN `author_name`,
    ADD COLUMN `employee_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `customer_contacts` ADD COLUMN `user_id` VARCHAR(191) NOT NULL,
    MODIFY `message` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `bukti_pembayaran`,
    DROP COLUMN `jenis_pembayaran`,
    DROP COLUMN `product_type`;

-- AlterTable
ALTER TABLE `password_reset_tokens` DROP COLUMN `createdAt`,
    DROP COLUMN `expiresAt`,
    DROP COLUMN `tokenHash`,
    DROP COLUMN `usedAt`,
    DROP COLUMN `userId`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `expires_at` DATETIME(3) NOT NULL,
    ADD COLUMN `token_hash` VARCHAR(191) NOT NULL,
    ADD COLUMN `used_at` DATETIME(3) NULL,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `whats_new` DROP COLUMN `author_name`,
    ADD COLUMN `employee_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `big_assistant`;

-- DropTable
DROP TABLE `big_legal`;

-- DropTable
DROP TABLE `big_social`;

-- DropTable
DROP TABLE `big_vision`;

-- DropTable
DROP TABLE `consultation`;

-- DropTable
DROP TABLE `employee`;

-- DropTable
DROP TABLE `project`;

-- DropTable
DROP TABLE `test`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `roles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `has_local_password` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_categories` (
    `id` VARCHAR(191) NOT NULL,
    `category_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `nama_produk` VARCHAR(191) NOT NULL,
    `harga_produk` VARCHAR(191) NOT NULL,
    `deskripsi_produk` VARCHAR(191) NOT NULL,
    `durasi_produk` VARCHAR(191) NOT NULL,
    `terjual` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `confirmed_by` VARCHAR(191) NOT NULL,
    `jenis_pembayaran` VARCHAR(191) NOT NULL,
    `bukti_pembayaran` VARCHAR(191) NOT NULL,
    `status_pembayaran` VARCHAR(191) NOT NULL,
    `paid_at` DATETIME(3) NULL,
    `confirmed_at` DATETIME(3) NULL,

    UNIQUE INDEX `payments_order_id_key`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` VARCHAR(191) NOT NULL,
    `employee_id` VARCHAR(191) NOT NULL,
    `start_label` VARCHAR(191) NOT NULL,
    `target_label` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consultations` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NULL,
    `product` VARCHAR(191) NOT NULL,
    `message` LONGTEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `password_reset_tokens_token_hash_key` ON `password_reset_tokens`(`token_hash`);

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `password_reset_tokens` ADD CONSTRAINT `password_reset_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_confirmed_by_fkey` FOREIGN KEY (`confirmed_by`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news_reviews` ADD CONSTRAINT `news_reviews_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `whats_new` ADD CONSTRAINT `whats_new_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer_contacts` ADD CONSTRAINT `customer_contacts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consultations` ADD CONSTRAINT `consultations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `archived_products` ADD CONSTRAINT `archived_products_original_id_fkey` FOREIGN KEY (`original_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `archived_products` ADD CONSTRAINT `archived_products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `archived_projects` ADD CONSTRAINT `archived_projects_original_id_fkey` FOREIGN KEY (`original_id`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `archived_projects` ADD CONSTRAINT `archived_projects_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `archived_whats_new` ADD CONSTRAINT `archived_whats_new_original_id_fkey` FOREIGN KEY (`original_id`) REFERENCES `whats_new`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `archived_whats_new` ADD CONSTRAINT `archived_whats_new_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
