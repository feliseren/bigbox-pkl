-- CreateTable
CREATE TABLE `orders` (
    `order_id` VARCHAR(191) NOT NULL,
    `product_type` ENUM('BIG_ASSISTANT', 'BIG_LEGAL', 'BIG_SOCIAL', 'BIG_VISION') NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `total_pesanan` VARCHAR(191) NOT NULL,
    `nama_customer` VARCHAR(191) NOT NULL,
    `status_pesanan` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
