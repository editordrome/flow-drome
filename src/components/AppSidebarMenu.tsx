
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { menuItems } from "./sidebar/MenuItems";
import { SidebarMenuItemComponent } from "./sidebar/SidebarMenuItem";

interface AppSidebarMenuProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

export function AppSidebarMenu({ activeModule, setActiveModule }: AppSidebarMenuProps) {
  return (
    <SidebarContent className="px-4 py-6">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-2">
            {menuItems.map((item) => (
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
