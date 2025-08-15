-- Migração: Sistema de Permissões Hierárquicas Super Admin
-- Data: 15 de Agosto de 2025
-- Descrição: Implementa sistema completo de permissões com Super Admin, Admin e Atendente

-- 1. Tabela de Unidades (Franquias)
CREATE TABLE IF NOT EXISTS units (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    cnpj VARCHAR(18) UNIQUE,
    status unit_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Enum para status da unidade
DO $$ BEGIN
    CREATE TYPE unit_status AS ENUM ('active', 'inactive', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Tabela de Módulos do Sistema
CREATE TABLE IF NOT EXISTS modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    category VARCHAR(100) NOT NULL,
    is_core BOOLEAN DEFAULT false, -- Módulos essenciais que não podem ser desativados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Módulos por Unidade (Controle do Super Admin)
CREATE TABLE IF NOT EXISTS unit_modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    activated_by UUID REFERENCES auth.users(id), -- Super Admin que ativou
    activated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deactivated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(unit_id, module_id)
);

-- 4. Tabela de Associação Usuário-Unidade
CREATE TABLE IF NOT EXISTS user_unit_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id), -- Admin ou Super Admin que fez a atribuição
    is_primary BOOLEAN DEFAULT false, -- Unidade principal do usuário
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, unit_id)
);

-- 5. Tabela de Permissões de Módulos por Usuário (Controle do Admin)
CREATE TABLE IF NOT EXISTS user_module_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    has_access BOOLEAN DEFAULT false,
    can_read BOOLEAN DEFAULT true,
    can_write BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false,
    granted_by UUID REFERENCES auth.users(id), -- Admin que concedeu a permissão
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, unit_id, module_id),
    
    -- Constraint: só pode ter permissão se o módulo estiver ativo na unidade
    CONSTRAINT fk_unit_module CHECK (
        EXISTS (
            SELECT 1 FROM unit_modules um 
            WHERE um.unit_id = user_module_permissions.unit_id 
            AND um.module_id = user_module_permissions.module_id 
            AND um.is_active = true
        )
    )
);

-- 6. Inserir módulos padrão do sistema
INSERT INTO modules (name, description, icon, category, is_core) VALUES
-- Módulos Core (não podem ser desativados)
('Dashboard', 'Painel principal com métricas e visão geral', '📊', 'core', true),
('Usuários', 'Gerenciamento de usuários e permissões', '👥', 'core', true),

-- Módulos de Atendimento
('Agenda', 'Gerenciamento de agendamentos e horários', '📅', 'atendimento', false),
('Clientes', 'Cadastro e gestão de clientes', '🧑‍💼', 'atendimento', false),
('Leads', 'Gestão de leads e pipeline de vendas', '🎯', 'atendimento', false),
('Tickets', 'Sistema de suporte e atendimento', '🎫', 'atendimento', false),

-- Módulos Financeiros
('Financeiro', 'Controle financeiro e fluxo de caixa', '💰', 'financeiro', false),
('Cashback', 'Sistema de cashback e fidelidade', '💳', 'financeiro', false),

-- Módulos de Gestão
('Profissionais', 'Cadastro e gestão de profissionais', '👨‍⚕️', 'gestao', false),
('Materiais', 'Controle de estoque e materiais', '📦', 'gestao', false),
('Uniformes', 'Gestão de uniformes e vestimentas', '👔', 'gestao', false),

-- Módulos de Marketing
('Marketing', 'Materiais de marketing e campanhas', '📢', 'marketing', false),
('Publicações', 'Gestão de conteúdo e redes sociais', '📱', 'marketing', false),

-- Módulos Educacionais
('MariaUni', 'Plataforma educacional e treinamentos', '🎓', 'educacao', false),
('Base de Conhecimento', 'Documentação e base de conhecimento', '📚', 'educacao', false),

-- Módulos Especializados
('Recrutadora', 'Sistema de recrutamento e seleção', '🔍', 'rh', false)

ON CONFLICT (name) DO NOTHING;

-- 7. Criar unidade de exemplo para testes
INSERT INTO units (name, address, phone, email, cnpj, status) VALUES
('MariaFlow Matriz', 'Rua das Flores, 123 - Centro, São Paulo - SP', '(11) 99999-9999', 'matriz@mariaflow.com', '12.345.678/0001-90', 'active'),
('MariaFlow Filial Norte', 'Av. Paulista, 456 - Bela Vista, São Paulo - SP', '(11) 88888-8888', 'norte@mariaflow.com', '12.345.678/0002-71', 'active')
ON CONFLICT (cnpj) DO NOTHING;

-- 8. Ativar todos os módulos para as unidades de exemplo
INSERT INTO unit_modules (unit_id, module_id, is_active, activated_by)
SELECT u.id, m.id, true, sa.id
FROM units u
CROSS JOIN modules m
CROSS JOIN (SELECT id FROM auth.users WHERE email = 'jeanpetri@gmail.com' LIMIT 1) sa
ON CONFLICT (unit_id, module_id) DO NOTHING;

-- 9. Associar usuários às unidades
-- Super Admin tem acesso a todas as unidades
INSERT INTO user_unit_assignments (user_id, unit_id, assigned_by, is_primary)
SELECT u.id, un.id, u.id, (ROW_NUMBER() OVER() = 1)
FROM (SELECT id FROM auth.users WHERE email = 'jeanpetri@gmail.com') u
CROSS JOIN units un
ON CONFLICT (user_id, unit_id) DO NOTHING;

-- Admin da matriz
INSERT INTO user_unit_assignments (user_id, unit_id, assigned_by, is_primary)
SELECT 
    (SELECT id FROM auth.users WHERE email = 'admin@mariaflow.com'),
    (SELECT id FROM units WHERE name = 'MariaFlow Matriz'),
    (SELECT id FROM auth.users WHERE email = 'jeanpetri@gmail.com'),
    true
ON CONFLICT (user_id, unit_id) DO NOTHING;

-- 10. Índices para performance
CREATE INDEX IF NOT EXISTS idx_unit_modules_unit_active ON unit_modules(unit_id, is_active);
CREATE INDEX IF NOT EXISTS idx_user_unit_assignments_user ON user_unit_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_unit_assignments_unit ON user_unit_assignments(unit_id);
CREATE INDEX IF NOT EXISTS idx_user_module_permissions_user_unit ON user_module_permissions(user_id, unit_id);

-- 11. RLS (Row Level Security)
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_unit_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_module_permissions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Super Admin vê tudo
CREATE POLICY "Super Admin full access" ON units FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM auth.users u
        JOIN users usr ON u.id = usr.user_id
        WHERE u.id = auth.uid() AND usr.access_level = 100
    )
);

-- Admin vê apenas suas unidades
CREATE POLICY "Admin unit access" ON units FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_unit_assignments uua
        JOIN auth.users u ON u.id = uua.user_id
        JOIN users usr ON u.id = usr.user_id
        WHERE u.id = auth.uid() 
        AND uua.unit_id = units.id 
        AND usr.role = 'admin'
    )
);

-- Atendente vê apenas sua unidade principal
CREATE POLICY "Attendant unit access" ON units FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_unit_assignments uua
        JOIN auth.users u ON u.id = uua.user_id
        JOIN users usr ON u.id = usr.user_id
        WHERE u.id = auth.uid() 
        AND uua.unit_id = units.id 
        AND uua.is_primary = true
        AND usr.role = 'attendant'
    )
);

-- 12. Funções auxiliares

-- Função para verificar se usuário tem acesso a uma unidade
CREATE OR REPLACE FUNCTION user_has_unit_access(user_uuid UUID, unit_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_level INTEGER;
BEGIN
    -- Buscar nível de acesso do usuário
    SELECT access_level INTO user_level
    FROM users
    WHERE user_id = user_uuid;
    
    -- Super Admin tem acesso a tudo
    IF user_level = 100 THEN
        RETURN TRUE;
    END IF;
    
    -- Verificar se usuário está associado à unidade
    RETURN EXISTS (
        SELECT 1 FROM user_unit_assignments
        WHERE user_id = user_uuid AND unit_id = unit_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se usuário pode acessar módulo em uma unidade
CREATE OR REPLACE FUNCTION user_can_access_module(user_uuid UUID, unit_uuid UUID, module_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_level INTEGER;
    user_role TEXT;
BEGIN
    -- Buscar dados do usuário
    SELECT access_level, role INTO user_level, user_role
    FROM users
    WHERE user_id = user_uuid;
    
    -- Super Admin tem acesso a tudo
    IF user_level = 100 THEN
        RETURN TRUE;
    END IF;
    
    -- Verificar se módulo está ativo na unidade
    IF NOT EXISTS (
        SELECT 1 FROM unit_modules
        WHERE unit_id = unit_uuid AND module_id = module_uuid AND is_active = true
    ) THEN
        RETURN FALSE;
    END IF;
    
    -- Admin tem acesso a todos os módulos ativos das suas unidades
    IF user_role = 'admin' AND EXISTS (
        SELECT 1 FROM user_unit_assignments
        WHERE user_id = user_uuid AND unit_id = unit_uuid
    ) THEN
        RETURN TRUE;
    END IF;
    
    -- Atendente precisa ter permissão específica
    IF user_role = 'attendant' THEN
        RETURN EXISTS (
            SELECT 1 FROM user_module_permissions ump
            JOIN user_unit_assignments uua ON uua.user_id = ump.user_id AND uua.unit_id = ump.unit_id
            WHERE ump.user_id = user_uuid 
            AND ump.unit_id = unit_uuid 
            AND ump.module_id = module_uuid 
            AND ump.has_access = true
        );
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar função authenticate_user para incluir informações de unidades
CREATE OR REPLACE FUNCTION authenticate_user(email TEXT, password TEXT)
RETURNS JSON AS $$
DECLARE
    user_record RECORD;
    user_units JSON;
    user_permissions JSON;
BEGIN
    -- Buscar usuário e validar senha
    SELECT u.*, users.role, users.access_level, users.full_name
    INTO user_record
    FROM auth.users u
    JOIN users ON u.id = users.user_id
    WHERE u.email = authenticate_user.email
    AND users.password_hash = crypt(authenticate_user.password, users.password_hash);
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Credenciais inválidas');
    END IF;
    
    -- Buscar unidades do usuário
    SELECT json_agg(
        json_build_object(
            'id', un.id,
            'name', un.name,
            'is_primary', uua.is_primary
        )
    ) INTO user_units
    FROM user_unit_assignments uua
    JOIN units un ON un.id = uua.unit_id
    WHERE uua.user_id = user_record.id
    AND un.status = 'active';
    
    -- Se for Super Admin, incluir todas as unidades
    IF user_record.access_level = 100 THEN
        SELECT json_agg(
            json_build_object(
                'id', id,
                'name', name,
                'is_primary', true
            )
        ) INTO user_units
        FROM units
        WHERE status = 'active';
    END IF;
    
    RETURN json_build_object(
        'success', true,
        'user', json_build_object(
            'id', user_record.id,
            'email', user_record.email,
            'full_name', user_record.full_name,
            'role', user_record.role,
            'access_level', user_record.access_level,
            'units', COALESCE(user_units, '[]'::json),
            'is_super_admin', user_record.access_level = 100
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
