
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ModuleConfigData {
  moduleKey: string;
  companyId?: string;
  unitId?: string;
  configuration?: Record<string, any>;
  permissions?: Record<string, any>;
  isActive?: boolean;
}

export const useModuleConfiguration = (moduleKey: string, companyId?: string, unitId?: string) => {
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ['module-configuration', moduleKey, companyId, unitId],
    queryFn: async () => {
      let query = supabase
        .from('module_configurations')
        .select('*')
        .eq('module_key', moduleKey);

      if (companyId) query = query.eq('company_id', companyId);
      if (unitId) query = query.eq('unit_id', unitId);

      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!moduleKey,
  });

  const updateConfig = useMutation({
    mutationFn: async (configData: Partial<ModuleConfigData>) => {
      const upsertData = {
        module_key: moduleKey,
        company_id: companyId || null,
        unit_id: unitId || null,
        configuration: configData.configuration || {},
        permissions: configData.permissions || {},
        is_active: configData.isActive ?? true,
      };

      const { data, error } = await supabase
        .from('module_configurations')
        .upsert(upsertData, { 
          onConflict: 'module_key,company_id,unit_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['module-configuration', moduleKey, companyId, unitId] 
      });
      toast.success('Configuração do módulo atualizada com sucesso');
    },
    onError: (error) => {
      console.error('Erro ao atualizar configuração:', error);
      toast.error('Erro ao atualizar configuração do módulo');
    }
  });

  return {
    config,
    isLoading,
    updateConfig: updateConfig.mutate,
    isUpdating: updateConfig.isPending
  };
};
