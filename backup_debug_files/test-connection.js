const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testConnection() {
  try {
    console.log('🔄 Testando conexão com Supabase...');
    console.log('URL:', process.env.VITE_SUPABASE_URL);
    console.log('Project ID:', process.env.SUPABASE_PROJECT_REF);
    
    // Testar listagem de empresas
    const { data: companies, error: companyError } = await supabase
      .from('companies')
      .select('id, name, created_at')
      .limit(3);
    
    if (companyError) {
      console.error('❌ Erro ao buscar companies:', companyError.message);
    } else {
      console.log('✅ Conexão estabelecida com sucesso!');
      console.log('🏢 Empresas encontradas:', companies.length);
      companies.forEach(c => console.log('  -', c.name, `(${c.id})`));
    }
    
    // Testar tabela modules
    const { data: modules, error: moduleError } = await supabase
      .from('modules')
      .select('name, display_name, is_active')
      .eq('is_active', true)
      .limit(5);
    
    if (moduleError) {
      console.error('❌ Erro ao buscar modules:', moduleError.message);
    } else {
      console.log('🔧 Módulos ativos encontrados:', modules.length);
      modules.forEach(m => console.log('  -', m.display_name || m.name));
    }
    
    // Testar tabela users
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, email, name, is_active')
      .limit(3);
    
    if (userError) {
      console.error('❌ Erro ao buscar users:', userError.message);
    } else {
      console.log('👥 Usuários encontrados:', users.length);
      users.forEach(u => console.log('  -', u.name || u.email, u.is_active ? '(ativo)' : '(inativo)'));
    }

    // Testar tabela resultados
    const { count } = await supabase
      .from('resultados')
      .select('*', { count: 'exact', head: true });
    
    console.log('📊 Total de registros na tabela resultados:', count);
    
  } catch (err) {
    console.error('❌ Erro de conexão:', err.message);
  }
}

testConnection();
