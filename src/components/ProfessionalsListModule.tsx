
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { activeProfessionals, inactiveProfessionals } from "@/data/professionals";
import { ProfessionalsTable } from "./professionals/ProfessionalsTable";

const ProfessionalsListModule = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="ativas" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-cream-modern border-2 border-cream-modern">
          <TabsTrigger 
            value="ativas"
            className="data-[state=active]:bg-blue-modern data-[state=active]:text-white"
          >
            Ativas ({activeProfessionals.length})
          </TabsTrigger>
          <TabsTrigger 
            value="inativas"
            className="data-[state=active]:bg-blue-modern data-[state=active]:text-white"
          >
            Inativas ({inactiveProfessionals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ativas" className="space-y-6">
          <ProfessionalsTable professionals={activeProfessionals} isActive={true} />
        </TabsContent>

        <TabsContent value="inativas" className="space-y-6">
          <ProfessionalsTable professionals={inactiveProfessionals} isActive={false} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfessionalsListModule;
