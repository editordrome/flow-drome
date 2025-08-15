
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityLogViewer } from "./ActivityLogViewer";
import { CompanyMetricsDashboard } from "./CompanyMetricsDashboard";
import { ModuleConfigurationPanel } from "./ModuleConfigurationPanel";
import { 
  Shield, 
  BarChart3, 
  Settings, 
  Activity,
  Users,
  Building,
  FileText
} from "lucide-react";

export const GovernanceModule = () => {
  // Por enquanto usando um ID fixo - em produção viria do contexto da empresa
  const companyId = "example-company-id";

  const modules = [
    { key: "agenda", name: "Agenda" },
    { key: "commercial", name: "Comercial" },
    { key: "clients", name: "Clientes" },
    { key: "professionals", name: "Profissionais" },
    { key: "financial", name: "Financeiro" },
    { key: "marketing", name: "Marketing" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Governança e Auditoria</h1>
          <p className="text-gray-600">
            Controle completo sobre métricas, logs e configurações do sistema
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Fase 1: Base Fortalecida
        </Badge>
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Métricas
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Logs de Atividade
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuração de Módulos
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <CompanyMetricsDashboard companyId={companyId} />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityLogViewer />
        </TabsContent>

        <TabsContent value="modules">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuração de Módulos</CardTitle>
                <p className="text-sm text-gray-600">
                  Configure e gerencie as funcionalidades de cada módulo do sistema
                </p>
              </CardHeader>
            </Card>

            <div className="grid gap-6">
              {modules.map((module) => (
                <ModuleConfigurationPanel
                  key={module.key}
                  moduleKey={module.key}
                  moduleName={module.name}
                  companyId={companyId}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Status de Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Auditoria de Dados</p>
                      <p className="text-sm text-gray-600">Logs implementados</p>
                    </div>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Métricas de Performance</p>
                      <p className="text-sm text-gray-600">Coleta automática</p>
                    </div>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Configuração Modular</p>
                      <p className="text-sm text-gray-600">Sistema flexível</p>
                    </div>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Próximas Funcionalidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Sistema de Papéis Avançado</p>
                      <p className="text-sm text-gray-600">Gestão granular de permissões por módulo</p>
                    </div>
                    <Badge variant="secondary">Fase 2</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Portal da Gestora</p>
                      <p className="text-sm text-gray-600">Interface para gerenciar múltiplas unidades</p>
                    </div>
                    <Badge variant="secondary">Fase 2</Badge>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">DromeFlow SuperAdmin</p>
                      <p className="text-sm text-gray-600">Governança centralizada do ecossistema</p>
                    </div>
                    <Badge variant="secondary">Fase 3</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
