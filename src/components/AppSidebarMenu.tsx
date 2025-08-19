
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { SidebarMenuItemComponent } from "./sidebar/SidebarMenuItem";
import { useAuth } from "@/hooks/useAuth";
import { useAllowedModules } from "@/hooks/useAllowedModules";
import { useActiveUnit } from "@/hooks/useActiveUnit";

interface AppSidebarMenuProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

export function AppSidebarMenu({ activeModule, setActiveModule }: AppSidebarMenuProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { allowedModules } = useAllowedModules();
  const { activeUnit, loading: unitLoading } = useActiveUnit();
  
  const isLoading = authLoading || unitLoading;
  
  // Debug - verificar o estado do usuário e módulos permitidos
  console.log('AppSidebarMenu - User:', user);
  console.log('AppSidebarMenu - User is_super_admin:', user?.is_super_admin);
  console.log('AppSidebarMenu - Active unit:', activeUnit?.name);
  console.log('AppSidebarMenu - Allowed modules count:', allowedModules.length);
  console.log('AppSidebarMenu - IsLoading (auth/unit):', authLoading, '/', unitLoading);
  
  // Se ainda está carregando, mostrar loading
  if (isLoading) {
    return (
      <SidebarContent className="px-4 py-6">
        <div className="flex items-center justify-center">
          Carregando menu...
        </div>
      </SidebarContent>
    );
  }

  // Se não há módulos permitidos, mostrar mensagem
  if (!user || allowedModules.length === 0) {
    return (
      <SidebarContent className="px-4 py-6">
        <div className="text-center text-gray-500">
          <p>Nenhum módulo disponível</p>
          {activeUnit?.name && <p className="text-sm mt-1">Unidade: {activeUnit.name}</p>}
        </div>
      </SidebarContent>
    );
  }

  return (
    <SidebarContent className="px-4 py-6">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-2">
            {allowedModules.map((item) => (
              <SidebarMenuItemComponent
                key={item.id}
                item={item}
                activeModule={activeModule}
                setActiveModule={setActiveModule}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
