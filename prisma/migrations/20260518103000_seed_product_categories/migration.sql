INSERT INTO `product_categories` (`id`, `category_name`, `description`, `created_at`, `updated_at`)
VALUES
  ('0', 'Big Assistant', 'Kategori produk Big Assistant', NOW(), NOW()),
  ('1', 'Big Legal', 'Kategori produk Big Legal', NOW(), NOW()),
  ('2', 'Big Social', 'Kategori produk Big Social', NOW(), NOW()),
  ('3', 'Big Vision', 'Kategori produk Big Vision', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  `category_name` = VALUES(`category_name`),
  `description` = VALUES(`description`),
  `updated_at` = NOW();
