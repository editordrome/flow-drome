# MariaFlow - Sistema de Gestão para Franquias

Sistema de gestão completo para **franquias**, permitindo controle centralizado de múltiplas unidades com governança empresarial e modularidade flexível.

## 🚀 Status do Projeto

**✅ SISTEMA DE PERMISSÕES HIERÁRQUICAS IMPLEMENTADO (Agosto 2025)**

- Sistema de autenticação completo com 3 níveis hierárquicos
- Sidebar dinâmica baseada em permissões por usuário/unidade
- Gestão de unidades e módulos via Super Admin
- Arquitetura robusta com fallbacks e validações

## 🏗️ Arquitetura Tecnológica

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions + Auth)
- **UI Framework**: Shadcn/ui + Lucide React Icons
- **Estado**: TanStack Query (React Query v5)
- **Charts**: Recharts
- **Autenticação**: Sistema customizado com RLS (Row Level Security)

## 🔐 Sistema de Autenticação

### Hierarquia de Usuários

1. **Super Admin (level 100)**
   - Acesso global a todas as unidades
   - Módulos específicos: Super Admin Dashboard + Gestão de Unidades
   - Pode gerenciar todo o sistema

2. **Admin (level 80)**
   - Acesso às unidades onde está vinculado
   - Todos os módulos ativos da unidade
   - Pode gerenciar usuários da unidade

3. **Atendente (level 30)**
   - Acesso às unidades onde está vinculado
   - Apenas módulos especificamente permitidos
   - Acesso granular controlado pelo Admin

### Usuários Configurados

```bash
# Super Admin
Email: jeanpetri@gmail.com
Senha: DRom@29011725

# Admin de Teste
Email: admin@mariaflow.com
Senha: admin123

# Atendentes de Teste
Email: atendente@mariaflow.com
Senha: atendente123

Email: lucas@email.com
Senha: lucas123
```

## 📊 Estrutura de Banco de Dados

### Tabelas Principais (20 total)

#### Autenticação e Usuários
- `users` - Usuários com roles e status
- `roles` - Papéis hierárquicos (levels 30, 80, 100)
- `super_admins` - Super administradores
- `user_units` - Relacionamento usuário-unidade (legacy)
- `user_unit_assignments` - Associações hierárquicas usuário-unidade
- `user_module_permissions` - Permissões granulares por módulo

#### Estrutura Organizacional
- `companies` - Empresas/franquias
- `units` - Unidades/filiais com métricas
- `company_members` - Membros com papéis
- `modules` - Catálogo de módulos (16 módulos)
- `unit_modules` - Controle de ativação por unidade

#### Dados Operacionais
- `resultados` - Dados financeiros (11,888+ registros)
- `profissionais` - Gestão de profissionais
- `recruta` - Sistema de recrutamento
- `table_status` - Status de agendamentos
- `sua_tabela` - Configurações gerais

#### Sistema e Governança
- `activity_logs` - Logs de atividade
- `module_configurations` - Configurações JSONB
- `unit_metrics` - Métricas de performance
- `unit_keys` - Chaves de integração

## 🎯 Módulos do Sistema

### Core (Não desativáveis)
- **Dashboard** - Painel principal
- **Usuários** - Gestão de usuários

### Atendimento
- **Agenda** - Calendário e agendamentos
- **Clientes** - Gestão de clientes
- **Pipeline** - Funil de vendas (Kanban)
- **Tickets** - Central de suporte

### Financeiro
- **Financeiro** - Dashboard financeiro
- **Cashback** - Sistema de recompensas

### Gestão
- **Profissionais** - Gestão de profissionais
- **Materiais** - Controle de estoque
- **Uniformes** - Gestão de uniformes

### Marketing
- **Marketing** - Criação de materiais
- **Publicações** - Gestão de publicações

### Educação
- **MariaUni** - Treinamentos
- **Base de Conhecimento** - Documentação

### RH
- **Recrutadora** - Sistema de recrutamento

### Super Admin
- **Super Admin Dashboard** - Painel de administração global
- **Gestão de Unidades** - Gerenciamento de unidades e permissões

## 🔧 Hooks Principais

### `useAuth()`
Hook principal de autenticação:
```typescript
const { user, login, logout, isLoading, isLoggedIn } = useAuth();
```

### `useActiveUnit()`
Gerenciamento hierárquico de unidades e módulos:
```typescript
const { 
  activeUnit, 
  userUnits, 
  availableModules, 
  loading, 
  switchUnit, 
  refreshModules 
} = useActiveUnit();
```

### `useAllowedModules()`
Filtragem dinâmica do menu da sidebar:
```typescript
const allowedModules = useAllowedModules();
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ ou Bun
- Acesso ao projeto Supabase configurado

### Instalação
```bash
# Clone o repositório
git clone [repository-url]
cd mariaflow-projeto-main

# Instale dependências
npm install
# ou
bun install

# Inicie o servidor de desenvolvimento
npm run dev
# ou
bun dev
```

### Acesso
- **URL Local**: http://localhost:8080
- **Login**: Use as credenciais configuradas acima
- **Teste**: Faça login com diferentes usuários para ver as permissões

## 📁 Estrutura de Arquivos

```
src/
├── components/           # Componentes React
│   ├── ui/              # Shadcn/ui base
│   ├── SuperAdminDashboard.tsx
│   ├── GestaoUnidadesModule.tsx
│   └── [Module]Module.tsx
├── hooks/               # React Hooks
│   ├── useAuth.tsx
│   ├── useActiveUnit.tsx
│   └── useAllowedModules.tsx
├── pages/               # Páginas
│   ├── Index.tsx
│   └── LoginPage.tsx
├── data/                # Dados mock
├── lib/                 # Utilitários
└── integrations/        # Supabase client
```

## 🔍 Fluxo de Permissões

```
1. Login (useAuth) → Valida credenciais
2. Carregamento (useActiveUnit) → Define unidades e módulos
3. Filtragem (useAllowedModules) → Filtra menu da sidebar
4. Renderização (AppSidebarMenu) → Mostra apenas módulos permitidos
```

## 📈 Dados de Teste

### Unidades Operacionais
- **MB Drome** (unidade padrão Super Admin)
- **MB Londrina** (vinculada ao Admin)
- **MariaFlow Matriz** (CNPJ: 12.345.678/0001-90)
- **MariaFlow Filial Norte** (CNPJ: 12.345.678/0002-71)

### Permissões Configuradas
- **Super Admin**: Acesso total
- **Admin**: Módulos da unidade MB Londrina
- **Atendentes**: Dashboard + Clientes (+ Agenda para lucas@email.com)

## 🛠️ Suporte e Desenvolvimento

### Logs de Debug
O sistema inclui logs detalhados no console para debug:
- Carregamento de usuários e unidades
- Validação de permissões
- Filtragem de módulos

### Ferramentas de Desenvolvimento
- **TypeScript**: Tipagem estrita
- **ESLint**: Linting de código
- **Tailwind**: Styling consistente
- **Vite**: Build rápido e HMR

---

**Sistema MariaFlow - Gestão Inteligente para Franquias** 🚀

*Desenvolvido com React 18, TypeScript e Supabase*
