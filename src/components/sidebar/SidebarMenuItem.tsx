
import { Badge } from "@/components/ui/badge";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { MenuItem, isParentActive } from "./MenuItems";

interface SidebarMenuItemComponentProps {
  item: MenuItem;
  activeModule: string;
  setActiveModule: (module: string) => void;
}

export function SidebarMenuItemComponent({ 
  item, 
  activeModule, 
  setActiveModule 
}: SidebarMenuItemComponentProps) {
  const isActive = isParentActive(item, activeModule);

  if (item.submenu) {
    return (
      <SidebarMenuItem>
        <Collapsible>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              className={`group w-full justify-between rounded-2xl px-5 py-4 font-semibold transition-all duration-200 hover:scale-[1.02] ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-200 hover:bg-white/10 hover:text-white hover:shadow-md"
              }`}
            >
              <div className="flex items-center space-x-4">
                <item.icon className={`h-6 w-6 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center space-x-3">
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className={`h-7 px-3 text-sm font-bold transition-colors duration-200 ${
                      isActive
                        ? "bg-white/20 text-white border-white/30"
                        : "bg-slate-600 text-slate-200 border-slate-500"
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
                <ChevronDown className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </div>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <SidebarMenuSub className="mt-3 ml-4 space-y-1">
              {item.submenu.map((subItem) => (
                <li key={subItem.id}>
                  <SidebarMenuSubButton
                    onClick={() => setActiveModule(subItem.id)}
                    className={`group w-full pl-4 pr-4 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                      activeModule === subItem.id
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-purple-500/20"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="font-medium">{subItem.label}</span>
                  </SidebarMenuSubButton>
                </li>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => setActiveModule(item.id)}
        className={`group w-full justify-between rounded-2xl px-5 py-4 font-semibold transition-all duration-200 hover:scale-[1.02] ${
          isActive
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
            : "text-slate-200 hover:bg-white/10 hover:text-white hover:shadow-md"
        }`}
      >
        <div className="flex items-center space-x-4">
          <item.icon className={`h-6 w-6 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
          <span>{item.label}</span>
        </div>
        {item.badge && (
          <Badge
            variant="secondary"
            className={`h-7 px-3 text-sm font-bold transition-colors duration-200 ${
              isActive
                ? "bg-white/20 text-white border-white/30"
                : "bg-slate-600 text-slate-200 border-slate-500"
            }`}
          >
            {item.badge}
          </Badge>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
