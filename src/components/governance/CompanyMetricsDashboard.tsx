
import { useState } from "react";
import { useCompanyMetrics } from "@/hooks/useCompanyMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  Clock,
  Star
} from "lucide-react";
import { format, subDays } from "date-fns";

interface CompanyMetricsDashboardProps {
  companyId: string;
}

export const CompanyMetricsDashboard = ({ companyId }: CompanyMetricsDashboardProps) => {
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  const { data: metrics, isLoading, error } = useCompanyMetrics({
    companyId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Erro ao carregar métricas: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando métricas...</div>
        </CardContent>
      </Card>
    );
  }

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = "blue",
    suffix = "" 
  }: {
    title: string;
    value: number | string;
    icon: any;
    color?: string;
    suffix?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-3xl font-bold text-${color}-600`}>
              {value}{suffix}
            </p>
          </div>
          <div className={`h-12 w-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard de Métricas da Empresa</CardTitle>
          <div className="flex gap-4">
            <div>
              <label className="text-sm font-medium">Data Inicial</label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Data Final</label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {metrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total de Serviços"
              value={metrics.total_services || 0}
              icon={Users}
              color="blue"
            />
            
            <MetricCard
              title="Serviços Concluídos"
              value={metrics.completed_services || 0}
              icon={CheckCircle}
              color="green"
            />
            
            <MetricCard
              title="Serviços Cancelados"
              value={metrics.cancelled_services || 0}
              icon={XCircle}
              color="red"
            />
            
            <MetricCard
              title="Receita Total"
              value={`R$ ${(metrics.total_revenue || 0).toLocaleString('pt-BR')}`}
              icon={DollarSign}
              color="green"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Unidades Ativas"
              value={metrics.active_units || 0}
              icon={Users}
              color="purple"
            />
            
            <MetricCard
              title="Satisfação Média"
              value={metrics.avg_satisfaction || 0}
              icon={Star}
              color="yellow"
              suffix="/5"
            />
            
            <MetricCard
              title="Tempo Médio de Resposta"
              value={`${metrics.avg_response_time || 0} min`}
              icon={Clock}
              color="orange"
            />
          </div>

          {metrics.period && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-4">
                  <Badge variant="outline">
                    Período: {format(new Date(metrics.period.start_date), 'dd/MM/yyyy')} - {format(new Date(metrics.period.end_date), 'dd/MM/yyyy')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
