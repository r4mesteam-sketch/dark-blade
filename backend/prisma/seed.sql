# Dark Blade Database Seed Script

-- Create admin user (password: ChangeMe123!@#)
INSERT INTO "User" (id, email, "passwordHash", "firstName", "lastName", role, "emailVerified", "isActive", "createdAt", "updatedAt")
VALUES ('admin-001', 'admin@darkblade.local', '$2b$10$...', 'Admin', 'User', 'ADMIN', true, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Create test seller
INSERT INTO "User" (id, email, "passwordHash", "firstName", "lastName", role, "emailVerified", "isActive", "createdAt", "updatedAt")
VALUES ('seller-001', 'seller@darkblade.local', '$2b$10$...', 'Test', 'Seller', 'SELLER', true, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Create test buyer
INSERT INTO "User" (id, email, "passwordHash", "firstName", "lastName", role, "emailVerified", "isActive", "createdAt", "updatedAt")
VALUES ('buyer-001', 'buyer@darkblade.local', '$2b$10$...', 'Test', 'Buyer', 'BUYER', true, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Create categories
INSERT INTO "Category" (id, name, slug, description, "isFeatured", "displayOrder", "createdAt", "updatedAt")
VALUES
('cat-001', 'Electronics', 'electronics', 'Electronic devices and gadgets', true, 1, NOW(), NOW()),
('cat-002', 'Software', 'software', 'Software licenses and digital products', true, 2, NOW(), NOW()),
('cat-003', 'Crypto Hardware', 'crypto-hardware', 'Hardware wallets and mining equipment', true, 3, NOW(), NOW())
ON CONFLICT DO NOTHING;
