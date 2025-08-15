
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, User, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgendamentosTableProps {
  agendamentos: any[];
}

export default function AgendamentosTable({ agendamentos }: AgendamentosTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100">
      <Table>
        <TableHeader className="bg-kit-light/50">
          <TableRow className="border-b border-gray-100">
            <TableHead className="w-[120px] font-semibold text-gray-700">
              <div className="flex items-center">
                <div className="kit-icon-secondary mr-2">
                  <Clock className="h-4 w-4" />
                </div>
                Horário
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              <div className="flex items-center">
                <div className="kit-icon-accent mr-2">
                  <User className="h-4 w-4" />
                </div>
                Cliente
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              <div className="flex items-center">
                <div className="kit-icon-primary mr-2">
                  <MapPin className="h-4 w-4" />
                </div>
                Serviço
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700">Profissional</TableHead>
            <TableHead className="font-semibold text-gray-700">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-kit-accent/20 flex items-center justify-center mr-2">
                  <Phone className="h-4 w-4 text-kit-accent" />
                </div>
                Telefone
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700">Status</TableHead>
            <TableHead className="w-[140px] font-semibold text-gray-700">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agendamentos.map((agendamento) => (
            <TableRow key={agendamento.id} className="hover:bg-kit-light/30 transition-colors border-b border-gray-50">
              <TableCell>
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-kit-secondary to-blue-600 rounded-2xl shadow-kit">
                  <div className="text-center">
                    <div className="text-sm font-bold text-white">{agendamento.horario}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-gray-900 text-base">{agendamento.cliente}</div>
              </TableCell>
              <TableCell>
                <Badge variant="light" className="kit-badge-light">
                  {agendamento.servico}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-700 font-medium">{agendamento.profissional}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-600 font-mono">{agendamento.telefone}</div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={agendamento.status === "Confirmado" ? "accent" : "default"}
                  className={cn(
                    "font-medium",
                    agendamento.status === "Confirmado" 
                      ? "kit-badge-accent" 
                      : "kit-badge-primary"
                  )}
                >
                  {agendamento.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="kit-btn-outline-secondary"
                >
                  Ver Detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
