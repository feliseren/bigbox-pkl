-- AlterTable
ALTER TABLE `news_reviews` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `news_stories` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `archived_products` (
    `id` VARCHAR(191) NOT NULL,
    `original_id` VARCHAR(191) NOT NULL,
    `product_type` ENUM('BIG_ASSISTANT', 'BIG_LEGAL', 'BIG_SOCIAL', 'BIG_VISION') NOT NULL,
    `nama_produk` VARCHAR(191) NOT NULL,
    `harga_produk` VARCHAR(191) NOT NULL,
    `deskripsi_produk` VARCHAR(191) NOT NULL,
    `durasi_produk` VARCHAR(191) NOT NULL,
    `terjual` VARCHAR(191) NOT NULL,
    `deleted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_by` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archived_projects` (
    `id` VARCHAR(191) NOT NULL,
    `original_id` VARCHAR(191) NOT NULL,
    `start_label` VARCHAR(191) NOT NULL,
    `target_label` VARCHAR(191) NOT NULL,
    `owner` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_by` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archived_whats_new` (
    `id` VARCHAR(191) NOT NULL,
    `original_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `summary` LONGTEXT NOT NULL,
    `content_text` LONGTEXT NULL,
    `image_url` VARCHAR(191) NULL,
    `is_highlight` BOOLEAN NOT NULL,
    `publish_date` DATETIME(3) NOT NULL,
    `author_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_by` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
