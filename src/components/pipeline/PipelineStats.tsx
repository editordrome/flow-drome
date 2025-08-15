
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, Target, Building2, DollarSign } from "lucide-react";

interface PipelineStatsProps {
  leads: any[];
}

export const PipelineStats = ({ leads }: PipelineStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="border-0 shadow-sm bg-blue-modern text-white">
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-blue-100">Novos Leads</p>
            <p className="text-2xl font-bold">{leads.filter(l => l.stage === 'novos').length}</p>
            <div className="flex items-center text-xs text-blue-200">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+2 na semana</span>
            </div>
          </div>
          <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Target className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-orange-modern text-white">
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-orange-100">Em Andamento</p>
            <p className="text-2xl font-bold">{leads.filter(l => l.stage !== 'novos').length}</p>
            <div className="flex items-center text-xs text-orange-200">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+1 na semana</span>
            </div>
          </div>
          <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-green-modern text-white">
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-green-100">Taxa Conversão</p>
            <p className="text-2xl font-bold">25%</p>
            <div className="flex items-center text-xs text-green-200">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+2%</span>
            </div>
          </div>
          <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Target className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-teal-modern text-white">
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-teal-100">Valor Total</p>
            <p className="text-2xl font-bold">R$ 83.5K</p>
            <div className="flex items-center text-xs text-teal-200">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+R$15K</span>
            </div>
          </div>
          <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
            <DollarSign className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
