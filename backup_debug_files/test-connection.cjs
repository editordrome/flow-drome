const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Lê o arquivo .env manualmente
const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabase = createClient(
  envVars.VITE_SUPABASE_URL,
  envVars.VITE_SUPABASE_ANON_KEY
);

async function testConnection() {
  try {
    console.log('🔄 Testando conexão com Supabase...');
    console.log('URL:', envVars.VITE_SUPABASE_URL);
    console.log('Project ID:', envVars.SUPABASE_PROJECT_REF);
    
    // Testar com uma query SQL direta
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    });
    
    if (error) {
      console.error('❌ Erro na consulta SQL:', error.message);
      
      // Tentar uma abordagem diferente - listar tabelas conhecidas
      console.log('🔄 Tentando abordagem alternativa...');
      
      try {
        const { data: testData, error: testError } = await supabase
          .from('resultados')
          .select('id')
          .limit(1);
          
        if (testError) {
          console.error('❌ Erro ao testar tabela resultados:', testError.message);
        } else {
          console.log('✅ Tabela resultados está acessível!');
          console.log('📊 Registro encontrado:', testData.length > 0 ? 'Sim' : 'Não');
        }
      } catch (err) {
        console.error('❌ Erro no teste alternativo:', err.message);
      }
      
    } else {
      console.log('✅ Conexão estabelecida com sucesso!');
      console.log('📋 Tabelas encontradas:');
      data.forEach(table => console.log('  -', table.table_name));
    }
    
  } catch (err) {
    console.error('❌ Erro de conexão:', err.message);
  }
}

testConnection();
