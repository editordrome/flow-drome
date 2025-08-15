
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ActivityLog {
  id: string;
  module_name: string;
  action: string;
  description: string;
  metadata: Record<string, any>;
  created_at: string;
  users?: {
    nome: string;
    email: string;
  };
}

export const ActivityLogViewer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");

  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ['activity-logs', searchTerm, moduleFilter],
    queryFn: async () => {
      let query = supabase
        .from('activity_logs')
        .select(`
          *,
          users:user_id (
            nome,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (searchTerm) {
        query = query.or(`description.ilike.%${searchTerm}%,action.ilike.%${searchTerm}%`);
      }

      if (moduleFilter) {
        query = query.eq('module_name', moduleFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ActivityLog[];
    },
    staleTime: 30 * 1000, // 30 segundos
  });

  const uniqueModules = [...new Set(logs.map(log => log.module_name))];

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'view': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Log de Atividades do Sistema</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </CardTitle>
        
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por descrição ou ação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="">Todos os módulos</option>
              {uniqueModules.map(module => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{log.module_name}</Badge>
                    <Badge className={getActionColor(log.action)}>
                      {log.action}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </span>
                </div>
                
                <p className="text-sm mb-2">{log.description}</p>
                
                {log.users && (
                  <p className="text-xs text-gray-600">
                    Por: {log.users.nome} ({log.users.email})
                  </p>
                )}
                
                {Object.keys(log.metadata || {}).length > 0 && (
                  <details className="mt-2">
                    <summary className="text-xs text-blue-600 cursor-pointer">
                      Ver metadados
                    </summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
            
            {logs.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-500">
                Nenhum log de atividade encontrado
              </div>
            )}
            
            {isLoading && (
              <div className="text-center py-8 text-gray-500">
                Carregando logs...
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
