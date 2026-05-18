INSERT INTO `roles` (`id`, `name`, `description`)
VALUES
  ('0', 'admin', 'Administrator'),
  ('1', 'marketing', 'Marketing'),
  ('2', 'project manager', 'Project Manager')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`);
