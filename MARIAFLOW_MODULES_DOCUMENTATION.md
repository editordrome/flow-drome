
# MariaFlow - Documentação Completa dos Módulos

*Atualizada em 15/08/2025 - Sistema de Permissões Hierárquicas Implementado*

## 📋 Índice

1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [🔴 Módulos Super Admin](#módulos-super-admin)
3. [🟡 Módulos de Unidade](#módulos-de-unidade)
4. [Sistema de Permissões](#sistema-de-permissões)
5. [Mapeamento Técnico](#mapeamento-técnico)

---

## Visão Geral do Sistema

O MariaFlow implementa um **sistema hierárquico de módulos** com 3 níveis de acesso:

- **🔴 Super Admin (level 100)**: Módulos especiais + módulos da unidade ativa
- **🟡 Admin (level 80)**: Todos os módulos habilitados na unidade
- **🟢 Atendente (level 30)**: Apenas módulos específicos liberados

### Arquitetura de Acesso

```
🔴 Super Admin
├── Super Admin Dashboard (exclusivo)
├── Gestão de Unidades (exclusivo)
└── + Módulos da unidade ativa selecionada

🟡 Admin de Unidade  
└── Módulos habilitados na unidade (unit_modules)

🟢 Atendente
└── Módulos específicos liberados (user_module_permissions)
```

---

## 🔴 Módulos Super Admin

### Super Admin Dashboard
**Acesso**: Exclusivo Super Admin  
**ID Frontend**: `super-admin`  
**Descrição**: Visão global do sistema com métricas consolidadas

**Funcionalidades:**
- 📊 Métricas globais de todas as unidades
- 👥 Resumo de usuários por unidade e role
- 📈 Performance agregada do sistema
- 🎯 KPIs principais da franquia
- 🔧 Configurações globais do sistema

### Gestão de Unidades
**Acesso**: Exclusivo Super Admin  
**ID Frontend**: `gestao-unidades`  
**Descrição**: Controle completo de unidades, usuários e permissões

**Funcionalidades Implementadas:**

#### 🏢 Gerenciamento de Unidades
- ✅ **Listagem Completa**: Visualização de todas as unidades
- ✅ **Detalhes da Unidade**: Nome, código, endereço, contatos
- ✅ **Status Operacional**: Controle ativo/inativo
- ✅ **Interface em Abas**: Dados, Módulos, Usuários, Logs

#### 👥 Gestão de Usuários (Implementado)
- ✅ **Criação de Usuários**: Interface funcional para cadastro
- ✅ **Vinculação Automática**: Associação à unidade selecionada
- ✅ **Role Padrão**: Atendente (level 30) atribuído automaticamente
- ✅ **Validação**: Nome, email e senha obrigatórios
- ✅ **Feedback**: Alertas de sucesso/erro integrados

#### ⚙️ Configuração de Módulos
- ✅ **Ativação/Desativação**: Toggles para cada módulo
- ✅ **Interface Grid**: Layout moderno e responsivo
- ✅ **Categorização**: Módulos organizados por tipo
- ✅ **Persistência**: Configurações salvas no banco (unit_modules)

#### 📝 Sistema de Logs
- ✅ **Atividades de Usuário**: Login, criação, alterações
- ✅ **Mudanças de Configuração**: Módulos ativados/desativados
- ✅ **Auditoria Completa**: Quem, quando, o que mudou
- ✅ **Interface de Visualização**: Lista ordenada por data

---

## 🟡 Módulos de Unidade

*Acessíveis por Admin (todos) e Atendente (se liberado)*
### Dashboard
**ID Frontend**: `dashboard`  
**Categoria**: Core  
**Acesso**: Admin + Atendente (se liberado)

**Funcionalidades:**
- 📊 **Visão Geral da Unidade**: Métricas específicas da unidade
- 🎯 **KPIs Principais**: Vendas, leads, agendamentos, clientes
- 📈 **Gráficos Interativos**: Performance temporal e comparativa
- 🔔 **Notificações**: Alertas e lembretes importantes
- 📋 **Resumo de Atividades**: Últimas ações realizadas

### Agenda
**ID Frontend**: `agenda`  
**Categoria**: Atendimento  
**Acesso**: Admin + Atendente (se liberado)

**Funcionalidades:**
- 📅 **Calendário Interativo**: Visualização mensal/semanal/diária
- ⏰ **Gestão de Horários**: Configuração de horários disponíveis
- 👥 **Agendamento de Clientes**: Interface para marcar consultas
- 🔔 **Lembretes Automáticos**: Notificações de agendamentos
- 📊 **Relatórios de Agenda**: Análise de ocupação e performance

### Agendamentos
**ID Frontend**: `agendamentos`  
**Categoria**: Atendimento  
**Acesso**: Admin + Atendente (se liberado)

**Funcionalidades:**
- 📋 **Lista de Agendamentos**: Visualização completa dos agendamentos
- ✅ **Status de Atendimento**: Confirmado, em andamento, concluído
- 🔍 **Filtros Avançados**: Por data, profissional, serviço, status
- 📝 **Observações**: Notas sobre cada agendamento
- 📊 **Métricas de Agendamento**: Taxa de comparecimento, cancelamentos

### Clientes
**ID Frontend**: `clientes`  
**Categoria**: Atendimento  
**Acesso**: Admin + Atendente (se liberado)

**Funcionalidades:**
- 👥 **Cadastro Completo**: Dados pessoais, contatos, preferências
- 📋 **Histórico de Atendimentos**: Timeline completa de interações
- 💰 **Histórico Financeiro**: Compras, pagamentos, pendências
- 📱 **Integração WhatsApp**: Comunicação direta via WhatsApp
- 🎯 **Segmentação**: Classificação por perfil e comportamento

### Pipeline
**ID Frontend**: `pipeline`  
**Categoria**: Comercial  
**Acesso**: Admin + Atendente (se liberado)

**Funcionalidades:**
- 🎯 **Kanban de Vendas**: Visualização em funil de oportunidades
- 📞 **Gestão de Leads**: Captura, qualificação e follow-up
- 💬 **Histórico de Interações**: Todas as comunicações registradas
- 📊 **Métricas de Conversão**: Taxa de fechamento por etapa
- 🔄 **Automação de Follow-up**: Lembretes e tarefas automáticas

### Tickets
**ID Frontend**: `tickets`  
**Categoria**: Suporte  
**Acesso**: Admin + Atendente (se liberado)

**Funcionalidades:**
- 🎫 **Sistema de Chamados**: Abertura e gestão de tickets
- ⚡ **Níveis de Prioridade**: Crítico, alto, médio, baixo
- 👤 **Atribuição**: Designação para profissionais específicos
- 📊 **SLA**: Controle de tempo de resposta e resolução
- 📈 **Relatórios de Suporte**: Métricas de atendimento

### Profissionais
**ID Frontend**: `profissionais`  
**Categoria**: Recursos Humanos  
**Acesso**: Admin + Atendente (se liberado)

**Funcionalidades:**
- 👨‍💼 **Cadastro de Equipe**: Dados pessoais e profissionais
- 📅 **Gestão de Horários**: Disponibilidade e escalas
- 💰 **Controle de Comissões**: Cálculo automático de comissões
- 📊 **Performance Individual**: Métricas por profissional
- 🎓 **Certificações**: Controle de qualificações e cursos

### Financeiro
**ID Frontend**: `financeiro`  
**Categoria**: Financeiro  
**Acesso**: Admin + Atendente (se liberado)

**Funcionalidades:**
- 💰 **Fluxo de Caixa**: Entradas e saídas detalhadas
- 📊 **Relatórios Financeiros**: DRE, balanço, lucratividade
- 💳 **Gestão de Pagamentos**: Controle de recebimentos e pagamentos
- 📈 **Análise de Performance**: ROI, margem, ticket médio
- 🔄 **Conciliação Bancária**: Integração com extratos bancários

### Cashback
**ID Frontend**: `cashback`  
**Categoria**: Fidelização  
**Acesso**: Admin + Atendente (se liberado)

**Funcionalidades:**
- 🎁 **Programa de Pontos**: Sistema de recompensas para clientes
- 💳 **Cartão Fidelidade**: Gestão de cartões virtuais
- 🎯 **Campanhas Promocionais**: Criação de ofertas especiais
- 📊 **Relatórios de Uso**: Análise de engajamento do programa
- 🔄 **Resgate de Pontos**: Interface para troca de recompensas

### Materiais
**ID Frontend**: `materiais`  
**Categoria**: Marketing  
**Acesso**: Admin + Atendente (se liberado)

**Funcionalidades:**
- 📁 **Biblioteca de Materiais**: Organização de arquivos e documentos
- 🎨 **Editor de Materiais**: Criação e edição de peças gráficas
- 📋 **Controle de Estoque**: Gestão de materiais físicos
- 📊 **Relatórios de Uso**: Tracking de downloads e utilização
- 🔄 **Versionamento**: Controle de versões dos materiais

### Materiais Marketing
**ID Frontend**: `materiais-marketing`  
**Categoria**: Marketing  
**Acesso**: Admin + Atendente (se liberado)

**Funcionalidades:**
- 🎨 **Peças Promocionais**: Criação de materiais de divulgação
- 📱 **Templates Digitais**: Modelos para redes sociais
- 🖨️ **Materiais Impressos**: Flyers, cartões, banners
- 📅 **Calendário de Campanhas**: Planejamento de ações de marketing
- 📊 **Performance de Materiais**: Análise de efetividade

### Uniformes
**ID Frontend**: `uniformes`  
**Categoria**: Recursos Humanos  
**Acesso**: Admin + Atendente (se liberado)

**Funcionalidades:**
- 👕 **Catálogo de Uniformes**: Gestão de peças disponíveis
- 📏 **Controle de Tamanhos**: Gestão de estoque por tamanho
- 📋 **Pedidos**: Sistema de solicitação de uniformes
- 💰 **Controle de Custos**: Gestão de gastos com uniformes
- 📊 **Relatórios**: Análise de uso e reposição

### Publicações
**ID Frontend**: `publicacoes`  
**Categoria**: Marketing  
**Acesso**: Admin + Atendente (se liberado)

**Funcionalidades:**
- 📝 **Editor de Conteúdo**: Criação de posts e artigos
- 📅 **Agendamento**: Publicação programada em redes sociais
- 📊 **Métricas de Engajamento**: Análise de performance
- 🎯 **Segmentação de Público**: Direcionamento de conteúdo
- 🔄 **Aprovação de Conteúdo**: Workflow de validação

### Recrutadora
**ID Frontend**: `recrutadora`  
**Categoria**: Recursos Humanos  
**Acesso**: Admin + Atendente (se liberado)

**Funcionalidades:**
- 📋 **Gestão de Vagas**: Criação e publicação de oportunidades
- 👤 **Banco de Currículos**: Armazenamento e organização
- 📞 **Processo Seletivo**: Etapas de entrevistas e avaliações
- 📊 **Métricas de RH**: Tempo de contratação, turnover
- 🎯 **Matching**: Compatibilidade candidato-vaga

### Base Conhecimento
**ID Frontend**: `base-conhecimento`  
**Categoria**: Educação  
**Acesso**: Admin + Atendente (se liberado)

**Funcionalidades:**
- 📚 **Biblioteca Digital**: Documentos, manuais, procedimentos
- 🔍 **Sistema de Busca**: Localização rápida de informações
- 📋 **Artigos e Tutoriais**: Conteúdo educativo estruturado
- 🎥 **Vídeos Treinamento**: Biblioteca de vídeos educativos
- 📊 **Tracking de Leitura**: Acompanhamento de acesso

### MariaUni
**ID Frontend**: `maria-uni`  
**Categoria**: Educação  
**Acesso**: Admin + Atendente (se liberado)

**Funcionalidades:**
- 🎓 **Cursos Online**: Plataforma de educação à distância
- 📋 **Avaliações**: Sistema de provas e certificações
- 📊 **Progresso de Aprendizado**: Tracking individual de evolução
- 🏆 **Certificações**: Emissão de certificados de conclusão
- 👥 **Turmas Virtuais**: Organização de grupos de estudo

### Configuração Módulos
**ID Frontend**: `configuracao-modulos`  
**Categoria**: Administração  
**Acesso**: Admin + Atendente (se liberado)

**Funcionalidades:**
- ⚙️ **Configurações da Unidade**: Personalização por unidade
- 🔧 **Parâmetros do Sistema**: Configurações técnicas
- 👥 **Permissões de Usuário**: Gestão granular de acessos
- 📊 **Relatórios de Configuração**: Auditoria de mudanças
- 🔄 **Backup de Configurações**: Restore de configurações anteriores
   ---

## Sistema de Permissões

### 🔧 Como Funciona

**🔴 Super Admin (level 100)**
```typescript
// Sempre inclui módulos especiais
const superAdminModules = ['super-admin', 'gestao-unidades'];
// Adiciona módulos da unidade ativa
const unitModules = availableModules.map(m => m.module_name);
const allModules = [...superAdminModules, ...unitModules];
```

**🟡 Admin (level 80)**
```sql
-- Busca todos os módulos habilitados na unidade
SELECT m.name as module_name, um.unit_id
FROM unit_modules um
JOIN modules m ON m.id = um.module_id
WHERE um.unit_id = $1 AND um.is_active = true;
```

**🟢 Atendente (level 30)**
```sql
-- Busca apenas módulos específicos liberados
SELECT m.name as module_name, ump.unit_id
FROM user_module_permissions ump
JOIN modules m ON m.id = ump.module_id
WHERE ump.user_id = $1 AND ump.unit_id = $2 AND ump.is_active = true;
```

### 🎯 Exemplos de Configuração

**Admin da Unidade MB Drome:**
- Vê: Dashboard, Agenda, Clientes, Pipeline, Tickets, Profissionais, Financeiro, etc.
- Fonte: Todos os módulos em `unit_modules` onde `unit_id = MB Drome`

**Atendente Maria Silva:**
- Vê apenas: Dashboard, Clientes
- Fonte: Registros específicos em `user_module_permissions`

**Atendente João Santos:**
- Vê apenas: Dashboard, Clientes, Agenda
- Fonte: Registros específicos em `user_module_permissions`

---

## Mapeamento Técnico

### Frontend → Backend

```typescript
const MODULE_MAPPING = {
  // Super Admin exclusivos
  'super-admin': 'Super Admin Dashboard',
  'gestao-unidades': 'Gestão Unidades',
  
  // Módulos de unidade
  'dashboard': 'Dashboard',
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

### Estrutura de Menu

```typescript
// Estrutura hierárquica do menu
const menuItems = [
  {
    id: 'super-admin',
    title: 'Super Admin',
    icon: Crown,
    // Visível apenas para Super Admin
  },
  {
    id: 'dashboard',
    title: 'Dashboard', 
    icon: BarChart3,
    // Visível para todos (se liberado)
  },
  {
    title: 'Atendimento',
    items: [
      { id: 'agenda', title: 'Agenda', icon: Calendar },
      { id: 'clientes', title: 'Clientes', icon: Users },
      { id: 'pipeline', title: 'Pipeline', icon: TrendingUp },
      // ... outros módulos de atendimento
    ]
  },
  // ... outras categorias
];
```

### Database Tables

```sql
-- Módulos disponíveis no sistema
modules: id, name, display_name, category, icon, is_active

-- Módulos habilitados por unidade (Admin)
unit_modules: unit_id, module_id, is_active, configured_by

-- Permissões específicas de módulos (Atendente)  
user_module_permissions: user_id, module_id, unit_id, is_active, granted_by
```

## 🚀 Status de Implementação

### ✅ Completamente Implementado
- [x] **Sistema Hierárquico**: 3 níveis funcionando corretamente
- [x] **Database Schema**: Todas as tabelas criadas e relacionadas
- [x] **Hooks de Permissão**: useAuth, useActiveUnit, useAllowedModules
- [x] **Sidebar Dinâmica**: Renderização baseada em permissões
- [x] **Super Admin Dashboard**: Interface exclusiva para super admins
- [x] **Gestão de Unidades**: Controle completo de unidades e usuários
- [x] **Dados de Teste**: Usuários configurados para validação

### 🎯 Pronto para Produção
- **Interface**: http://localhost:8081/
- **Usuários Teste**: 4 níveis diferentes configurados
- **Permissões**: Granulares e hierárquicas funcionando
- **Validação**: Sistema testado e operacional

---

*Documentação atualizada em 15/08/2025 - Sistema de Permissões Hierárquicas totalmente implementado e funcional.*

---

## Conclusãoamentos)
12. [Funcionalidades Transversais](#funcionalidades-transversais)

---

## Visão Geral do Sistema

O **MariaFlow** é uma plataforma completa para gestão de franquias de serviços domiciliares, incluindo diaristas, terceirização, limpeza especializada e pós-obra. O sistema é construído com uma arquitetura moderna e modular, permitindo escalabilidade e adaptação às necessidades específicas de cada unidade operacional.

### Tecnologias Utilizadas
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Autenticação**: Supabase Auth com RLS (Row Level Security)
- **UI Components**: Shadcn/ui + Lucide React Icons
- **Charts**: Recharts
- **Estado Global**: TanStack Query

### Arquitetura do Sistema
O MariaFlow segue uma arquitetura modular onde cada funcionalidade é implementada como um módulo independente, permitindo ativação/desativação conforme necessário para cada franquia ou unidade.

---

## Dashboard

### Visão Geral
O Dashboard é o centro de controle do MariaFlow, fornecendo uma visão panorâmica das operações da franquia através de métricas-chave, gráficos interativos e indicadores de performance.

### Funcionalidades Principais

#### 1. Métricas Principais
- **Atendimentos do Mês**: Contador em tempo real dos serviços realizados
- **Receita Total**: Faturamento acumulado com comparativo mensal
- **Taxa de Conversão**: Percentual de leads convertidos em clientes
- **Satisfação do Cliente**: Média das avaliações recebidas
- **Profissionais Ativos**: Número de profissionais disponíveis

#### 2. Gráficos e Visualizações
- **Evolução da Receita**: Gráfico de linha mostrando crescimento mensal
- **Distribuição de Serviços**: Gráfico de pizza por tipo de serviço
- **Performance por Região**: Mapa de calor das operações
- **Tendências de Agendamento**: Análise de padrões temporais

#### 3. Alertas e Notificações
- Sistema de alertas em tempo real para eventos críticos
- Notificações de pendências e ações necessárias
- Lembretes de follow-up com clientes

### Componentes Técnicos
- `ModernDashboard.tsx`: Componente principal do dashboard
- `FinancialDashboardCards.tsx`: Cards de métricas financeiras
- `FinancialOverviewTab.tsx`: Visão geral financeira
- Charts integrados com Recharts para visualizações

---

## Módulo Comercial

### Visão Geral
O módulo comercial gerencia todo o funil de vendas, desde a captura de leads até a conversão em clientes, incluindo campanhas de cashback e fidelização.

### Submódulos

#### 1. Pipeline de Leads
**Localização**: `PipelineKanban.tsx`

**Funcionalidades**:
- Sistema Kanban para gestão visual do funil de vendas
- Estágios configuráveis: Novo Lead → Contato → Proposta → Negociação → Fechado
- Arrastar e soltar leads entre estágios
- Informações detalhadas de cada lead (contato, origem, valor potencial)
- Filtros por período, origem, valor e status
- Relatórios de conversão por estágio

**Recursos Técnicos**:
- Componente `LeadCard.tsx` para exibição individual
- `NewLeadDialog.tsx` para criação de novos leads
- `PipelineStats.tsx` para estatísticas do funil
- Integração com `react-beautiful-dnd` para drag & drop

#### 2. Sistema de Cashback
**Localização**: `CashbackModule.tsx`

**Funcionalidades**:
- Configuração de regras de cashback por tipo de serviço
- Cálculo automático de recompensas
- Histórico de cashback por cliente
- Relatórios de impacto do programa
- Gestão de saldo de cashback dos clientes

### Integrações
- Conecta com WhatsApp Business API para comunicação
- Integração com sistemas de pagamento
- Sincronização com CRM externo

---

## Módulo de Clientes

### Visão Geral
**Localização**: `ClientsModule.tsx`

Gerencia toda a base de clientes da franquia, desde o cadastro inicial até o acompanhamento do histórico de serviços e relacionamento.

### Funcionalidades Principais

#### 1. Gestão de Cadastro
- Formulário completo de cadastro com validações
- Campos personalizáveis por tipo de serviço
- Upload de documentos e fotos
- Geolocalização e mapeamento de endereços

#### 2. Histórico e Acompanhamento
- Timeline completa de interações
- Histórico de serviços realizados
- Avaliações e feedback dos serviços
- Preferências e observações especiais

#### 3. Segmentação e Filtros
- Filtros avançados por localização, tipo de serviço, frequência
- Segmentação automática de clientes (VIP, regular, esporádico)
- Tags personalizáveis para categorização

### Componentes Técnicos
- `ClientsTable.tsx`: Tabela principal de clientes
- `NewClientModal.tsx`: Modal para novos cadastros
- `ClientDetailModal.tsx`: Detalhes completos do cliente
- Integração com maps API para geolocalização

---

## Módulo de Profissionais

### Visão Geral
Sistema completo para gestão do time de profissionais, incluindo cadastro, agenda, performance e recrutamento.

### Submódulos

#### 1. Cadastro e Gestão
**Localização**: `ProfessionalsModule.tsx`, `ProfessionalsListModule.tsx`

**Funcionalidades**:
- Cadastro completo com documentação
- Verificação de antecedentes
- Certificações e especializações
- Avaliações de performance
- Histórico disciplinar

#### 2. Sistema de Agenda
**Localização**: `AgendaModule.tsx`

**Funcionalidades**:
- Calendário visual para agendamentos
- Sincronização com Google Calendar/Outlook
- Bloqueios e disponibilidade
- Otimização de rotas
- Notificações automáticas

**Componentes**:
- `CalendarioTab.tsx`: Visualização em calendário
- `GestaoTab.tsx`: Gestão semanal e mensal
- `ColorfulCalendar.tsx`: Calendário interativo
- `StatusBadge.tsx`: Indicadores visuais de status

#### 3. Módulo Recrutadora
**Localização**: `RecrutadoraModule.tsx`

**Funcionalidades**:
- Portal de vagas e candidaturas
- Processo seletivo digital
- Entrevistas por vídeo integradas
- Avaliação de competências
- Onboarding automatizado

### Status de Atendimento
Sistema para acompanhamento em tempo real do status dos profissionais:
- Em atendimento
- Disponível
- Em deslocamento
- Offline
- Em pausa

---

## Módulo Financeiro

### Visão Geral
Sistema financeiro completo para controle de receitas, despesas, fluxo de caixa e relatórios gerenciais.

### Submódulos

#### 1. Dashboard Financeiro
**Localização**: `DashboardFinanceiroModule.tsx`

**Funcionalidades**:
- Visão geral das finanças em tempo real
- Indicadores de performance financeira
- Gráficos de evolução de receita e custos
- Comparativos mensais e anuais

#### 2. Contas a Pagar
**Localização**: `ContasPagarModule.tsx`

**Funcionalidades**:
- Cadastro de fornecedores e despesas
- Agendamento de pagamentos
- Controle de vencimentos
- Relatórios de despesas por categoria
- Integração com bancos para pagamentos

#### 3. Contas a Receber
**Localização**: `ContasReceberModule.tsx`

**Funcionalidades**:
- Controle de faturamento
- Emissão de notas fiscais
- Acompanhamento de recebimentos
- Gestão de inadimplência
- Relatórios de recebimento

#### 4. Fluxo de Caixa
**Localização**: `FluxoCaixaModule.tsx`

**Funcionalidades**:
- Projeção de fluxo de caixa
- Análise de entradas e saídas
- Planejamento financeiro
- Alertas de baixo caixa

#### 5. Relatórios
**Localização**: `RelatoriosModule.tsx`

**Funcionalidades**:
- DRE (Demonstrativo de Resultado)
- Relatórios customizados
- Exportação para Excel/PDF
- Dashboards executivos

### Componentes Técnicos
- `FinancialModule.tsx`: Módulo principal
- `AccountsPayableTab.tsx`: Gestão de contas a pagar
- `AccountsReceivableTab.tsx`: Gestão de contas a receber
- `DRETab.tsx`: Demonstrativo de resultado
- `financialUtils.ts`: Utilitários para cálculos

---

## Módulo de Marketing

### Visão Geral
Ferramentas para criação, gestão e acompanhamento de campanhas de marketing digital e materiais promocionais.

### Submódulos

#### 1. Materiais de Marketing
**Localização**: `MateriaisMarketingModule.tsx`

**Funcionalidades**:
- Editor visual de materiais gráficos
- Templates pré-configurados
- Personalização de marca
- Biblioteca de imagens e ícones
- Exportação em múltiplos formatos

**Componentes Técnicos**:
- `MaterialEditor.tsx`: Editor visual
- `MaterialPersonalizationModal.tsx`: Modal de personalização
- `MaterialPersonalizationContent.tsx`: Conteúdo de edição
- `PersonalizedImagePreview.tsx`: Preview em tempo real

#### 2. Gestão de Publicações
**Localização**: `PublicacoesModule.tsx`

**Funcionalidades**:
- Agendamento de posts para redes sociais
- Calendário editorial
- Análise de engagement
- Resposta automatizada
- Relatórios de performance

### Recursos Avançados
- Integração com Meta Business (Facebook/Instagram)
- Google My Business
- WhatsApp Business API
- Analytics e métricas de conversão

---

## Módulo de Compras

### Visão Geral
Gestão completa do processo de compras, desde uniformes até materiais de limpeza e equipamentos.

### Submódulos

#### 1. Uniformes
**Localização**: `UniformesModule.tsx`

**Funcionalidades**:
- Catálogo de uniformes personalizados
- Pedidos por tamanho e quantidade
- Controle de estoque
- Relatórios de consumo
- Integração com fornecedores

#### 2. Materiais e Equipamentos
**Localização**: `MateriaisModule.tsx`

**Funcionalidades**:
- Catálogo de produtos de limpeza
- Controle de estoque por unidade
- Pedidos automáticos por ponto de reposição
- Relatórios de consumo
- Gestão de fornecedores

### Recursos Técnicos
- Integração com ERPs de fornecedores
- API de cotação automática
- Sistema de aprovação de compras
- Controle de orçamento por categoria

---

## Módulo de Suporte

### Visão Geral
Sistema completo de atendimento ao cliente interno e externo, incluindo base de conhecimento e tickets.

### Submódulos

#### 1. Central de Tickets
**Localização**: `TicketsModule.tsx`

**Funcionalidades**:
- Sistema de tickets com priorização
- Categorização automática
- SLA e tempos de resposta
- Chat interno entre equipes
- Histórico completo de atendimentos

#### 2. Base de Conhecimento
**Localização**: `BaseConhecimentoModule.tsx`

**Funcionalidades**:
- Artigos e tutoriais organizados
- Sistema de busca avançada
- FAQ dinâmico
- Vídeos explicativos
- Avaliação de utilidade dos conteúdos

### Recursos Avançados
- Chatbot com IA para respostas automáticas
- Integração com WhatsApp e Telegram
- Analytics de satisfação do suporte

---

## Maria Uni

### Visão Geral
**Localização**: `MariaUniModule.tsx`

Plataforma de ensino e capacitação para profissionais da rede, com cursos, certificações e trilhas de aprendizado.

### Funcionalidades Principais

#### 1. Gestão de Cursos
- Criação de cursos multimídia
- Trilhas de aprendizado personalizadas
- Avaliações e certificações
- Gamificação com pontuação
- Relatórios de progresso

#### 2. Biblioteca de Conteúdo
- Vídeos instrucionais
- Manuais em PDF
- Podcasts especializados
- Webinars ao vivo
- Simuladores práticos

#### 3. Certificações
- Certificados digitais
- Validação por QR Code
- Renovação automática
- Histórico de certificações

### Recursos Técnicos
- Streaming de vídeo integrado
- Sistema de avaliações online
- Gamificação com badges
- Mobile-first design
- Offline-first para áreas rurais

---

## Módulo de Agendamentos

### Visão Geral
**Localização**: `AgendamentosModule.tsx`

Sistema centralizado para gestão de todos os agendamentos da franquia, integrando clientes, profissionais e serviços.

### Funcionalidades Principais

#### 1. Agendamento Online
- Portal web para clientes
- App mobile para agendamentos
- Disponibilidade em tempo real
- Confirmação automática via WhatsApp

#### 2. Gestão Operacional
**Componentes**:
- `AgendamentosSearch.tsx`: Busca avançada
- `AgendamentosStats.tsx`: Estatísticas
- `AgendamentosTable.tsx`: Tabela principal
- `AgendamentosTabContent.tsx`: Abas de conteúdo

**Funcionalidades**:
- Otimização de rotas
- Redistribuição automática
- Controle de qualidade
- Feedback pós-serviço

#### 3. Relatórios e Analytics
- Taxa de ocupação dos profissionais
- Análise de produtividade
- Relatórios de no-show
- Métricas de satisfação

---

## Funcionalidades Transversais

### 1. Sistema de Governança
**Localização**: `governance/`

**Componentes**:
- `GovernanceModule.tsx`: Módulo principal
- `ActivityLogViewer.tsx`: Visualizador de logs
- `CompanyMetricsDashboard.tsx`: Dashboard de métricas
- `ModuleConfigurationPanel.tsx`: Painel de configuração

**Funcionalidades**:
- Auditoria completa de ações
- Controle de permissões granular
- Métricas de usabilidade
- Configuração de módulos por unidade

### 2. Sistema de Busca Global
**Localização**: `ModuleSearchDropdown.tsx`

- Busca unificada em todos os módulos
- Filtros inteligentes
- Histórico de buscas
- Sugestões contextuais

### 3. Sistema de Notificações
- Notificações push em tempo real
- Email marketing integrado
- SMS para lembretes críticos
- WhatsApp Business API

### 4. Relatórios Executivos
- Dashboards customizáveis
- Exportação automática
- Alertas de performance
- Benchmarking entre unidades

### 5. Integrações Externas
- APIs de pagamento (PIX, cartão)
- Google Maps para rotas
- WhatsApp Business
- Meta Business (Facebook/Instagram)
- Google My Business

---

## Segurança e Compliance

### Row Level Security (RLS)
- Políticas de acesso por empresa/unidade
- Segregação completa de dados
- Auditoria de todas as ações
- Controle de sessões

### Backup e Recuperação
- Backups automáticos diários
- Replicação geográfica
- Plano de recuperação de desastres
- Testes regulares de restore

### LGPD Compliance
- Controle de consentimento
- Anonimização de dados
- Relatórios de privacidade
- Gestão de direitos do titular

---

## Roadmap de Desenvolvimento

### Próximas Funcionalidades
1. **App Mobile Nativo** - React Native
2. **IA para Otimização de Rotas** - Machine Learning
3. **Integração com IoT** - Dispositivos inteligentes
4. **Blockchain para Certificações** - Verificação imutável
5. **Realidade Aumentada** - Treinamentos imersivos

### Melhorias Planejadas
- Performance otimizada com lazy loading
- PWA completo para uso offline
- Multilíngue para expansão internacional
- APIs públicas para parceiros

---

## Conclusão

O MariaFlow representa uma solução completa e escalável para gestão de franquias de serviços domiciliares. Sua arquitetura modular permite adaptação às necessidades específicas de cada unidade, enquanto mantém consistência e qualidade em toda a rede.

A plataforma está preparada para crescimento e evolução contínua, sempre focada na experiência do usuário e na eficiência operacional das franquias.

---

**Versão do Documento**: 1.1  
**Data de Criação**: 2025-01-14  
**Última Atualização**: 2025-08-15  
**Autor**: Equipe de Desenvolvimento MariaFlow

---

*Este documento é um guia vivo e será atualizado conforme a evolução do sistema. Última atualização: Implementação do Sistema de Vinculação de Usuários (15/08/2025).*
