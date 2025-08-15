
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import AgendamentosStats from "./AgendamentosStats";
import AgendamentosTable from "./AgendamentosTable";

interface AgendamentosTabContentProps {
  agendamentos: any[];
  date: Date;
  isCustomDate?: boolean;
}

export default function AgendamentosTabContent({ 
  agendamentos, 
  date, 
  isCustomDate = false 
}: AgendamentosTabContentProps) {
  const gradientClass = isCustomDate 
    ? "bg-gradient-to-r from-kit-accent/10 to-kit-light/30"
    : "bg-gradient-to-r from-kit-secondary/10 to-kit-light/50";

  return (
    <Card className="border-0 shadow-kit-lg rounded-2xl overflow-hidden">
      <CardHeader className={`border-b border-gray-100 ${gradientClass}`}>
        <AgendamentosStats agendamentos={agendamentos} date={date} />
      </CardHeader>
      
      <CardContent className="p-0">
        {agendamentos.length === 0 ? (
          <div className="p-12 text-center">
            <div className="kit-icon-light mx-auto mb-6">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <p className="text-gray-600 text-lg font-medium">Nenhum agendamento encontrado para esta data</p>
            <p className="text-gray-400 text-sm mt-2">Tente ajustar os filtros ou verificar outras datas</p>
          </div>
        ) : (
          <div className="p-6">
            <AgendamentosTable agendamentos={agendamentos} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
