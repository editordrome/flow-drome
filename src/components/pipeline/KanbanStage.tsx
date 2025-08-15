
import { Button } from "@/components/ui/button";
import { Droppable } from 'react-beautiful-dnd';
import { Plus, MoreHorizontal } from "lucide-react";
import { LeadCard } from "./LeadCard";

interface KanbanStageProps {
  stage: {
    id: string;
    title: string;
    color: string;
  };
  leads: any[];
  onViewDetails: (lead: any) => void;
}

export const KanbanStage = ({ stage, leads, onViewDetails }: KanbanStageProps) => {
  return (
    <div className={`${stage.color} rounded-lg border-t-4 bg-white min-h-[600px]`}>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800 text-sm">
            {stage.title}
          </h3>
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <Droppable droppableId={stage.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-4 space-y-3 min-h-[500px] ${
              snapshot.isDraggingOver ? 'bg-gray-50' : ''
            }`}
          >
            {leads
              .filter(lead => lead.stage === stage.id)
              .map((lead, index) => (
                <LeadCard 
                  key={lead.id} 
                  lead={lead} 
                  index={index} 
                  onViewDetails={onViewDetails}
                />
              ))}
            {provided.placeholder}
            
            <Button 
              variant="ghost" 
              className="w-full border-2 border-dashed border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-600 h-12"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Cartão
            </Button>
          </div>
        )}
      </Droppable>
    </div>
  );
};
