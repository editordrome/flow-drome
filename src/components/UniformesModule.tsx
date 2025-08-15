
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Search, ShirtIcon, Package, AlertTriangle } from "lucide-react";

const UniformesModule = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Uniformes</h1>
          <p className="text-gray-600">Catálogo de uniformes oficiais da franquia</p>
        </div>
        <Button className="bg-[#010d32] hover:bg-[#010d32]/90">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ver Carrinho (0)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShirtIcon className="h-5 w-5 text-blue-600" />
              Total de Itens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">3</div>
            <p className="text-sm text-gray-600">Disponíveis para compra</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-green-600" />
              Pedidos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-1">1</div>
            <p className="text-sm text-gray-600">Em processamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Gasto Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">R$ 395,50</div>
            <p className="text-sm text-gray-600">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Histórico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Ver Todos os Pedidos
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShirtIcon className="h-5 w-5" />
              Catálogo de Uniformes
            </CardTitle>
            <p className="text-sm text-gray-600">Uniformes oficiais da franquia DromeFlow</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input 
                  placeholder="Buscar uniformes..." 
                  className="w-full"
                />
              </div>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="camisetas">Camisetas</SelectItem>
                  <SelectItem value="calcas">Calças</SelectItem>
                  <SelectItem value="aventais">Aventais</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShirtIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Camiseta DromeFlow - Azul</h3>
                    <p className="text-sm text-gray-600">Camisetas • Estoque: 15</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">P</Badge>
                      <Badge variant="outline" className="text-xs">M</Badge>
                      <Badge variant="outline" className="text-xs">G</Badge>
                      <Badge variant="outline" className="text-xs">GG</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">R$ 35,90</div>
                  <Button size="sm" className="mt-2">
                    + Adicionar
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShirtIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Calça Jeans DromeFlow</h3>
                    <p className="text-sm text-gray-600">Calças • Estoque: 8</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">36</Badge>
                      <Badge variant="outline" className="text-xs">38</Badge>
                      <Badge variant="outline" className="text-xs">40</Badge>
                      <Badge variant="outline" className="text-xs">42</Badge>
                      <Badge variant="outline" className="text-xs">44</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">R$ 89,90</div>
                  <Button size="sm" className="mt-2">
                    + Adicionar
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShirtIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Avental DromeFlow - Branco</h3>
                    <p className="text-sm text-gray-600">Aventais • Estoque: 22</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">Único</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">R$ 25,90</div>
                  <Button size="sm" className="mt-2">
                    + Adicionar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Histórico de Pedidos
            </CardTitle>
            <p className="text-sm text-gray-600">Seus pedidos de uniformes</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Pedido #1</h3>
                <p className="text-sm text-gray-600">09/01/2025 • 6 itens</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">R$ 215,70</div>
                <Badge variant="secondary" className="mt-1">Em processamento</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Pedido #2</h3>
                <p className="text-sm text-gray-600">04/01/2025 • 4 itens</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">R$ 179,80</div>
                <Badge className="mt-1 bg-green-600">Entregue</Badge>
              </div>
            </div>

            <div className="text-center pt-4">
              <Button variant="outline" className="w-full">
                Ver Todos os Pedidos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UniformesModule;
