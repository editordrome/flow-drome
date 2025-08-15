
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, Clock } from "lucide-react";

const ContasPagarModule = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Contas a Pagar</h1>
        <Button className="bg-blue-modern hover:bg-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      {/* Barra de busca e filtros */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar fornecedor..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total a Pagar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">R$ 2.050,00</div>
            <p className="text-sm text-gray-600">3 contas pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Vencendo em 7 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">R$ 1.200,00</div>
            <p className="text-sm text-gray-600">1 conta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pagas este mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-modern">R$ 3.450,00</div>
            <p className="text-sm text-gray-600">8 contas</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de contas */}
      <Card>
        <CardHeader>
          <CardTitle>Contas a Pagar</CardTitle>
          <p className="text-sm text-gray-600">Gerencie todas as suas contas e fornecedores</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Conta 1 */}
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div className="flex-1">
              <h4 className="font-medium">Empresa de Limpeza ABC</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Categoria: Materiais</span>
                <span>•</span>
                <span>Vencimento: 19/01/2025</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-bold">R$ 1200,00</div>
                <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                  Pendente
                </Badge>
              </div>
              <Button className="bg-blue-modern hover:bg-blue-600">
                Pagar
              </Button>
              <Button variant="outline">
                Editar
              </Button>
            </div>
          </div>

          {/* Conta 2 */}
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div className="flex-1">
              <h4 className="font-medium">Fornecedor de Uniformes XYZ</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Categoria: Uniformes</span>
                <span>•</span>
                <span>Vencimento: 14/01/2025</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-bold">R$ 850,00</div>
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  Vencida
                </Badge>
              </div>
              <Button variant="outline">
                Editar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContasPagarModule;
