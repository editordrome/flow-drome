
import { useState } from "react";
import { DragDropContext } from 'react-beautiful-dnd';
import { toast } from "@/hooks/use-toast";
import { LeadDetailModal } from "./LeadDetailModal";
import { PipelineStats } from "./pipeline/PipelineStats";
import { KanbanStage } from "./pipeline/KanbanStage";
import { NewLeadDialog } from "./pipeline/NewLeadDialog";
import { initialLeads, stages } from "./pipeline/pipelineData";

const PipelineKanban = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [leads, setLeads] = useState(initialLeads);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId !== destination.droppableId) {
      const newLeads = leads.map(lead => {
        if (lead.id === result.draggableId) {
          return { ...lead, stage: destination.droppableId };
        }
        return lead;
      });
      
      setLeads(newLeads);
      toast({
        title: "Lead movido!",
        description: `Lead foi movido para ${stages.find(s => s.id === destination.droppableId)?.title}`,
      });
    }
  };

  const handleViewDetails = (lead: any) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PipelineStats leads={leads} />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((stage) => (
            <KanbanStage 
              key={stage.id}
              stage={stage}
              leads={leads}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </DragDropContext>

      <div className="mt-6 flex justify-center">
        <NewLeadDialog />
      </div>

      <LeadDetailModal 
        lead={selectedLead}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
};

export default PipelineKanban;
