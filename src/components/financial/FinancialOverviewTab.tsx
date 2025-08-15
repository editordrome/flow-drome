
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface FinancialData {
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;
  cashFlow: number;
  pending: number;
  monthlyGrowth: number;
}

interface FinancialOverviewTabProps {
  financialData: FinancialData;
}

const FinancialOverviewTab = ({ financialData }: FinancialOverviewTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Caixa (30 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Entradas</span>
              <span className="font-semibold text-green-modern">R$ {financialData.revenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Saídas</span>
              <span className="font-semibold text-orange-modern">R$ {financialData.expenses.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Saldo Líquido</span>
                <span className="font-bold text-blue-modern">R$ {financialData.profit.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pendências Financeiras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">A Receber (Vencido)</span>
              <span className="font-semibold text-red-600">R$ 4.500</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">A Receber (Pendente)</span>
              <span className="font-semibold text-yellow-modern">R$ 630</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">A Pagar (Vencendo)</span>
              <span className="font-semibold text-orange-modern">R$ 1.200</span>
            </div>
            <Progress value={65} className="w-full" />
            <p className="text-xs text-muted-foreground">65% das pendências em dia</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialOverviewTab;
