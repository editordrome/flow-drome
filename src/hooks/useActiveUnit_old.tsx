import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Unit {
  id: string;
  name: string;
  status: string;
  cnpj?: string;
}

interface UserModulePermission {
  module_id: string;
  module_name: string;
  module_display_name: string;
  category: string;
  is_core: boolean;
}

interface ActiveUnitContextType {
  activeUnit: Unit | null;
  userUnits: Unit[];
  availableModules: UserModulePermission[];
  loading: boolean;
  switchUnit: (unitId: string) => void;
  refreshModules: () => void;
}

const ActiveUnitContext = createContext<ActiveUnitContextType | undefined>(undefined);

export function ActiveUnitProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeUnit, setActiveUnit] = useState<Unit | null>(null);
  const [userUnits, setUserUnits] = useState<Unit[]>([]);
  const [availableModules, setAvailableModules] = useState<UserModulePermission[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para carregar unidades do usuário
  const loadUserUnits = async () => {
    if (!user?.id) return;

    try {
      // Se for Super Admin, carregar todas as unidades
      if (user.is_super_admin) {
        const { data: allUnits, error } = await supabase
          .from('units')
          .select('id, name, status, cnpj')
          .eq('status', 'active')
          .order('name');

        if (error) throw error;
        setUserUnits(allUnits || []);
        
        // Super Admin começa com MB Drome como unidade chave
        if (!activeUnit && allUnits?.length) {
          const savedUnitId = localStorage.getItem(`activeUnit_${user.id}`);
          let unitToSet;
          
          if (savedUnitId) {
            unitToSet = allUnits.find(u => u.id === savedUnitId);
          }
          
          // Se não há unidade salva ou não encontrou, usar MB Drome como padrão
          if (!unitToSet) {
            unitToSet = allUnits.find(u => u.name === 'MB Drome') || allUnits[0];
          }
          
          setActiveUnit(unitToSet);
        }
        
      } else {
        // Carregar apenas unidades vinculadas ao usuário
        const { data: userAssignments, error } = await supabase
          .from('user_unit_assignments')
          .select(`
            *,
            units:unit_id (
              id,
              name,
              status,
              cnpj
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;
        
        const units = userAssignments?.map(assignment => assignment.units).filter(Boolean) || [];
        setUserUnits(units);
        
        // Para usuários normais, sempre definir primeira unidade como ativa
        if (!activeUnit && units.length) {
          const savedUnitId = localStorage.getItem(`activeUnit_${user.id}`);
          const unitToSet = savedUnitId 
            ? units.find(u => u.id === savedUnitId) || units[0]
            : units[0];
          setActiveUnit(unitToSet);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar unidades:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as unidades do usuário",
        variant: "destructive"
      });
    }
  };

  // Função para carregar módulos disponíveis para o usuário na unidade ativa
  const loadAvailableModules = async () => {
    if (!user?.id || !activeUnit?.id) {
      console.log('⚠️ LoadAvailableModules: Faltam dados', { userId: user?.id, activeUnitId: activeUnit?.id });
      return;
    }

    console.log('🔄 LoadAvailableModules iniciado', { 
      userId: user?.id, 
      activeUnitId: activeUnit?.id, 
      activeUnitName: activeUnit?.name,
      userRoleLevel: user?.role_level,
      isSuperAdmin: user?.is_super_admin
    });

    try {
      // Super Admin tem acesso baseado na unidade ativa
      if (user.is_super_admin) {
        console.log('👑 Super Admin - carregando módulos da unidade ativa');
        return loadUnitModules();
      }
      
      // Admin (level >= 80): acesso a todos os módulos ativos da unidade
      if (user?.role_level >= 80) {
        console.log('👑 Admin - carregando todos os módulos da unidade');
        return loadUnitModules();
      } 
      
      // Atendente (level < 80): acesso apenas aos módulos com permissão específica
      console.log('👤 Atendente - carregando módulos com permissão específica');
      return loadAtendantModules();
      
    } catch (error) {
      console.error('❌ Erro em loadAvailableModules:', error);
      setAvailableModules([]);
    }
  };

  // Função para carregar módulos da unidade (Super Admin e Admin)
  const loadUnitModules = async () => {
        
        // Usar query separada para evitar problemas de relacionamento do Supabase
        // 1. Buscar unit_modules ativos
        const { data: unitModulesRaw, error: umError } = await supabase
          .from('unit_modules')
          .select('*')
          .eq('unit_id', activeUnit.id)
          .eq('is_active', true);

        if (umError) throw umError;
        
        console.log('📦 Unit modules brutos recebidos:', unitModulesRaw?.length || 0, unitModulesRaw);

        if (!unitModulesRaw || unitModulesRaw.length === 0) {
          console.log('⚠️ Nenhum unit_module ativo encontrado');
          setAvailableModules([]);
          return;
        }

        // 2. Buscar informações dos módulos separadamente
        const moduleIds = unitModulesRaw.map(um => um.module_id).filter(Boolean);
        console.log('🔍 IDs dos módulos para buscar:', moduleIds);

        const { data: modulesData, error: modulesError } = await supabase
          .from('modules')
          .select('id, name, display_name, category, is_core')
          .in('id', moduleIds);

        if (modulesError) throw modulesError;
        
        console.log('� Dados dos módulos recebidos:', modulesData?.length || 0, modulesData);

        // 3. Combinar os dados manualmente
        const modules = unitModulesRaw.map(um => {
          const moduleInfo = modulesData?.find(m => m.id === um.module_id);
          
          if (!moduleInfo) {
            console.warn('⚠️ Módulo não encontrado para unit_module:', um);
            return null;
          }
          
          return {
            module_id: moduleInfo.id,
            module_name: moduleInfo.name,
            module_display_name: moduleInfo.display_name,
            category: moduleInfo.category,
            is_core: moduleInfo.is_core
          };
        }).filter(Boolean) || [];

        console.log('✅ Módulos processados para Admin:', modules.length, modules);
        setAvailableModules(modules);
      } else {
        console.log('👤 Usuário Atendente - carregando módulos com permissão específica');
        
        // Para atendentes: módulos com permissão específica + módulos core ativos
        
        // 1. Buscar permissões específicas do usuário
        const { data: userPermissionsRaw, error: permError } = await supabase
          .from('user_module_permissions')
          .select('*')
          .eq('user_id', user.id)
          .eq('unit_id', activeUnit.id);

        if (permError) throw permError;

        // 2. Buscar módulos core ativos na unidade  
        const { data: coreModulesRaw, error: coreError } = await supabase
          .from('unit_modules')
          .select('*')
          .eq('unit_id', activeUnit.id)
          .eq('is_active', true);

        if (coreError) throw coreError;

        // 3. Buscar informações dos módulos core separadamente
        const coreModulesFiltered = coreModulesRaw?.filter(um => {
          // Precisamos verificar se é core na tabela modules
          return true; // Por enquanto incluir todos, filtraremos depois
        }) || [];

        // 4. Coletar todos os module_ids únicos
        const permissionModuleIds = userPermissionsRaw?.map(up => up.module_id).filter(Boolean) || [];
        const coreModuleIds = coreModulesFiltered.map(um => um.module_id).filter(Boolean);
        const allModuleIds = [...new Set([...permissionModuleIds, ...coreModuleIds])];

        console.log('🔍 IDs dos módulos para atendente:', { permissionModuleIds, coreModuleIds, allModuleIds });

        if (allModuleIds.length === 0) {
          console.log('⚠️ Nenhum módulo encontrado para atendente');
          setAvailableModules([]);
          return;
        }

        // 5. Buscar informações dos módulos
        const { data: modulesData, error: modulesError } = await supabase
          .from('modules')
          .select('id, name, display_name, category, is_core')
          .in('id', allModuleIds);

        if (modulesError) throw modulesError;

        // 6. Filtrar apenas módulos core que estão ativos + módulos com permissão
        const coreModulesFormatted = coreModulesFiltered.map(um => {
          const moduleInfo = modulesData?.find(m => m.id === um.module_id && m.is_core);
          
          if (!moduleInfo) return null;
          
          return {
            module_id: moduleInfo.id,
            module_name: moduleInfo.name,
            module_display_name: moduleInfo.display_name,
            category: moduleInfo.category,
            is_core: moduleInfo.is_core
          };
        }).filter(Boolean) || [];

        const permissionModules = userPermissionsRaw?.map(up => {
          const moduleInfo = modulesData?.find(m => m.id === up.module_id);
          
          if (!moduleInfo) return null;
          
          return {
            module_id: moduleInfo.id,
            module_name: moduleInfo.name,
            module_display_name: moduleInfo.display_name,
            category: moduleInfo.category,
            is_core: moduleInfo.is_core
          };
        }).filter(Boolean) || [];

        // Combinar e remover duplicatas
        const allModules = [...permissionModules, ...coreModulesFormatted];
        const uniqueModules = allModules.filter((module, index, self) => 
          index === self.findIndex(m => m.module_id === module.module_id)
        );

        console.log('✅ Módulos processados para Atendente:', uniqueModules.length, uniqueModules);
        setAvailableModules(uniqueModules);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar módulos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os módulos disponíveis",
        variant: "destructive"
      });
    }
  };

  // Função para trocar de unidade
  const switchUnit = (unitId: string) => {
    const newUnit = userUnits.find(unit => unit.id === unitId);
    if (newUnit) {
      setActiveUnit(newUnit);
      localStorage.setItem(`activeUnit_${user?.id}`, unitId);
      toast({
        title: "Unidade alterada",
        description: `Agora você está trabalhando na unidade: ${newUnit.name}`,
        duration: 3000
      });
    }
  };

  // Função para atualizar módulos
  const refreshModules = () => {
    loadAvailableModules();
  };

  // Carregar dados quando o usuário ou unidade ativa mudar
  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      loadUserUnits();
    }
  }, [user?.id]);

  useEffect(() => {
    if (activeUnit?.id && user?.id) {
      loadAvailableModules().finally(() => setLoading(false));
    } else if (user?.id) {
      setLoading(false);
    }
  }, [activeUnit?.id, user?.id]);

  const value = {
    activeUnit,
    userUnits,
    availableModules,
    loading,
    switchUnit,
    refreshModules
  };

  return (
    <ActiveUnitContext.Provider value={value}>
      {children}
    </ActiveUnitContext.Provider>
  );
}

export function useActiveUnit() {
  const context = useContext(ActiveUnitContext);
  if (context === undefined) {
    throw new Error('useActiveUnit deve ser usado dentro de um ActiveUnitProvider');
  }
  return context;
}
