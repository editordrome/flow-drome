
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { Star, MapPin } from "lucide-react";
import { Professional } from "@/data/professionals";
import { ProfessionalDetailModal } from "./ProfessionalDetailModal";

interface ProfessionalTableRowProps {
  professional: Professional;
  isActive: boolean;
}

export const ProfessionalTableRow = ({ professional, isActive }: ProfessionalTableRowProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <TableRow className="cursor-pointer hover:bg-gray-50">
          <TableCell>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{professional.avatar}</span>
              <div>
                <p className="font-semibold">{professional.name}</p>
                <p className="text-sm text-gray-600">{professional.specialty}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Badge 
              variant={isActive ? "default" : "secondary"} 
              className={isActive ? 
                "bg-green-modern text-white" : 
                "bg-gray-100 text-gray-700"
              }
            >
              {isActive ? "Ativa" : "Inativa"}
            </Badge>
          </TableCell>
          <TableCell>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-modern mr-1" />
              <span className="font-medium">{professional.rating}</span>
            </div>
          </TableCell>
          <TableCell>{professional.services} serviços</TableCell>
          <TableCell>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-3 w-3 mr-1" />
              {professional.location}
            </div>
          </TableCell>
          <TableCell>{professional.experience}</TableCell>
          {!isActive && professional.inactiveReason && (
            <TableCell>
              <span className="text-xs text-red-600">{professional.inactiveReason}</span>
            </TableCell>
          )}
        </TableRow>
      </DialogTrigger>
      <ProfessionalDetailModal professional={professional} isActive={isActive} />
    </Dialog>
  );
};
