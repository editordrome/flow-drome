-- Adicionar um usuário super admin para testes
INSERT INTO users (id, email, name, password, is_active, role_id) VALUES 
('99999999-9999-9999-9999-999999999999', 'admin@mariaflow.com', 'Super Admin', 'admin123', true, 1)
ON CONFLICT (id) DO NOTHING;

-- Adicionar entrada na tabela super_admins
INSERT INTO super_admins (user_id, is_active, created_at) VALUES 
('99999999-9999-9999-9999-999999999999', true, NOW())
ON CONFLICT (user_id) DO NOTHING;

-- Verificar se o usuário foi criado
SELECT u.*, sa.is_active as is_super_admin FROM users u
LEFT JOIN super_admins sa ON u.id = sa.user_id
WHERE u.email = 'admin@mariaflow.com';
