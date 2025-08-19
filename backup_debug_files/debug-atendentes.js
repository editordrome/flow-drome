import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://mstjpohsemoxbgwjklby.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdGpwb2hzZW1veGJnd2prbGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMjY1MjcsImV4cCI6MjA3MDgwMjUyN30.1Jg1XK-3t7W5tsyR6e0Y3o2B6YmLBTP9aPzwMCS-07U";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function debugAtendentesProblema() {
  console.log('🔍 Investigando problema dos atendentes...\n');

  try {
    // 1. Verificar TODOS os usuários no sistema
    console.log('1️⃣ Verificando TODOS os usuários no sistema...');
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        name,
        is_active,
        role_id,
        roles:role_id (
          name,
          display_name,
          level
        )
      `)
      .order('email');

    if (usersError) {
      console.error('❌ Erro ao buscar usuários:', usersError);
      return;
    }

    console.log(`✅ ${allUsers.length} usuários encontrados no sistema:`);
    allUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email})`);
      console.log(`     Role: ${user.roles?.display_name || 'SEM ROLE'} (Level: ${user.roles?.level || 'N/A'})`);
      console.log(`     Status: ${user.is_active ? 'Ativo' : 'Inativo'}`);
      console.log(`     ID: ${user.id}\n`);
    });

    // 2. Filtrar apenas atendentes (level 30)
    console.log('2️⃣ Filtrando apenas ATENDENTES (level 30)...');
    const atendentes = allUsers.filter(user => user.roles?.level === 30);
    console.log(`✅ ${atendentes.length} atendentes encontrados:`);
    atendentes.forEach(atendente => {
      console.log(`   - ${atendente.name} (${atendente.email}) - Status: ${atendente.is_active ? 'Ativo' : 'Inativo'}`);
    });

    if (atendentes.length === 0) {
      console.log('❌ PROBLEMA: Não há usuários com role level 30 (Atendente)!');
      return;
    }

    // 3. Verificar TODAS as associações user_unit_assignments
    console.log('\n3️⃣ Verificando TODAS as associações user_unit_assignments...');
    const { data: allAssignments, error: assignmentsError } = await supabase
      .from('user_unit_assignments')
      .select(`
        id,
        user_id,
        unit_id,
        assigned_at,
        users!user_unit_assignments_user_id_fkey (
          email,
          name,
          roles (
            display_name,
            level
          )
        ),
        units!user_unit_assignments_unit_id_fkey (
          name
        )
      `)
      .order('assigned_at');

    if (assignmentsError) {
      console.error('❌ Erro ao buscar associações:', assignmentsError);
      return;
    }

    console.log(`✅ ${allAssignments.length} associações encontradas:`);
    allAssignments.forEach(assignment => {
      console.log(`   - Usuário: ${assignment.users?.name} (${assignment.users?.email})`);
      console.log(`     Role: ${assignment.users?.roles?.display_name} (Level: ${assignment.users?.roles?.level})`);
      console.log(`     Unidade: ${assignment.units?.name}`);
      console.log(`     Data: ${new Date(assignment.assigned_at).toLocaleString('pt-BR')}`);
      console.log(`     IDs: user_id=${assignment.user_id}, unit_id=${assignment.unit_id}\n`);
    });

    // 4. Focar nas unidades do Admin
    console.log('4️⃣ Verificando associações para as unidades do Admin...');
    const adminUnits = [
      { id: '4b1d4048-fc87-498d-91d1-009e680f2dbd', name: 'MariaFlow Matriz' },
      { id: '92174537-bb69-4d75-87a4-4c3c87b472c6', name: 'MB Dromedario' }
    ];

    for (const unit of adminUnits) {
      console.log(`\n🏢 Unidade: ${unit.name} (${unit.id})`);
      
      // Buscar todas as associações desta unidade (sem filtro de role)
      const unitAssignments = allAssignments.filter(a => a.unit_id === unit.id);
      console.log(`   📋 ${unitAssignments.length} associações totais:`);
      
      unitAssignments.forEach(assignment => {
        console.log(`   - ${assignment.users?.name}: ${assignment.users?.roles?.display_name} (Level: ${assignment.users?.roles?.level})`);
      });

      // Filtrar apenas atendentes desta unidade
      const atendenteAssignments = unitAssignments.filter(a => a.users?.roles?.level === 30);
      console.log(`   👤 ${atendenteAssignments.length} atendentes vinculados:`);
      
      if (atendenteAssignments.length === 0) {
        console.log(`   ⚠️ Nenhum atendente vinculado à unidade ${unit.name}`);
      } else {
        atendenteAssignments.forEach(assignment => {
          console.log(`   ✅ ${assignment.users?.name} (${assignment.users?.email})`);
        });
      }
    }

    // 5. Testar a consulta exata que está sendo usada
    console.log('\n5️⃣ Testando a consulta EXATA do sistema...');
    for (const unit of adminUnits) {
      console.log(`\n🔍 Testando consulta para: ${unit.name}`);
      
      const { data: queryResult, error: queryError } = await supabase
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
        .eq('users.roles.level', 30);

      if (queryError) {
        console.error(`❌ Erro na consulta para ${unit.name}:`, queryError);
      } else {
        console.log(`✅ Consulta retornou ${queryResult?.length || 0} resultados:`);
        queryResult?.forEach(result => {
          if (result.users) {
            console.log(`   - ${result.users.name} (${result.users.email})`);
            console.log(`     Role: ${result.users.roles.display_name} (Level: ${result.users.roles.level})`);
            console.log(`     Status: ${result.users.is_active ? 'Ativo' : 'Inativo'}`);
          }
        });
      }
    }

    // 6. Verificar se há problema com o filtro roles.level
    console.log('\n6️⃣ Testando sem filtro de role...');
    for (const unit of adminUnits) {
      console.log(`\n🔍 Testando SEM filtro de role para: ${unit.name}`);
      
      const { data: noFilterResult, error: noFilterError } = await supabase
        .from('user_unit_assignments')
        .select(`
          user_id,
          users!user_unit_assignments_user_id_fkey (
            id,
            email,
            name,
            is_active,
            roles (
              name,
              display_name,
              level
            )
          )
        `)
        .eq('unit_id', unit.id);

      if (noFilterError) {
        console.error(`❌ Erro na consulta sem filtro para ${unit.name}:`, noFilterError);
      } else {
        console.log(`✅ Consulta sem filtro retornou ${noFilterResult?.length || 0} resultados:`);
        noFilterResult?.forEach(result => {
          if (result.users) {
            console.log(`   - ${result.users.name} (${result.users.email})`);
            console.log(`     Role: ${result.users.roles?.display_name || 'SEM ROLE'} (Level: ${result.users.roles?.level || 'N/A'})`);
            console.log(`     É Atendente? ${result.users.roles?.level === 30 ? 'SIM' : 'NÃO'}`);
          }
        });
      }
    }

  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

debugAtendentesProblema();
