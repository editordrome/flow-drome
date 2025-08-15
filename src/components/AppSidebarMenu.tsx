
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { SidebarMenuItemComponent } from "./sidebar/SidebarMenuItem";
import { useAuth } from "@/hooks/useAuth";
import { useAllowedModules } from "@/hooks/useAllowedModules";

interface AppSidebarMenuProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

export function AppSidebarMenu({ activeModule, setActiveModule }: AppSidebarMenuProps) {
  const { user, isLoading } = useAuth();
  const { allowedModules } = useAllowedModules();
  
  // Debug - verificar o estado do usuário e módulos permitidos
  console.log('AppSidebarMenu - User:', user);
  console.log('AppSidebarMenu - User is_super_admin:', user?.is_super_admin);
  console.log('AppSidebarMenu - User unit:', user?.unit_name);
  console.log('AppSidebarMenu - Allowed modules:', user?.allowed_modules);
  console.log('AppSidebarMenu - Filtered menu items:', allowedModules.length);
  console.log('AppSidebarMenu - IsLoading:', isLoading);
  
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
          {user?.unit_name && <p className="text-sm mt-1">Unidade: {user.unit_name}</p>}
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
