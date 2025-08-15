# MariaFlow - Sistema de Gestão de Franquias

Sistema completo de gestão para franquias com controle hierárquico de permissões, módulos configuráveis por unidade e interface moderna.

## 🚀 Funcionalidades Principais

### ✅ Sistema de Autenticação e Permissões Hierárquicas
- **🔴 Super Admin (level 100)**: Acesso total + módulos especiais (Super Admin Dashboard, Gestão Unidades)
- **🟡 Administrador (level 80)**: Acesso aos módulos habilitados na unidade (table: unit_modules)  
- **🟢 Atendente (level 30)**: Acesso granular aos módulos específicos liberados (table: user_module_permissions)

### ✅ Sistema de Unidades
- Cadastro e edição de unidades/filiais
- Vinculação hierárquica de usuários às unidades
- Configuração modular de funcionalidades por unidade
- Logs de atividade e auditoria completa

### ✅ Módulos Implementados

**🔴 Módulos Super Admin:**
- **Super Admin Dashboard**: Visão global do sistema
- **Gestão de Unidades**: Controle de todas as unidades

**🟡 Módulos de Unidade (Admin + Atendente autorizado):**
- **Dashboard**: Visão geral da unidade
- **Agenda**: Sistema de agendamentos
- **Agendamentos**: Gestão de agendamentos  
- **Clientes**: Cadastro e gestão de clientes
- **Pipeline**: Gestão de leads e oportunidades
- **Tickets**: Sistema de suporte
- **Profissionais**: Gestão de equipe
- **Financeiro**: Controle financeiro
- **Cashback**: Sistema de recompensas
- **Materiais**: Gestão de materiais
- **Materiais Marketing**: Materiais promocionais
- **Uniformes**: Controle de uniformes
- **Publicações**: Gestão de conteúdo
- **Recrutadora**: Processo seletivo
- **Base Conhecimento**: Documentação
- **MariaUni**: Sistema educacional
- **Configuração Módulos**: Configurações da unidade

## 🏗️ Arquitetura Técnica

### ✅ Frontend Implementado
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento  
- **Tailwind CSS** + **shadcn/ui** para interface moderna
- **Lucide React** para iconografia
- **Hooks Customizados** para gerenciamento de estado

### ✅ Backend Configurado
- **Supabase** (PostgreSQL + Auth + API Real-time)
- **Sistema Hierárquico de Roles** (3 níveis)
- **Foreign Keys** e constraints para integridade
- **RPC Functions** para autenticação customizada

### ✅ Database Schema Completo
```sql
-- Estrutura principal implementada
users                    -- Usuários do sistema
roles                    -- Roles hierárquicos (30, 80, 100)
super_admins            -- Controle de super admins
units                   -- Unidades/Filiais
modules                 -- Módulos do sistema
unit_modules           -- Módulos por unidade (Admin)
user_unit_assignments  -- Vínculo usuário-unidade
user_module_permissions -- Permissões específicas (Atendente)
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

## 🔧 Hooks Principais

### useAuth.tsx
- Autenticação pura via RPC `authenticate_user`
- Retorna dados básicos do usuário
- Interface limpa sem lógica de permissões

### useActiveUnit.tsx  
- **Fonte única de verdade** para permissões
- Lógica diferenciada por role level
- Carregamento de módulos disponíveis

### useAllowedModules.tsx
- Filtro hierárquico do menu
- Integração com estrutura de MenuItems
- Renderização condicional do sidebar
- `roles` - Funções (Super Admin, Admin, Atendente)
## 🛠️ Instalação e Desenvolvimento

```bash
# 1. Clonar o repositório
git clone https://github.com/editordrome/flow-drome.git
cd mariaflow-projeto-main

# 2. Instalar dependências
npm install --legacy-peer-deps

# 3. Configurar variáveis de ambiente
# Criar arquivo .env com as configurações do Supabase

# 4. Iniciar desenvolvimento
npm run dev
# Servidor: http://localhost:8081/
```

## 🔐 Usuários de Teste Configurados

### 🔴 Super Admin
- **Email**: `jeanpetri@gmail.com`
- **Nome**: Jean Petri
- **Acesso**: Todos os módulos + Super Admin Dashboard + Gestão Unidades

### 🟡 Admin de Unidade  
- **Email**: `admin@mariaflow.com`
- **Nome**: Admin MariaFlow
- **Unidade**: MB Drome
- **Acesso**: Todos os módulos habilitados na unidade

### 🟢 Atendentes
**Atendente Básico:**
- **Email**: `atendente@mariaflow.com`
- **Nome**: Atendente Teste
- **Módulos**: Dashboard + Clientes

**Atendente Estendido:**
- **Email**: `lucas@email.com`  
- **Nome**: Lucas Silva
- **Módulos**: Dashboard + Clientes + Agenda

## 🚧 Status Atual do Projeto

### ✅ IMPLEMENTADO E FUNCIONANDO

**🎯 Sistema de Permissões Hierárquicas**
- [x] **3 Níveis de Usuário**: Super Admin (100) → Admin (80) → Atendente (30)
- [x] **Database Schema Completo**: Todas as tabelas criadas e relacionadas
- [x] **Hooks Refatorados**: useAuth, useActiveUnit, useAllowedModules
- [x] **Lógica Hierárquica**: Diferenciada por role level
- [x] **Sidebar Dinâmica**: Renderização baseada em permissões

**🔧 Funcionalidades Core**
- [x] **Autenticação**: RPC authenticate_user + fallback SQL
- [x] **Super Admin**: Módulos especiais + gestão global
- [x] **Admin**: Acesso aos módulos da unidade (unit_modules)
- [x] **Atendente**: Permissões granulares (user_module_permissions)
- [x] **Interface Gestão Unidades**: Abas completas (Dados, Módulos, Usuários, Logs)
- [x] **Dados de Teste**: Usuários configurados para validação

### 🎯 PRONTO PARA TESTE
- **Interface**: http://localhost:8081/ 
- **Hierarquia**: Testável com 4 usuários diferentes
- **Módulos**: Filtragem hierárquica implementada
- **Sidebar**: Renderização condicional funcionando

### 📊 Dados Configurados
- **Usuários**: 4 usuários de teste (1 Super Admin, 1 Admin, 2 Atendentes)
- **Unidades**: MB Drome (completa), MB Londrina, MB Cascavel, MB Maringá
- **Módulos**: 16 módulos configurados e mapeados
- **Permissões**: Granulares para atendentes, completas para admin

## 🔄 Última Atualização: 15/08/2025

### ✅ Sistema de Permissões Hierárquicas Completo
**Refatoração Principal:**
- ✅ **useAuth.tsx**: Simplificado para autenticação pura
- ✅ **useActiveUnit.tsx**: Reescrito como fonte única de verdade para permissões
- ✅ **useAllowedModules.tsx**: Filtro hierárquico implementado
- ✅ **Database**: Permissões configuradas e testadas
- ✅ **Frontend**: Sidebar renderiza módulos corretos por tipo de usuário

**Funcionalidades Validadas:**
- 🔴 **Super Admin**: Vê Super Admin Dashboard + Gestão Unidades + módulos da unidade ativa
- 🟡 **Admin**: Vê todos os módulos habilitados na unidade específica  
- 🟢 **Atendente**: Vê apenas módulos específicos liberados individualmente

**Arquitetura Final:**
```
Database → useActiveUnit (permissions logic) → useAllowedModules (filter) → Sidebar (render)
```

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes base (shadcn/ui)
│   ├── sidebar/         # Componentes da sidebar
│   └── *.tsx           # Módulos específicos
├── hooks/               # Custom hooks
│   ├── useAuth.tsx     # Autenticação
│   ├── useAllowedModules.tsx  # Filtro de módulos
│   └── *.tsx
├── integrations/        # Integrações externas
│   └── supabase/       # Cliente Supabase
├── lib/                # Utilitários
└── pages/              # Páginas principais
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, entre em contato através das issues do GitHub ou pelo email de suporte.

---

**MariaFlow** - Sistema de Gestão de Franquias © 2025

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cb95e1c4-03cc-46f8-b1aa-5a458b8e66fd) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
