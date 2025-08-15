
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Professional } from "@/data/professionals";
import { ProfessionalTableRow } from "./ProfessionalTableRow";

interface ProfessionalsTableProps {
  professionals: Professional[];
  isActive: boolean;
}

export const ProfessionalsTable = ({ professionals, isActive }: ProfessionalsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Profissional</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Avaliação</TableHead>
          <TableHead>Serviços</TableHead>
          <TableHead>Localização</TableHead>
          <TableHead>Experiência</TableHead>
          {!isActive && <TableHead>Motivo Inatividade</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {professionals.map((professional) => (
          <ProfessionalTableRow 
            key={professional.id} 
            professional={professional} 
            isActive={isActive}
          />
        ))}
      </TableBody>
    </Table>
  );
};
