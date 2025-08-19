import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://mstjpohsemoxbgwjklby.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdGpwb2hzZW1veGJnd2prbGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMjY1MjcsImV4cCI6MjA3MDgwMjUyN30.1Jg1XK-3t7W5tsyR6e0Y3o2B6YmLBTP9aPzwMCS-07U";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Mapeamento copiado do useAllowedModules.tsx - ATUALIZADO
const getModuleNameFromId = (id) => {
  const idToModuleMap = {
    // Core modules - nomes como aparecem no banco
    'dashboard': 'Dashboard',
    'gestao': 'Dashboard',
    'usuarios': 'Usuários',
    'agendamentos': 'Dashboard', // Agendamentos é parte do dashboard
    
    // Atendimento modules
    'agenda': 'Agenda',
    'clientes': 'Clientes',
    'pipeline': 'Pipeline',
    'tickets': 'Tickets',
    
    // Financeiro modules  
    'financeiro': 'Financeiro',
    'dashboard-financeiro': 'Financeiro',
    'cashback': 'Cashback',
    
    // Gestão modules
    'profissionais': 'Profissionais',
    'profissionais-lista': 'Profissionais',
    'materiais': 'Materiais',
    'uniformes': 'Uniformes',
    
    // Marketing modules
    'marketing': 'Marketing',
    'materiais-marketing': 'Marketing',
    'publicacoes': 'Publicações',
    
    // Educação modules
    'maria-uni': 'MariaUni',
    'base-conhecimento': 'Base Conhecimento',
    
    // RH modules
    'recrutadora': 'Recrutadora',
    
    // Super Admin modules
    'super-admin': 'super-admin',
    'super-admin-dashboard': 'super-admin',
    'gestao-unidades': 'super-admin',
    'configuracao-modulos': 'super-admin',
    
    // Admin modules - Configuration
    'configuracao': 'configuracao-admin',
    'gestao-usuarios': 'configuracao-admin',
  };

  return idToModuleMap[id] || id;
};

async function testModuleMapping() {
  console.log('🔄 Testando mapeamento de módulos...\n');

  try {
    // 1. Buscar usuário Admin
    const { data: adminUser, error: userError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        name,
        role_id,
        roles:role_id (
          name,
          display_name,
          level
        )
      `)
      .eq('email', 'admin@mariaflow.com')
      .single();

    if (userError || !adminUser) {
      console.error('❌ Admin não encontrado:', userError);
      return;
    }

    console.log('✅ Admin encontrado:', adminUser.email, adminUser.name, 'Level:', adminUser.roles.level);

    // 2. Buscar unidades do admin
    const { data: adminUnits, error: unitsError } = await supabase
      .from('user_unit_assignments')
      .select(`
        units:unit_id (
          id,
          name,
          status,
          cnpj
        )
      `)
      .eq('user_id', adminUser.id);

    if (unitsError) {
      console.error('❌ Erro ao buscar unidades:', unitsError);
      return;
    }

    const units = adminUnits?.map(a => a.units).filter(Boolean) || [];
    console.log(`✅ Admin tem acesso a ${units.length} unidades:`);
    units.forEach(unit => {
      console.log(`   - ${unit.name} (${unit.cnpj})`);
    });

    if (units.length === 0) {
      console.log('❌ Admin não tem unidades associadas!');
      return;
    }

    // 3. Testar módulos da primeira unidade
    const firstUnit = units[0];
    console.log(`\n🔍 Testando módulos para unidade: ${firstUnit.name} (${firstUnit.id})`);

    const { data: unitModules, error: modulesError } = await supabase
      .from('unit_modules')
      .select(`
        module_id,
        is_active,
        modules!inner(name, display_name, category, is_core)
      `)
      .eq('unit_id', firstUnit.id)
      .eq('is_active', true);

    if (modulesError) {
      console.error('❌ Erro ao buscar módulos:', modulesError);
      return;
    }

    console.log(`✅ ${unitModules.length} módulos ativos encontrados na unidade:`);
    
    const moduleNames = [];
    unitModules.forEach(um => {
      console.log(`   - ${um.modules.name} (${um.modules.display_name}) - Categoria: ${um.modules.category}`);
      moduleNames.push(um.modules.name);
    });

    // 4. Testar se Admin tem acesso ao menu Configuração
    if (adminUser.roles.level >= 80) {
      moduleNames.push('configuracao-admin');
      console.log('\n✅ Admin tem level >= 80, adicionando configuracao-admin');
    }

    console.log('\n📋 Lista final de módulos para o Admin:');
    moduleNames.forEach(name => {
      console.log(`   - ${name}`);
    });

    // 5. Testar mapeamento reverso - quais IDs de menu correspondem aos módulos
    console.log('\n🔄 Testando mapeamento ID → Módulo:');
    const menuIds = [
      'dashboard', 'gestao', 'agendamentos', 'pipeline', 'cashback', 'clientes',
      'configuracao', 'gestao-usuarios', 'profissionais', 'profissionais-lista',
      'agenda', 'recrutadora', 'financeiro', 'dashboard-financeiro', 'materiais-marketing',
      'publicacoes', 'uniformes', 'materiais', 'tickets', 'base-conhecimento', 'maria-uni'
    ];

    menuIds.forEach(id => {
      const moduleName = getModuleNameFromId(id);
      const isAllowed = moduleNames.includes(moduleName);
      console.log(`   ${id} → ${moduleName} [${isAllowed ? '✅' : '❌'}]`);
    });

  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

testModuleMapping();
