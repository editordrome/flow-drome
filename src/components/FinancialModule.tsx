
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinancialDashboardCards from "./financial/FinancialDashboardCards";
import FinancialOverviewTab from "./financial/FinancialOverviewTab";
import AccountsReceivableTab from "./financial/AccountsReceivableTab";
import AccountsPayableTab from "./financial/AccountsPayableTab";
import DRETab from "./financial/DRETab";

const FinancialModule = () => {
  const financialData = {
    revenue: 45231,
    expenses: 28450,
    profit: 16781,
    margin: 37.1,
    cashFlow: 8920,
    pending: 5640,
    monthlyGrowth: 12.5
  };

  const accountsReceivable = [
    {
      id: 1,
      client: "Maria Silva",
      amount: 280,
      dueDate: "2024-01-20",
      status: "pending",
      overdue: false
    },
    {
      id: 2,
      client: "Empresa ABC",
      amount: 4500,
      dueDate: "2024-01-15",
      status: "overdue",
      overdue: true
    },
    {
      id: 3,
      client: "João Santos",
      amount: 350,
      dueDate: "2024-01-25",
      status: "paid",
      overdue: false
    }
  ];

  const accountsPayable = [
    {
      id: 1,
      supplier: "Produtos de Limpeza XYZ",
      amount: 1200,
      dueDate: "2024-01-18",
      status: "pending",
      category: "Material"
    },
    {
      id: 2,
      supplier: "Folha de Pagamento",
      amount: 15000,
      dueDate: "2024-01-30",
      status: "scheduled",
      category: "Pessoal"
    },
    {
      id: 3,
      supplier: "Aluguel Escritório",
      amount: 2500,
      dueDate: "2024-01-10",
      status: "paid",
      category: "Estrutura"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-sm border-blue-modern/30 text-blue-modern">
          Janeiro 2024
        </Badge>
      </div>

      <FinancialDashboardCards financialData={financialData} />

      <Tabs defaultValue="visao-geral" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-cream-modern border-2 border-cream-modern">
          <TabsTrigger 
            value="visao-geral"
            className="data-[state=active]:bg-blue-modern data-[state=active]:text-white"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger 
            value="contas-receber"
            className="data-[state=active]:bg-blue-modern data-[state=active]:text-white"
          >
            A Receber
          </TabsTrigger>
          <TabsTrigger 
            value="contas-pagar"
            className="data-[state=active]:bg-blue-modern data-[state=active]:text-white"
          >
            A Pagar
          </TabsTrigger>
          <TabsTrigger 
            value="dre"
            className="data-[state=active]:bg-blue-modern data-[state=active]:text-white"
          >
            DRE
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-6">
          <FinancialOverviewTab financialData={financialData} />
        </TabsContent>

        <TabsContent value="contas-receber" className="space-y-6">
          <AccountsReceivableTab accountsReceivable={accountsReceivable} />
        </TabsContent>

        <TabsContent value="contas-pagar" className="space-y-6">
          <AccountsPayableTab accountsPayable={accountsPayable} />
        </TabsContent>

        <TabsContent value="dre" className="space-y-6">
          <DRETab financialData={financialData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialModule;
