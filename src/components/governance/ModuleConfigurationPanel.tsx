
import { useState } from "react";
import { useModuleConfiguration } from "@/hooks/useModuleConfiguration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Save, RefreshCw } from "lucide-react";

interface ModuleConfigurationPanelProps {
  moduleKey: string;
  moduleName: string;
  companyId?: string;
  unitId?: string;
}

export const ModuleConfigurationPanel = ({ 
  moduleKey, 
  moduleName, 
  companyId, 
  unitId 
}: ModuleConfigurationPanelProps) => {
  const { config, isLoading, updateConfig, isUpdating } = useModuleConfiguration(
    moduleKey, 
    companyId, 
    unitId
  );

  const [formData, setFormData] = useState({
    isActive: config?.is_active ?? true,
    configuration: JSON.stringify(config?.configuration || {}, null, 2),
    permissions: JSON.stringify(config?.permissions || {}, null, 2)
  });

  const handleSave = () => {
    try {
      const configurationData = JSON.parse(formData.configuration);
      const permissionsData = JSON.parse(formData.permissions);

      updateConfig({
        moduleKey,
        companyId,
        unitId,
        configuration: configurationData,
        permissions: permissionsData,
        isActive: formData.isActive
      });
    } catch (error) {
      console.error('Erro ao fazer parse do JSON:', error);
      // toast.error('JSON inválido nas configurações');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Carregando configurações...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuração do Módulo: {moduleName}
          <Badge variant={formData.isActive ? "default" : "secondary"}>
            {formData.isActive ? "Ativo" : "Inativo"}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="module-active"
              checked={formData.isActive}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, isActive: checked }))
              }
            />
            <Label htmlFor="module-active">Módulo Ativo</Label>
          </div>

          <Tabs defaultValue="configuration" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="configuration">Configurações</TabsTrigger>
              <TabsTrigger value="permissions">Permissões</TabsTrigger>
            </TabsList>

            <TabsContent value="configuration" className="space-y-4">
              <div>
                <Label htmlFor="config-json">Configurações (JSON)</Label>
                <Textarea
                  id="config-json"
                  rows={10}
                  value={formData.configuration}
                  onChange={(e) => 
                    setFormData(prev => ({ ...prev, configuration: e.target.value }))
                  }
                  className="font-mono text-sm"
                  placeholder='{"exemplo": "valor"}'
                />
                <p className="text-xs text-gray-500 mt-1">
                  Configure as opções específicas do módulo em formato JSON
                </p>
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
              <div>
                <Label htmlFor="permissions-json">Permissões (JSON)</Label>
                <Textarea
                  id="permissions-json"
                  rows={10}
                  value={formData.permissions}
                  onChange={(e) => 
                    setFormData(prev => ({ ...prev, permissions: e.target.value }))
                  }
                  className="font-mono text-sm"
                  placeholder='{"read": true, "write": false}'
                />
                <p className="text-xs text-gray-500 mt-1">
                  Defina as permissões de acesso para este módulo
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={isUpdating}
              className="flex items-center gap-2"
            >
              {isUpdating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Salvar Configurações
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
