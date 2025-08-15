
-- Criar tabela para logs de atividades do sistema
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  company_id UUID REFERENCES companies(id),
  unit_id UUID REFERENCES units(id),
  module_name TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS na tabela activity_logs
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Política para visualizar logs (usuários podem ver logs da sua empresa/unidade)
CREATE POLICY "Users can view activity logs from their context"
ON activity_logs FOR SELECT
USING (
  company_id IN (
    SELECT cm.company_id FROM company_members cm WHERE cm.user_id = auth.uid()
  ) OR
  unit_id IN (
    SELECT u.id FROM units u 
    JOIN company_members cm ON cm.company_id = u.company_id 
    WHERE cm.user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM users WHERE auth_user_id = auth.uid() AND role = 'super_admin'
  )
);

-- Política para inserir logs
CREATE POLICY "Users can insert activity logs"
ON activity_logs FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT cm.company_id FROM company_members cm WHERE cm.user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM users WHERE auth_user_id = auth.uid() AND role = 'super_admin'
  )
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_company_id ON activity_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_unit_id ON activity_logs(unit_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);

-- Criar tabela para configurações modulares
CREATE TABLE IF NOT EXISTS module_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_key TEXT NOT NULL,
  company_id UUID REFERENCES companies(id),
  unit_id UUID REFERENCES units(id),
  configuration JSONB DEFAULT '{}',
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(module_key, company_id, unit_id)
);

-- Habilitar RLS na tabela module_configurations
ALTER TABLE module_configurations ENABLE ROW LEVEL SECURITY;

-- Política para configurações de módulos
CREATE POLICY "Users can manage module configurations in their context"
ON module_configurations FOR ALL
USING (
  company_id IN (
    SELECT cm.company_id FROM company_members cm 
    WHERE cm.user_id = auth.uid() AND cm.role IN ('owner', 'admin')
  ) OR
  EXISTS (
    SELECT 1 FROM users WHERE auth_user_id = auth.uid() AND role = 'super_admin'
  )
);

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_module_configurations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_module_configurations_updated_at
  BEFORE UPDATE ON module_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_module_configurations_updated_at();

-- Criar tabela para métricas de performance por unidade
CREATE TABLE IF NOT EXISTS unit_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) NOT NULL,
  metric_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  metric_date DATE NOT NULL,
  total_services INTEGER DEFAULT 0,
  completed_services INTEGER DEFAULT 0,
  cancelled_services INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  active_professionals INTEGER DEFAULT 0,
  customer_satisfaction DECIMAL(3,2), -- 0-5 scale
  response_time_avg INTEGER, -- em minutos
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(unit_id, metric_type, metric_date)
);

-- Habilitar RLS na tabela unit_metrics
ALTER TABLE unit_metrics ENABLE ROW LEVEL SECURITY;

-- Política para métricas de unidade
CREATE POLICY "Users can view metrics from their units"
ON unit_metrics FOR SELECT
USING (
  unit_id IN (
    SELECT u.id FROM units u 
    JOIN company_members cm ON cm.company_id = u.company_id 
    WHERE cm.user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM users WHERE auth_user_id = auth.uid() AND role = 'super_admin'
  )
);

-- Política para inserir/atualizar métricas
CREATE POLICY "System can manage unit metrics"
ON unit_metrics FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users WHERE auth_user_id = auth.uid() AND role = 'super_admin'
  )
);

-- Função para registrar atividade do sistema
CREATE OR REPLACE FUNCTION log_system_activity(
  p_user_id UUID,
  p_company_id UUID,
  p_unit_id UUID,
  p_module_name TEXT,
  p_action TEXT,
  p_description TEXT,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO activity_logs (
    user_id, company_id, unit_id, module_name, 
    action, description, metadata
  ) VALUES (
    p_user_id, p_company_id, p_unit_id, p_module_name,
    p_action, p_description, p_metadata
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- Função para obter métricas consolidadas de uma empresa
CREATE OR REPLACE FUNCTION get_company_metrics(
  p_company_id UUID,
  p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  p_end_date DATE DEFAULT CURRENT_DATE
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Verificar permissão
  IF NOT EXISTS (
    SELECT 1 FROM company_members 
    WHERE user_id = auth.uid() AND company_id = p_company_id
  ) AND NOT EXISTS (
    SELECT 1 FROM users WHERE auth_user_id = auth.uid() AND role = 'super_admin'
  ) THEN
    RETURN jsonb_build_object('error', 'Access denied');
  END IF;

  SELECT jsonb_build_object(
    'total_services', COALESCE(SUM(um.total_services), 0),
    'completed_services', COALESCE(SUM(um.completed_services), 0),
    'cancelled_services', COALESCE(SUM(um.cancelled_services), 0),
    'total_revenue', COALESCE(SUM(um.revenue), 0),
    'active_units', COUNT(DISTINCT um.unit_id),
    'avg_satisfaction', ROUND(AVG(um.customer_satisfaction), 2),
    'avg_response_time', ROUND(AVG(um.response_time_avg)),
    'period', jsonb_build_object(
      'start_date', p_start_date,
      'end_date', p_end_date
    )
  ) INTO v_result
  FROM unit_metrics um
  JOIN units u ON u.id = um.unit_id
  WHERE u.company_id = p_company_id
    AND um.metric_date BETWEEN p_start_date AND p_end_date;

  RETURN COALESCE(v_result, jsonb_build_object('error', 'No data found'));
END;
$$;

-- Atualizar tabela companies para incluir configurações de governança
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS governance_settings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS compliance_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS last_audit_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS next_audit_date TIMESTAMP WITH TIME ZONE;

-- Atualizar tabela units para incluir métricas de performance
ALTER TABLE units 
ADD COLUMN IF NOT EXISTS performance_score DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_performance_review TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS operational_status TEXT DEFAULT 'active';

-- Criar índices adicionais para performance
CREATE INDEX IF NOT EXISTS idx_companies_governance ON companies USING GIN(governance_settings);
CREATE INDEX IF NOT EXISTS idx_units_performance ON units(performance_score DESC);
CREATE INDEX IF NOT EXISTS idx_module_configurations_module_key ON module_configurations(module_key);
