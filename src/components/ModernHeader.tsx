
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";
import { ModuleSearchDropdown } from "./ModuleSearchDropdown";
import { useModuleSearch } from "@/hooks/useModuleSearch";

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

  const handleSelectItem = (itemId: string) => {
    setActiveModule(itemId);
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

          <Button variant="ghost" size="sm" className="hover:bg-cream-modern/50">
            <User className="h-4 w-4 text-gray-600" />
          </Button>

          <Badge variant="outline" className="text-xs bg-green-modern/20 text-green-modern border-green-modern/30">
            Online
          </Badge>
        </div>
      </div>
    </header>
  );
}
