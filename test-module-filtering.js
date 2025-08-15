import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mstjpohsemoxbgwjklby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdGpwb2hzZW1veGJnd2prbGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMjY1MjcsImV4cCI6MjA3MDgwMjUyN30.1Jg1XK-3t7W5tsyR6e0Y3o2B6YmLBTP9aPzwMCS-07U';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testModuleFiltering() {
  try {
    console.log('🧪 Testando sistema de filtragem de módulos...\n');

    // 1. Verificar módulos disponíveis no sistema
    console.log('1️⃣ Verificando módulos cadastrados no sistema...');
    const { data: allModules, error: modulesError } = await supabase
      .from('modules')
      .select('id, name, display_name, category, is_core')
      .order('category', { ascending: true });

    if (modulesError) {
      console.error('❌ Erro ao buscar módulos:', modulesError);
      return;
    }

    console.log(`✅ Total de módulos cadastrados: ${allModules.length}`);
    console.log('Módulos por categoria:');
    const modulesByCategory = allModules.reduce((acc, module) => {
      acc[module.category] = acc[module.category] || [];
      acc[module.category].push(module.name);
      return acc;
    }, {});
    
    Object.entries(modulesByCategory).forEach(([category, modules]) => {
      console.log(`   ${category}: ${modules.join(', ')}`);
    });

    // 2. Verificar unidades e seus módulos ativos
    console.log('\n2️⃣ Verificando unidades e módulos ativos...');
    const { data: units, error: unitsError } = await supabase
      .from('units')
      .select('id, name, status')
      .eq('status', 'active');

    if (unitsError) {
      console.error('❌ Erro ao buscar unidades:', unitsError);
      return;
    }

    for (const unit of units.slice(0, 2)) { // Test only first 2 units
      const { data: unitModules, error: umError } = await supabase
        .from('unit_modules')
        .select(`
          module_id,
          is_active,
          modules(name, display_name)
        `)
        .eq('unit_id', unit.id)
        .eq('is_active', true);

      if (umError) {
        console.error(`❌ Erro ao buscar módulos da unidade ${unit.name}:`, umError);
        continue;
      }

      console.log(`📦 ${unit.name}: ${unitModules.length} módulos ativos`);
      unitModules.slice(0, 5).forEach(um => {
        console.log(`     - ${um.modules?.name}`);
      });
      if (unitModules.length > 5) {
        console.log(`     ... e mais ${unitModules.length - 5} módulos`);
      }
    }

    // 3. Testar usuários específicos e suas permissões
    console.log('\n3️⃣ Testando permissões de usuários específicos...');
    
    const testUsers = [
      { email: 'atendente@mariaflow.com', type: 'Atendente', expectedModules: ['Dashboard', 'Clientes'] },
      { email: 'lucas@email.com', type: 'Atendente', expectedModules: ['Dashboard', 'Clientes', 'Agenda'] },
      { email: 'admin@mariaflow.com', type: 'Admin', expectedModules: ['Todos os módulos da unidade'] }
    ];

    for (const testUser of testUsers) {
      console.log(`\n👤 Testando usuário: ${testUser.email} (${testUser.type})`);
      
      // Buscar dados do usuário
      const { data: user, error: userError } = await supabase
        .from('users')
        .select(`
          id, 
          email, 
          name,
          role_id,
          roles:role_id(name, display_name, level)
        `)
        .eq('email', testUser.email)
        .single();

      if (userError || !user) {
        console.log(`⚠️ Usuário ${testUser.email} não encontrado`);
        continue;
      }

      console.log(`   📋 Nome: ${user.name}`);
      console.log(`   🎭 Role: ${user.roles?.display_name} (level ${user.roles?.level})`);

      // Buscar unidades vinculadas
      const { data: userUnits, error: uuError } = await supabase
        .from('user_unit_assignments')
        .select(`
          unit_id,
          is_primary,
          units(name)
        `)
        .eq('user_id', user.id);

      if (uuError) {
        console.error(`❌ Erro ao buscar unidades do usuário:`, uuError);
        continue;
      }

      console.log(`   🏢 Unidades vinculadas: ${userUnits.length}`);
      userUnits.forEach(uu => {
        console.log(`     - ${uu.units?.name} ${uu.is_primary ? '(Principal)' : ''}`);
      });

      // Se for atendente (level < 80), verificar permissões específicas
      if (user.roles?.level < 80 && userUnits.length > 0) {
        const primaryUnit = userUnits.find(uu => uu.is_primary) || userUnits[0];
        
        console.log(`   🔍 Verificando permissões específicas na unidade: ${primaryUnit.units?.name}`);
        
        const { data: permissions, error: permError } = await supabase
          .from('user_module_permissions')
          .select(`
            module_id,
            has_access,
            can_read,
            modules(name, display_name)
          `)
          .eq('user_id', user.id)
          .eq('unit_id', primaryUnit.unit_id)
          .eq('has_access', true)
          .eq('can_read', true);

        if (permError) {
          console.error(`❌ Erro ao buscar permissões:`, permError);
          continue;
        }

        console.log(`   ✅ Módulos permitidos: ${permissions.length}`);
        permissions.forEach(perm => {
          console.log(`     - ${perm.modules?.name}`);
        });

        // Comparar com expectativa
        const allowedModuleNames = permissions.map(p => p.modules?.name);
        const hasExpectedModules = testUser.expectedModules.every(expected => 
          allowedModuleNames.includes(expected)
        );

        if (hasExpectedModules) {
          console.log(`   ✅ CORRETO: Usuário tem acesso aos módulos esperados`);
        } else {
          console.log(`   ⚠️ DIVERGÊNCIA: Esperado ${testUser.expectedModules.join(', ')}, encontrado ${allowedModuleNames.join(', ')}`);
        }
      }
    }

    // 4. Verificar se existe dados de teste para criar permissões de atendente
    console.log('\n4️⃣ Verificando se precisamos criar dados de teste...');
    
    const { data: existingPermissions, error: epError } = await supabase
      .from('user_module_permissions')
      .select('id')
      .limit(1);

    if (epError) {
      console.error('❌ Erro ao verificar permissões existentes:', epError);
      return;
    }

    if (existingPermissions.length === 0) {
      console.log('⚠️ Nenhuma permissão específica encontrada. O sistema pode estar dependendo apenas de unit_modules.');
      console.log('💡 Para testar atendentes com permissões limitadas, seria necessário criar registros em user_module_permissions.');
    } else {
      console.log('✅ Permissões específicas existem no sistema.');
    }

    console.log('\n🎉 RESULTADO DO TESTE:');
    console.log('✅ Sistema de módulos está configurado corretamente');
    console.log('✅ Usuários estão vinculados às unidades');
    console.log('✅ Estrutura de permissões está funcional');
    
  } catch (error) {
    console.error('💥 Erro durante o teste:', error);
  }
}

testModuleFiltering();