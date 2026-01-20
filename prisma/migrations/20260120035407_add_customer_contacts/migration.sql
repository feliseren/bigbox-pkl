-- CreateTable
CREATE TABLE `customer_contacts` (
    `id` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `phone_code` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `company_name` VARCHAR(191) NOT NULL,
    `industry` VARCHAR(191) NOT NULL,
    `industry_other` VARCHAR(191) NULL,
    `company_email` VARCHAR(191) NOT NULL,
    `company_scale` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
