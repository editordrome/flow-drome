```instructions
---
applyTo: '**'
---

# MariaFlow - Sistema de Gestão para Franquias
Instruções para GitHub Copilot sobre o projeto MariaFlow

## DIRETRIZES DE SEGURANÇA CRÍTICAS

### 🔐 Regras Fundamentais (NUNCA VIOLAR)
1. **MANTER A LINHA DE CRIAÇÃO SEMPRE**: Garantir que todas as ações sejam consistentes com o objetivo inicial, sem desviar do propósito do sistema
2. **NUNCA DESCONFIGURAR O SISTEMA**: Jamais realizar alterações que possam comprometer o funcionamento existente
3. **VERIFICAR CONFLITOS E DUPLICAÇÕES**: Antes de qualquer ação, validar se a configuração causará conflitos, duplicações ou inconsistências
4. **SEMPRE PERGUNTAR ANTES DE EXECUTAR**: Solicitar confirmação antes de executar qualquer ação ou alteração significativa

### 🚫 Ações Proibidas
- Modificar estruturas de banco de dados sem análise prévia
- Alterar configurações do Supabase sem confirmação
- Remover ou renomear componentes existentes
- Modificar tipos TypeScript que podem quebrar dependências
- Alterar rotas ou navegação sem verificar impactos
- Modificar configurações de build ou deploy

## CONTEXTO DO PROJETO

### 🎯 Propósito
Sistema de gestão completo para **franquias**, permitindo controle centralizado de múltiplas unidades com governança empresarial e modularidade flexível.

### 🏗️ Arquitetura Tecnológica
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions + Auth)
- **UI Framework**: Shadcn/ui + Lucide React Icons
- **Estado**: TanStack Query (React Query v5)
- **Charts**: Recharts
- **Autenticação**: Supabase Auth com RLS (Row Level Security)

### 🗄️ Estrutura de Banco de Dados (20 Tabelas)

#### Tabelas de Autenticação e Usuários
- `users` - Usuários do sistema (com role_id, is_active, password encriptada)
- `roles` - Papéis e níveis de permissão (name, display_name, level)
- `super_admins` - Super administradores (com is_active flag)
- `user_units` - Relacionamento usuário-unidade (many-to-many)
- `user_unit_assignments` - **NOVO**: Associações usuário-unidade hierárquicas
- `user_module_permissions` - **NOVO**: Permissões granulares por usuário/módulo/unidade

#### Tabelas de Estrutura Organizacional
- `companies` - Empresas/franquias (governance_settings, compliance_status)
- `units` - Unidades/filiais (performance_score, operational_status, cnpj, status)
- `company_members` - Membros da empresa com papéis
- `super_admins` - Super administradores do sistema

#### Tabelas de Dados Operacionais
- `table_status` - Status de agendamentos e serviços
- `resultados` - Resultados financeiros (11,888+ registros existentes!)
- `recruta` - Sistema de recrutamento
- `profissionais` - Profissionais por unidade
- `sua_tabela` - Configurações gerais do sistema

#### Tabelas de Sistema e Governança
- `modules` - Módulos do sistema (name, display_name, category, is_core)
- `unit_modules` - **ATUALIZADO**: Módulos habilitados por unidade (controle Super Admin)
- `activity_logs` - Logs de atividade (user_id, action, metadata)
- `module_configurations` - Configurações JSONB por módulo
- `unit_metrics` - Métricas de performance das unidades
- `unit_keys` - Chaves de integração e APIs

### 📁 Estrutura de Arquivos

```
src/
├── components/
│   ├── ui/                     # Shadcn/ui base components
│   ├── SuperAdminDashboard.tsx # **NOVO**: Painel Super Admin completo
│   ├── sidebar/                # AppSidebar, AppSidebarHeader, etc
│   ├── agenda/                 # CalendarioTab, GestaoTab
│   ├── financial/              # FinancialModule, ContasPagar, etc
│   ├── pipeline/               # PipelineKanban (Sistema Kanban)
│   ├── professionals/          # ProfessionalsModule, Lista
│   ├── governance/             # GovernanceModule, ModuleConfigurationPanel
│   ├── agendamentos/           # AgendamentosModule
│   ├── [ModuleName]Module.tsx  # Módulos principais
│   └── [Feature]Modal.tsx      # Modals específicos
├── hooks/
│   ├── useAuth.tsx                   # ✨ NOVO: Sistema de autenticação
│   ├── useModuleConfiguration.tsx    # Configuração de módulos
│   ├── useMaterialPersonalization.tsx
│   ├── useActivityLogger.tsx         # Logs de atividade
│   ├── useCompanyMetrics.tsx         # Métricas empresariais
│   └── use-mobile.tsx               # Responsividade
├── pages/
│   ├── Index.tsx               # Página principal com navegação
│   ├── LoginPage.tsx           # ✨ NOVO: Página de login
│   └── NotFound.tsx            # 404
├── data/
│   ├── materialTemplates.ts    # Templates de materiais
│   ├── professionals.ts        # Dados mock de profissionais
│   └── agenda.ts              # Dados de agenda
├── lib/
│   └── utils.ts               # Utilitários (cn, etc)
├── utils/
│   └── imageGenerator.ts      # Geração de imagens
└── integrations/
    └── supabase/              # Cliente Supabase
```

### 🔐 Sistema de Autenticação (Implementado em Agosto 2025)

#### Funcionalidades Implementadas
- **Login/Logout Funcional**: Sistema completo de autenticação
- **Proteção de Rotas**: Redirecionamento automático para login se não autenticado
- **Sessão Persistente**: Mantém usuário logado via localStorage
- **Menu de Usuário**: Dropdown no header com informações e logout
- **Fallback Robusto**: Se RPC falhar, usa consulta SQL direta

#### Estrutura Técnica
- **Hook Principal**: `useAuth()` em `src/hooks/useAuth.tsx`
- **Página de Login**: `LoginPage.tsx` com validação e UX moderna
- **Provider**: `AuthProvider` wrapping toda a aplicação
- **Função Supabase**: `public.authenticate_user(email, password)`
- **Segurança**: Senhas hasheadas com pgcrypto, validação server-side

#### Usuários Configurados
```typescript
// Super Admin
email: "jeanpetri@gmail.com"
senha: "DRom@29011725"
role: "Super Administrador" (level 100)
is_super_admin: true

// Admin de Teste
email: "admin@mariaflow.com" 
senha: "admin123"
role: "Administrador" (level 80)
is_super_admin: false
```

#### Fluxo de Autenticação
1. Usuário acessa sistema → Redireciona para LoginPage se não logado
2. Preenche credenciais → Valida via RPC `authenticate_user`
3. Se RPC falha → Fallback para consulta direta às tabelas
4. Sucesso → Armazena dados no contexto + localStorage
5. Acesso liberado → Mostra dashboard com menu de usuário
6. Logout → Limpa contexto + localStorage + recarrega página

#### Segurança Implementada
- ✅ Senhas hasheadas com pgcrypto (crypt function)
- ✅ RLS (Row Level Security) em tabelas críticas
- ✅ Validação server-side via função PostgreSQL
- ✅ Políticas de acesso baseadas em roles
- ✅ Limpeza completa de sessão no logout

### 🧩 Módulos do Sistema

#### Módulos Principais (Core)
- **Dashboard de Gestão** (`ModernDashboard`) - Container principal
- **Comercial** (`PipelineKanban`) - Sistema Kanban para leads
- **Clientes** (`ClientsModule`) - Gestão de clientes
- **Profissionais** (`ProfessionalsModule`) - Gestão de profissionais
- **Financeiro** (`FinancialModule`) - Dashboard financeiro completo

#### Submódulos
- **Agenda** (`AgendaModule`) - CalendarioTab, GestaoTab
- **Agendamentos** (`AgendamentosModule`) - Gestão de agendamentos
- **Pipeline/Leads** (`PipelineKanban`) - Funil de vendas
- **Cashback** (`CashbackModule`) - Sistema de recompensas
- **Recrutadora** (`RecrutadoraModule`) - Sistema de recrutamento

#### Módulos de Suporte
- **Marketing** (`MateriaisMarketingModule`) - Criação de materiais
- **Materiais** (`MateriaisModule`) - Controle de estoque
- **Publicações** (`PublicacoesModule`) - Gestão de publicações
- **Uniformes** (`UniformesModule`) - Gestão de uniformes
- **Tickets** (`TicketsModule`) - Central de suporte
- **Base de Conhecimento** (`BaseConhecimentoModule`) - Documentação
- **Maria Uni** (`MariaUniModule`) - Treinamentos

#### Módulos de Governança
- **Governança** (`GovernanceModule`) - Configurações empresariais
- **Financeiro Avançado** - Contas a Pagar/Receber, Fluxo de Caixa

### 🔧 Componentes Críticos

#### Navegação
- `AppSidebar` - Sidebar principal com estrutura hierárquica
- `AppSidebarHeader` - Cabeçalho da sidebar
- `AppSidebarMenu` - Menu de navegação
- `ModuleSearchDropdown` - Busca de módulos

#### Autenticação (NOVO - Agosto 2025)
- `LoginPage` - Página de login moderna com validação
- `AuthProvider` - Provider de contexto de autenticação
- `ModernHeader` - Cabeçalho atualizado com menu de usuário e logout
- Dropdown de usuário com informações e opção "Sair"
- Sistema de proteção de rotas automático

#### UI Personalizados
- `ModernHeader` - Cabeçalho com busca global e menu de usuário
- `ColorfulCalendar` - Calendário customizado
- `MaterialPersonalizationModal` - Personalização de materiais
- `ClientDetailModal` / `LeadDetailModal` - Modals de detalhes

### 🎛️ Hooks Importantes

#### Autenticação (ATUALIZADO - Agosto 2025)
- `useAuth()` - Hook principal de autenticação com:
  - `login(email, password)` - Função de login com fallback duplo (RPC + SQL direto)
  - `logout()` - Função de logout com limpeza de sessão
  - `user` - Estado do usuário logado (id, email, nome, role, role_level, is_super_admin)
  - `isLoading` - Estado de carregamento
  - `isLoggedIn` - Status de autenticação

#### Gestão de Unidades e Permissões (NOVO - Agosto 2025)
- `useActiveUnit()` - Hook principal para gerenciamento hierárquico:
  - `activeUnit` - Unidade atualmente ativa para o usuário
  - `userUnits` - Lista de unidades acessíveis pelo usuário
  - `availableModules` - Módulos disponíveis baseados em permissões
  - `loading` - Estado de carregamento das permissões
  - `switchUnit(unitId)` - Função para trocar unidade ativa
  - `refreshModules()` - Recarregar módulos após mudanças
  - Context Provider para estado global de unidades/módulos

#### Configuração e Estado
- `useAllowedModules()` - Filtragem de menu baseada em permissões:
  - Consome `availableModules` do `useActiveUnit`
  - Adiciona módulos Super Admin quando aplicável
  - Filtra `MenuItems` para sidebar hierárquica
- `useModuleConfiguration(moduleKey, companyId?, unitId?)` - Configurações por módulo
- `useMaterialPersonalization()` - Personalização de materiais
- `useModuleSearch()` - Busca de módulos
- `use-mobile()` - Detecção de dispositivo móvel

#### Logs e Métricas
- `useActivityLogger()` - Log de atividades do usuário
- `useCompanyMetrics()` - Métricas empresariais

### 📊 Integração Supabase

#### Integração Supabase

#### Autenticação (ATUALIZADO - Agosto 2025)
- **Sistema Customizado**: Implementado via função `authenticate_user(email, password)`
- **Função RPC**: `public.authenticate_user` com validação de senha via pgcrypto
- **Usuários Configurados**:
  - Super Admin: `jeanpetri@gmail.com` / `DRom@29011725` (ID: 3ef8a250-073c-4c98-b58a-9c6521197939)
  - Admin: `admin@mariaflow.com` / `admin123` (ID: 764e0ae6-bc0c-4005-9774-9dec96609c8d)
  - Atendente: `atendente@mariaflow.com` / `atendente123` (Dashboard + Clientes)
  - Atendente: `lucas@email.com` / `lucas123` (Dashboard + Clientes + Agenda)
- **Roles Configuradas**: 
  - Super Administrador (level 100) - Acesso total ao sistema
  - Administrador (level 80) - Acesso administrativo padrão
  - Atendente (level 30) - Acesso limitado baseado em permissões específicas
- **Sistema de Fallback**: Se RPC falhar, usa consulta direta às tabelas
- **Proteção de Rotas**: Implementada via AuthProvider no App.tsx
- **UI de Login**: Página de login moderna com botões de teste rápido
- **Logout**: Menu dropdown no header com opção "Sair"
- **Permissões Hierárquicas**: Sistema completo de RLS baseado em unidades e módulos
- Row Level Security (RLS) habilitado em tabelas críticas
- Políticas baseadas em company_id, unit_id e user_id
- Sistema de papéis com níveis hierárquicos e permissões granulares

#### APIs Disponíveis
- Projeto: FlowDrome (mstjpohsemoxbgwjklby)
- URL: https://mstjpohsemoxbgwjklby.supabase.co
- Todas as 20 tabelas com relacionamentos configurados
- Sistema de permissões hierárquicas implementado

#### Funções PostgreSQL Disponíveis
```sql
-- Autenticação de usuários
public.authenticate_user(email TEXT, password TEXT) → JSON
-- Retorna: {success: boolean, user_id: UUID, email, nome, role, role_level, is_super_admin, message}

-- Verificação de acesso a unidade
user_has_unit_access(user_uuid UUID, unit_uuid UUID) → BOOLEAN

-- Verificação de acesso a módulo
user_can_access_module(user_uuid UUID, unit_uuid UUID, module_uuid UUID) → BOOLEAN

-- Extensões habilitadas
pgcrypto - Para hash de senhas (função crypt)
```

#### Estrutura de Permissões Hierárquicas
- **Super Admin (level 100)**: Acesso global, gerenciamento de sistema, todas as unidades
- **Admin (level 80)**: Acesso a unidades vinculadas, todos os módulos da unidade
- **Atendente (level 30)**: Acesso a unidades vinculadas, módulos específicos permitidos
- **RLS Policies**: Configuradas para permitir hierarquia de acesso
- **Tabelas de Controle**: `unit_modules`, `user_unit_assignments`, `user_module_permissions`

### 🎨 Design System

#### Componentes Base (Shadcn/ui)
- `Card`, `Button`, `Input`, `Select`, `Tabs`, `Badge`, `Table`
- `Modal`, `Tooltip`, `Switch`, `Calendar`, `Charts`

#### Tokens de Design
- Cores primárias: Blue (#3B82F6), Green (#10B981), Red (#EF4444)
- Spacing: Tailwind CSS (4px = 1 unit)
- Typography: Inter font family
- Shadows: Tailwind shadow system

## REGRAS DE DESENVOLVIMENTO

### ✅ Permitido
- Criar novos componentes seguindo a estrutura existente
- Adicionar novos hooks seguindo padrões estabelecidos
- Implementar novas funcionalidades em módulos existentes
- Melhorar UI/UX mantendo design system
- Adicionar validações e tratamento de erros
- Otimizar performance sem quebrar funcionalidades
- **NOVO**: Extend sistema de autenticação mantendo compatibilidade
- **NOVO**: Adicionar novos roles/permissões seguindo hierarquia existente

### 🔍 Verificações Obrigatórias
1. **Antes de modificar qualquer arquivo**: Verificar dependências e imports
2. **Antes de alterar tipos**: Confirmar impacto em todos os componentes
3. **Antes de modificar banco**: Verificar relacionamentos e constraints
4. **Antes de alterar rotas**: Confirmar navegação não quebra
5. **Antes de deploy**: Testar build e funcionalidades críticas

### 📝 Padrões de Código
- **TypeScript Strict Mode**: Sempre tipado
- **Componentes Funcionais**: Usar React Hooks
- **Naming Convention**: PascalCase para componentes, camelCase para funções
- **Imports**: Absolute imports com alias `@/`
- **Styling**: Tailwind CSS classes, evitar CSS inline
- **Estado**: TanStack Query para server state, useState para local state

### 🚨 Alertas de Segurança
- NUNCA expor credenciais ou tokens
- SEMPRE usar variáveis de ambiente para configs sensíveis
- VERIFICAR permissões RLS antes de queries
- VALIDAR dados do usuário antes de persistir
- SANITIZAR inputs para prevenir XSS
- **NOVO**: NUNCA modificar senhas sem re-hash via pgcrypto
- **NOVO**: SEMPRE validar autenticação server-side via função PostgreSQL
- **NOVO**: PRESERVAR função `authenticate_user` - é crítica para o sistema

## CONTEXTO DE DADOS EXISTENTES

⚠️ **DADOS EM PRODUÇÃO**: A tabela `resultados` contém 11,888+ registros reais. Qualquer alteração deve ser testada em ambiente de desenvolvimento primeiro.

### Relacionamentos Críticos
- `users` ↔ `user_units` ↔ `units` (Many-to-many)
- `companies` ↔ `units` (One-to-many)
- `modules` ↔ `unit_modules` ↔ `units` (Many-to-many)
- Todas as tabelas operacionais referenciam `user_id` e `unit_id`

## INSTRUÇÕES FINAIS

Sempre que interagir com este projeto:
1. ✅ **PERGUNTE ANTES DE AGIR** se a ação pode impactar funcionalidades existentes
2. ✅ **VERIFIQUE COMPATIBILIDADE** com estrutura atual antes de mudanças
3. ✅ **MANTENHA CONSISTÊNCIA** com padrões arquiteturais estabelecidos
4. ✅ **PRESERVE DADOS** existentes e relacionamentos de banco
5. ✅ **DOCUMENTE MUDANÇAS** significativas para referência futura

## 📋 HISTÓRICO DE ATUALIZAÇÕES

### Agosto 2025 - Sistema de Autenticação Completo
**Status**: ✅ **IMPLEMENTADO E FUNCIONANDO**

#### Implementações Realizadas:
- ✅ Hook `useAuth()` com login/logout funcional
- ✅ Página `LoginPage.tsx` com UX moderna
- ✅ Função PostgreSQL `authenticate_user(email, password)`
- ✅ Sistema de fallback (RPC → SQL direto)
- ✅ Proteção de rotas via `AuthProvider`
- ✅ Menu de usuário no header com logout
- ✅ Configuração de usuários: Super Admin + Admin
- ✅ Roles configuradas (level 100 + level 80)
- ✅ RLS policies para autenticação
- ✅ Extensão pgcrypto para hash de senhas

### Agosto 2025 - Sistema de Permissões Hierárquicas Super Admin
**Status**: ✅ **IMPLEMENTADO E FUNCIONANDO**

#### Estrutura de Banco Completa:
- ✅ Tabela `units` - Gerenciamento de unidades/franquias
- ✅ Tabela `modules` - 16 módulos categorizados do sistema
- ✅ Tabela `unit_modules` - Controle Super Admin de ativação por unidade
- ✅ Tabela `user_unit_assignments` - Associação usuário-unidade
- ✅ Tabela `user_module_permissions` - Permissões específicas por módulo

#### Hierarquia de Permissões:
- **Super Admin (nível 100)**: ✅ Acesso global a todas unidades e módulos
- **Admin (nível 80)**: ✅ Acesso a múltiplas unidades designadas 
- **Atendente (nível 40)**: ✅ Acesso limitado conforme Admin define

#### Super Admin Dashboard:
- ✅ Painel completo com 3 tabs: Unidades, Módulos, Usuários
- ✅ Sistema de toggles para ativar/desativar módulos por unidade
- ✅ Interface moderna com busca e filtros
- ✅ Gestão visual de unidades com contadores de usuários
- ✅ Integração automática com roteamento do sistema

#### Módulos Categorizados (16 total):
- **Core**: Dashboard, Usuários (não desativáveis)
- **Atendimento**: Agenda, Clientes, Pipeline, Tickets
- **Financeiro**: Financeiro, Cashback
- **Gestão**: Profissionais, Materiais, Uniformes
- **Marketing**: Marketing, Publicações
- **Educação**: MariaUni, Base de Conhecimento
- **RH**: Recrutadora

#### Funções PostgreSQL Implementadas:
- ✅ `user_has_unit_access(user_uuid, unit_uuid)` 
- ✅ `user_can_access_module(user_uuid, unit_uuid, module_uuid)`
- ✅ `authenticate_user()` atualizada com informações de unidades

#### Unidades de Exemplo Criadas:
- **MariaFlow Matriz** (CNPJ: 12.345.678/0001-90)
- **MariaFlow Filial Norte** (CNPJ: 12.345.678/0002-71)
- ✅ 32 associações módulo-unidade criadas (16 módulos × 2 unidades)

#### Usuários Ativos:
- **Super Admin**: jeanpetri@gmail.com / DRom@29011725
- **Admin**: admin@mariaflow.com / admin123

#### Funcionalidades Testadas:
- ✅ Login via RPC funcionando (confirmado via curl)
- ✅ Login via fallback SQL funcionando
- ✅ Logout e limpeza de sessão funcionando
- ✅ Proteção de rotas funcionando
- ✅ Detecção de super admin funcionando
- ✅ Persistência de sessão funcionando

**Sistema 100% Operacional - Testado e Aprovado**

### Agosto 2025 - Sistema de Vinculação de Usuários Completo
**Status**: ✅ **IMPLEMENTADO E FUNCIONANDO**

#### Funcionalidades de Gestão de Usuários Implementadas:
- ✅ **Criação de Usuários**: Super Admin pode criar novos usuários via interface
- ✅ **Vinculação Automática**: Usuários criados são automaticamente vinculados à unidade selecionada
- ✅ **Gestão de Roles**: Sistema com 3 níveis (Super Admin level 100, Admin level 80, Atendente level 30)
- ✅ **Interface Completa**: Módulo `GestaoUnidadesModule.tsx` com 4 tabs (Dados, Módulos, Usuários, Logs)
- ✅ **Validação de Dados**: Sistema valida email, nome e senha antes da criação

#### Políticas RLS Implementadas:
- ✅ **Tabela `users`**: Política "Allow anonymous write access to users" (ALL operations)
- ✅ **Tabela `user_unit_assignments`**: Política "Allow anonymous access to user_unit_assignments" (ALL operations)  
- ✅ **Tabela `user_units`**: Política "Allow anonymous access to user_units" (ALL operations)
- ✅ **Tabela `units`**: Políticas de leitura e escrita para gestão de unidades
- ✅ **Tabela `roles`**: Política de leitura para sistema de permissões

#### Estado Atual da Base de Dados:
- **Usuários Ativos**: 5 usuários cadastrados (incluindo 2 admins)
- **Unidades Operacionais**: 4 unidades ativas
  - MariaFlow Matriz (CNPJ: 12.345.678/0001-90)
  - MariaFlow Filial Norte (CNPJ: 12.345.678/0002-71)  
  - MB Drome
  - MB Londrina
- **Associações Existentes**: 1 vinculação (Admin → MB Londrina)
- **Roles Configuradas**: 3 níveis hierárquicos funcionais

#### Funcionalidades Testadas via Script Automatizado:
- ✅ **Busca de Usuários**: Consulta retorna 5 usuários existentes
- ✅ **Busca de Unidades**: Consulta retorna 4 unidades ativas
- ✅ **Busca de Roles**: Consulta retorna 3 roles configurados
- ✅ **Criação de Usuário**: Inserção na tabela `users` funcional
- ✅ **Vinculação**: Inserção na tabela `user_unit_assignments` funcional
- ✅ **Relacionamentos**: Foreign keys e joins funcionando corretamente
- ✅ **Limpeza de Dados**: Sistema de rollback funcional

#### Interface Super Admin:
- ✅ **Módulo Gestão de Unidades**: Acessível via sidebar Super Admin
- ✅ **Seleção de Unidade**: Lista todas as 4 unidades disponíveis
- ✅ **Tab Usuários**: Interface para criação e gestão de usuários
- ✅ **Formulário de Criação**: Campos nome, email, senha, role_id
- ✅ **Vinculação Automática**: Sistema vincula usuário à unidade selecionada
- ✅ **Feedback Visual**: Alertas de sucesso/erro funcionais

#### Fluxo Operacional Completo:
1. **Acesso Super Admin** → Login com jeanpetri@gmail.com
2. **Navegação** → Sidebar → "Gestão de Unidades"  
3. **Seleção de Unidade** → Escolher entre 4 unidades disponíveis
4. **Criação de Usuário** → Tab "Usuários" → Preencher formulário
5. **Vinculação Automática** → Sistema cria usuário + vincula à unidade
6. **Confirmação** → Alert de sucesso + recarregamento dos dados

**Sistema de Vinculação 100% Operacional - Testado e Validado** ✅

### Agosto 2025 - Sistema de Permissões Hierárquicas Sidebar
**Status**: ✅ **IMPLEMENTADO E FUNCIONANDO**

#### Arquitetura de Permissões Hierárquicas:
- ✅ **Hook useActiveUnit**: Fonte única de verdade para permissões e módulos
- ✅ **Hierarquia de Acesso**: Super Admin → Admin → Atendente com lógicas distintas
- ✅ **Context Provider**: `ActiveUnitProvider` gerencia estado global de unidades/módulos
- ✅ **Filtragem Dinâmica**: Sidebar mostra apenas módulos permitidos por usuário/unidade

#### Lógica Hierárquica Implementada:

**Super Admin (level 100):**
- ✅ **Acesso Global**: Todas as unidades do sistema
- ✅ **Módulos Super Admin**: Dashboard Super Admin + Gestão de Unidades
- ✅ **Módulos da Unidade**: Todos os módulos ativos da unidade selecionada
- ✅ **Unidade Padrão**: MB Drome prioritária, senão primeira unidade

**Admin (level 80):**
- ✅ **Unidades Vinculadas**: Apenas unidades onde está associado
- ✅ **Módulos da Unidade**: Todos os módulos ativos da unidade (`unit_modules`)
- ✅ **Gestão Local**: Pode gerenciar usuários e configurações da unidade

**Atendente (level < 80):**
- ✅ **Unidades Vinculadas**: Apenas unidades onde está associado
- ✅ **Módulos Específicos**: Apenas módulos com permissão em `user_module_permissions`
- ✅ **Acesso Granular**: Controle individual por módulo/unidade

#### Hooks Refatorados:

**useAuth.tsx:**
- ✅ **Responsabilidade Única**: Apenas autenticação (login/logout)
- ✅ **Interface Limpa**: Retorna user com id, email, nome, role, role_level, is_super_admin
- ✅ **Sem Lógica de Permissões**: Remove duplicação com useActiveUnit

**useActiveUnit.tsx:**
- ✅ **Context Provider**: Gerencia estado global de unidades e módulos
- ✅ **Funções Separadas**:
  - `loadUserUnits()`: Carrega unidades baseado no tipo de usuário
  - `loadUnitModules()`: Módulos da unidade para Admin/Super Admin
  - `loadAtendantModules()`: Módulos específicos para Atendente
- ✅ **Logs Detalhados**: Console logs para debug de permissões
- ✅ **Reatividade**: useEffect para mudanças de usuário/unidade

**useAllowedModules.tsx:**
- ✅ **Filtro de Menu**: Consome availableModules do useActiveUnit
- ✅ **Módulos Super Admin**: Adiciona módulos específicos para Super Admin
- ✅ **Menu Hierárquico**: Filtra MenuItems baseado nos módulos disponíveis

#### Fluxo de Dados:
```
Database Tables:
├── units (unidades do sistema)
├── unit_modules (módulos ativos por unidade) 
├── user_unit_assignments (usuário ↔ unidade)
├── user_module_permissions (permissões granulares atendente)
└── modules (catálogo de módulos)
    ↓
useActiveUnit Hook:
├── loadUserUnits() → Define unidades acessíveis
├── loadUnitModules() → Módulos da unidade (Admin/Super Admin)
├── loadAtendantModules() → Módulos específicos (Atendente)
└── availableModules[] → Lista final de módulos
    ↓
useAllowedModules Hook:
├── filterMenuItemsByModules() → Filtra menu principal
├── Adiciona módulos Super Admin se aplicável
└── menuItems[] → Menu filtrado para sidebar
    ↓
AppSidebarMenu Component:
└── Renderiza apenas módulos permitidos
```

#### Dados de Teste Configurados:

**Usuários com Permissões:**
- `jeanpetri@gmail.com` - Super Admin (level 100) - Acesso total
- `admin@mariaflow.com` - Admin (level 80) - Módulos da unidade
- `atendente@mariaflow.com` - Atendente (level 30) - Dashboard + Clientes
- `lucas@email.com` - Atendente (level 30) - Dashboard + Clientes + Agenda

**Unidades Operacionais:**
- MB Drome (unidade padrão Super Admin)
- MB Londrina (vinculada ao Admin)
- MariaFlow Matriz
- MariaFlow Filial Norte

#### Funcionalidades Validadas:
- ✅ **Login Hierárquico**: Diferentes usuários mostram diferentes módulos
- ✅ **Troca de Unidade**: Super Admin pode alternar entre unidades
- ✅ **Filtragem Dinâmica**: Sidebar atualiza conforme permissões
- ✅ **Logs de Debug**: Console mostra fluxo de carregamento de permissões
- ✅ **Performance**: Provider evita re-renders desnecessários

**Sistema de Permissões Hierárquicas 100% Operacional - Testado e Validado** ✅

```