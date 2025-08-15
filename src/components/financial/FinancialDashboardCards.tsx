
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  AlertCircle
} from "lucide-react";

interface FinancialData {
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;
  cashFlow: number;
  pending: number;
  monthlyGrowth: number;
}

interface FinancialDashboardCardsProps {
  financialData: FinancialData;
}

const FinancialDashboardCards = ({ financialData }: FinancialDashboardCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
          <div className="h-8 w-8 bg-green-modern/20 rounded-lg flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-green-modern" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-modern">R$ {financialData.revenue.toLocaleString()}</div>
          <div className="flex items-center text-xs text-green-modern">
            <TrendingUp className="h-3 w-3 mr-1" />
            +{financialData.monthlyGrowth}% vs mês anterior
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas</CardTitle>
          <div className="h-8 w-8 bg-orange-modern/20 rounded-lg flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-orange-modern" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-modern">R$ {financialData.expenses.toLocaleString()}</div>
          <div className="flex items-center text-xs text-orange-modern">
            <TrendingDown className="h-3 w-3 mr-1" />
            {((financialData.expenses / financialData.revenue) * 100).toFixed(1)}% da receita
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
          <div className="h-8 w-8 bg-blue-modern/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-blue-modern" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-modern">R$ {financialData.profit.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">
            Margem: {financialData.margin}%
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fluxo de Caixa</CardTitle>
          <div className="h-8 w-8 bg-teal-modern/20 rounded-lg flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-teal-modern" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-teal-modern">R$ {financialData.cashFlow.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">
            Saldo atual disponível
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialDashboardCards;
