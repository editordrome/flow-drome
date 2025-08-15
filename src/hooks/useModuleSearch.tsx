
import { useState, useMemo } from 'react';
import { useAllowedModules } from './useAllowedModules';

export const useModuleSearch = (activeModule: string) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { allowedModules } = useAllowedModules();

  // Cria uma lista plana de todos os itens disponíveis (apenas os permitidos)
  const allAvailableItems = useMemo(() => {
    const items: Array<{
      id: string;
      label: string;
      icon: any;
      parentLabel: string | null;
    }> = [];

    allowedModules.forEach(mainItem => {
      if (mainItem.submenu) {
        // Adiciona os itens do submenu
        mainItem.submenu.forEach(sub => {
          items.push({
            id: sub.id,
            label: sub.label,
            icon: sub.icon,
            parentLabel: mainItem.label
          });
        });
      } else {
        // Adiciona o item principal se não tem submenu
        items.push({
          id: mainItem.id,
          label: mainItem.label,
          icon: mainItem.icon,
          parentLabel: null
        });
      }
    });

    return items;
  }, [allowedModules]);

  const currentModuleItems = useMemo(() => {
    // Encontra o item do menu principal que corresponde ao módulo ativo
    const mainItem = allowedModules.find(item => 
      item.id === activeModule || 
      (item.submenu && item.submenu.some(sub => sub.id === activeModule))
    );

    if (!mainItem) return [];

    // Se o módulo ativo é um submenu, retorna os itens do submenu
    if (mainItem.submenu) {
      return mainItem.submenu.map(sub => ({
        id: sub.id,
        label: sub.label,
        icon: sub.icon,
        parentLabel: mainItem.label
      }));
    }

    // Se não tem submenu, retorna o próprio item
    return [{
      id: mainItem.id,
      label: mainItem.label,
      icon: mainItem.icon,
      parentLabel: null
    }];
  }, [activeModule, allowedModules]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return currentModuleItems;

    // Busca em todos os itens disponíveis, não apenas no módulo atual
    return allAvailableItems.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.parentLabel && item.parentLabel.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allAvailableItems, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    currentModuleItems,
    filteredItems,
    hasResults: filteredItems.length > 0
  };
};
