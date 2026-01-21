-- CreateTable
CREATE TABLE `big_assistant` (
    `id` VARCHAR(191) NOT NULL,
    `nama_produk` VARCHAR(191) NOT NULL,
    `harga_produk` VARCHAR(191) NOT NULL,
    `deskripsi_produk` VARCHAR(191) NOT NULL,
    `terjual` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `big_vision` (
    `id` VARCHAR(191) NOT NULL,
    `nama_produk` VARCHAR(191) NOT NULL,
    `harga_produk` VARCHAR(191) NOT NULL,
    `deskripsi_produk` VARCHAR(191) NOT NULL,
    `terjual` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `big_legal` (
    `id` VARCHAR(191) NOT NULL,
    `nama_produk` VARCHAR(191) NOT NULL,
    `harga_produk` VARCHAR(191) NOT NULL,
    `deskripsi_produk` VARCHAR(191) NOT NULL,
    `terjual` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `big_social` (
    `id` VARCHAR(191) NOT NULL,
    `nama_produk` VARCHAR(191) NOT NULL,
    `harga_produk` VARCHAR(191) NOT NULL,
    `deskripsi_produk` VARCHAR(191) NOT NULL,
    `terjual` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
