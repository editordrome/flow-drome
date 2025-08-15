import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { menuItems, MenuItem } from '@/components/sidebar/MenuItems';

export const useAllowedModules = () => {
  const { user } = useAuth();

  const allowedModules = useMemo(() => {
    console.log('useAllowedModules - User:', user);
    console.log('useAllowedModules - User is_super_admin:', user?.is_super_admin);
    console.log('useAllowedModules - User allowed_modules:', user?.allowed_modules);
    
    // Se for super admin, tem acesso a todos os módulos
    if (user?.is_super_admin) {
      console.log('useAllowedModules - Super admin detected, returning all modules');
      return menuItems;
    }

    // Se não tiver módulos permitidos, não mostrar nenhum módulo
    if (!user?.allowed_modules || user.allowed_modules.length === 0) {
      console.log('useAllowedModules - No allowed modules found');
      return [];
    }

    console.log('useAllowedModules - Filtering modules based on allowed list:', user.allowed_modules);

    // Filtrar menuItems baseado nos módulos permitidos
    const filteredMenuItems: MenuItem[] = [];

    menuItems.forEach(menuItem => {
      if (menuItem.submenu) {
        // Se tem submenu, verificar cada item do submenu
        const allowedSubmenuItems = menuItem.submenu.filter(subItem => {
          const moduleName = getModuleNameFromId(subItem.id);
          console.log(`useAllowedModules - Checking submenu item: ${subItem.id} -> ${moduleName}`);
          
          // Se for super admin, permitir tudo
          if (user.is_super_admin) return true;
          
          // Para super-admin menu items, só permitir para super admin
          if (moduleName === 'super-admin') return false;
          
          // Para outros módulos, verificar se está na lista de permitidos
          const isAllowed = user.allowed_modules?.includes(moduleName);
          console.log(`useAllowedModules - Submenu module ${moduleName} allowed: ${isAllowed}`);
          
          return isAllowed || false;
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
        console.log(`useAllowedModules - Checking menu item: ${menuItem.id} -> ${moduleName}`);
        
        // Se for super admin, permitir tudo
        if (user.is_super_admin) {
          filteredMenuItems.push(menuItem);
        } else {
          // Para super-admin menu items, só permitir para super admin
          if (moduleName === 'super-admin') return;
          
          // Para outros módulos, verificar se está na lista de permitidos
          const isAllowed = user.allowed_modules?.includes(moduleName);
          console.log(`useAllowedModules - Module ${moduleName} allowed: ${isAllowed}`);
          
          if (isAllowed) {
            filteredMenuItems.push(menuItem);
          }
        }
      }
    });

    console.log('useAllowedModules - Final filtered menu items:', filteredMenuItems);
    return filteredMenuItems;
  }, [user]);

  return { allowedModules };
};

// Função para mapear ID do menu para nome do módulo no banco
const getModuleNameFromId = (menuId: string): string => {
  const moduleMap: { [key: string]: string } = {
    'dashboard': 'Dashboard',
    'agenda': 'Agenda',
    'agendamentos': 'Agenda', // Agendamentos usa o módulo Agenda
    'clientes': 'Clientes',
    'pipeline': 'Pipeline',
    'tickets': 'Tickets',
    'profissionais': 'Profissionais',
    'financeiro': 'Financeiro',
    'cashback': 'Cashback',
    'materials': 'Materiais',
    'materials-marketing': 'Marketing',
    'uniformes': 'Uniformes',
    'publicacoes': 'Publicações',
    'recrutadora': 'Recrutadora',
    'base-conhecimento': 'Base Conhecimento',
    'maria-uni': 'MariaUni',
    'usuarios': 'Usuários',
    // Super Admin items - sempre permitidos para super admin
    'super-admin': 'super-admin',
    'gestao-unidades': 'super-admin'
  };

  return moduleMap[menuId] || menuId;
};
