-- Adicionar campos para dados do CNPJ na tabela units
-- Migration: 20250815100000_add_cnpj_fields_to_units.sql

-- Adicionar novos campos à tabela units
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS razao_social TEXT;
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS nome_fantasia TEXT;
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS cep TEXT;
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS cidade TEXT;
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS estado TEXT;
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS uf TEXT;
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS logradouro TEXT;
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS numero TEXT;
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS complemento TEXT;
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS bairro TEXT;
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS municipio TEXT;
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS cnae_fiscal TEXT;
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS situacao_cadastral TEXT;
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS porte TEXT;

-- Comentários para documentação
COMMENT ON COLUMN public.units.razao_social IS 'Razão social da empresa conforme CNPJ';
COMMENT ON COLUMN public.units.nome_fantasia IS 'Nome fantasia da empresa conforme CNPJ';
COMMENT ON COLUMN public.units.cep IS 'CEP do endereço da unidade';
COMMENT ON COLUMN public.units.cidade IS 'Cidade da unidade';
COMMENT ON COLUMN public.units.estado IS 'Estado da unidade (nome completo)';
COMMENT ON COLUMN public.units.uf IS 'UF - Unidade Federativa (sigla do estado)';
COMMENT ON COLUMN public.units.logradouro IS 'Logradouro conforme CNPJ';
COMMENT ON COLUMN public.units.numero IS 'Número do endereço conforme CNPJ';
COMMENT ON COLUMN public.units.complemento IS 'Complemento do endereço conforme CNPJ';
COMMENT ON COLUMN public.units.bairro IS 'Bairro conforme CNPJ';
COMMENT ON COLUMN public.units.municipio IS 'Município conforme CNPJ';
COMMENT ON COLUMN public.units.cnae_fiscal IS 'CNAE fiscal principal da empresa';
COMMENT ON COLUMN public.units.situacao_cadastral IS 'Situação cadastral da empresa (ATIVA, SUSPENSA, etc.)';
COMMENT ON COLUMN public.units.porte IS 'Porte da empresa (MICRO EMPRESA, PEQUENA EMPRESA, etc.)';

-- Atualizar política RLS se necessário (manter as existentes)
-- As políticas RLS existentes já cobrem a tabela units, então não precisamos modificar

-- Criar índices para melhor performance em consultas frequentes
CREATE INDEX IF NOT EXISTS idx_units_cnpj ON public.units(cnpj);
CREATE INDEX IF NOT EXISTS idx_units_uf ON public.units(uf);
CREATE INDEX IF NOT EXISTS idx_units_cidade ON public.units(cidade);
CREATE INDEX IF NOT EXISTS idx_units_situacao_cadastral ON public.units(situacao_cadastral);

-- Log da migração
INSERT INTO public.schema_migrations (version, applied_at) 
VALUES ('20250815100000_add_cnpj_fields_to_units', NOW())
ON CONFLICT (version) DO NOTHING;
