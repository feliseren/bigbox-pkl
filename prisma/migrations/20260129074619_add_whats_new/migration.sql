-- CreateTable
CREATE TABLE `whats_new` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `summary` LONGTEXT NOT NULL,
    `content_text` LONGTEXT NULL,
    `image_url` VARCHAR(191) NULL,
    `is_highlight` BOOLEAN NOT NULL DEFAULT false,
    `publish_date` DATETIME(3) NOT NULL,
    `author_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
