
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Clock, CheckCircle, AlertCircle } from "lucide-react";

const TicketsModule = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Central de Tickets</h1>
          <p className="text-gray-600 mt-1">Gerencie e acompanhe tickets de suporte</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Ticket
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Buscar tickets..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="aberto">Aberto</SelectItem>
            <SelectItem value="aguardando">Aguardando</SelectItem>
            <SelectItem value="resolvido">Resolvido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-700">Tickets Abertos</CardTitle>
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">1</div>
            <p className="text-sm text-gray-500 mt-1">Aguardando resposta</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-700">Aguardando</CardTitle>
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">1</div>
            <p className="text-sm text-gray-500 mt-1">Sua resposta</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-700">Resolvidos</CardTitle>
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">1</div>
            <p className="text-sm text-gray-500 mt-1">Este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle>Meus Tickets</CardTitle>
          <p className="text-gray-600">Acompanhe o status dos seus tickets de suporte</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Ticket Item */}
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <h3 className="font-semibold">Problema com agendamento de clientes</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">TICK-001 • Técnico • Criado em 14/01/2025</p>
                  <p className="text-sm text-gray-500">Última resposta: 15/01, 14:30</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-red-100 text-red-700">Alta</Badge>
                  <Badge variant="destructive">Aberto</Badge>
                </div>
              </div>
            </div>

            {/* Ticket Item */}
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <h3 className="font-semibold">Dúvida sobre processo de cobrança</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">TICK-002 • Financeiro • Criado em 13/01/2025</p>
                  <p className="text-sm text-gray-500">Última resposta: 14/01, 16:45</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Média</Badge>
                  <Badge variant="secondary">Aguardando</Badge>
                </div>
              </div>
            </div>

            {/* Ticket Item */}
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <h3 className="font-semibold">Solicitação de material promocional</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">TICK-003 • Marketing • Criado em 11/01/2025</p>
                  <p className="text-sm text-gray-500">Última resposta: 13/01, 10:20</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">Baixa</Badge>
                  <Badge variant="outline" className="bg-green-600 text-white">Resolvido</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketsModule;
