import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { useActiveUnit } from './useActiveUnit';
import { menuItems, MenuItem } from '@/components/sidebar/MenuItems';

export const useAllowedModules = () => {
  const { user } = useAuth();
  const { availableModules, activeUnit, loading } = useActiveUnit();

  const allowedModules = useMemo(() => {
    console.log('\n🔄 useAllowedModules RECALCULANDO:');
    console.log('   - User:', user?.email, 'Role Level:', user?.role_level, 'Is Super Admin:', user?.is_super_admin);
    console.log('   - Active Unit:', activeUnit?.name, 'ID:', activeUnit?.id);
    console.log('   - Available Modules:', availableModules.length);
    availableModules.forEach(m => console.log(`      * ${m.module_display_name} (${m.module_name})`));
    console.log('   - Loading:', loading);
    
    // Se ainda está carregando, retornar array vazio
    if (loading) {
      console.log('   ⏳ Still loading, returning empty array');
      return [];
    }
    
    // Se for super admin, incluir módulos super admin + módulos da unidade ativa
    if (user?.is_super_admin) {
      console.log('   👑 Super admin detected');
      
      // Sempre incluir módulos super admin
      const superAdminModules = ['super-admin', 'gestao-unidades'];
      
      // Adicionar módulos disponíveis da unidade ativa
      const unitModuleNames = availableModules.map(m => m.module_name);
      const allAllowedModules = [...superAdminModules, ...unitModuleNames];
      
      console.log('   📋 Super admin final modules:', allAllowedModules);
      return filterMenuItemsByModules(allAllowedModules, true);
    }

    // Para outros usuários (Admin e Atendente), usar módulos disponíveis da unidade
    const unitModuleNames = availableModules.map(m => m.module_name);
    
    // Se for Admin (level 80), adicionar acesso ao menu Configuração
    if (user?.role_level >= 80) {
      unitModuleNames.push('configuracao-admin');
      console.log('   👨‍💼 Admin detected, adding configuracao-admin');
    }
    
    console.log('   📋 Regular user final modules:', unitModuleNames);
    
    return filterMenuItemsByModules(unitModuleNames, false);
  }, [user, availableModules, activeUnit, loading]);

  return { allowedModules };
};

// Função para filtrar menuItems baseado nos módulos permitidos
const filterMenuItemsByModules = (allowedModuleNames: string[], isSuperAdmin: boolean): MenuItem[] => {
  console.log('🔍 filterMenuItemsByModules INICIADO:');
  console.log('   - allowedModuleNames:', allowedModuleNames);
  console.log('   - isSuperAdmin:', isSuperAdmin);
  
  const filteredMenuItems: MenuItem[] = [];

  menuItems.forEach(menuItem => {
    console.log(`\n📋 Processando menu principal: ${menuItem.id} (${menuItem.label})`);
    
    if (menuItem.submenu) {
      // Se tem submenu, verificar cada item do submenu
      const allowedSubmenuItems = menuItem.submenu.filter(subItem => {
        const moduleName = getModuleNameFromId(subItem.id);
        console.log(`   🔍 Verificando submenu: ${subItem.id} -> módulo: ${moduleName}`);
        
        // Para super-admin menu items, só permitir para super admin
        if (moduleName === 'super-admin') {
          const allowed = isSuperAdmin;
          console.log(`   🔐 Super admin module: ${allowed}`);
          return allowed;
        }
        
        // Para gestão de usuários, permitir para Admin (level 80+) e Super Admin
        if (subItem.id === 'gestao-usuarios') {
          const allowed = allowedModuleNames.includes('configuracao-admin') || isSuperAdmin;
          console.log(`   👥 Gestão usuários: ${allowed} (tem configuracao-admin: ${allowedModuleNames.includes('configuracao-admin')})`);
          return allowed;
        }
        
        // Para outros módulos, verificar se está na lista de permitidos
        const isAllowed = allowedModuleNames.includes(moduleName);
        console.log(`   ✅ Módulo ${moduleName} permitido: ${isAllowed}`);
        
        return isAllowed;
      });

      console.log(`   📊 Submenu permitido: ${allowedSubmenuItems.length}/${menuItem.submenu.length}`);
      allowedSubmenuItems.forEach(item => console.log(`      - ${item.label}`));

      // Se algum item do submenu é permitido, incluir o menu principal
      if (allowedSubmenuItems.length > 0) {
        console.log(`   ✅ INCLUINDO menu principal: ${menuItem.label}`);
        filteredMenuItems.push({
          ...menuItem,
          submenu: allowedSubmenuItems
        });
      } else {
        console.log(`   ❌ EXCLUINDO menu principal: ${menuItem.label} (nenhum submenu permitido)`);
      }
    } else {
      // Se não tem submenu, verificar se o módulo é permitido
      const moduleName = getModuleNameFromId(menuItem.id);
      console.log(`   🔍 Menu simples: ${menuItem.id} -> módulo: ${moduleName}`);
      
      // Para super-admin menu items, só permitir para super admin
      if (moduleName === 'super-admin') {
        if (isSuperAdmin) {
          console.log(`   ✅ INCLUINDO menu super admin: ${menuItem.label}`);
          filteredMenuItems.push(menuItem);
        } else {
          console.log(`   ❌ EXCLUINDO menu super admin: ${menuItem.label} (não é super admin)`);
        }
      } else {
        // Para outros módulos, verificar se está na lista de permitidos
        const isAllowed = allowedModuleNames.includes(moduleName);
        console.log(`   ✅ Módulo ${moduleName} permitido: ${isAllowed}`);
        
        if (isAllowed) {
          console.log(`   ✅ INCLUINDO menu: ${menuItem.label}`);
          filteredMenuItems.push(menuItem);
        } else {
          console.log(`   ❌ EXCLUINDO menu: ${menuItem.label}`);
        }
      }
    }
  });

  console.log('\n🎯 RESULTADO FINAL filterMenuItemsByModules:');
  filteredMenuItems.forEach((item, index) => {
    console.log(`${index + 1}. ${item.label}`);
    if (item.submenu) {
      item.submenu.forEach(sub => console.log(`   - ${sub.label}`));
    }
  });
  
  return filteredMenuItems;
};

// Função para mapear ID do menu para nome do módulo no banco
const getModuleNameFromId = (id: string): string => {
  // Mapeamento de IDs de menu para módulos de permissão
  const idToModuleMap: Record<string, string> = {
    // Core modules - nomes como aparecem no banco
    'dashboard': 'Dashboard',
    'gestao': 'Gestao', // Submenu Gestão = módulo Gestão específico (não Dashboard!)
    'usuarios': 'Usuários',
    'agendamentos': 'Agenda', // Submenu Atendimentos = módulo Agenda
    
    // Atendimento modules
    'agenda': 'Agenda',
    'clientes': 'Clientes',
    'pipeline': 'Pipeline',
    'tickets': 'Tickets',
    
    // Financeiro modules  
    'financeiro': 'Financeiro',
    'dashboard-financeiro': 'Financeiro',
    'cashback': 'Cashback',
    
    // Gestão modules
    'profissionais': 'Profissionais',
    'profissionais-lista': 'Profissionais',
    'materiais': 'Materiais',
    'uniformes': 'Uniformes',
    
    // Marketing modules
    'marketing': 'Marketing',
    'materiais-marketing': 'Marketing',
    'publicacoes': 'Publicações',
    
    // Educação modules
    'maria-uni': 'MariaUni',
    'base-conhecimento': 'Base Conhecimento',
    
    // RH modules
    'recrutadora': 'Recrutadora',
    
    // Super Admin modules
    'super-admin': 'super-admin',
    'super-admin-dashboard': 'super-admin',
    'gestao-unidades': 'super-admin',
    'configuracao-modulos': 'super-admin',
    
    // Admin modules - Configuration
    'configuracao': 'configuracao-admin',
    'gestao-usuarios': 'configuracao-admin',
  };

  return idToModuleMap[id] || id;
};
