import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://mstjpohsemoxbgwjklby.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdGpwb2hzZW1veGJnd2prbGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMjY1MjcsImV4cCI6MjA3MDgwMjUyN30.1Jg1XK-3t7W5tsyR6e0Y3o2B6YmLBTP9aPzwMCS-07U";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testGestaoUsuarios() {
  console.log('🔄 Testando Gestão de Usuários...\n');

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
      console.log(`   - ${unit.name} (${unit.id})`);
    });

    if (units.length === 0) {
      console.log('❌ Admin não tem unidades associadas!');
      return;
    }

    // 3. Para cada unidade, buscar atendentes (conforme implementação atual)
    for (const unit of units) {
      console.log(`\n🔍 Buscando atendentes para unidade: ${unit.name}`);
      
      const { data: attendants, error: attendantsError } = await supabase
        .from('user_unit_assignments')
        .select(`
          user_id,
          users!inner (
            id,
            email,
            name,
            is_active,
            created_at,
            roles!inner (
              name,
              display_name,
              level
            )
          )
        `)
        .eq('unit_id', unit.id)
        .eq('users.roles.level', 30); // Apenas atendentes

      if (attendantsError) {
        console.error(`❌ Erro ao buscar atendentes para ${unit.name}:`, attendantsError);
        continue;
      }

      console.log(`✅ ${attendants?.length || 0} atendentes encontrados na unidade ${unit.name}:`);
      
      if (attendants && attendants.length > 0) {
        attendants.forEach(item => {
          console.log(`   - ${item.users.name} (${item.users.email}) - Ativo: ${item.users.is_active} - Level: ${item.users.roles.level}`);
        });
      } else {
        console.log('   (Nenhum atendente encontrado)');
      }
    }

    // 4. Verificar se submenu "Usuários" está disponível para Admin
    console.log('\n🔍 Verificando acesso ao menu Configuração → Usuários:');
    
    // Admin tem level 80, deve ter acesso ao configuracao-admin
    const adminLevel = adminUser.roles.level;
    const hasConfigAccess = adminLevel >= 80;
    
    console.log(`   - Admin Level: ${adminLevel}`);
    console.log(`   - Acesso a Configuração: ${hasConfigAccess ? '✅' : '❌'}`);
    
    if (hasConfigAccess) {
      console.log('   - Submenu "Usuários" deve estar visível na Configuração ✅');
    } else {
      console.log('   - Submenu "Usuários" NÃO deve estar visível ❌');
    }

    // 5. Testar se há dados na tabela de roles para atendentes
    console.log('\n🔍 Verificando role de Atendente (level 30):');
    
    const { data: attendantRole, error: roleError } = await supabase
      .from('roles')
      .select('id, name, display_name, level')
      .eq('level', 30)
      .single();

    if (roleError || !attendantRole) {
      console.error('❌ Role de Atendente não encontrada:', roleError);
    } else {
      console.log(`✅ Role de Atendente encontrada: ${attendantRole.display_name} (ID: ${attendantRole.id})`);
    }

  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

testGestaoUsuarios();
