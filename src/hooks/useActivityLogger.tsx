
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ActivityLogData {
  moduleName: string;
  action: string;
  description?: string;
  metadata?: Record<string, any>;
}

export const useActivityLogger = () => {
  const logActivity = useMutation({
    mutationFn: async (data: ActivityLogData) => {
      // Obter dados do usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar informações do usuário na nossa base
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) throw new Error('Dados do usuário não encontrados');

      // Obter company_id e unit_id do contexto (se disponível)
      // Por enquanto vamos usar valores null - isso pode ser melhorado com context
      const company_id = null;
      const unit_id = null;

      // Chamar a função para registrar atividade
      const { data: result, error } = await supabase.rpc('log_system_activity', {
        p_user_id: userData.id,
        p_company_id: company_id,
        p_unit_id: unit_id,
        p_module_name: data.moduleName,
        p_action: data.action,
        p_description: data.description || '',
        p_metadata: data.metadata || {}
      });

      if (error) throw error;
      return result;
    },
    onError: (error) => {
      console.error('Erro ao registrar atividade:', error);
      // Não mostrar toast de erro para logs - isso pode ser muito intrusivo
    }
  });

  const log = (data: ActivityLogData) => {
    logActivity.mutate(data);
  };

  return { log, isLogging: logActivity.isPending };
};
