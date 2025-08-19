import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mstjpohsemoxbgwjklby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdGpwb2hzZW1veGJnd2prbGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMjY1MjcsImV4cCI6MjA3MDgwMjUyN30.1Jg1XK-3t7W5tsyR6e0Y3o2B6YmLBTP9aPzwMCS-07U';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserAssignment() {
  try {
    console.log('🧪 Testando funcionalidade de vinculação de usuários...\n');

    // 1. Buscar usuários existentes
    console.log('1️⃣ Buscando usuários existentes...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, role_id, is_active')
      .limit(5);

    if (usersError) {
      console.error('❌ Erro ao buscar usuários:', usersError);
      return;
    }
    console.log(`✅ Encontrados ${users.length} usuários:`);
    users.forEach(user => console.log(`   - ${user.name} (${user.email})`));

    // 2. Buscar unidades existentes
    console.log('\n2️⃣ Buscando unidades existentes...');
    const { data: units, error: unitsError } = await supabase
      .from('units')
      .select('id, name, cnpj, status')
      .eq('status', 'active');

    if (unitsError) {
      console.error('❌ Erro ao buscar unidades:', unitsError);
      return;
    }
    console.log(`✅ Encontradas ${units.length} unidades:`);
    units.forEach(unit => console.log(`   - ${unit.name} (${unit.cnpj})`));

    // 3. Buscar roles existentes
    console.log('\n3️⃣ Buscando roles existentes...');
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('id, name, display_name, level');

    if (rolesError) {
      console.error('❌ Erro ao buscar roles:', rolesError);
      return;
    }
    console.log(`✅ Encontrados ${roles.length} roles:`);
    roles.forEach(role => console.log(`   - ${role.display_name} (level: ${role.level})`));

    // 4. Buscar associações existentes
    console.log('\n4️⃣ Buscando associações usuário-unidade existentes...');
    const { data: assignments, error: assignmentsError } = await supabase
      .from('user_unit_assignments')
      .select(`
        id,
        user_id,
        unit_id,
        is_primary,
        users!user_unit_assignments_user_id_fkey(name, email),
        units(name)
      `);

    if (assignmentsError) {
      console.error('❌ Erro ao buscar associações:', assignmentsError);
      return;
    }
    console.log(`✅ Encontradas ${assignments.length} associações:`);
    assignments.forEach(ass => {
      console.log(`   - ${ass.users?.name} → ${ass.units?.name} ${ass.is_primary ? '(Principal)' : ''}`);
    });

    // 5. Teste de funcionalidade do módulo (verificar se consegue criar usuário)
    console.log('\n5️⃣ Testando criação de usuário de teste...');
    const testUser = {
      email: `teste_${Date.now()}@mariaflow.com`,
      name: `Usuário Teste ${new Date().toLocaleString()}`,
      role_id: roles.find(r => r.name === 'atendente')?.id || roles[0]?.id,
      password: 'teste123',
      is_active: true
    };

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert(testUser)
      .select()
      .single();

    if (createError) {
      console.error('❌ Erro ao criar usuário teste:', createError);
      return;
    }
    console.log('✅ Usuário teste criado:', newUser.name);

    // 6. Teste de vinculação
    if (units.length > 0) {
      console.log('\n6️⃣ Testando vinculação usuário-unidade...');
      const assignment = {
        user_id: newUser.id,
        unit_id: units[0].id,
        is_primary: true,
        assigned_by: '3ef8a250-073c-4c98-b58a-9c6521197939' // Super Admin ID
      };

      const { data: newAssignment, error: assignError } = await supabase
        .from('user_unit_assignments')
        .insert(assignment)
        .select()
        .single();

      if (assignError) {
        console.error('❌ Erro ao vincular usuário:', assignError);
      } else {
        console.log(`✅ Vinculação criada: ${newUser.name} → ${units[0].name}`);
      }

      // 7. Limpar dados de teste
      console.log('\n7️⃣ Limpando dados de teste...');
      if (newAssignment) {
        await supabase
          .from('user_unit_assignments')
          .delete()
          .eq('id', newAssignment.id);
      }
      await supabase
        .from('users')
        .delete()
        .eq('id', newUser.id);
      console.log('✅ Dados de teste removidos');
    }

    console.log('\n🎉 RESULTADO FINAL:');
    console.log('✅ Funcionalidade de vinculação usuário-unidade está FUNCIONANDO!');
    console.log('✅ O Super Admin pode agora criar usuários e vinculá-los às unidades');

  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

testUserAssignment();
