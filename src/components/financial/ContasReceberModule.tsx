
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, MessageSquare } from "lucide-react";

const ContasReceberModule = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Contas a Receber</h1>
        <Button className="bg-blue-modern hover:bg-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          Nova Cobrança
        </Button>
      </div>

      {/* Barra de busca e filtros */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar cliente..."
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
            <CardTitle className="text-sm font-medium text-gray-600">Total a Receber</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-modern">R$ 2.050,00</div>
            <p className="text-sm text-gray-600">2 contas pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Em Atraso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">R$ 850,00</div>
            <p className="text-sm text-gray-600">1 conta vencida</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Recebidas este mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-modern">R$ 12.450,00</div>
            <p className="text-sm text-gray-600">18 contas</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de contas */}
      <Card>
        <CardHeader>
          <CardTitle>Contas a Receber</CardTitle>
          <p className="text-sm text-gray-600">Gerencie todas as suas cobranças e recebimentos</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Conta 1 */}
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div className="flex-1">
              <h4 className="font-medium">Maria Silva</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Serviço: Limpeza Residencial</span>
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
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Cobrar
              </Button>
              <Button variant="outline" size="sm">
                Editar
              </Button>
            </div>
          </div>

          {/* Conta 2 */}
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div className="flex-1">
              <h4 className="font-medium">João Santos</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Serviço: Limpeza Comercial</span>
                <span>•</span>
                <span>Vencimento: 21/01/2025</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-bold">R$ 1200,00</div>
                <Badge variant="outline" className="border-blue-300 text-blue-700">
                  Pendente
                </Badge>
              </div>
              <Button className="bg-blue-modern hover:bg-blue-600" size="sm">
                Confirmar Pagto
              </Button>
              <Button variant="outline" size="sm">
                Editar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContasReceberModule;
