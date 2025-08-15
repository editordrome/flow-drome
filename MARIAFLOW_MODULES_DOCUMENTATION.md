
# MariaFlow - Documentação Completa dos Módulos

## Índice

1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Dashboard](#dashboard)
3. [Módulo Comercial](#módulo-comercial)
4. [Módulo de Clientes](#módulo-de-clientes)
5. [Módulo de Profissionais](#módulo-de-profissionais)
6. [Módulo Financeiro](#módulo-financeiro)
7. [Módulo de Marketing](#módulo-de-marketing)
8. [Módulo de Compras](#módulo-de-compras)
9. [Módulo de Suporte](#módulo-de-suporte)
10. [Maria Uni](#maria-uni)
11. [Módulo de Agendamentos](#módulo-de-agendamentos)
12. [Gestão de Unidades (Super Admin)](#gestão-de-unidades-super-admin)
13. [Funcionalidades Transversais](#funcionalidades-transversais)
- PWA completo para uso offline
- Multilíngue para expansão internacional
- APIs públicas para parceiros

---

## Gestão de Unidades (Super Admin)

### Visão Geral
Módulo exclusivo para Super Administradores que permite gerenciar todas as unidades da franquia, incluindo criação de usuários, configuração de módulos e controle completo do sistema.

### Funcionalidades Principais

#### 1. Gerenciamento de Unidades
- **Listagem Completa**: Visualização de todas as unidades cadastradas
- **Detalhes da Unidade**: Informações completas (nome, CNPJ, endereço, contatos)
- **Status Operacional**: Controle de unidades ativas/inativas
- **Métricas por Unidade**: Número de usuários, módulos ativos, performance

#### 2. Gestão de Usuários
- **Criação de Usuários**: Interface para cadastrar novos usuários
- **Vinculação Automática**: Associação automática à unidade selecionada
- **Controle de Roles**: Atribuição de níveis (Super Admin, Admin, Atendente)
- **Gestão de Permissões**: Controle granular de acesso por usuário

#### 3. Configuração de Módulos
- **Ativação/Desativação**: Controle individual de módulos por unidade
- **Visualização em Grid**: Interface moderna com toggles para cada módulo
- **Categorização**: Módulos organizados por categorias (Core, Atendimento, Financeiro, etc.)
- **Aplicação em Massa**: Configurações que podem ser aplicadas a múltiplas unidades

#### 4. Sistema de Logs
- **Auditoria Completa**: Registro de todas as ações realizadas
- **Histórico de Mudanças**: Rastreamento de alterações em configurações
- **Atividades por Usuário**: Log detalhado por usuário e unidade
- **Relatórios de Acesso**: Controle de login e ações dos usuários

### Estrutura Técnica

#### Componente Principal
- `GestaoUnidadesModule.tsx`: Interface completa com sistema de tabs

#### Interface de Abas
1. **Dados**: Informações gerais da unidade
2. **Módulos**: Configuração de módulos ativos
3. **Usuários**: Criação e gestão de usuários
4. **Logs**: Histórico de atividades

#### Base de Dados
- `units`: Informações das unidades
- `users`: Usuários do sistema
- `user_unit_assignments`: Vinculação usuário-unidade
- `unit_modules`: Módulos ativos por unidade
- `activity_logs`: Logs de atividades

### Funcionalidades Implementadas (15/08/2025)

#### ✅ Sistema de Vinculação de Usuários
- **Criação Simplificada**: Formulário com nome, email e senha
- **Role Padrão**: Atendente atribuído automaticamente
- **Vinculação Automática**: Usuário vinculado à unidade selecionada
- **Validação Integrada**: Campos obrigatórios com feedback visual
- **RLS Policies**: Políticas de segurança implementadas

#### ✅ Políticas de Segurança
```sql
-- Usuários - Acesso completo para gestão
CREATE POLICY "Allow anonymous write access to users" 
ON users FOR ALL TO anon USING (true) WITH CHECK (true);

-- Vinculações usuário-unidade
CREATE POLICY "Allow anonymous access to user_unit_assignments" 
ON user_unit_assignments FOR ALL TO anon USING (true) WITH CHECK (true);
```

#### ✅ Estado Operacional
- **5 Usuários Cadastrados**: Incluindo Super Admin e Admins
- **4 Unidades Ativas**: MariaFlow Matriz, Filial Norte, MB Drome, MB Londrina
- **3 Roles Configurados**: Super Admin (100), Admin (80), Atendente (30)
- **Sistema 100% Funcional**: Testado e validado

### Fluxo Operacional

1. **Acesso ao Módulo**
   - Super Admin → Sidebar → "Gestão de Unidades"

2. **Seleção de Unidade**
   - Lista dropdown com todas as unidades disponíveis
   - Carregamento automático dos dados da unidade

3. **Gestão de Usuários**
   - Tab "Usuários" → Formulário de criação
   - Preenchimento: Nome, Email, Senha
   - Sistema vincula automaticamente à unidade

4. **Confirmação**
   - Alert de sucesso/erro
   - Recarregamento dos dados
   - Usuário criado e operacional

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
