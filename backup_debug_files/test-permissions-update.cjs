const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mstjpohsemoxbgwjklby.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdGpwb2hzZW1veGJnd2prbGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMjY1MjcsImV4cCI6MjA3MDgwMjUyN30.1Jg1XK-3t7W5tsyR6e0Y3o2B6YmLBTP9aPzwMCS-07U';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testPermissionsUpdate() {
  console.log('🧪 TESTE: Atualização de Permissões de Usuário\n');

  try {
    // Dados de teste
    const testUserId = '47cb31ca-72ac-410f-a93a-9246055ee822'; // Lucas Silva
    const testUnitId = '92174537-bb69-4d75-87a4-4c3c87b472c6'; // MB Dromedario
    
    console.log('📋 Dados do teste:');
    console.log(`   - Usuário: ${testUserId} (Lucas Silva)`);
    console.log(`   - Unidade: ${testUnitId} (MB Dromedario)`);

    // 1. Verificar permissões atuais
    console.log('\n1️⃣ Verificando permissões atuais...');
    const { data: currentPermissions, error: currentError } = await supabase
      .from('user_module_permissions')
      .select(`
        id,
        module_id,
        is_active,
        can_view,
        can_create,
        can_edit,
        modules (
          display_name
        )
      `)
      .eq('user_id', testUserId)
      .eq('unit_id', testUnitId)
      .eq('is_active', true);

    if (currentError) {
      console.error('❌ Erro ao buscar permissões atuais:', currentError);
      return;
    }

    console.log(`✅ Permissões atuais encontradas: ${currentPermissions?.length || 0}`);
    currentPermissions?.forEach(perm => {
      console.log(`   - ${perm.modules.display_name}: view=${perm.can_view}, create=${perm.can_create}, edit=${perm.can_edit}`);
    });

    // 2. Buscar módulos disponíveis na unidade
    console.log('\n2️⃣ Buscando módulos disponíveis na unidade...');
    const { data: availableModules, error: modulesError } = await supabase
      .from('unit_modules')
      .select(`
        module_id,
        modules (
          id,
          name,
          display_name,
          category
        )
      `)
      .eq('unit_id', testUnitId)
      .eq('is_active', true);

    if (modulesError) {
      console.error('❌ Erro ao buscar módulos disponíveis:', modulesError);
      return;
    }

    console.log(`✅ Módulos disponíveis: ${availableModules?.length || 0}`);
    availableModules?.forEach(mod => {
      console.log(`   - ${mod.modules.display_name} (${mod.modules.category})`);
    });

    // 3. Testar remoção de todas as permissões
    console.log('\n3️⃣ Testando remoção de permissões existentes...');
    const { error: deleteError } = await supabase
      .from('user_module_permissions')
      .delete()
      .eq('user_id', testUserId)
      .eq('unit_id', testUnitId);

    if (deleteError) {
      console.error('❌ Erro ao deletar permissões:', deleteError);
      return;
    }

    console.log('✅ Permissões removidas com sucesso');

    // 4. Testar inserção de novas permissões
    console.log('\n4️⃣ Testando inserção de novas permissões...');
    
    // Vamos dar permissão para 3 módulos como teste
    const testModules = availableModules?.slice(0, 3) || [];
    const newPermissions = testModules.map(mod => ({
      user_id: testUserId,
      unit_id: testUnitId,
      module_id: mod.module_id,
      is_active: true,
      can_view: true,
      can_create: true,
      can_edit: false,
      can_delete: false,
      can_export: false
    }));

    console.log(`📝 Inserindo ${newPermissions.length} novas permissões...`);

    const { error: insertError } = await supabase
      .from('user_module_permissions')
      .insert(newPermissions);

    if (insertError) {
      console.error('❌ Erro ao inserir permissões:', insertError);
      return;
    }

    console.log('✅ Novas permissões inseridas com sucesso');

    // 5. Verificar se as permissões foram salvas corretamente
    console.log('\n5️⃣ Verificando permissões após inserção...');
    const { data: finalPermissions, error: finalError } = await supabase
      .from('user_module_permissions')
      .select(`
        id,
        module_id,
        is_active,
        can_view,
        can_create,
        can_edit,
        modules (
          display_name
        )
      `)
      .eq('user_id', testUserId)
      .eq('unit_id', testUnitId)
      .eq('is_active', true);

    if (finalError) {
      console.error('❌ Erro ao verificar permissões finais:', finalError);
      return;
    }

    console.log(`✅ Permissões finais: ${finalPermissions?.length || 0}`);
    finalPermissions?.forEach(perm => {
      console.log(`   - ${perm.modules.display_name}: view=${perm.can_view}, create=${perm.can_create}, edit=${perm.can_edit}`);
    });

    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
    console.log('\n📊 RESUMO:');
    console.log(`   - Permissões iniciais: ${currentPermissions?.length || 0}`);
    console.log(`   - Módulos disponíveis: ${availableModules?.length || 0}`);
    console.log(`   - Permissões finais: ${finalPermissions?.length || 0}`);

  } catch (error) {
    console.error('❌ Erro geral no teste:', error);
  }
}

testPermissionsUpdate();
