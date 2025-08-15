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
      console.log('🔄 LoadUserUnits iniciado para:', user.email, 'Role Level:', user.role_level);

      // Se for Super Admin, carregar todas as unidades
      if (user.is_super_admin) {
        console.log('👑 Super Admin: carregando todas as unidades');
        const { data: allUnits, error } = await supabase
          .from('units')
          .select('id, name, status, cnpj')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        
        setUserUnits(allUnits || []);
        
        // Definir unidade ativa (MB Drome prioritário, senão primeira)
        const mbDrome = allUnits?.find(unit => unit.name === 'MB Drome');
        const defaultUnit = mbDrome || allUnits?.[0];
        
        if (defaultUnit && defaultUnit.id !== activeUnit?.id) {
          console.log('🏢 Super Admin: definindo unidade ativa:', defaultUnit.name);
          setActiveUnit(defaultUnit);
        }
      } else {
        // Para outros usuários, buscar apenas unidades vinculadas
        console.log('👤 Usuário regular: buscando unidades vinculadas');
        const { data: assignments, error } = await supabase
          .from('user_unit_assignments')
          .select(`
            units:unit_id (
              id,
              name,
              status,
              cnpj
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        const units = assignments?.map(a => a.units).filter(Boolean) || [];
        setUserUnits(units);
        
        // Definir primeira unidade como ativa
        if (units.length > 0 && units[0].id !== activeUnit?.id) {
          console.log('🏢 Usuário regular: definindo unidade ativa:', units[0].name);
          setActiveUnit(units[0]);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao carregar unidades:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar unidades do usuário",
        variant: "destructive"
      });
    }
  };

  // Função para carregar módulos disponíveis baseado no usuário e unidade ativa
  const loadAvailableModules = async () => {
    if (!user?.id || !activeUnit?.id) {
      console.log('⚠️ LoadAvailableModules: faltam dados', { 
        userId: user?.id, 
        activeUnitId: activeUnit?.id 
      });
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
      // Super Admin e Admin (level >= 80): acesso a todos os módulos ativos da unidade
      if (user.is_super_admin || user?.role_level >= 80) {
        console.log('👑 Admin/Super Admin: carregando todos os módulos da unidade');
        await loadUnitModules();
      } else {
        // Atendente (level < 80): acesso apenas aos módulos com permissão específica
        console.log('👤 Atendente: carregando módulos com permissão específica');
        await loadAtendantModules();
      }
    } catch (error) {
      console.error('❌ Erro em loadAvailableModules:', error);
      setAvailableModules([]);
    }
  };

  // Função para carregar todos os módulos ativos da unidade (Admin/Super Admin)
  const loadUnitModules = async () => {
    // 1. Buscar unit_modules ativos
    const { data: unitModulesRaw, error: umError } = await supabase
      .from('unit_modules')
      .select('*')
      .eq('unit_id', activeUnit.id)
      .eq('is_active', true);

    if (umError) throw umError;
    
    console.log('📦 Unit modules ativos encontrados:', unitModulesRaw?.length || 0);

    if (!unitModulesRaw || unitModulesRaw.length === 0) {
      console.log('⚠️ Nenhum unit_module ativo encontrado');
      setAvailableModules([]);
      return;
    }

    // 2. Buscar informações dos módulos
    const moduleIds = unitModulesRaw.map(um => um.module_id).filter(Boolean);
    const { data: modulesData, error: modulesError } = await supabase
      .from('modules')
      .select('id, name, display_name, category, is_core')
      .in('id', moduleIds);

    if (modulesError) throw modulesError;
    
    // 3. Combinar os dados
    const modules = unitModulesRaw.map(um => {
      const moduleInfo = modulesData?.find(m => m.id === um.module_id);
      
      if (!moduleInfo) {
        console.warn('⚠️ Módulo não encontrado:', um.module_id);
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

    console.log('✅ Módulos da unidade carregados:', modules.length, modules.map(m => m.module_name));
    setAvailableModules(modules);
  };

  // Função para carregar módulos específicos do atendente
  const loadAtendantModules = async () => {
    // 1. Buscar permissões específicas do usuário
    const { data: userPermissions, error: permError } = await supabase
      .from('user_module_permissions')
      .select('*')
      .eq('user_id', user.id)
      .eq('unit_id', activeUnit.id)
      .eq('has_access', true)
      .eq('can_read', true);

    if (permError) throw permError;

    console.log('🔍 Permissões específicas encontradas:', userPermissions?.length || 0);

    if (!userPermissions || userPermissions.length === 0) {
      console.log('⚠️ Nenhuma permissão específica encontrada');
      setAvailableModules([]);
      return;
    }

    // 2. Buscar informações dos módulos permitidos
    const moduleIds = userPermissions.map(up => up.module_id).filter(Boolean);
    const { data: modulesData, error: modulesError } = await supabase
      .from('modules')
      .select('id, name, display_name, category, is_core')
      .in('id', moduleIds);

    if (modulesError) throw modulesError;

    // 3. Combinar os dados
    const modules = userPermissions.map(up => {
      const moduleInfo = modulesData?.find(m => m.id === up.module_id);
      
      if (!moduleInfo) {
        console.warn('⚠️ Módulo não encontrado:', up.module_id);
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

    console.log('✅ Módulos do atendente carregados:', modules.length, modules.map(m => m.module_name));
    setAvailableModules(modules);
  };

  // Função para trocar de unidade ativa
  const switchUnit = (unitId: string) => {
    const unit = userUnits.find(u => u.id === unitId);
    if (unit) {
      console.log('🔄 Trocando unidade ativa para:', unit.name);
      setActiveUnit(unit);
    }
  };

  // Função para recarregar módulos (útil após mudanças)
  const refreshModules = () => {
    console.log('🔄 Refresh modules solicitado');
    loadAvailableModules();
  };

  // Effect para carregar unidades quando usuário muda
  useEffect(() => {
    if (user?.id) {
      console.log('👤 Usuário mudou, carregando unidades');
      loadUserUnits();
    } else {
      console.log('👤 Usuário deslogado, limpando dados');
      setActiveUnit(null);
      setUserUnits([]);
      setAvailableModules([]);
      setLoading(false);
    }
  }, [user?.id]);

  // Effect para carregar módulos quando unidade ativa muda
  useEffect(() => {
    if (user?.id && activeUnit?.id) {
      console.log('🏢 Unidade ativa mudou, carregando módulos');
      loadAvailableModules().finally(() => setLoading(false));
    }
  }, [user?.id, activeUnit?.id]);

  return (
    <ActiveUnitContext.Provider value={{
      activeUnit,
      userUnits,
      availableModules,
      loading,
      switchUnit,
      refreshModules
    }}>
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
