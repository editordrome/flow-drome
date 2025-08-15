
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

const FluxoCaixaModule = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Fluxo de Caixa</h1>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <div className="h-8 w-8 bg-blue-modern/20 rounded-lg flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-blue-modern" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-modern">R$ 15.450,00</div>
            <div className="text-xs text-gray-600">
              Disponível em conta
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas do Mês</CardTitle>
            <div className="h-8 w-8 bg-green-modern/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-green-modern" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-modern">R$ 28.750,00</div>
            <div className="flex items-center text-xs text-green-modern">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15,2% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saídas do Mês</CardTitle>
            <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">R$ 13.300,00</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -8,1% vs mês anterior
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="movimentacoes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-cream-modern border-2 border-cream-modern">
          <TabsTrigger 
            value="movimentacoes"
            className="data-[state=active]:bg-blue-modern data-[state=active]:text-white"
          >
            Movimentações
          </TabsTrigger>
          <TabsTrigger 
            value="projecao"
            className="data-[state=active]:bg-blue-modern data-[state=active]:text-white"
          >
            Projeção
          </TabsTrigger>
          <TabsTrigger 
            value="categoria"
            className="data-[state=active]:bg-blue-modern data-[state=active]:text-white"
          >
            Por Categoria
          </TabsTrigger>
        </TabsList>

        <TabsContent value="movimentacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Movimentações Recentes</CardTitle>
              <p className="text-sm text-gray-600">Últimas entradas e saídas do caixa</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Movimentação 1 */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-green-modern/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-modern" />
                  </div>
                  <div>
                    <h4 className="font-medium">Recebimento - Cliente Maria Silva</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>14/01/2025</span>
                      <span>•</span>
                      <span>Serviços</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-modern">+R$ 850,00</div>
                  <Badge className="bg-green-modern/20 text-green-modern border-green-modern/30">
                    Entrada
                  </Badge>
                </div>
              </div>

              {/* Movimentação 2 */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Pagamento - Fornecedor ABC</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>13/01/2025</span>
                      <span>•</span>
                      <span>Materiais</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">R$ 1200,00</div>
                  <Badge className="bg-red-100 text-red-600 border-red-200">
                    Saída
                  </Badge>
                </div>
              </div>

              {/* Movimentação 3 */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-green-modern/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-modern" />
                  </div>
                  <div>
                    <h4 className="font-medium">Recebimento - Cliente João Santos</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>12/01/2025</span>
                      <span>•</span>
                      <span>Serviços</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-modern">+R$ 1200,00</div>
                  <Badge className="bg-green-modern/20 text-green-modern border-green-modern/30">
                    Entrada
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projecao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Projeção de Fluxo de Caixa</CardTitle>
              <p className="text-sm text-gray-600">Previsão para os próximos 30 dias</p>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-gray-400">
              Gráfico de projeção de fluxo de caixa...
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categoria" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fluxo por Categoria</CardTitle>
              <p className="text-sm text-gray-600">Análise de entrada e saída por categoria</p>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-gray-400">
              Gráfico por categoria...
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FluxoCaixaModule;
