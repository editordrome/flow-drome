
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface AgendamentosSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function AgendamentosSearch({ 
  searchTerm, 
  setSearchTerm,
}: AgendamentosSearchProps) {
  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 kit-icon-secondary">
        <Search className="h-5 w-5" />
      </div>
      <Input
        type="text"
        placeholder="Buscar por cliente, profissional, serviço..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="kit-input pl-12 pr-4 w-full"
      />
    </div>
  );
}
