import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateAttendantData {
  name: string;
  email: string;
  password: string;
  selectedModules: string[];
}

interface AttendantUser {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  created_at: string;
  role: {
    name: string;
    display_name: string;
    level: number;
  };
}

interface Module {
  id: string;
  name: string;
  display_name: string;
  category: string;
}

interface Unit {
  id: string;
  name: string;
  is_active: boolean;
}

interface ModulePermission {
  module_id: string;
  module_name: string;
  is_active: boolean;
}

export function useUserManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Buscar role_id do Atendente (level 30)
  const getAttendantRoleId = async () => {
    const { data, error } = await supabase
      .from('roles')
      .select('id')
      .eq('level', 30)
      .single();
    
    if (error) {
      console.error('Erro ao buscar role de atendente:', error);
      return null;
    }
    
    return data?.id;
  };

  // Criar novo atendente
  const createAttendant = async (userData: CreateAttendantData, unitId: string, adminUserId: string) => {
    try {
      setIsLoading(true);

      // Verificar se o admin tem acesso à unidade (exceto Super Admin)
      const { data: adminCheck } = await supabase
        .from('users')
        .select('role_id, roles!inner(name, level)')
        .eq('id', adminUserId)
        .single();

      const isSuperAdmin = adminCheck?.roles?.level >= 100;

      if (!isSuperAdmin) {
        // Verificar se admin tem acesso à unidade
        const { data: accessCheck, error: accessError } = await supabase
          .from('user_unit_assignments')
          .select('id')
          .eq('user_id', adminUserId)
          .eq('unit_id', unitId)
          .single();

        if (accessError || !accessCheck) {
          throw new Error('Você não tem permissão para criar usuários nesta unidade.');
        }
      }

      // 1. Buscar role_id do atendente
      const attendantRoleId = await getAttendantRoleId();
      if (!attendantRoleId) {
        throw new Error('Role de atendente não encontrada');
      }

      // 2. Criar usuário
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([{
          email: userData.email,
          name: userData.name,
          password: userData.password, // Em produção, seria hasheada no backend
          role_id: attendantRoleId,
          unit_id: unitId, // Vincular diretamente à unidade
          is_active: true
        }])
        .select()
        .single();

      if (userError) throw userError;

      // 3. Vincular usuário à unidade (relacionamento adicional)
      const { error: assignmentError } = await supabase
        .from('user_unit_assignments')
        .insert([{
          user_id: newUser.id,
          unit_id: unitId,
          assigned_by: adminUserId,
          is_primary: true,
          assigned_at: new Date().toISOString()
        }]);

      if (assignmentError) throw assignmentError;

      // 4. Configurar permissões de módulos
      if (userData.selectedModules.length > 0) {
        const modulePermissions = userData.selectedModules.map(moduleId => ({
          user_id: newUser.id,
          unit_id: unitId,
          module_id: moduleId,
          granted_by: adminUserId,
          can_view: true,
          can_create: true,
          can_edit: true,
          can_delete: false,
          can_export: false,
          is_active: true
        }));

        const { error: permissionsError } = await supabase
          .from('user_module_permissions')
          .insert(modulePermissions);

        if (permissionsError) throw permissionsError;
      }

      toast({
        title: "Atendente criado com sucesso!",
        description: `Usuário ${userData.name} foi criado e vinculado à unidade.`,
      });

      return { success: true, user: newUser };

    } catch (error) {
      console.error('Erro ao criar atendente:', error);
      toast({
        title: "Erro ao criar atendente",
        description: error instanceof Error ? error.message : "Erro inesperado",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar atendentes de uma unidade
  const getAttendantsByUnit = async (unitId: string) => {
    try {
      console.log('🔄 useUserManagement.getAttendantsByUnit iniciado para unitId:', unitId);
      
      const { data, error } = await supabase
        .from('user_unit_assignments')
        .select(`
          user_id,
          users!user_unit_assignments_user_id_fkey (
            id,
            email,
            name,
            is_active,
            created_at,
            roles!inner (
              name,
              display_name,
              level
            )
          )
        `)
        .eq('unit_id', unitId)
        .eq('users.roles.level', 30); // Apenas atendentes

      if (error) {
        console.error('❌ useUserManagement.getAttendantsByUnit - Erro na consulta:', error);
        throw error;
      }

      console.log('📊 useUserManagement.getAttendantsByUnit - Dados brutos:', data?.length || 0, 'registros');
      console.log('📋 useUserManagement.getAttendantsByUnit - Dados detalhados:', JSON.stringify(data, null, 2));

      const attendants: AttendantUser[] = data?.map(item => {
        // Verificar se o objeto users existe e é válido
        if (!item.users || !item.users.id) {
          console.warn('⚠️ Item com users inválido encontrado:', item);
          return null;
        }
        
        return {
          id: item.users.id,
          email: item.users.email,
          name: item.users.name,
          is_active: item.users.is_active,
          created_at: item.users.created_at,
          role: item.users.roles
        };
      }).filter(Boolean) || []; // Filtrar itens nulos

      // Ordenar por data de criação (mais recentes primeiro)
      attendants.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      console.log('✅ useUserManagement.getAttendantsByUnit - Atendentes processados:', attendants.length);
      attendants.forEach(att => {
        console.log(`   - ${att.name} (${att.email}) - Status: ${att.is_active ? 'Ativo' : 'Inativo'}`);
      });

      return { success: true, data: attendants };

    } catch (error) {
      console.error('❌ useUserManagement.getAttendantsByUnit - Erro:', error);
      return { success: false, error, data: [] };
    }
  };

  // Buscar permissões de módulos de um usuário
  const getUserModulePermissions = async (userId: string, unitId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_module_permissions')
        .select(`
          module_id,
          is_active,
          modules (
            name,
            display_name
          )
        `)
        .eq('user_id', userId)
        .eq('unit_id', unitId);

      if (error) throw error;

      const permissions: ModulePermission[] = data?.map(item => ({
        module_id: item.module_id,
        module_name: item.modules.display_name,
        is_active: item.is_active
      })) || [];

      return { success: true, data: permissions };

    } catch (error) {
      console.error('Erro ao buscar permissões:', error);
      return { success: false, error, data: [] };
    }
  };

  // Atualizar permissões de módulos
  const updateUserPermissions = async (userId: string, unitId: string, modulePermissions: { moduleId: string; isActive: boolean }[]) => {
    try {
      console.log('🔄 useUserManagement.updateUserPermissions iniciado');
      console.log('   - userId:', userId);
      console.log('   - unitId:', unitId);
      console.log('   - modulePermissions:', modulePermissions);
      
      setIsLoading(true);

      // Deletar permissões existentes
      console.log('🗑️ Deletando permissões existentes...');
      const { error: deleteError } = await supabase
        .from('user_module_permissions')
        .delete()
        .eq('user_id', userId)
        .eq('unit_id', unitId);

      if (deleteError) {
        console.error('❌ Erro ao deletar permissões existentes:', deleteError);
        throw deleteError;
      }

      console.log('✅ Permissões existentes deletadas');

      // Inserir novas permissões (apenas as ativas)
      const activePermissions = modulePermissions
        .filter(p => p.isActive)
        .map(p => ({
          user_id: userId,
          unit_id: unitId,
          module_id: p.moduleId,
          is_active: true,
          can_view: true,
          can_create: true,
          can_edit: false,
          can_delete: false,
          can_export: false
        }));

      console.log('📝 Permissões ativas a inserir:', activePermissions.length);

      if (activePermissions.length > 0) {
        const { error: insertError } = await supabase
          .from('user_module_permissions')
          .insert(activePermissions);

        if (insertError) {
          console.error('❌ Erro ao inserir novas permissões:', insertError);
          throw insertError;
        }
        console.log('✅ Novas permissões inseridas');
      }

      toast({
        title: "Permissões atualizadas!",
        description: "As permissões do usuário foram atualizadas com sucesso.",
      });

      console.log('✅ useUserManagement.updateUserPermissions concluído com sucesso');
      return { success: true };

    } catch (error) {
      console.error('❌ useUserManagement.updateUserPermissions - Erro:', error);
      toast({
        title: "Erro ao atualizar permissões",
        description: error instanceof Error ? error.message : "Erro inesperado",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Ativar/Desativar usuário
  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('users')
        .update({ is_active: isActive })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: `Usuário ${isActive ? 'ativado' : 'desativado'}!`,
        description: `O status do usuário foi atualizado com sucesso.`,
      });

      return { success: true };

    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
      toast({
        title: "Erro ao alterar status",
        description: error instanceof Error ? error.message : "Erro inesperado",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar módulos disponíveis na unidade
  const getAvailableModules = async (unitId: string) => {
    try {
      console.log('🔄 useUserManagement.getAvailableModules iniciado para unitId:', unitId);
      
      const { data, error } = await supabase
        .from('unit_modules')
        .select(`
          module_id,
          is_active,
          modules (
            id,
            name,
            display_name,
            category
          )
        `)
        .eq('unit_id', unitId)
        .eq('is_active', true); // Apenas módulos ativos na unidade

      if (error) {
        console.error('❌ useUserManagement.getAvailableModules - Erro na consulta:', error);
        throw error;
      }

      console.log('📦 useUserManagement.getAvailableModules - Dados brutos:', data?.length || 0, 'módulos');

      const modules = data?.map(item => {
        if (!item.modules) {
          console.warn('⚠️ Item com module inválido encontrado:', item);
          return null;
        }
        
        return {
          id: item.modules.id,
          name: item.modules.name,
          display_name: item.modules.display_name,
          category: item.modules.category
        };
      }).filter(Boolean) || [];

      // Ordenar por categoria no JavaScript em vez do SQL
      modules.sort((a, b) => {
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        return 0;
      });

      console.log('✅ useUserManagement.getAvailableModules - Módulos processados:', modules.length);

      return { success: true, data: modules };

    } catch (error) {
      console.error('❌ useUserManagement.getAvailableModules - Erro:', error);
      return { success: false, error, data: [] };
    }
  };

  // Buscar unidades do usuário atual (considerando hierarquia de permissões)
  const getAdminUnits = async (userId: string, isSuperAdmin: boolean = false) => {
    try {
      // Super Admin tem acesso a todas as unidades
      if (isSuperAdmin) {
        const { data, error } = await supabase
          .from('units')
          .select('id, name, is_active')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        return { success: true, data: data || [] };
      }

      // Admin tem acesso apenas às unidades às quais está associado
      const { data, error } = await supabase
        .from('user_unit_assignments')
        .select(`
          unit_id,
          units!user_unit_assignments_unit_id_fkey (
            id,
            name,
            is_active
          )
        `)
        .eq('user_id', userId)
        .eq('units.is_active', true);

      if (error) throw error;

      const units = data?.map(item => ({
        id: item.units.id,
        name: item.units.name,
        is_active: item.units.is_active
      })) || [];

      return { success: true, data: units };

    } catch (error) {
      console.error('Erro ao buscar unidades do usuário:', error);
      return { success: false, error, data: [] };
    }
  };

  // Buscar todas as unidades ativas (DEPRECATED - usar getAdminUnits)
  const getActiveUnits = async () => {
    console.warn('getActiveUnits está deprecated. Use getAdminUnits com parâmetros de usuário.');
    try {
      const { data, error } = await supabase
        .from('units')
        .select('id, name, is_active')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return { success: true, data: data || [] };

    } catch (error) {
      console.error('Erro ao buscar unidades:', error);
      return { success: false, error, data: [] };
    }
  };

  return {
    isLoading,
    createAttendant,
    getAttendantsByUnit,
    getUserModulePermissions,
    updateUserPermissions,
    toggleUserStatus,
    getAvailableModules,
    getAdminUnits,
    getActiveUnits // DEPRECATED - manter para compatibilidade
  };
}
