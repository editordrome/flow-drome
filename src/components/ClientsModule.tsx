
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, AlertTriangle, Building, ArrowUp } from "lucide-react";
import ClientsTable from "./ClientsTable";

const ClientsModule = () => {
  const stats = {
    total: { value: 5, trend: "+2" },
    active: { value: 2, trend: "+1" },
    attention: { value: 2, trend: "0" },
    contracts: { value: 1, trend: "0" }
  };

  return (
    <div className="space-y-8">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-kit-lg bg-kit-secondary text-white overflow-hidden">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-blue-100">Total de Clientes</p>
              <p className="text-3xl font-bold mt-2">{stats.total.value}</p>
              <div className="flex items-center text-xs text-blue-200 mt-2">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>{stats.total.trend} na semana</span>
              </div>
            </div>
            <div className="kit-icon-container bg-white/20">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-kit-lg bg-kit-accent text-white overflow-hidden">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-green-100">Clientes Ativos</p>
              <p className="text-3xl font-bold mt-2">{stats.active.value}</p>
              <div className="flex items-center text-xs text-green-200 mt-2">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>{stats.active.trend} na semana</span>
              </div>
            </div>
            <div className="kit-icon-container bg-white/20">
              <UserCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-kit-lg bg-orange-500 text-white overflow-hidden">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-orange-100">Em Atenção</p>
              <p className="text-3xl font-bold mt-2">{stats.attention.value}</p>
              <div className="flex items-center text-xs text-orange-200 mt-2">
                <span>{stats.attention.trend} na semana</span>
              </div>
            </div>
            <div className="kit-icon-container bg-white/20">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-kit-lg bg-teal-600 text-white overflow-hidden">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-teal-100">Com Contrato</p>
              <p className="text-3xl font-bold mt-2">{stats.contracts.value}</p>
              <div className="flex items-center text-xs text-teal-200 mt-2">
                <span>{stats.contracts.trend} na semana</span>
              </div>
            </div>
            <div className="kit-icon-container bg-white/20">
              <Building className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Componente principal da tabela */}
      <ClientsTable />
    </div>
  );
};

export default ClientsModule;
