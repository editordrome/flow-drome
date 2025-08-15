# MariaFlow - Arquitetura do Sistema

## Visão Geral

O MariaFlow é uma plataforma completa para gestão de franquias de serviços, incluindo diaristas, terceirização, limpeza especializada e pós-obra. O sistema é construído com uma arquitetura moderna baseada em React + TypeScript no frontend e Supabase como backend.

## Arquitetura Geral do Sistema

<lov-mermaid>
graph TB
    subgraph "Frontend (React + TypeScript)"
        A[App.tsx]
        B[Sidebar Navigation]
        C[Module Components]
        D[UI Components]
        E[Hooks & Utils]
    end
    
    subgraph "Backend (Supabase)"
        F[Authentication]
        G[Database (PostgreSQL)]
        H[Row Level Security]
        I[Edge Functions]
        J[Storage]
    end
    
    subgraph "External Integrations"
        K[WhatsApp API]
        L[Payment Gateways]
        M[Analytics Services]
    end
    
    A --> B
    B --> C
    C --> D
    C --> E
    C --> F
    F --> G
    G --> H
    C --> I
    C --> J
    C --> K
    C --> L
    C --> M
</lov-mermaid>

## Estrutura de Módulos

<lov-mermaid>
graph LR
    subgraph "Core Modules"
        A[Dashboard]
        B[Comercial]
        C[Clientes]
        D[Profissionais]
        E[Financeiro]
    end
    
    subgraph "Support Modules"
        F[Marketing]
        G[Compras]
        H[Suporte]
        I[Maria Uni]
    end
    
    subgraph "Submódulos"
        J[Pipeline/Leads]
        K[Cashback]
        L[Agenda]
        M[Recrutadora]
        N[Relatórios]
        O[Materiais]
        P[Uniformes]
        Q[Tickets]
    end
    
    B --> J
    B --> K
    D --> L
    D --> M
    E --> N
    G --> O
    G --> P
    H --> Q
</lov-mermaid>

## Arquitetura do Frontend

<lov-mermaid>
graph TD
    subgraph "Pages"
        A[Index.tsx]
        B[NotFound.tsx]
    end
    
    subgraph "Layout Components"
        C[ModernDashboard]
        D[ModernHeader]
        E[AppSidebar]
        F[Sidebar]
    end
    
    subgraph "Feature Modules"
        G[AgendaModule]
        H[ClientsModule]
        I[FinancialModule]
        J[ProfessionalsModule]
        K[PipelineKanban]
        L[MaterialsModule]
    end
    
    subgraph "UI Components"
        M[Button]
        N[Card]
        O[Table]
        P[Modal]
        Q[Calendar]
        R[Charts]
    end
    
    subgraph "Hooks & Utils"
        S[useMaterialPersonalization]
        T[useModuleSearch]
        U[use-mobile]
        V[utils]
    end
    
    A --> C
    C --> D
    C --> E
    C --> G
    C --> H
    C --> I
    C --> J
    C --> K
    C --> L
    G --> M
    H --> M
    I --> M
    G --> S
    G --> T
    C --> U
    G --> V
</lov-mermaid>

## Estrutura do Banco de Dados

<lov-mermaid>
erDiagram
    companies ||--o{ units : "has"
    companies ||--o{ company_members : "contains"
    companies ||--o{ franchise_subscriptions : "subscribes_to"
    
    users ||--o{ company_members : "member_of"
    users ||--o{ user_roles : "has_role"
    users ||--o{ profiles : "has_profile"
    users ||--o{ notifications : "receives"
    
    units ||--o{ profissionais : "employs"
    units ||--o{ status_atendimento : "manages"
    units ||--o{ recruitment_module : "recruits"
    
    modules ||--o{ module_instances : "instantiated_as"
    
    franchise_plans ||--o{ franchise_subscriptions : "defines"
    
    companies {
        uuid id PK
        text name
        text key
        text status
        jsonb modules
        jsonb settings
    }
    
    units {
        uuid id PK
        uuid company_id FK
        text name
        text code
        text status
        jsonb modules
    }
    
    users {
        uuid id PK
        uuid auth_user_id
        text email
        text role
        boolean active
    }
    
    profissionais {
        uuid id PK
        uuid unit_id FK
        text NOME
        text WHATSAPP
    }
    
    status_atendimento {
        uuid id PK
        uuid unit_id FK
        text CLIENTE
        text PROFISSIONAL
        text STATUS
        text DATA
    }
</lov-mermaid>

## Fluxo de Dados e Autenticação

<lov-mermaid>
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant S as Supabase Auth
    participant D as Database
    participant R as RLS Policies
    
    U->>F: Login Request
    F->>S: Authenticate
    S->>F: JWT Token
    F->>D: Request Data with Token
    D->>R: Check Permissions
    R->>D: Allow/Deny Access
    D->>F: Return Filtered Data
    F->>U: Display Data
</lov-mermaid>

## Sistema de Permissões e RLS

<lov-mermaid>
graph TD
    subgraph "User Roles"
        A[Super Admin]
        B[Company Admin]
        C[Unit Manager]
        D[Staff Member]
    end
    
    subgraph "RLS Policies"
        E[Company Level Access]
        F[Unit Level Access]
        G[User Specific Data]
        H[Public Data]
    end
    
    subgraph "Data Access"
        I[All Companies]
        J[Own Company]
        K[Own Unit]
        L[Own Records]
    end
    
    A --> E
    A --> I
    B --> E
    B --> J
    C --> F
    C --> K
    D --> G
    D --> L
    
    E --> J
    F --> K
    G --> L
    H --> L
</lov-mermaid>

## Componentes Principais

### 1. Dashboard e Navegação
- **ModernDashboard**: Container principal da aplicação
- **AppSidebar**: Navegação lateral com estrutura hierárquica de módulos
- **ModernHeader**: Cabeçalho com busca global e notificações

### 2. Módulos Funcionais

#### Agenda e Profissionais
- **AgendaModule**: Gestão de agendamentos e calendário
- **ProfessionalsModule**: Cadastro e gestão de profissionais
- **CalendarioTab**: Visualização em calendário com disponibilidade
- **GestaoTab**: Gestão semanal e estatísticas

#### Comercial e Clientes
- **PipelineKanban**: Sistema Kanban para gestão de leads
- **ClientsModule**: Cadastro e gestão de clientes
- **CashbackModule**: Sistema de cashback e recompensas

#### Financeiro
- **FinancialModule**: Dashboard financeiro completo
- **ContasPagarModule**: Contas a pagar
- **ContasReceberModule**: Contas a receber
- **FluxoCaixaModule**: Controle de fluxo de caixa

#### Marketing e Materiais
- **MateriaisMarketingModule**: Criação de materiais promocionais
- **MaterialPersonalizationModal**: Personalização de templates
- **PublicacoesModule**: Gestão de publicações

### 3. Componentes de UI
- Sistema de design baseado em shadcn/ui
- Componentes customizados para needs específicos
- Tokens de design semânticos para consistência visual

## Integrações e APIs

<lov-mermaid>
graph LR
    subgraph "MariaFlow Frontend"
        A[React App]
    end
    
    subgraph "Supabase Backend"
        B[Database]
        C[Auth]
        D[Storage]
        E[Edge Functions]
    end
    
    subgraph "External APIs"
        F[WhatsApp Business]
        G[Payment Providers]
        H[Analytics]
        I[Email Services]
    end
    
    A --> B
    A --> C
    A --> D
    A --> E
    E --> F
    E --> G
    E --> H
    E --> I
</lov-mermaid>

## Estrutura de Arquivos

```
src/
├── components/
│   ├── ui/                    # Componentes base (shadcn/ui)
│   ├── sidebar/               # Componentes de navegação
│   ├── agenda/                # Módulo de agenda
│   ├── financial/             # Módulo financeiro
│   ├── pipeline/              # Sistema de leads
│   ├── professionals/         # Gestão de profissionais
│   └── [outros módulos]/
├── hooks/                     # React hooks customizados
├── lib/                       # Utilitários e configurações
├── pages/                     # Páginas principais
├── data/                      # Dados estáticos e mocks
├── utils/                     # Funções utilitárias
└── integrations/
    └── supabase/              # Cliente e tipos Supabase
```

## Segurança e Compliance

### Row Level Security (RLS)
- Políticas de acesso baseadas em níveis organizacionais
- Separação por empresa e unidade
- Controle granular de permissões

### Auditoria
- Log completo de ações do usuário
- Rastreamento de mudanças de dados
- Histórico de operações críticas

### Autenticação
- Supabase Auth com JWT
- Múltiplos provedores (email, social)
- Gestão de sessões segura

## Performance e Escalabilidade

### Frontend
- Code splitting por módulos
- Lazy loading de componentes
- Otimização de re-renders

### Backend
- Índices otimizados no banco
- Consultas eficientes com RLS
- Cache estratégico

### Monitoramento
- Logs de aplicação
- Métricas de performance
- Alertas automatizados

## Fluxo de Desenvolvimento

<lov-mermaid>
graph LR
    A[Development] --> B[Testing]
    B --> C[Staging]
    C --> D[Production]
    
    subgraph "Deployment"
        E[Supabase Migrations]
        F[Frontend Deploy]
        G[Edge Functions]
    end
    
    D --> E
    D --> F
    D --> G
</lov-mermaid>

## Próximos Passos

1. **Implementação de Testes**: Testes unitários e de integração
2. **Otimização de Performance**: Análise e melhorias de velocidade
3. **Expansão de Módulos**: Novos recursos baseados em feedback
4. **Mobile App**: Aplicativo móvel para profissionais
5. **APIs Externas**: Integrações com mais serviços terceiros

---

Este documento serve como referência principal para a arquitetura do sistema MariaFlow e deve ser atualizado conforme a evolução do projeto.