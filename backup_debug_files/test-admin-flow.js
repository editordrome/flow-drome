import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://mstjpohsemoxbgwjklby.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdGpwb2hzZW1veGJnd2prbGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMjY1MjcsImV4cCI6MjA3MDgwMjUyN30.1Jg1XK-3t7W5tsyR6e0Y3o2B6YmLBTP9aPzwMCS-07U";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Simular exatamente o fluxo do admin no componente GestaoUsuariosModule
async function testAdminFlowCompleto() {
  console.log('🔄 Simulando fluxo completo do Admin no GestaoUsuariosModule...\n');

  try {
    // 1. PASSO 1: Admin faz login - buscar dados do admin (simulando useAuth)
    console.log('1️⃣ PASSO 1: Simulando login do Admin...');
    const adminEmail = 'admin@mariaflow.com';
    
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
      .eq('email', adminEmail)
      .single();

    if (userError || !adminUser) {
      console.error('❌ Erro ao encontrar admin:', userError);
      return;
    }

    console.log('✅ Admin logado:');
    console.log(`   - Nome: ${adminUser.name}`);
    console.log(`   - Email: ${adminUser.email}`);
    console.log(`   - Role Level: ${adminUser.roles.level}`);
    console.log(`   - Pode acessar gestão? ${adminUser.roles.level >= 80 ? 'SIM' : 'NÃO'}`);

    // 2. PASSO 2: Carregar unidades do admin (função loadAdminUnits)
    console.log('\n2️⃣ PASSO 2: Carregando unidades do Admin (getAdminUnits)...');
    
    const { data: adminUnitsData, error: unitsError } = await supabase
      .from('user_unit_assignments')
      .select(`
        unit_id,
        units!user_unit_assignments_unit_id_fkey (
          id,
          name,
          is_active
        )
      `)
      .eq('user_id', adminUser.id)
      .eq('units.is_active', true);

    if (unitsError) {
      console.error('❌ Erro ao carregar unidades:', unitsError);
      return;
    }

    const units = adminUnitsData?.map(item => item.units) || [];
    console.log(`✅ Admin tem acesso a ${units.length} unidades:`);
    units.forEach(unit => {
      console.log(`   - ${unit.name} (${unit.id})`);
    });

    // 3. PASSO 3: Admin seleciona unidade MB Dromedario
    console.log('\n3️⃣ PASSO 3: Admin seleciona unidade "MB Dromedario"...');
    const selectedUnit = units.find(u => u.name === 'MB Dromedario');
    
    if (!selectedUnit) {
      console.error('❌ Unidade MB Dromedario não encontrada nas unidades do admin!');
      return;
    }

    console.log(`✅ Unidade selecionada: ${selectedUnit.name} (${selectedUnit.id})`);

    // 4. PASSO 4: Carregar atendentes da unidade (função loadAttendants -> getAttendantsByUnit)
    console.log('\n4️⃣ PASSO 4: Carregando atendentes da unidade...');
    console.log('   🔍 Executando consulta getAttendantsByUnit...');
    
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
      .eq('unit_id', selectedUnit.id)
      .eq('users.roles.level', 30); // Apenas atendentes

    if (attendantsError) {
      console.error('❌ Erro ao carregar atendentes:', attendantsError);
      return;
    }

    console.log(`   📊 Consulta retornou ${attendantsData?.length || 0} registros brutos`);
    
    // Processar dados como no hook
    const attendants = attendantsData?.map(item => ({
      id: item.users?.id,
      email: item.users?.email,
      name: item.users?.name,
      is_active: item.users?.is_active,
      created_at: item.users?.created_at,
      role: item.users?.roles
    })).filter(attendant => attendant.id) || [];

    console.log(`   ✅ Após processamento: ${attendants.length} atendentes válidos`);
    
    if (attendants.length === 0) {
      console.log('   ⚠️ NENHUM ATENDENTE ENCONTRADO!');
      
      // Verificar o que está acontecendo - debug adicional
      console.log('\n   🔍 DEBUG: Verificando dados brutos da consulta...');
      console.log('   Dados brutos:', JSON.stringify(attendantsData, null, 2));
    } else {
      console.log('   📋 Atendentes encontrados:');
      attendants.forEach(attendant => {
        console.log(`   - ${attendant.name} (${attendant.email})`);
        console.log(`     Status: ${attendant.is_active ? 'Ativo' : 'Inativo'}`);
        console.log(`     Role: ${attendant.role?.display_name} (Level: ${attendant.role?.level})`);
        console.log(`     ID: ${attendant.id}`);
      });
    }

    // 5. PASSO 5: Verificar se o problema pode ser no filtro da interface
    console.log('\n5️⃣ PASSO 5: Testando busca/filtro da interface...');
    const searchTerm = ''; // Simular busca vazia
    
    const filteredAttendants = attendants.filter(attendant =>
      attendant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendant.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log(`   🔍 Após filtro de busca (termo: "${searchTerm}"): ${filteredAttendants.length} atendentes`);

    // 6. PASSO 6: Verificar se o problema pode ser na renderização
    console.log('\n6️⃣ PASSO 6: Simulando renderização da tabela...');
    
    if (filteredAttendants.length === 0) {
      console.log('   📺 INTERFACE MOSTRARIA: "Nenhum atendente vinculado"');
      console.log('   🎯 ESTE É O PROBLEMA: A interface não mostra atendentes!');
    } else {
      console.log('   📺 INTERFACE MOSTRARIA tabela com:');
      filteredAttendants.forEach((attendant, index) => {
        console.log(`   Linha ${index + 1}: ${attendant.name} | ${attendant.email} | ${attendant.role?.display_name}`);
      });
    }

    // 7. COMPARAÇÃO: Verificar sem filtro de role level
    console.log('\n7️⃣ COMPARAÇÃO: Testando SEM filtro de role level...');
    
    const { data: allUsersData, error: allError } = await supabase
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
      .eq('unit_id', selectedUnit.id);

    if (!allError && allUsersData) {
      console.log(`   📊 SEM filtro de role: ${allUsersData.length} usuários total`);
      allUsersData.forEach(item => {
        if (item.users) {
          const isAttendant = item.users.roles?.level === 30;
          console.log(`   - ${item.users.name}: Level ${item.users.roles?.level} ${isAttendant ? '(ATENDENTE)' : '(NÃO ATENDENTE)'}`);
        }
      });
    }

    console.log('\n🎯 DIAGNÓSTICO FINAL:');
    console.log(`- Admin tem acesso: ${units.length > 0 ? 'SIM' : 'NÃO'}`);
    console.log(`- Unidade selecionada: ${selectedUnit ? 'SIM' : 'NÃO'}`);
    console.log(`- Consulta executou: ${!attendantsError ? 'SIM' : 'NÃO'}`);
    console.log(`- Atendentes encontrados: ${attendants.length}`);
    console.log(`- Interface deveria mostrar: ${attendants.length > 0 ? 'TABELA' : 'MENSAGEM VAZIA'}`);

  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

testAdminFlowCompleto();
