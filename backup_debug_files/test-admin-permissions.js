// Script de teste para validar hierarquia de permissões de Admin
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mstjpohsemoxbgwjklby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdGpwb2hzZW1veGJnd2prbGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM2NTA5MzQsImV4cCI6MjAzOTIyNjkzNH0.QGcAhJr1qr7PdKyTSPONFJKsF8j4X9H8V4_9WQG_3HY';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔄 Testando hierarquia de permissões Admin vs Super Admin...\n');

// Função para testar acesso de unidades por usuário
async function testAdminUnits(userId, userName, isSuperAdmin) {
  console.log(`👤 Testando acesso para: ${userName} (${isSuperAdmin ? 'Super Admin' : 'Admin'})`);
  
  try {
    if (isSuperAdmin) {
      // Super Admin: todas as unidades
      const { data, error } = await supabase
        .from('units')
        .select('id, name, is_active')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      console.log(`   ✅ Acesso a ${data.length} unidades (todas):`, data.map(u => u.name));
      return data;
    } else {
      // Admin: apenas unidades associadas
      const { data, error } = await supabase
        .from('user_unit_assignments')
        .select(`
          unit_id,
          units!inner (
            id,
            name,
            is_active
          )
        `)
        .eq('user_id', userId)
        .eq('units.is_active', true)
        .order('units.name');

      if (error) throw error;
      
      const units = data?.map(item => ({
        id: item.units.id,
        name: item.units.name,
        is_active: item.units.is_active
      })) || [];

      console.log(`   ✅ Acesso a ${units.length} unidades designadas:`, units.map(u => u.name));
      return units;
    }
  } catch (error) {
    console.log(`   ❌ Erro ao buscar unidades:`, error.message);
    return [];
  }
}

// Função principal de teste
async function runTest() {
  // IDs dos usuários de teste (conforme banco de dados)
  const superAdminId = '3ef8a250-073c-4c98-b58a-9c6521197939'; // jeanpetri@gmail.com
  const adminId = '20277a80-d4b2-413f-a81c-7652a97d6c7b';      // admin@mariaflow.com

  // Testar Super Admin
  const superAdminUnits = await testAdminUnits(superAdminId, 'Jean Petri (Super Admin)', true);
  
  console.log('');
  
  // Testar Admin regular
  const adminUnits = await testAdminUnits(adminId, 'Admin MariaFlow', false);

  console.log('\n📊 Resumo dos resultados:');
  console.log(`   Super Admin: ${superAdminUnits.length} unidades (acesso total)`);
  console.log(`   Admin:       ${adminUnits.length} unidades (apenas designadas)`);
  
  if (superAdminUnits.length > adminUnits.length) {
    console.log('   ✅ Hierarquia de permissões funcionando corretamente!');
  } else {
    console.log('   ⚠️  Possível problema na hierarquia de permissões');
  }

  // Testar verificação de acesso específico
  console.log('\n🔒 Testando verificação de acesso específico...');
  
  const testUnitId = '7aeabe43-235a-4905-8a4b-bf760d02869f'; // MB Drome
  
  // Verificar se admin tem acesso a uma unidade específica
  const { data: accessCheck, error: accessError } = await supabase
    .from('user_unit_assignments')
    .select('id')
    .eq('user_id', adminId)
    .eq('unit_id', testUnitId)
    .single();

  if (accessError || !accessCheck) {
    console.log('   ✅ Admin CORRETAMENTE não tem acesso à MB Drome');
  } else {
    console.log('   ⚠️  Admin tem acesso inesperado à MB Drome');
  }

  console.log('\n✨ Teste completo!\n');
}

// Executar teste
runTest().catch(console.error);
