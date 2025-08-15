
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, User, LogOut, Settings, UserCircle } from "lucide-react";
import { ModuleSearchDropdown } from "./ModuleSearchDropdown";
import { useModuleSearch } from "@/hooks/useModuleSearch";
import { useAuth } from "@/hooks/useAuth";

interface ModernHeaderProps {
  title: string;
  subtitle?: string;
  activeModule: string;
  setActiveModule: (module: string) => void;
}

export function ModernHeader({ title, subtitle, activeModule, setActiveModule }: ModernHeaderProps) {
  const {
    searchQuery,
    setSearchQuery,
    filteredItems,
    hasResults
  } = useModuleSearch(activeModule);

  const { user, logout } = useAuth();

  const handleSelectItem = (itemId: string) => {
    setActiveModule(itemId);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ModuleSearchDropdown
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredItems={filteredItems}
            hasResults={hasResults}
            onSelectItem={handleSelectItem}
          />
          
          <Button variant="ghost" size="sm" className="relative hover:bg-cream-modern/50">
            <Bell className="h-4 w-4 text-gray-600" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-yellow-modern text-gray-800">
              3
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-cream-modern/50">
                <User className="h-4 w-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.nome || 'Usuário'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'user@mariaflow.com'}
                  </p>
                  {user?.is_super_admin && (
                    <Badge variant="outline" className="text-xs w-fit">
                      Super Admin
                    </Badge>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Badge variant="outline" className="text-xs bg-green-modern/20 text-green-modern border-green-modern/30">
            Online
          </Badge>
        </div>
      </div>
    </header>
  );
}
