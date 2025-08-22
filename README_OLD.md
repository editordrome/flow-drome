# MariaFlow - Sistema de Gestão de Franquias

> 🎯 **Sistema completo de gestão para franquias** permitindo controle centralizado de múltiplas unidades com governança empresarial e modularidade flexível.

**Status**: ✅ **Sistema 100% Operacional** - Última atualização: 22/08/2025

## 🚀 Funcionalidades Principais

### ✅ Sistema de Autenticação Completo (Implementado Agosto 2025)
- **Login/Logout Funcional**: Sistema customizado via PostgreSQL com fallback duplo
- **Proteção de Rotas**: Redirecionamento automático para usuários não autenticados
- **Sessão Persistente**: Mantém usuário logado via localStorage
- **Menu de Usuário**: Dropdown no header com informações e logout
- **Função PostgreSQL**: `authenticate_user(email, password)` com hash seguro

### ✅ Sistema de Permissões Hierárquicas
- **🔴 Super Admin (level 100)**: Acesso total + módulos especiais (Super Admin Dashboard, Gestão Unidades)
- **🟡 Administrador (level 80)**: Acesso aos módulos habilitados na unidade (table: unit_modules)  
- **🟢 Atendente (level 30)**: Acesso granular aos módulos específicos liberados (table: user_module_permissions)

### ✅ Sistema de Gestão de Unidades (Completo)
- **Cadastro e Edição**: Interface completa para gerenciar unidades/filiais
- **Vinculação de Usuários**: Sistema hierárquico de associação usuário-unidade
- **Gestão de Módulos**: Controle por unidade de quais módulos estão ativos
- **Interface de Chaves**: Gestão de APIs e integrações por unidade (Agosto 2025)
- **Criação de Usuários**: Super Admin pode criar e vincular usuários diretamente
- **Logs de Atividade**: Auditoria completa de ações no sistema

### ✅ Módulos Implementados (17 módulos ativos)

## 📊 **Estado Atual do Sistema**

### 🎯 **Métricas Operacionais**
- ✅ **5 usuários** ativos no sistema
- ✅ **4 unidades** operacionais 
- ✅ **17 módulos** funcionando normalmente
- ✅ **21 tabelas** de banco de dados íntegras
- ✅ **Workspace limpo** - 25+ arquivos obsoletos removidos

### 🔐 **Usuários Configurados**
- **Super Admin**: jeanpetri@gmail.com 
- **Admin**: admin@mariaflow.com 
- **3 usuários** adicionais em diferentes unidades

### 🏢 **Unidades Ativas**
- **MariaFlow Matriz** (CNPJ: 12.345.678/0001-90)
- **MariaFlow Filial Norte** (CNPJ: 12.345.678/0002-71)
- **MB Drome** - Unidade operacional
- **MB Londrina** - Unidade operacional

**MariaFlow** - Sistema de Gestão de Franquias © 2025  
🚀 **Desenvolvido com React 18, TypeScript, Vite, Tailwind CSS e Supabase**

**Status**: ✅ **Sistema 100% Operacional** - Pronto para produção  
**Última Atualização**: 22 de Agosto de 2025

**Status**: ✅ **Sistema 100% Operacional** - Última atualização: 19/08/2025

## 🚀 Funcionalidades Principais

### ✅ Sistema de Autenticação Completo (Implementado Agosto 2025)
- **Login/Logout Funcional**: Sistema customizado via PostgreSQL com fallback duplo
- **Proteção de Rotas**: Redirecionamento automático para usuários não autenticados
- **Sessão Persistente**: Mantém usuário logado via localStorage
- **Menu de Usuário**: Dropdown no header com informações e logout
- **Função PostgreSQL**: `authenticate_user(email, password)` com hash seguro

### ✅ Sistema de Permissões Hierárquicas
- **🔴 Super Admin (level 100)**: Acesso total + módulos especiais (Super Admin Dashboard, Gestão Unidades)
- **🟡 Administrador (level 80)**: Acesso aos módulos habilitados na unidade (table: unit_modules)  
- **🟢 Atendente (level 30)**: Acesso granular aos módulos específicos liberados (table: user_module_permissions)

### ✅ Sistema de Gestão de Unidades (Completo)
- **Cadastro e Edição**: Interface completa para gerenciar unidades/filiais
- **Vinculação de Usuários**: Sistema hierárquico de associação usuário-unidade
- **Gestão de Módulos**: Controle por unidade de quais módulos estão ativos
- **Interface de Chaves**: Gestão de APIs e integrações por unidade (Agosto 2025)
- **Criação de Usuários**: Super Admin pode criar e vincular usuários diretamente
- **Logs de Atividade**: Auditoria completa de ações no sistema

### ✅ Módulos Implementados (17 módulos ativos)

**🔴 Módulos Super Admin:**
- **Super Admin Dashboard**: Visão global do sistema com estatísticas
- **Gestão de Unidades**: Controle completo de todas as unidades

**🟡 Módulos Core (sempre ativos):**
- **Dashboard**: Visão geral da unidade ativa
- **Usuários**: Gestão de usuários da unidade

**🟡 Módulos de Atendimento:**
- **Agenda**: Sistema completo de agendamentos  
- **Clientes**: Cadastro e gestão de clientes
- **Pipeline**: Gestão de leads e oportunidades Kanban
- **Tickets**: Sistema de suporte e atendimento

**🟡 Módulos Financeiros:**
- **Financeiro**: Dashboard financeiro completo
- **Cashback**: Sistema de recompensas

**🟡 Módulos de Gestão:**
- **Profissionais**: Gestão de equipe e colaboradores
- **Materiais**: Controle de estoque e materiais
- **Uniformes**: Gestão de uniformes

**🟡 Módulos de Marketing:**
- **Marketing**: Criação de materiais promocionais
- **Publicações**: Gestão de conteúdo

**🟡 Módulos Educacionais:**
- **MariaUni**: Sistema educacional e treinamentos
- **Base Conhecimento**: Documentação e manuais

**🟡 Módulos de RH:**
- **Recrutadora**: Processo seletivo e recrutamento

## 🏗️ Arquitetura Técnica

### ✅ Frontend Moderno
- **React 18** com TypeScript para type safety
- **Vite** para build ultrarrápido e desenvolvimento  
- **Tailwind CSS** + **shadcn/ui** para interface moderna e consistente
- **Lucide React** para iconografia profissional
- **TanStack Query (React Query v5)** para gerenciamento de estado server
- **Recharts** para visualizações e dashboards

### ✅ Backend Robusto
- **Supabase** (PostgreSQL + Edge Functions + Auth)
- **Row Level Security (RLS)** para segurança granular
- **Sistema Hierárquico de Roles** (3 níveis de permissão)
- **Foreign Keys** e constraints para integridade de dados
- **Funções PostgreSQL** para autenticação customizada
- **Extensão pgcrypto** para hash seguro de senhas

### ✅ Database Schema Completo (20 tabelas)
```sql
-- 📊 ESTRUTURA PRINCIPAL IMPLEMENTADA (20 TABELAS)

-- Autenticação e Usuários
users                    -- Usuários do sistema (senhas hasheadas)
roles                    -- Roles hierárquicos (30, 80, 100)
super_admins            -- Controle de super administradores
user_units              -- Relacionamento usuário-unidade (many-to-many)
user_unit_assignments   -- Associações usuário-unidade hierárquicas
user_module_permissions -- Permissões granulares por usuário/módulo/unidade

-- Estrutura Organizacional
companies               -- Empresas/franquias (governance_settings)
units                   -- Unidades/filiais (performance_score, CNPJ)
company_members         -- Membros da empresa com papéis
unit_keys              -- Chaves de integração e APIs por unidade

-- Sistema e Módulos
modules                 -- Módulos do sistema (17 módulos ativos)
unit_modules           -- Módulos habilitados por unidade (controle Super Admin)
module_configurations  -- Configurações JSONB por módulo
activity_logs          -- Logs de atividade (auditoria completa)

-- Dados Operacionais
table_status           -- Status de agendamentos e serviços
resultados            -- Resultados financeiros (11,888+ registros)
recruta               -- Sistema de recrutamento
profissionais         -- Profissionais por unidade
unit_metrics          -- Métricas de performance das unidades
sua_tabela           -- Configurações gerais do sistema
```

## 🎯 Arquitetura de Permissões

### Fluxo de Dados Implementado
```
Database (permissions) → useActiveUnit (logic) → useAllowedModules (filter) → Sidebar (render)
```

### Lógica por Tipo de Usuário
- **🔴 Super Admin**: Módulos especiais + módulos da unidade ativa
- **🟡 Admin**: Todos os módulos habilitados na unidade (unit_modules)
- **🟢 Atendente**: Apenas módulos específicos liberados (user_module_permissions)

## 🔧 Hooks Principais (Arquitetura de Estado)

### useAuth.tsx ✅ Implementado
```typescript
// Sistema de autenticação customizado
- login(email, password): Autenticação via RPC + fallback SQL
- logout(): Limpeza completa de sessão + recarregamento
- user: Estado do usuário (id, email, nome, role, is_super_admin)
- isLoading: Estado de carregamento
- isLoggedIn: Status de autenticação
```

### useActiveUnit.tsx ✅ Implementado
```typescript
// Fonte única de verdade para permissões e módulos
- activeUnit: Unidade ativa do usuário
- userUnits: Lista de unidades acessíveis
- availableModules: Módulos permitidos (lógica por role)
- loadAvailableModules(): Lógica diferenciada por role level
- switchUnit(): Troca de unidade ativa
- refreshModules(): Recarregamento de módulos
```

### useAllowedModules.tsx ✅ Implementado
```typescript
// Filtro hierárquico do menu lateral
- allowedModules: Array filtrado de itens do menu
- Integração com estrutura de MenuItems
- Renderização condicional da sidebar
- Lógica por tipo de usuário (Super Admin, Admin, Atendente)
```

## 📁 Estrutura do Projeto (Agosto 2025)

```
src/
├── components/                    # Componentes React
│   ├── ui/                       # shadcn/ui base components
│   ├── sidebar/                  # AppSidebar, MenuItems, etc
│   ├── SuperAdminDashboard.tsx   # ✨ Painel Super Admin completo
│   ├── GestaoUnidadesModule.tsx  # ✨ Gestão completa de unidades
│   ├── UserCreationModal.tsx     # ✨ Modal para criar usuários
│   ├── ModernHeader.tsx          # ✨ Header com menu de usuário
│   ├── financial/                # Módulos financeiros
│   ├── professionals/            # Gestão de profissionais
│   ├── pipeline/                 # Sistema Kanban
│   └── [ModuleName]Module.tsx    # Módulos específicos
├── hooks/                        # Custom hooks
│   ├── useAuth.tsx              # ✨ Sistema de autenticação
│   ├── useActiveUnit.tsx        # ✨ Gestão de unidades e módulos
│   ├── useAllowedModules.tsx    # ✨ Filtro de módulos
│   └── *.tsx                    # Outros hooks utilitários
├── pages/
│   ├── Index.tsx                # Página principal
│   ├── LoginPage.tsx            # ✨ Página de login moderna
│   └── NotFound.tsx             # 404
├── integrations/
│   └── supabase/                # Cliente Supabase configurado
└── lib/                         # Utilitários e helpers
```
## 🛠️ Instalação e Desenvolvimento

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta Supabase (configurada)

### Setup Completo
```bash
# 1. Clonar o repositório
git clone https://github.com/editordrome/flow-drome.git
cd mariaflow-projeto-main

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
# Criar arquivo .env com:
VITE_SUPABASE_URL=https://mstjpohsemoxbgwjklby.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# 4. Iniciar desenvolvimento
npm run dev
# Servidor disponível em: http://localhost:8081/
```

### Scripts Disponíveis
```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Build para produção
npm run build:dev    # Build modo desenvolvimento
npm run lint         # Verificação de código
npm run preview      # Preview do build
```

### Estrutura de Login
```bash
# Acesso ao sistema:
# URL: http://localhost:8081/
# 
# Super Admin:
# Email: jeanpetri@gmail.com
# Senha: DRom@29011725
#
# Admin:
# Email: admin@mariaflow.com  
# Senha: admin123
```

## 🎯 Arquitetura de Permissões (Implementada)

### Fluxo de Dados
```
🗄️ Database (permissions) 
    ↓
🔧 useActiveUnit (business logic) 
    ↓ 
🎛️ useAllowedModules (filter menu) 
    ↓
🎨 Sidebar (render modules)
```

### Lógica por Tipo de Usuário
```typescript
// 🔴 Super Admin (level 100)
- Módulos especiais: ['super-admin', 'gestao-unidades']
- + Todos os módulos da unidade ativa
- Acesso global: Todas as unidades

// 🟡 Admin (level 80) 
- Módulos da unidade: unit_modules WHERE unit_id = active_unit.id
- + Módulo especial: 'configuracao-admin'
- Acesso restrito: Unidades vinculadas

// 🟢 Atendente (level 30)
- Módulos específicos: user_module_permissions 
- WHERE user_id = current_user.id AND unit_id = active_unit.id
- + Módulos core sempre liberados (Dashboard)
- Acesso limitado: Apenas unidade vinculada
```

## 🔐 Usuários Configurados (Sistema Ativo)

### 🔴 Super Admin
```
Email: jeanpetri@gmail.com
Senha: DRom@29011725
Nome: Jean Petri
Role: Super Administrador (level 100)
Acesso: Todos os módulos + Super Admin Dashboard + Gestão Unidades
Status: ✅ Ativo
```

### 🟡 Admin de Unidade  
```
Email: admin@mariaflow.com
Senha: admin123
Nome: Admin MariaFlow
Role: Administrador (level 80)
Unidade: MB Londrina
Acesso: Todos os módulos habilitados na unidade
Status: ✅ Ativo
```

### Sistema de Login
- **URL de Acesso**: http://localhost:8081/
- **Autenticação**: Função PostgreSQL `authenticate_user(email, password)`
- **Fallback**: Consulta SQL direta se RPC falhar
- **Segurança**: Senhas hasheadas com pgcrypto (função crypt)
- **Sessão**: Persistente via localStorage + contexto React

## 🚧 Status Atual do Projeto

### ✅ SISTEMA 100% OPERACIONAL (19/08/2025)

**🎯 Sistema de Autenticação Completo**
- [x] **Login/Logout Funcional**: Sistema customizado via PostgreSQL + fallback
- [x] **Proteção de Rotas**: Redirecionamento automático para não autenticados
- [x] **Sessão Persistente**: localStorage + contexto React funcionando
- [x] **Menu de Usuário**: Dropdown no header com logout
- [x] **Segurança**: Senhas hasheadas + validação server-side

**🎯 Sistema de Permissões Hierárquicas**
- [x] **3 Níveis de Usuário**: Super Admin (100) → Admin (80) → Atendente (30)
- [x] **Database Schema**: 20 tabelas criadas e relacionadas
- [x] **Hooks Refatorados**: useAuth, useActiveUnit, useAllowedModules
- [x] **Lógica Hierárquica**: Diferenciada por role level
- [x] **Sidebar Dinâmica**: Renderização baseada em permissões

**🎯 Funcionalidades Super Admin**
- [x] **Super Admin Dashboard**: Painel com visão global do sistema
- [x] **Gestão de Unidades**: Interface completa com 4 tabs (Dados, Módulos, Usuários, Chaves)
- [x] **Criação de Usuários**: Modal para criar e vincular usuários às unidades
- [x] **Gestão de Módulos**: Toggle para ativar/desativar módulos por unidade
- [x] **Chaves & Integrações**: Sistema CRUD para APIs e integrações por unidade

**🎯 Sistema de Vinculação**
- [x] **Criação Automática**: Usuários criados são automaticamente vinculados
- [x] **Gestão Hierárquica**: Super Admin → Admin → Atendente
- [x] **Interface Completa**: Formulários validados e feedback visual
- [x] **RLS Policies**: Políticas de segurança implementadas

### 📊 Dados Configurados e Funcionais
- **Usuários**: 5 usuários ativos (1 Super Admin, 1 Admin, 3 outros)
- **Unidades**: 4 unidades operacionais (Matriz, Norte, MB Drome, MB Londrina)
- **Módulos**: 17 módulos categorizados e funcionais
- **Permissões**: Sistema granular implementado e testado
- **Chaves**: 1 chave de exemplo configurada (sistema funcional)

### 🎯 AMBIENTE DE DESENVOLVIMENTO
- **Interface**: http://localhost:8081/ ✅ Funcionando
- **Build**: npm run dev ✅ Sem erros
- **Database**: Supabase PostgreSQL ✅ Conectado
- **Autenticação**: Sistema customizado ✅ Validado
- **Permissões**: Hierarquia testada ✅ Operacional

### 🧹 Workspace Limpo (19/08/2025)
- [x] **17 arquivos de debug/teste removidos** para backup_debug_files/
- [x] **Nenhuma referência quebrada** no código de produção
- [x] **Sistema íntegro** após limpeza
- [x] **Documentação atualizada** com estado atual

## 🔄 Histórico de Atualizações

### 📅 19/08/2025 - Limpeza e Organização do Workspace
- ✅ **Remoção de Debug Files**: 17 arquivos de debug/teste movidos para backup
- ✅ **Workspace Limpo**: Apenas código de produção e documentação essencial
- ✅ **Documentação Atualizada**: README completamente reformulado com estado atual
- ✅ **Sistema Validado**: Todas as funcionalidades testadas após limpeza

### 📅 18/08/2025 - Sistema de Chaves & Integrações
- ✅ **Interface de Chaves**: Tab "Chaves & Integrações" na Gestão de Unidades
- ✅ **CRUD Completo**: Criar, editar, ativar/desativar chaves por unidade
- ✅ **Tabela unit_keys**: Estrutura para APIs e integrações
- ✅ **RLS Policies**: Segurança implementada para acessos

### 📅 18/08/2025 - Sistema de Vinculação de Usuários
- ✅ **Criação de Usuários**: Super Admin pode criar usuários via interface
- ✅ **Vinculação Automática**: Usuários automaticamente associados à unidade
- ✅ **Modal Completo**: Formulário validado com feedback visual
- ✅ **Gestão de Roles**: Sistema com 3 níveis hierárquicos

### 📅 17/08/2025 - Super Admin Dashboard Completo
- ✅ **Painel Super Admin**: Interface com gestão de unidades, módulos e usuários
- ✅ **Sistema de Toggles**: Ativação/desativação de módulos por unidade
- ✅ **Dashboard Toggle**: Removida restrição do módulo Dashboard
- ✅ **Interface Moderna**: Tabs, busca, filtros e contadores

### 📅 16/08/2025 - Sistema de Autenticação Completo
- ✅ **Login/Logout**: Sistema funcional via PostgreSQL + fallback
- ✅ **Proteção de Rotas**: Redirecionamento automático para não autenticados
- ✅ **Menu de Usuário**: Dropdown no header com informações e logout
- ✅ **Função PostgreSQL**: `authenticate_user(email, password)` implementada
- ✅ **Segurança**: Hash de senhas com pgcrypto

### � 15/08/2025 - Sistema de Permissões Hierárquicas
- ✅ **20 Tabelas**: Estrutura completa do banco de dados
- ✅ **3 Níveis de Permissão**: Super Admin → Admin → Atendente
- ✅ **Hooks Refatorados**: useAuth, useActiveUnit, useAllowedModules
- ✅ **Sidebar Dinâmica**: Renderização baseada em permissões
- ✅ **RLS Policies**: Row Level Security implementado

## 📊 Métricas do Sistema (Agosto 2025)

### Base de Dados
- **📊 Tabelas**: 20 tabelas operacionais
- **👥 Usuários**: 5 usuários ativos (1 Super Admin, 1 Admin, 3 outros)
- **🏢 Unidades**: 4 unidades configuradas
- **🧩 Módulos**: 17 módulos categorizados
- **🔐 Permissões**: Sistema granular implementado
- **📈 Resultados**: 11,888+ registros financeiros

### Performance
- **⚡ Build Time**: ~3-5 segundos (Vite)
- **🔄 Hot Reload**: <1 segundo
- **📱 Responsivo**: Mobile-first design
- **🔒 Segurança**: RLS + Hash + Validação server-side
- **🌐 Browser Support**: Navegadores modernos

## 🤝 Contribuição

### Processo de Desenvolvimento
1. **Fork** o projeto
2. **Clone** sua fork: `git clone https://github.com/seu-usuario/flow-drome.git`
3. **Branch** para feature: `git checkout -b feature/nova-feature`
4. **Commit** mudanças: `git commit -m 'feat: adiciona nova feature'`
5. **Push** para branch: `git push origin feature/nova-feature`
6. **Pull Request** com descrição detalhada

### Padrões de Código
- **TypeScript**: Strict mode sempre ativo
- **ESLint**: Configuração personalizada
- **Prettier**: Formatação automática
- **Commits**: Conventional Commits (feat, fix, docs, etc.)
- **Components**: PascalCase, functional components
- **Hooks**: camelCase, sempre com "use" prefix

## 📞 Suporte e Contato

### Documentação
- **README.md**: Guia principal (este arquivo)
- **MARIAFLOW_MODULES_DOCUMENTATION.md**: Documentação detalhada dos módulos
- **SYSTEM_ARCHITECTURE.md**: Arquitetura técnica
- **.github/instructions/**: Instruções para GitHub Copilot

### Issues e Bugs
- **GitHub Issues**: Para reportar bugs ou solicitar features
- **Descriptions**: Sempre incluir steps to reproduce
- **Labels**: Usar labels apropriados (bug, enhancement, documentation)

---

**MariaFlow** - Sistema de Gestão de Franquias © 2025  
🚀 **Desenvolvido com React 18, TypeScript, Vite, Tailwind CSS e Supabase**

**Status**: ✅ **Sistema 100% Operacional** - Pronto para produção  
**Última Atualização**: 19 de Agosto de 2025
