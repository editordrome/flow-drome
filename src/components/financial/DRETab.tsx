
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FinancialData {
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;
  cashFlow: number;
  pending: number;
  monthlyGrowth: number;
}

interface DRETabProps {
  financialData: FinancialData;
}

const DRETab = ({ financialData }: DRETabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>DRE - Demonstrativo de Resultados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-green-modern mb-2">RECEITAS</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Serviços PF</span>
                  <span>R$ 28.500</span>
                </div>
                <div className="flex justify-between">
                  <span>Serviços PJ</span>
                  <span>R$ 16.731</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>TOTAL RECEITAS</span>
                  <span>R$ {financialData.revenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-orange-modern mb-2">DESPESAS</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Folha de Pagamento</span>
                  <span>R$ 15.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Materiais</span>
                  <span>R$ 3.200</span>
                </div>
                <div className="flex justify-between">
                  <span>Estrutura</span>
                  <span>R$ 4.850</span>
                </div>
                <div className="flex justify-between">
                  <span>Marketing</span>
                  <span>R$ 2.100</span>
                </div>
                <div className="flex justify-between">
                  <span>Outros</span>
                  <span>R$ 3.300</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>TOTAL DESPESAS</span>
                  <span>R$ {financialData.expenses.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-2 pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>LUCRO LÍQUIDO</span>
              <span className="text-blue-modern">R$ {financialData.profit.toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Margem de Lucro: {financialData.margin}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DRETab;
