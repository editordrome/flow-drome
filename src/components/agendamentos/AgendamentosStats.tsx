
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface AgendamentosStatsProps {
  agendamentos: any[];
  date: Date;
}

export default function AgendamentosStats({ agendamentos, date }: AgendamentosStatsProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-gray-900">
        Agendamentos para {date.toLocaleDateString('pt-BR')}
      </h2>
      <Badge 
        variant="light" 
        className="kit-badge-light font-semibold px-4 py-1 text-sm"
      >
        {agendamentos.length} agendamento(s)
      </Badge>
    </div>
  );
}
