
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, AlertTriangle, History, Plus, ShoppingCart } from "lucide-react";

const MateriaisModule = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Materiais</h1>
          <p className="text-gray-600">Controle de estoque e sugestões de compra</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <History className="h-4 w-4 mr-2" />
            Histórico
          </Button>
          <Button className="bg-[#010d32] hover:bg-[#010d32]/90">
            <Plus className="h-4 w-4 mr-2" />
            Novo Material
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-blue-600" />
              Total de Itens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">3</div>
            <p className="text-sm text-gray-600">Em estoque</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 mb-1">2</div>
            <p className="text-sm text-gray-600">Itens requerem reposição</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Valor do Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">R$ 388,80</div>
            <p className="text-sm text-gray-600">Valor total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Compras do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-1">R$ 567,80</div>
            <p className="text-sm text-gray-600">Janeiro 2025</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Controle de Estoque
            </CardTitle>
            <p className="text-sm text-gray-600">Gerencie os materiais e produtos da sua franquia</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input 
                  placeholder="Buscar materiais..." 
                  className="w-full"
                />
              </div>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="limpeza">Limpeza</SelectItem>
                  <SelectItem value="materiais">Materiais</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Detergente Multiuso 500ml</h3>
                    <p className="text-sm text-gray-600">Produtos de Limpeza • Distribuidora ABC</p>
                    <p className="text-sm text-gray-600">Estoque: 5 un • Mínimo: 10 un</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">R$ 8,90</div>
                  <Badge variant="destructive" className="mt-1">Crítico</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Pano de Microfibra</h3>
                    <p className="text-sm text-gray-600">Materiais • Fornecedor XYZ</p>
                    <p className="text-sm text-gray-600">Estoque: 25 un • Mínimo: 15 un</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">R$ 12,50</div>
                  <Badge variant="secondary" className="mt-1">Normal</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Desinfetante 1L</h3>
                    <p className="text-sm text-gray-600">Produtos de Limpeza • Distribuidora ABC</p>
                    <p className="text-sm text-gray-600">Estoque: 2 un • Mínimo: 8 un</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">R$ 15,90</div>
                  <Badge variant="destructive" className="mt-1">Crítico</Badge>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <Button variant="outline" className="w-full">
                Ver Todos os Materiais
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Sugestões de Compra
            </CardTitle>
            <p className="text-sm text-gray-600">Baseado no estoque atual e histórico de uso</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Detergente Multiuso 500ml</h3>
                <p className="text-sm text-gray-600">Quantidade sugerida: 20 unidades</p>
                <Badge variant="destructive" className="mt-1 text-xs">Estoque abaixo do mínimo</Badge>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">R$ 178,00</div>
                <Button size="sm" className="mt-2 bg-[#010d32] hover:bg-[#010d32]/90">
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Adicionar ao Pedido
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Desinfetante 1L</h3>
                <p className="text-sm text-gray-600">Quantidade sugerida: 15 unidades</p>
                <Badge variant="destructive" className="mt-1 text-xs">Estoque crítico</Badge>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">R$ 238,50</div>
                <Button size="sm" className="mt-2 bg-[#010d32] hover:bg-[#010d32]/90">
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Adicionar ao Pedido
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold">Total Sugerido:</span>
                <span className="text-xl font-bold">R$ 416,50</span>
              </div>
              <Button className="w-full bg-[#010d32] hover:bg-[#010d32]/90">
                Fazer Pedido Completo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MateriaisModule;
