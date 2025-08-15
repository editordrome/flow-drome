import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { useActiveUnit } from './useActiveUnit';
import { menuItems, MenuItem } from '@/components/sidebar/MenuItems';

export const useAllowedModules = () => {
  const { user } = useAuth();
  const { availableModules, activeUnit, loading } = useActiveUnit();

  const allowedModules = useMemo(() => {
    console.log('useAllowedModules - User:', user);
    console.log('useAllowedModules - Active Unit:', activeUnit);
    console.log('useAllowedModules - Available Modules:', availableModules);
    
    // Se ainda está carregando, retornar array vazio
    if (loading) {
      console.log('useAllowedModules - Still loading, returning empty array');
      return [];
    }
    
    // Se for super admin, incluir módulos super admin + módulos da unidade ativa
    if (user?.is_super_admin) {
      console.log('useAllowedModules - Super admin detected');
      
      // Sempre incluir módulos super admin
      const superAdminModules = ['super-admin', 'gestao-unidades'];
      
      // Adicionar módulos disponíveis da unidade ativa
      const unitModuleNames = availableModules.map(m => m.module_name);
      const allAllowedModules = [...superAdminModules, ...unitModuleNames];
      
      console.log('useAllowedModules - Super admin modules:', allAllowedModules);
      return filterMenuItemsByModules(allAllowedModules, true);
    }

    // Para outros usuários (Admin e Atendente), usar módulos disponíveis da unidade
    const unitModuleNames = availableModules.map(m => m.module_name);
    console.log('useAllowedModules - Regular user modules:', unitModuleNames);
    
    return filterMenuItemsByModules(unitModuleNames, false);
  }, [user, availableModules, activeUnit, loading]);

  return { allowedModules };
};

// Função para filtrar menuItems baseado nos módulos permitidos
const filterMenuItemsByModules = (allowedModuleNames: string[], isSuperAdmin: boolean): MenuItem[] => {
  const filteredMenuItems: MenuItem[] = [];

  menuItems.forEach(menuItem => {
    if (menuItem.submenu) {
      // Se tem submenu, verificar cada item do submenu
      const allowedSubmenuItems = menuItem.submenu.filter(subItem => {
        const moduleName = getModuleNameFromId(subItem.id);
        console.log(`filterMenuItemsByModules - Checking submenu item: ${subItem.id} -> ${moduleName}`);
        
        // Para super-admin menu items, só permitir para super admin
        if (moduleName === 'super-admin') return isSuperAdmin;
        
        // Para outros módulos, verificar se está na lista de permitidos
        const isAllowed = allowedModuleNames.includes(moduleName);
        console.log(`filterMenuItemsByModules - Submenu module ${moduleName} allowed: ${isAllowed}`);
        
        return isAllowed;
      });

      // Se algum item do submenu é permitido, incluir o menu principal
      if (allowedSubmenuItems.length > 0) {
        filteredMenuItems.push({
          ...menuItem,
          submenu: allowedSubmenuItems
        });
      }
    } else {
      // Se não tem submenu, verificar se o módulo é permitido
      const moduleName = getModuleNameFromId(menuItem.id);
      console.log(`filterMenuItemsByModules - Checking menu item: ${menuItem.id} -> ${moduleName}`);
      
      // Para super-admin menu items, só permitir para super admin
      if (moduleName === 'super-admin') {
        if (isSuperAdmin) {
          filteredMenuItems.push(menuItem);
        }
      } else {
        // Para outros módulos, verificar se está na lista de permitidos
        const isAllowed = allowedModuleNames.includes(moduleName);
        console.log(`filterMenuItemsByModules - Module ${moduleName} allowed: ${isAllowed}`);
        
        if (isAllowed) {
          filteredMenuItems.push(menuItem);
        }
      }
    }
  });

  console.log('filterMenuItemsByModules - Final filtered menu items:', filteredMenuItems);
  return filteredMenuItems;
};

// Função para mapear ID do menu para nome do módulo no banco
const getModuleNameFromId = (menuId: string): string => {
  const moduleMap: { [key: string]: string } = {
    // Menu items principais
    'dashboard': 'Dashboard',
    'clientes': 'Clientes',
    'maria-uni': 'MariaUni',
    
    // Submenu items - Dashboard
    'gestao': 'Dashboard',
    'agendamentos': 'Agenda',
    
    // Submenu items - Comercial
    'pipeline': 'Pipeline',
    'cashback': 'Cashback',
    
    // Submenu items - Profissionais
    'profissionais': 'Profissionais',
    'profissionais-lista': 'Profissionais',
    'profissionais-status': 'Profissionais',
    'agenda': 'Agenda',
    'recrutadora': 'Recrutadora',
    
    // Submenu items - Financeiro
    'financeiro': 'Financeiro',
    'dashboard-financeiro': 'Financeiro',
    'relatorios': 'Financeiro',
    'contas-pagar': 'Financeiro',
    'contas-receber': 'Financeiro',
    'fluxo-caixa': 'Financeiro',
    
    // Submenu items - Marketing
    'marketing': 'Marketing',
    'materiais-marketing': 'Marketing',
    'publicacoes': 'Publicações',
    
    // Submenu items - Compras
    'compras': 'Materiais',
    'uniformes': 'Uniformes',
    'materiais': 'Materiais',
    
    // Submenu items - Suporte
    'suporte': 'Tickets',
    'tickets': 'Tickets',
    'base-conhecimento': 'Base Conhecimento',
    
    // Legacy mappings (manter por compatibilidade)
    'usuarios': 'Usuários',
    
    // Super Admin items - sempre permitidos para super admin
    'super-admin': 'super-admin',
    'gestao-unidades': 'super-admin',
    'configuracao-modulos': 'super-admin'
  };

  return moduleMap[menuId] || menuId;
};
