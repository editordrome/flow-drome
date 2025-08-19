import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mstjpohsemoxbgwjklby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdGpwb2hzZW1veGJnd2prbGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMjY1MjcsImV4cCI6MjA3MDgwMjUyN30.1Jg1XK-3t7W5tsyR6e0Y3o2B6YmLBTP9aPzwMCS-07U';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUnits() {
  console.log('🔍 Testando carregamento de unidades...');
  
  try {
    const { data: units, error } = await supabase
      .from('units')
      .select('*');
      
    if (error) {
      console.error('❌ Erro ao carregar unidades:', error);
      return;
    }
    
    console.log('✅ Unidades encontradas:', units.length);
    console.log('📋 Dados das unidades:', units);
    
    // Verificar se as colunas esperadas existem
    if (units.length > 0) {
      const firstUnit = units[0];
      console.log('🔍 Estrutura da primeira unidade:');
      console.log('- ID:', firstUnit.id);
      console.log('- Name:', firstUnit.name);
      console.log('- Code:', firstUnit.code);
      console.log('- Address:', firstUnit.address);
      console.log('- Status:', firstUnit.status);
      console.log('- Is Active:', firstUnit.is_active);
      console.log('- Created At:', firstUnit.created_at);
    }
    
  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

testUnits();
