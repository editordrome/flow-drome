# MariaFlow - Arquitetura do Sistema

*Documentação técnica atualizada - 15/08/2025*

## Visão Geral

O MariaFlow é um sistema de gestão para franquias que implementa uma arquitetura hierárquica baseada em unidades, com controle granular de módulos e permissões por nível de usuário.

## Arquitetura de Permissões Hierárquicas

### Sistema de 3 Camadas Implementado

```
🔴 Super Admin (level: 100, is_super_admin: true)
    │
    ├── ✅ Acesso total ao sistema
    ├── ✅ Gestão de todas as unidades (Gestão Unidades)
    ├── ✅ Super Admin Dashboard
    └── ✅ Módulos da unidade ativa selecionada
    
🟡 Admin (level: 80, role: "admin")
    │
    ├── ✅ Administração de unidade específica
    ├── ✅ Gestão de usuários da unidade
    └── ✅ Todos os módulos habilitados na unidade (unit_modules)
    
🟢 Atendente (level: 30, role: "atendente")
    │
    ├── ✅ Acesso granular por módulo específico
    ├── ✅ Apenas módulos liberados individualmente
    └── ✅ Configurado via user_module_permissions
```

### Fluxo de Dados de Permissões

```
Database (unit_modules + user_module_permissions)
    ↓
useActiveUnit.tsx (fonte única de verdade)
    ↓ 
useAllowedModules.tsx (filtra menu)
    ↓
AppSidebarMenu.tsx (renderiza sidebar)
```

## Database Schema Completo

### Tabelas Principais

```sql
-- Roles do sistema
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR UNIQUE NOT NULL,
    display_name VARCHAR NOT NULL,
    level INTEGER NOT NULL, -- 30: Atendente, 80: Admin, 100: Super Admin
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Usuários principais
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    nome VARCHAR NOT NULL,
    password VARCHAR, -- Hash bcrypt
    role_id UUID REFERENCES roles(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Super admins (controle especial)
CREATE TABLE super_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Unidades/Filiais
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    code VARCHAR UNIQUE,
    address TEXT,
    phone VARCHAR,
    email VARCHAR,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES users(id)
);

-- Módulos do sistema
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR UNIQUE NOT NULL, -- "dashboard", "clientes", "agenda", etc.
    display_name VARCHAR NOT NULL, -- "Dashboard", "Clientes", "Agenda", etc.
    description TEXT,
    icon VARCHAR, -- Nome do ícone
    category VARCHAR, -- "core", "atendimento", "comercial", etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ✅ IMPLEMENTADO: Módulos permitidos por unidade (para Admin)
CREATE TABLE unit_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    configured_at TIMESTAMPTZ DEFAULT now(),
    configured_by UUID REFERENCES users(id),
    UNIQUE(unit_id, module_id)
);

-- ✅ IMPLEMENTADO: Vinculação usuário-unidade
CREATE TABLE user_unit_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    role_override VARCHAR, -- Role específica para esta unidade (opcional)
    is_primary BOOLEAN DEFAULT false,
    assigned_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, unit_id)
);

-- ✅ IMPLEMENTADO: Permissões específicas de módulos para atendentes
CREATE TABLE user_module_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
    granted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    granted_at TIMESTAMPTZ DEFAULT now(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, module_id, unit_id)
);
```

-- Logs de atividade
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
    action VARCHAR NOT NULL, -- "login", "create_user", "enable_module", etc.
    resource VARCHAR, -- "user", "unit", "module", etc.
    resource_id UUID, -- ID do recurso afetado
    details JSONB, -- Detalhes adicionais da ação
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

## Estrutura de Módulos

### Mapeamento de Módulos Implementado

```typescript
// Mapeamento entre IDs do menu frontend e nomes no banco
const MODULE_MAPPING = {
  'dashboard': 'Dashboard',
  'super-admin': 'Super Admin Dashboard', // Apenas Super Admin
  'gestao-unidades': 'Gestão Unidades',   // Apenas Super Admin
  'agenda': 'Agenda',
  'agendamentos': 'Agendamentos', 
  'clientes': 'Clientes',
  'pipeline': 'Pipeline',
  'tickets': 'Tickets',
  'profissionais': 'Profissionais',
  'financeiro': 'Financeiro',
  'cashback': 'Cashback',
  'materiais': 'Materiais',
  'materiais-marketing': 'Materiais Marketing',
  'uniformes': 'Uniformes',
  'publicacoes': 'Publicações',
  'recrutadora': 'Recrutadora',
  'base-conhecimento': 'Base Conhecimento',
  'maria-uni': 'MariaUni',
  'configuracao-modulos': 'Configuração Módulos'
};
```

### Categorias de Módulos por Nível

```
🔴 Super Admin Exclusivos:
├── Super Admin Dashboard - Visão geral global
└── Gestão de Unidades - Controle de unidades

🟡 Módulos de Unidade (Admin + Atendente autorizado):
├── Core:
│   └── Dashboard - Visão geral da unidade
│
├── Atendimento:
│   ├── Agenda - Sistema de agendamentos
│   ├── Agendamentos - Gestão de agendamentos
│   ├── Clientes - Cadastro e gestão de clientes
│   ├── Pipeline - Gestão de leads e oportunidades
│   └── Tickets - Sistema de suporte
│
├── Recursos Humanos:
│   ├── Profissionais - Gestão de equipe
│   └── Recrutadora - Processo seletivo
│
├── Financeiro:
│   ├── Financeiro - Controle financeiro
│   └── Cashback - Programa de recompensas
│
├── Marketing & Materiais:
│   ├── Materiais - Gestão de materiais
│   ├── Materiais Marketing - Materiais promocionais
│   ├── Publicações - Gestão de conteúdo
│   └── Uniformes - Controle de uniformes
│
├── Educação:
│   ├── Base Conhecimento - Documentação
│   └── MariaUni - Sistema educacional
│
└── Configuração:
    └── Configuração Módulos - Configurações da unidade
```

## Hooks Principais Implementados

### useAuth.tsx - Autenticação Pura

```typescript
interface User {
  id: string;
  email: string;
  nome: string | null;
  role: string;
  role_level: number;
  is_super_admin: boolean;
}

// ✅ IMPLEMENTADO: Hook focado apenas em autenticação
// - Remove lógica de permissões (movida para useActiveUnit)
// - Retorna dados básicos do usuário
// - Chama RPC authenticate_user com fallback SQL
```

### useActiveUnit.tsx - Fonte Única de Verdade

```typescript
interface UnitModule {
  id: string;
  module_name: string;
  unit_id: string;
}

// ✅ IMPLEMENTADO: Gerenciamento centralizado de permissões
const useActiveUnit = () => {
  // Super Admin: loadUnitModules() - todos os módulos da unidade ativa
  // Admin: loadUnitModules() - módulos habilitados na unidade
  // Atendente: loadAtendantModules() - módulos específicos liberados
  
  return {
    activeUnit,
    setActiveUnit,
    availableModules, // Array de módulos disponíveis
    units,
    loading
  };
};
```

### useAllowedModules.tsx - Filtro de Menu

```typescript
// ✅ IMPLEMENTADO: Filtragem hierárquica do menu
const useAllowedModules = () => {
  const { user } = useAuth();
  const { activeUnit, availableModules, loading } = useActiveUnit();
  
  // Super Admin: módulos super admin + módulos da unidade
  // Admin/Atendente: apenas módulos disponíveis da unidade
  
  return {
    allowedModules, // MenuItems filtrados
    loading
  };
};
```

## Lógica de Permissões por Tipo de Usuário

### 🔴 Super Admin (level: 100)

```typescript
// Sempre inclui módulos especiais
const superAdminModules = ['super-admin', 'gestao-unidades'];

// Adiciona módulos da unidade ativa selecionada
const unitModules = availableModules.map(m => m.module_name);
const allModules = [...superAdminModules, ...unitModules];
```

### 🟡 Admin (level: 80)

```sql
-- Busca todos os módulos habilitados na unidade
SELECT m.name as module_name, um.unit_id
FROM unit_modules um
JOIN modules m ON m.id = um.module_id
WHERE um.unit_id = $1 AND um.is_active = true;
```

### 🟢 Atendente (level: 30)

```sql
-- Busca apenas módulos especificamente liberados
SELECT m.name as module_name, ump.unit_id
FROM user_module_permissions ump
JOIN modules m ON m.id = ump.module_id
WHERE ump.user_id = $1 
  AND ump.unit_id = $2 
  AND ump.is_active = true;
```
  role: string;
  is_super_admin?: boolean;
  unit_id?: string;
  unit_name?: string;
  allowed_modules?: string[]; // Módulos permitidos para a unidade
}

// Funcionalidades implementadas:
// - Login com validação de credenciais
// - Carregamento automático de unidade e módulos
// - Detecção de super_admin
// - Armazenamento em localStorage
// - Logs detalhados para debugging
```

### useAllowedModules.tsx

```typescript
// Filtro dinâmico de módulos baseado nas permissões:
// - Super Admin: Todos os módulos (bypass)
// - Outros roles: Apenas módulos da unidade
// - Mapeamento de IDs do menu para nomes no banco
// - Retorna menuItems filtrados

interface AllowedModulesReturn {
  allowedMenuItems: MenuItem[];
  isLoading: boolean;
}
```

## Fluxo de Autenticação

```mermaid
graph TD
    A[Login Form] --> B[useAuth.login()]
    B --> C{Validar Credenciais}
    C -->|Inválido| D[Erro de Login]
    C -->|Válido| E[Buscar Dados do Usuário]
    E --> F{É Super Admin?}
    F -->|Sim| G[Carregar Todos Módulos]
    F -->|Não| H[Buscar Unidade do Usuário]
    H --> I[Buscar Módulos da Unidade]
    I --> J{Tem Módulos?}
    J -->|Não| K[allowed_modules: vazio]
    J -->|Sim| L[Carregar Lista de Módulos]
    G --> M[Montar Objeto User]
    K --> M
    L --> M
    M --> N[Salvar localStorage]
    N --> O[Redirecionar Dashboard]
```

## Componentes Principais

### AppSidebarMenu.tsx
- Renderização dinâmica baseada em useAllowedModules
- Estado de loading durante carregamento
- Fallback "Nenhum módulo disponível" quando vazio
- Suporte completo a ícones e categorias

### GestaoUnidadesModule.tsx
- Interface completa para Super Admin
- 4 Abas: Dados, Módulos, Usuários, Logs
- CRUD completo de unidades
- Criação de usuários como "Atendente" por padrão
- Configuração de módulos por unidade
- Sistema de vinculação usuário-unidade

## Estado Atual - 15/08/2025

### ✅ Funcionalidades Implementadas
- [x] Sistema de roles hierárquico (Super Admin > Admin > Atendente)
- [x] Database schema completo com foreign keys corretas
- [x] Interface de gestão de unidades com 4 abas
- [x] Criação automática de usuários como "Atendente"
- [x] Vinculação de usuários às unidades (foreign key corrigida)
- [x] Hook useAuth com carregamento de permissões
## Dados de Teste Configurados

### Usuários de Teste

```sql
-- ✅ CONFIGURADO: Usuários para teste do sistema hierárquico
INSERT INTO users (id, email, nome, role_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'jeanpetri@gmail.com', 'Jean Petri', '550e8400-e29b-41d4-a716-446655440003'), -- Super Admin
('550e8400-e29b-41d4-a716-446655440002', 'admin@mariaflow.com', 'Admin MariaFlow', '550e8400-e29b-41d4-a716-446655440002'), -- Admin
('550e8400-e29b-41d4-a716-446655440004', 'atendente@mariaflow.com', 'Atendente Teste', '550e8400-e29b-41d4-a716-446655440001'), -- Atendente
('550e8400-e29b-41d4-a716-446655440005', 'lucas@email.com', 'Lucas Silva', '550e8400-e29b-41d4-a716-446655440001'); -- Atendente
```

### Permissões Específicas Configuradas

```sql
-- ✅ CONFIGURADO: Atendente com acesso a Dashboard + Clientes
atendente@mariaflow.com:
- Dashboard (unidade: MB Drome)
- Clientes (unidade: MB Drome)

-- ✅ CONFIGURADO: Atendente com acesso estendido
lucas@email.com:
- Dashboard (unidade: MB Drome)
- Clientes (unidade: MB Drome)
- Agenda (unidade: MB Drome)
```

### Módulos da Unidade (Admin)

```sql
-- ✅ CONFIGURADO: MB Drome tem todos os módulos habilitados
Unit "MB Drome" modules:
- Dashboard, Agenda, Agendamentos, Clientes, Pipeline, Tickets
- Profissionais, Financeiro, Cashback, Materiais, Materiais Marketing
- Uniformes, Publicações, Recrutadora, Base Conhecimento
- MariaUni, Configuração Módulos
```

## Status de Implementação

### ✅ Funcionalidades Implementadas

- [x] **Database Schema Completo**: Todas as tabelas criadas e relacionadas
- [x] **Sistema de Roles**: 3 níveis hierárquicos (Super Admin 100, Admin 80, Atendente 30)
- [x] **Super Admin System**: Controle total + módulos específicos
- [x] **Admin Unit Modules**: Acesso a todos os módulos da unidade
- [x] **Atendente Permissions**: Controle granular por módulo individual
- [x] **Hook useAuth**: Autenticação pura, dados básicos do usuário
- [x] **Hook useActiveUnit**: Fonte única de verdade para permissões
- [x] **Hook useAllowedModules**: Filtro hierárquico do menu
- [x] **Hierarchical Logic**: Lógica diferenciada por tipo de usuário
- [x] **Test Data**: Usuários e permissões configurados para teste
- [x] **Frontend Integration**: Sidebar renderiza módulos filtrados

### 🔧 Configuração Atual

#### Sistema Funcionando
- **Super Admin**: Vê módulos super admin + módulos da unidade ativa
- **Admin**: Vê todos os módulos habilitados na unidade (unit_modules)
- **Atendente**: Vê apenas módulos específicos liberados (user_module_permissions)

#### Fluxo de Dados Validado
```
Login → useAuth (user data) → useActiveUnit (permissions) → useAllowedModules (filter) → Sidebar (render)
```

#### Queries Validadas
- **Super Admin**: Sempre inclui ['super-admin', 'gestao-unidades'] + módulos da unidade
- **Admin**: SELECT unit_modules WHERE unit_id = active_unit
- **Atendente**: SELECT user_module_permissions WHERE user_id + unit_id

### 🎯 Pronto para Teste

**Usuários para Testar**:
1. `jeanpetri@gmail.com` - Super Admin (deve ver todos os módulos)
2. `admin@mariaflow.com` - Admin (deve ver módulos da unidade)
3. `atendente@mariaflow.com` - Atendente (só Dashboard + Clientes)
4. `lucas@email.com` - Atendente (Dashboard + Clientes + Agenda)

**URL de Teste**: http://localhost:8081/

## Estrutura do Frontend

### Organização de Arquivos
```
src/
├── components/
│   ├── ui/ (shadcn/ui components)
│   ├── sidebar/ (navigation components)
│   ├── AppSidebarMenu.tsx (renderização hierárquica)
│   ├── AgendaModule.tsx, ClientsModule.tsx, etc.
│   └── [outros módulos específicos]
├── hooks/
│   ├── useAuth.tsx (autenticação)
│   ├── useActiveUnit.tsx (permissões - fonte única)
│   ├── useAllowedModules.tsx (filtro de menu)
│   └── [outros hooks]
├── data/
│   └── menuItems.ts (estrutura do menu)
├── pages/
│   ├── Index.tsx (dashboard)
│   └── LoginPage.tsx
└── integrations/supabase/
    ├── client.ts
    └── types.ts
```

### Tecnologias Utilizadas

**Frontend**:
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- Lucide React (icons)

**Backend**:
- Supabase (BaaS)
- PostgreSQL
- Row Level Security (planejado)

**Desenvolvimento**:
- ESLint + TypeScript
- Git + GitHub

## Contas de Teste

### Super Admin
- **Email**: admin@sistema.com
- **Senha**: 123456
- **Acesso**: Todos os módulos + Gestão de Unidades

### Admin de Unidade
- **Email**: admin.filial1@sistema.com  
- **Senha**: 123456
- **Unidade**: Filial Centro
- **Módulos**: Dashboard, Pipeline, Clientes

### Atendente
- **Email**: atendente.teste@sistema.com
- **Senha**: 123456
- **Unidade**: Filial Centro  
- **Módulos**: Apenas Pipeline (PROBLEMA: vendo todos)

## Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- Conta Supabase

### Setup Local
```bash
# Clone do repositório
git clone <repository-url>
cd mariaflow-projeto-main

# Instalação de dependências  
npm install

# Configuração do Supabase
# Copie .env.example para .env
# Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

# Executar migrações
supabase db push

# Iniciar desenvolvimento
npm run dev
```

### Variáveis de Ambiente
```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## Roadmap de Desenvolvimento

### Versão 1.0 - Básica (Atual)
- [x] Sistema de autenticação
- [x] Gestão de unidades (Super Admin)
- [x] Criação de usuários
- [ ] **Filtro de módulos (CRÍTICO - em desenvolvimento)**

### Versão 1.1 - Melhorias
- [ ] RLS policies completas
- [ ] Sistema de auditoria avançado
- [ ] Interface responsiva mobile
- [ ] Testes automatizados

### Versão 2.0 - Expansão
- [ ] App mobile
- [ ] APIs REST públicas
- [ ] Integrações externas (WhatsApp, etc.)
- [ ] Sistema de relatórios avançado

## Debugging e Logs

### Console Logs Implementados
- useAuth: Login, carregamento de unidade e módulos
- useAllowedModules: Recebimento e filtragem de módulos
- AppSidebarMenu: Renderização de itens filtrados

### Como Debugar
1. Abra as ferramentas do desenvolvedor
2. Faça login com usuário de teste
3. Monitore console para fluxo de dados
4. Verifique localStorage para dados salvos

### Comandos Úteis
```sql
-- Verificar módulos de uma unidade
SELECT m.name, m.display_name 
FROM unit_modules um
JOIN modules m ON um.module_id = m.id
WHERE um.unit_id = 'uuid-da-unidade' AND um.is_active = true;

-- Verificar usuário e unidade
SELECT u.email, u.name, uua.unit_id, un.name as unit_name
FROM users u
JOIN user_unit_assignments uua ON u.id = uua.user_id  
JOIN units un ON uua.unit_id = un.id
WHERE u.email = 'email@teste.com';
```

## Considerações de Segurança

### Implementadas
- Hash de senhas (planejado com bcrypt)
- Validação de foreign keys no banco
- Separação de roles e permissões

### Planejadas
- Row Level Security (RLS) policies
- Validação JWT mais robusta
- Rate limiting
- Auditoria completa de ações

---

*Esta documentação reflete o estado atual do sistema em 15/08/2025. O problema crítico de filtro de módulos está sendo ativamente investigado com debugging extensivo implementado.*
