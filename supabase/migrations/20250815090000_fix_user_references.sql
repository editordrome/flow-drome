-- Migração: Corrigir referências de usuários
-- Data: 15 de Agosto de 2025
-- Descrição: Atualizar tabela user_unit_assignments para referenciar tabela users ao invés de auth.users

-- Remover constraint existente se existir
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'user_unit_assignments_user_id_fkey') THEN
        ALTER TABLE user_unit_assignments DROP CONSTRAINT user_unit_assignments_user_id_fkey;
    END IF;
END $$;

-- Recriar a tabela com referência correta para tabela users customizada
DROP TABLE IF EXISTS user_unit_assignments CASCADE;

CREATE TABLE user_unit_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id), -- Admin ou Super Admin que fez a atribuição
    is_primary BOOLEAN DEFAULT false, -- Unidade principal do usuário
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, unit_id)
);

-- Criar alguns dados de exemplo se não existirem usuários nas unidades
-- (Opcional - apenas para demonstração)
INSERT INTO user_unit_assignments (user_id, unit_id, assigned_by) 
SELECT 
    u.id as user_id,
    un.id as unit_id,
    u.id as assigned_by
FROM users u
CROSS JOIN units un
WHERE u.email = 'admin@mariaflow.com'
AND NOT EXISTS (SELECT 1 FROM user_unit_assignments WHERE user_id = u.id AND unit_id = un.id)
LIMIT 1;
