-- AddForeignKey
ALTER TABLE `archived_products` ADD CONSTRAINT `archived_products_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
