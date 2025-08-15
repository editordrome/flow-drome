# MariaFlow - Sistema de Gestão de Franquias

Sistema completo de gestão para franquias com controle hierárquico de permissões, módulos configuráveis por unidade e interface moderna.

## 🚀 Funcionalidades Principais

### Sistema de Autenticação e Permissões
- **Super Admin**: Acesso total ao sistema incluindo gestão de unidades
- **Administrador**: Acesso aos módulos liberados para sua unidade
- **Atendente**: Acesso básico aos módulos permitidos

### Gestão de Unidades
- Cadastro e edição de unidades
- Vinculação de usuários às unidades
- Configuração de módulos por unidade
- Sistema de logs e auditoria

### Módulos Disponíveis
- **Dashboard**: Visão geral do sistema
- **Pipeline**: Gestão de leads e oportunidades
- **Clientes**: Cadastro e gestão de clientes
- **Agenda**: Sistema de agendamentos
- **Profissionais**: Gestão de equipe
- **Financeiro**: Controle financeiro
- **Cashback**: Sistema de recompensas
- **Materiais**: Gestão de materiais
- **Marketing**: Materiais de marketing
- **Uniformes**: Controle de uniformes
- **Publicações**: Gestão de conteúdo
- **Recrutadora**: Processo seletivo
- **Base de Conhecimento**: Documentação
- **Maria Uni**: Sistema educacional
- **Tickets**: Sistema de suporte

## 🏗️ Arquitetura Técnica

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **Lucide React** para ícones

### Backend
- **Supabase** (PostgreSQL + Auth + API)
- Sistema de roles e permissões hierárquicas
- Foreign keys e constraints para integridade

### Database Schema
- `users` - Usuários do sistema
- `roles` - Funções (Super Admin, Admin, Atendente)
- `units` - Unidades/filiais
- `modules` - Módulos disponíveis
- `unit_modules` - Módulos habilitados por unidade
- `user_unit_assignments` - Vinculação usuário-unidade
- `super_admins` - Controle de super administradores

## 🛠️ Instalação e Desenvolvimento

```bash
# 1. Clonar o repositório
git clone https://github.com/editordrome/flow-drome.git
cd flow-drome

# 2. Instalar dependências
npm install --legacy-peer-deps

# 3. Configurar variáveis de ambiente
# Criar arquivo .env com as configurações do Supabase

# 4. Iniciar desenvolvimento
npm run dev
```

## 🔐 Contas de Teste

### Super Admin
- **Email**: jeanpetri@gmail.com
- **Senha**: DRom@29011725
- **Acesso**: Todos os módulos + Gestão de Unidades

### Administrador de Unidade
- **Email**: admin@mariaflow.com  
- **Senha**: admin123
- **Unidade**: MB Londrina
- **Módulos**: Pipeline (apenas este módulo habilitado)

## 🚧 Status Atual do Projeto

### ✅ Implementado
- [x] Sistema de autenticação completo
- [x] Hierarquia de permissões (Super Admin > Admin > Atendente)
- [x] Interface de gestão de unidades com abas (Dados, Módulos, Usuários, Logs)
- [x] Criação e vinculação de usuários às unidades
- [x] Configuração de módulos por unidade
- [x] Sidebar dinâmica baseada nas permissões
- [x] Database com foreign keys e constraints corretas
- [x] Role "Atendente" como padrão para novos usuários

### 🔧 Em Desenvolvimento
- [ ] Filtro de módulos baseado nas permissões da unidade
- [ ] Sistema de logs detalhado
- [ ] Validação completa de RLS (Row Level Security)

### ⚠️ Problemas Conhecidos
- Sistema não está filtrando módulos corretamente para usuários não-super-admin
- Query de carregamento de módulos permitidos precisa ajustes
- Logs de debug implementados para investigação

## 🔄 Últimas Atualizações

### 15/08/2025
- ✅ Corrigidas foreign keys em `user_unit_assignments`
- ✅ Implementado sistema de roles com "Atendente" como padrão
- ✅ Adicionados logs detalhados para debug
- 🔧 Investigando problema de filtro de módulos por unidade

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
