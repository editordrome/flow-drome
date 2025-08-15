
export const initialLeads = [
  {
    id: "1",
    name: "Tech Solutions Ltda",
    description: "Empresa interessada em automação",
    email: "contato@techsolutions.com",
    phone: "(11) 99999-0001",
    serviceType: "Limpeza Comercial",
    value: "R$ 12.500",
    stage: "novos",
    size: "Médio Porte",
    responsible: "João Silva",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "2",
    name: "Grupo ABC",
    description: "Necessita sistema integrado",
    email: "vendas@grupoabc.com",
    phone: "(11) 99999-0002",
    serviceType: "Limpeza Residencial",
    value: "R$ 28.000",
    stage: "novos",
    size: "Grande Porte",
    responsible: "Ana Costa",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "3",
    name: "Construtora JLM",
    description: "Interessados em sistema financeiro",
    email: "obras@construtorajlm.com",
    phone: "(11) 99999-0003",
    serviceType: "Pós-Obra",
    value: "R$ 35.000",
    stage: "contato",
    size: "Médio Porte",
    responsible: "Roberto Almeida",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "4",
    name: "Comércio Rápido ME",
    description: "Precisa de solução de PDV",
    email: "comercio@rapidome.com",
    phone: "(11) 99999-0004",
    serviceType: "Terceirização",
    value: "R$ 8.000",
    stage: "apresentacao",
    size: "Pequeno Porte",
    responsible: "Maria Santos",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  }
];

export const stages = [
  { 
    id: "novos", 
    title: "Novos Leads", 
    color: "border-t-blue-modern bg-blue-modern/10"
  },
  { 
    id: "contato", 
    title: "Contato Inicial", 
    color: "border-t-teal-modern bg-teal-modern/10"
  },
  { 
    id: "apresentacao", 
    title: "Apresentação", 
    color: "border-t-purple-500 bg-purple-50/50"
  },
  { 
    id: "proposta", 
    title: "Proposta", 
    color: "border-t-orange-modern bg-orange-modern/10"
  }
];
