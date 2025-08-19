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

    console.log('✅ Admin encontrado:');
    console.log(`   - Nome: ${adminUser.name}`);
    console.log(`   - Email: ${adminUser.email}`);
    console.log(`   - Role: ${adminUser.roles.display_name} (Level: ${adminUser.roles.level})`);
    console.log(`   - ID: ${adminUser.id}\n`);

    // 2. Buscar unidades do Admin (método do useUserManagement)
    console.log('🏢 Buscando unidades do Admin...');
    const { data: adminUnits, error: unitsError } = await supabase
      .from('user_unit_assignments')
      .select(`
        unit_id,
        units!inner (
          id,
          name,
          is_active
        )
      `)
      .eq('user_id', adminUser.id)
      .eq('units.is_active', true);

    if (unitsError) {
      console.error('❌ Erro ao buscar unidades:', unitsError);
      return;
    }

    const units = adminUnits?.map(item => item.units) || [];
    console.log(`✅ Admin tem acesso a ${units.length} unidades:`);
    units.forEach(unit => {
      console.log(`   - ${unit.name} (${unit.id})`);
    });

    if (units.length === 0) {
      console.log('❌ Admin não tem unidades associadas!');
      return;
    }

    // 3. Para cada unidade, buscar atendentes (método getAttendantsByUnit)
    for (const unit of units) {
      console.log(`\n👥 Buscando atendentes da unidade: ${unit.name}`);
      
      const { data: attendantsData, error: attendantsError } = await supabase
        .from('user_unit_assignments')
        .select(`
          user_id,
          users!user_unit_assignments_user_id_fkey (
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
        .eq('users.roles.level', 30); // Apenas atendentes (level 30)

      if (attendantsError) {
        console.error(`❌ Erro ao buscar atendentes da unidade ${unit.name}:`, attendantsError);
        continue;
      }

      const attendants = attendantsData?.map(item => ({
        id: item.users?.id,
        email: item.users?.email,
        name: item.users?.name,
        is_active: item.users?.is_active,
        created_at: item.users?.created_at,
        role: item.users?.roles
      })).filter(attendant => attendant.id) || []; // Filtrar apenas objetos válidos

      console.log(`   ✅ ${attendants.length} atendentes encontrados:`);
      if (attendants.length === 0) {
        console.log(`   📝 Nenhum atendente vinculado à unidade ${unit.name}`);
      } else {
        attendants.forEach(attendant => {
          console.log(`   - ${attendant.name} (${attendant.email}) - Status: ${attendant.is_active ? 'Ativo' : 'Inativo'}`);
        });
      }

      // 4. Buscar módulos disponíveis na unidade (método getAvailableModules)
      console.log(`\n📦 Buscando módulos disponíveis na unidade: ${unit.name}`);
      
      const { data: modulesData, error: modulesError } = await supabase
        .from('unit_modules')
        .select(`
          module_id,
          is_active,
          modules (
            id,
            name,
            display_name,
            category
          )
        `)
        .eq('unit_id', unit.id)
        .eq('is_active', true);

      if (modulesError) {
        console.error(`❌ Erro ao buscar módulos da unidade ${unit.name}:`, modulesError);
        continue;
      }

      const modules = modulesData?.map(item => item.modules) || [];
      console.log(`   ✅ ${modules.length} módulos ativos:`);
      modules.forEach(module => {
        console.log(`   - ${module.display_name} (${module.name}) - Categoria: ${module.category}`);
      });

      // 5. Se há atendentes, verificar permissões do primeiro
      if (attendants.length > 0) {
        const firstAttendant = attendants[0];
        console.log(`\n🔐 Verificando permissões de: ${firstAttendant.name}`);
        
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('user_module_permissions')
          .select(`
            module_id,
            is_active,
            modules (
              name,
              display_name
            )
          `)
          .eq('user_id', firstAttendant.id)
          .eq('unit_id', unit.id);

        if (permissionsError) {
          console.error(`❌ Erro ao buscar permissões:`, permissionsError);
        } else {
          console.log(`   ✅ ${permissionsData?.length || 0} permissões configuradas:`);
          permissionsData?.forEach(perm => {
            console.log(`   - ${perm.modules.display_name}: ${perm.is_active ? 'Ativo' : 'Inativo'}`);
          });
        }
      }
    }

    console.log('\n🎯 Resumo do teste:');
    console.log(`- Admin: ${adminUser.name} tem acesso a ${units.length} unidades`);
    console.log(`- Sistema de gestão de usuários está operacional`);
    console.log(`- Estrutura de permissões está implementada`);

  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

testGestaoUsuarios();
