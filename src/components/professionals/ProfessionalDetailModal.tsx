
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { KitProfileCard } from "@/components/ui/kit-profile-card";
import { Phone, MapPin, Calendar } from "lucide-react";
import { Professional } from "@/data/professionals";

interface ProfessionalDetailModalProps {
  professional: Professional;
  isActive: boolean;
}

export const ProfessionalDetailModal = ({ professional, isActive }: ProfessionalDetailModalProps) => {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Perfil da Profissional</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <KitProfileCard
          name={professional.name}
          specialty={professional.specialty}
          avatar={professional.avatar}
          rating={professional.rating}
          badges={professional.badges}
          stats={professional.stats}
          headerColor={isActive ? "blue" : "green"}
          avatarColor={isActive ? "green" : "yellow"}
        />
        
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{professional.phone}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{professional.location}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">Ingressou em {new Date(professional.joinDate).toLocaleDateString('pt-BR')}</span>
          </div>
          
          {!isActive && (
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-red-800">Status: Inativa</p>
              <p className="text-xs text-red-600">
                Motivo: {professional.inactiveReason}
              </p>
              <p className="text-xs text-red-600">
                Desde: {new Date(professional.inactiveSince!).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
        </div>
      </div>
    </DialogContent>
  );
};
