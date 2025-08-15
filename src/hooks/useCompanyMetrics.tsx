
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MetricsParams {
  companyId: string;
  startDate?: string;
  endDate?: string;
}

interface CompanyMetrics {
  total_services: number;
  completed_services: number;
  cancelled_services: number;
  total_revenue: number;
  active_units: number;
  avg_satisfaction: number;
  avg_response_time: number;
  period: {
    start_date: string;
    end_date: string;
  };
}

export const useCompanyMetrics = ({ companyId, startDate, endDate }: MetricsParams) => {
  return useQuery({
    queryKey: ['company-metrics', companyId, startDate, endDate],
    queryFn: async (): Promise<CompanyMetrics> => {
      const { data, error } = await supabase.rpc('get_company_metrics', {
        p_company_id: companyId,
        p_start_date: startDate,
        p_end_date: endDate
      });

      if (error) throw error;
      
      // Type cast from jsonb to our specific interface
      return data as CompanyMetrics;
    },
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
