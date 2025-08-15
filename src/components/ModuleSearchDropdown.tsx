
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SearchItem {
  id: string;
  label: string;
  icon: any;
  parentLabel: string | null;
}

interface ModuleSearchDropdownProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredItems: SearchItem[];
  hasResults: boolean;
  onSelectItem: (itemId: string) => void;
}

export function ModuleSearchDropdown({
  searchQuery,
  setSearchQuery,
  filteredItems,
  hasResults,
  onSelectItem
}: ModuleSearchDropdownProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (itemId: string) => {
    onSelectItem(itemId);
    setOpen(false);
    setSearchQuery('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setOpen(value.length > 0);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Buscar" 
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => searchQuery && setOpen(true)}
            className="w-64 pl-10 bg-cream-modern/50 border-gray-200 focus:bg-white focus:border-blue-modern focus:ring-blue-modern/20"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <CommandList>
            {!hasResults && searchQuery ? (
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => handleSelect(item.id)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <item.icon className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="text-sm">{item.label}</span>
                      {item.parentLabel && (
                        <span className="text-xs text-gray-500">{item.parentLabel}</span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
