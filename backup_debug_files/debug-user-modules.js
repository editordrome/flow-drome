const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mstjpohsemoxbgwjklby.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdGpwb2hzZW1veGJnd2prbGJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMjgwNzc0NCwiZXhwIjoyMDM4MzgzNzQ0fQ.ZgflT0FBjrVZFt4OGpx0cOQS4J5uHx6kqH6K6tJUhgc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugUserModules() {
  console.log('🔍 DEBUG: Conexão Usuários e Módulos\n');

  try {
    // 1. Verificar estrutura das unidades
    console.log('📋 1. UNIDADES DISPONÍVEIS:');
    const { data: units, error: unitsError } = await supabase
      .from('units')
      .select('id, name, is_active')
      .eq('is_active', true);

    if (unitsError) {
      console.error('❌ Erro ao carregar unidades:', unitsError);
      return;
    }

    units.forEach(unit => {
      console.log(`   - ${unit.name} (${unit.id})`);
    });

    // 2. Verificar módulos disponíveis
    console.log('\n📦 2. MÓDULOS DO SISTEMA:');
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('id, name, display_name, category, is_core')
      .order('category', { ascending: true });

    if (modulesError) {
      console.error('❌ Erro ao carregar módulos:', modulesError);
      return;
    }

    const modulesByCategory = {};
    modules.forEach(module => {
      if (!modulesByCategory[module.category]) {
        modulesByCategory[module.category] = [];
      }
      modulesByCategory[module.category].push(module);
    });

    Object.keys(modulesByCategory).forEach(category => {
      console.log(`\n   📂 ${category.toUpperCase()}:`);
      modulesByCategory[category].forEach(mod => {
        console.log(`      - ${mod.display_name} (${mod.name}) [${mod.is_core ? 'CORE' : 'OPCIONAL'}]`);
      });
    });

    // 3. Verificar unit_modules (módulos ativos por unidade)
    console.log('\n🔗 3. MÓDULOS ATIVOS POR UNIDADE:');
    for (const unit of units) {
      console.log(`\n   🏢 ${unit.name}:`);
      
      const { data: unitModules, error: unitModulesError } = await supabase
        .from('unit_modules')
        .select(`
          module_id,
          is_active,
          modules (
            name,
            display_name,
            category
          )
        `)
        .eq('unit_id', unit.id)
        .eq('is_active', true);

      if (unitModulesError) {
        console.error(`      ❌ Erro ao carregar módulos da unidade: ${unitModulesError.message}`);
        continue;
      }

      if (unitModules.length === 0) {
        console.log('      ⚠️ Nenhum módulo ativo configurado');
      } else {
        unitModules.forEach(um => {
          console.log(`      ✅ ${um.modules.display_name} (${um.modules.category})`);
        });
      }
    }

    // 4. Verificar usuários Admin e suas unidades
    console.log('\n👥 4. USUÁRIOS ADMIN E SUAS UNIDADES:');
    
    const { data: adminUsers, error: adminError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        name,
        is_active,
        roles (
          name,
          display_name,
          level
        )
      `)
      .in('role_id', ['b8f3a3e0-4d5e-4b6a-9c3d-2f1e8a7b9c0d', 'a7b8c9d0-1e2f-3a4b-5c6d-7e8f9a0b1c2d']) // Admin e Super Admin
      .eq('is_active', true);

    if (adminError) {
      console.error('❌ Erro ao carregar usuários admin:', adminError);
      return;
    }

    for (const admin of adminUsers) {
      console.log(`\n   👤 ${admin.name} (${admin.email}) - ${admin.roles.display_name}`);
      
      // Verificar unidades do admin
      const { data: adminUnits, error: adminUnitsError } = await supabase
        .from('user_unit_assignments')
        .select(`
          unit_id,
          units (
            name
          )
        `)
        .eq('user_id', admin.id);

      if (adminUnitsError) {
        console.error(`      ❌ Erro ao carregar unidades do admin: ${adminUnitsError.message}`);
        continue;
      }

      if (adminUnits.length === 0) {
        console.log('      ⚠️ Não está vinculado a nenhuma unidade');
      } else {
        adminUnits.forEach(au => {
          console.log(`      🏢 ${au.units.name}`);
        });
      }
    }

    // 5. Verificar atendentes e suas permissões
    console.log('\n🎯 5. ATENDENTES E SUAS PERMISSÕES:');
    
    const { data: attendants, error: attendantsError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        name,
        is_active,
        roles (
          level
        )
      `)
      .eq('role_id', 'c9d0e1f2-3a4b-5c6d-7e8f-9a0b1c2d3e4f') // Atendente
      .eq('is_active', true);

    if (attendantsError) {
      console.error('❌ Erro ao carregar atendentes:', attendantsError);
      return;
    }

    for (const attendant of attendants) {
      console.log(`\n   👤 ${attendant.name} (${attendant.email})`);
      
      // Verificar unidades do atendente
      const { data: attendantUnits, error: attendantUnitsError } = await supabase
        .from('user_unit_assignments')
        .select(`
          unit_id,
          units (
            name
          )
        `)
        .eq('user_id', attendant.id);

      if (attendantUnitsError) {
        console.error(`      ❌ Erro ao carregar unidades: ${attendantUnitsError.message}`);
        continue;
      }

      if (attendantUnits.length === 0) {
        console.log('      ⚠️ Não está vinculado a nenhuma unidade');
        continue;
      }

      for (const au of attendantUnits) {
        console.log(`      🏢 Unidade: ${au.units.name}`);
        
        // Verificar permissões específicas do atendente
        const { data: permissions, error: permissionsError } = await supabase
          .from('user_module_permissions')
          .select(`
            module_id,
            is_active,
            modules (
              display_name
            )
          `)
          .eq('user_id', attendant.id)
          .eq('unit_id', au.unit_id)
          .eq('is_active', true);

        if (permissionsError) {
          console.error(`        ❌ Erro ao carregar permissões: ${permissionsError.message}`);
          continue;
        }

        if (permissions.length === 0) {
          console.log('        ⚠️ Nenhuma permissão específica configurada');
        } else {
          permissions.forEach(perm => {
            console.log(`        ✅ ${perm.modules.display_name}`);
          });
        }
      }
    }

    console.log('\n✅ Debug finalizado com sucesso!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

debugUserModules();
