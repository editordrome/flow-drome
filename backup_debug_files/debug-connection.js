import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://mstjpohsemoxbgwjklby.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdGpwb2hzZW1veGJnd2prbGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMjY1MjcsImV4cCI6MjA3MDgwMjUyN30.1Jg1XK-3t7W5tsyR6e0Y3o2B6YmLBTP9aPzwMCS-07U";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
  console.log('🔄 Testando conexão com Supabase...\n');

  try {
    // 1. Testar conexão básica
    console.log('1️⃣ Testando conexão básica...');
    const { data: healthCheck } = await supabase.from('users').select('count').limit(1);
    console.log('✅ Conexão estabelecida!\n');

    // 2. Verificar usuários
    console.log('2️⃣ Verificando usuários...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, role_level, is_super_admin')
      .eq('is_active', true);
    
    if (usersError) {
      console.error('❌ Erro ao buscar usuários:', usersError);
    } else {
      console.log(`✅ ${users.length} usuários encontrados:`);
      users.forEach(user => {
        console.log(`   - ${user.email} (${user.name}) - Level: ${user.role_level} - Super Admin: ${user.is_super_admin}`);
      });
    }
    console.log('');

    // 3. Verificar unidades
    console.log('3️⃣ Verificando unidades...');
    const { data: units, error: unitsError } = await supabase
      .from('units')
      .select('id, name, status, cnpj')
      .eq('is_active', true);
    
    if (unitsError) {
      console.error('❌ Erro ao buscar unidades:', unitsError);
    } else {
      console.log(`✅ ${units.length} unidades encontradas:`);
      units.forEach(unit => {
        console.log(`   - ${unit.name} (${unit.cnpj}) - Status: ${unit.status}`);
      });
    }
    console.log('');

    // 4. Verificar módulos
    console.log('4️⃣ Verificando módulos...');
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('id, name, display_name, category, is_core')
      .order('category, name');
    
    if (modulesError) {
      console.error('❌ Erro ao buscar módulos:', modulesError);
    } else {
      console.log(`✅ ${modules.length} módulos encontrados:`);
      modules.forEach(module => {
        console.log(`   - ${module.name} (${module.display_name}) - Categoria: ${module.category} - Core: ${module.is_core}`);
      });
    }
    console.log('');

    // 5. Verificar unit_modules (associações)
    console.log('5️⃣ Verificando associações unit_modules...');
    const { data: unitModules, error: umError } = await supabase
      .from('unit_modules')
      .select(`
        id,
        unit_id,
        module_id,
        is_active,
        units!inner(name),
        modules!inner(name, display_name)
      `)
      .eq('is_active', true);
    
    if (umError) {
      console.error('❌ Erro ao buscar unit_modules:', umError);
    } else {
      console.log(`✅ ${unitModules.length} associações unit_modules ativas:`);
      unitModules.forEach(um => {
        console.log(`   - Unidade: ${um.units.name} → Módulo: ${um.modules.name} (${um.modules.display_name})`);
      });
    }
    console.log('');

    // 6. Verificar user_unit_assignments
    console.log('6️⃣ Verificando associações user_unit_assignments...');
    const { data: userUnits, error: uuError } = await supabase
      .from('user_unit_assignments')
      .select(`
        user_id,
        unit_id,
        users!user_unit_assignments_user_id_fkey(email, name),
        units!inner(name)
      `);
    
    if (uuError) {
      console.error('❌ Erro ao buscar user_unit_assignments:', uuError);
    } else {
      console.log(`✅ ${userUnits.length} associações user_unit_assignments:`);
      userUnits.forEach(uu => {
        console.log(`   - Usuário: ${uu.users.email} (${uu.users.name}) → Unidade: ${uu.units.name}`);
      });
    }
    console.log('');

    // 7. Teste específico para Admin
    console.log('7️⃣ Testando para usuário Admin (admin@mariaflow.com)...');
    const adminUser = users?.find(u => u.email === 'admin@mariaflow.com');
    
    if (adminUser) {
      console.log(`Admin encontrado: ${adminUser.email} - Level: ${adminUser.role_level}`);
      
      // Buscar unidades do admin
      const { data: adminUnits, error: adminUnitsError } = await supabase
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

      if (adminUnitsError) {
        console.error('❌ Erro ao buscar unidades do admin:', adminUnitsError);
      } else {
        const units = adminUnits?.map(a => a.units).filter(Boolean) || [];
        console.log(`✅ Admin tem acesso a ${units.length} unidades:`);
        units.forEach(unit => {
          console.log(`   - ${unit.name} (${unit.cnpj})`);
        });

        // Se tem unidades, testar módulos da primeira
        if (units.length > 0) {
          const firstUnit = units[0];
          console.log(`\n🔍 Testando módulos para unidade: ${firstUnit.name}`);
          
          const { data: unitModulesForAdmin, error: umaError } = await supabase
            .from('unit_modules')
            .select(`
              module_id,
              is_active,
              modules!inner(name, display_name, category, is_core)
            `)
            .eq('unit_id', firstUnit.id)
            .eq('is_active', true);

          if (umaError) {
            console.error('❌ Erro ao buscar módulos da unidade:', umaError);
          } else {
            console.log(`✅ ${unitModulesForAdmin.length} módulos ativos na unidade ${firstUnit.name}:`);
            unitModulesForAdmin.forEach(um => {
              console.log(`   - ${um.modules.name} (${um.modules.display_name}) - Categoria: ${um.modules.category}`);
            });
          }
        }
      }
    } else {
      console.log('❌ Admin não encontrado!');
    }

  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

testConnection();
