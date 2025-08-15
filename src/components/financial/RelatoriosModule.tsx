
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, BarChart3, Receipt, CreditCard, TrendingUp, FileSpreadsheet } from "lucide-react";

const RelatoriosModule = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Relatórios Financeiros</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Select defaultValue="periodo">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Período do relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="periodo">Período do relatório</SelectItem>
              <SelectItem value="este-mes">Este mês</SelectItem>
              <SelectItem value="mes-anterior">Mês anterior</SelectItem>
              <SelectItem value="ultimo-trimestre">Último trimestre</SelectItem>
              <SelectItem value="este-ano">Este ano</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-modern hover:bg-blue-600">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Exportar Relatórios
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Demonstrativo de Resultados */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-modern/20 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-modern" />
              </div>
              <div>
                <CardTitle className="text-lg">Demonstrativo de Resultados</CardTitle>
                <p className="text-sm text-gray-600">Receitas, despesas e lucro do período</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        {/* Fluxo de Caixa */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-green-modern/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-green-modern" />
              </div>
              <div>
                <CardTitle className="text-lg">Fluxo de Caixa</CardTitle>
                <p className="text-sm text-gray-600">Entradas e saídas detalhadas</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        {/* Contas a Receber */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-teal-modern/20 rounded-lg flex items-center justify-center">
                <Receipt className="h-5 w-5 text-teal-modern" />
              </div>
              <div>
                <CardTitle className="text-lg">Contas a Receber</CardTitle>
                <p className="text-sm text-gray-600">Status dos recebimentos</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        {/* Contas a Pagar */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-orange-modern/20 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-orange-modern" />
              </div>
              <div>
                <CardTitle className="text-lg">Contas a Pagar</CardTitle>
                <p className="text-sm text-gray-600">Status dos pagamentos</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        {/* Análise por Cliente */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Análise por Cliente</CardTitle>
                <p className="text-sm text-gray-600">Rentabilidade por cliente</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        {/* Relatório de Impostos */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-yellow-modern/20 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-yellow-700" />
              </div>
              <div>
                <CardTitle className="text-lg">Relatório de Impostos</CardTitle>
                <p className="text-sm text-gray-600">Dados para contabilidade</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RelatoriosModule;
