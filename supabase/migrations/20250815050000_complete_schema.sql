-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create roles table first
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  level INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role_id UUID REFERENCES roles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  name VARCHAR(255) NOT NULL DEFAULT 'Novo Usuário',
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  governance_settings JSONB DEFAULT '{}',
  compliance_status TEXT DEFAULT 'pending',
  last_audit_date TIMESTAMP WITH TIME ZONE,
  next_audit_date TIMESTAMP WITH TIME ZONE,
  CONSTRAINT check_compliance_status CHECK (compliance_status IN ('pending', 'compliant', 'non_compliant', 'under_review'))
);

-- Create units table
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  code VARCHAR(50) UNIQUE,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  performance_score DECIMAL DEFAULT 0,
  last_performance_review TIMESTAMP WITH TIME ZONE,
  operational_status TEXT DEFAULT 'active',
  CONSTRAINT check_operational_status CHECK (operational_status IN ('active', 'inactive', 'maintenance', 'suspended'))
);

-- Create user_units relationship table
CREATE TABLE IF NOT EXISTS user_units (
  user_id UUID NOT NULL REFERENCES users(id),
  unit_id UUID NOT NULL REFERENCES units(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  PRIMARY KEY (user_id, unit_id)
);

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  parent_module UUID REFERENCES modules(id),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  route VARCHAR(255),
  required_role VARCHAR(50) DEFAULT 'user',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create remaining tables
CREATE TABLE IF NOT EXISTS table_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data TEXT,
  horario TEXT,
  momento TEXT,
  servico TEXT,
  tipo TEXT,
  periodo TEXT,
  cliente TEXT,
  profissional TEXT,
  endereco TEXT,
  dia TEXT,
  status TEXT,
  whatscliente TEXT,
  user_id UUID NOT NULL REFERENCES users(id),
  unit_id UUID NOT NULL REFERENCES units(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resultados (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data DATE,
  horario TEXT,
  valor DECIMAL,
  servico TEXT,
  tipo TEXT,
  periodo TEXT,
  cliente TEXT,
  profissional TEXT,
  endereco TEXT,
  dia TEXT,
  repasse DECIMAL,
  whatscliente TEXT,
  cupom TEXT,
  origem TEXT,
  atendimento_id TEXT,
  is_divisao TEXT,
  cadastro DATE,
  acao TEXT,
  horas TEXT,
  motivo TEXT,
  acomp DATE,
  status TEXT,
  pos TEXT,
  observacao TEXT,
  user_id UUID NOT NULL REFERENCES users(id),
  unit_id UUID NOT NULL REFERENCES units(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recruta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT,
  data_nasc TEXT,
  whatsapp TEXT,
  dias_livres TEXT,
  dias_semana TEXT,
  fumante TEXT,
  rest_pet TEXT,
  rest_pet_qual TEXT,
  exp_residencial TEXT,
  ref_residencial TEXT,
  exp_comercial TEXT,
  ref_comercial TEXT,
  sit_atual TEXT,
  motivo_cadastro TEXT,
  estado_civil TEXT,
  filhos TEXT,
  qto_filhos TEXT,
  rotina_filhos TEXT,
  transporte TEXT,
  status TEXT,
  endereco TEXT,
  rg TEXT,
  cpf TEXT,
  unidade TEXT,
  color_card TEXT,
  observacao TEXT,
  user_id UUID NOT NULL REFERENCES users(id),
  unit_id UUID NOT NULL REFERENCES units(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profissionais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT,
  whatsapp TEXT,
  user_id UUID NOT NULL REFERENCES users(id),
  unit_id UUID NOT NULL REFERENCES units(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sua_tabela (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  color TEXT,
  image_url TEXT
);

-- Create governance tables
CREATE TABLE IF NOT EXISTS company_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  user_id UUID REFERENCES users(id),
  role VARCHAR(50) DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS super_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

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
  CONSTRAINT unique_module_config_per_unit UNIQUE (module_key, company_id, unit_id)
);

CREATE TABLE IF NOT EXISTS unit_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES units(id),
  metric_type TEXT NOT NULL,
  metric_date DATE NOT NULL,
  total_services INTEGER DEFAULT 0,
  completed_services INTEGER DEFAULT 0,
  cancelled_services INTEGER DEFAULT 0,
  revenue DECIMAL DEFAULT 0,
  active_professionals INTEGER DEFAULT 0,
  customer_satisfaction DECIMAL(3,2),
  response_time_avg INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(unit_id, metric_type, metric_date),
  CONSTRAINT check_metrics_non_negative CHECK (total_services >= 0 AND completed_services >= 0 AND cancelled_services >= 0 AND revenue >= 0),
  CONSTRAINT check_completed_not_exceed_total CHECK (completed_services <= total_services)
);

CREATE TABLE IF NOT EXISTS unit_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES units(id),
  module_id UUID NOT NULL REFERENCES modules(id),
  enabled_by UUID REFERENCES users(id),
  enabled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  disabled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_module_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  unit_id UUID REFERENCES units(id),
  module_id UUID REFERENCES modules(id),
  granted_by UUID REFERENCES users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  can_view BOOLEAN DEFAULT false,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  can_export BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS unit_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES units(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  key_type VARCHAR(50) NOT NULL DEFAULT 'link',
  value TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
