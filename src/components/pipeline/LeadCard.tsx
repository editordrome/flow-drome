
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Draggable } from 'react-beautiful-dnd';
import { MoreHorizontal, Eye } from "lucide-react";

interface LeadCardProps {
  lead: any;
  index: number;
  onViewDetails: (lead: any) => void;
}

export const LeadCard = ({ lead, index, onViewDetails }: LeadCardProps) => {
  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType) {
      case "Limpeza Residencial":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Limpeza Comercial":
        return "bg-green-100 text-green-800 border-green-200";
      case "Terceirização":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Pós-Obra":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Limpeza Especial":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 ${snapshot.isDragging ? 'rotate-2' : ''}`}
        >
          <Card 
            className={`bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing ${
              snapshot.isDragging ? 'shadow-lg' : ''
            }`}
            onDoubleClick={() => onViewDetails(lead)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-sm font-semibold text-gray-900 leading-tight">
                  {lead.name}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => onViewDetails(lead)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <Badge 
                variant="outline" 
                className={`text-xs w-fit ${getServiceTypeColor(lead.serviceType)}`}
              >
                {lead.serviceType}
              </Badge>
            </CardHeader>
          </Card>
        </div>
      )}
    </Draggable>
  );
};
