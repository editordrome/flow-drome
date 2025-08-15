
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const DashboardFinanceiroModule = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Financeiro</h1>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
            <div className="h-8 w-8 bg-green-modern/20 rounded-lg flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-green-modern" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-modern">R$ 45.231,89</div>
            <div className="flex items-center text-xs text-green-modern">
              <TrendingUp className="h-3 w-3 mr-1" />
              +20,1% em relação ao mês anterior
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
            <div className="h-8 w-8 bg-orange-modern/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-orange-modern" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-modern">R$ 23.456,78</div>
            <div className="flex items-center text-xs text-orange-modern">
              <TrendingDown className="h-3 w-3 mr-1" />
              -4,3% em relação ao mês anterior
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
            <div className="text-2xl font-bold text-blue-modern">R$ 21.775,11</div>
            <div className="flex items-center text-xs text-blue-modern">
              <TrendingUp className="h-3 w-3 mr-1" />
              +32,5% em relação ao mês anterior
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas em Atraso</CardTitle>
            <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <div className="text-xs text-red-600">
              Requer atenção imediata
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="visao-geral" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-cream-modern border-2 border-cream-modern">
          <TabsTrigger 
            value="visao-geral"
            className="data-[state=active]:bg-blue-modern data-[state=active]:text-white"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger 
            value="fluxo-caixa"
            className="data-[state=active]:bg-blue-modern data-[state=active]:text-white"
          >
            Fluxo de Caixa
          </TabsTrigger>
          <TabsTrigger 
            value="pendencias"
            className="data-[state=active]:bg-blue-modern data-[state=active]:text-white"
          >
            Pendências
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolução Mensal</CardTitle>
                <p className="text-sm text-gray-600">Receitas e despesas dos últimos 6 meses</p>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center text-gray-400">
                Gráfico de evolução mensal...
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Receitas</CardTitle>
                <p className="text-sm text-gray-600">Por categoria de serviço</p>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center text-gray-400">
                Gráfico de pizza...
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pendencias" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações Pendentes</CardTitle>
              <p className="text-sm text-gray-600">Itens que requerem sua atenção</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <h4 className="font-medium text-red-800">Fatura Vencida - Cliente João Silva</h4>
                  <p className="text-sm text-red-600">Valor: R$ 850,00 - Vencimento: 15/01/2025</p>
                </div>
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <h4 className="font-medium text-yellow-800">Pagamento de Fornecedor Pendente</h4>
                  <p className="text-sm text-yellow-600">Valor: R$ 1.200,00 - Vencimento: 20/01/2025</p>
                </div>
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardFinanceiroModule;
