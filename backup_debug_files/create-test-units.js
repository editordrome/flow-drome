import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mstjpohsemoxbgwjklby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdGpwb2hzZW1veGJnd2prbGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMjY1MjcsImV4cCI6MjA3MDgwMjUyN30.1Jg1XK-3t7W5tsyR6e0Y3o2B6YmLBTP9aPzwMCS-07U';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUnits() {
  console.log('🏗️  Criando unidades de teste...');
  
  const testUnits = [
    {
      name: 'MariaFlow Matriz',
      code: 'mf-matriz',
      address: 'Rua Principal, 123 - Centro - São Paulo/SP',
      phone: '(11) 99999-0001',
      email: 'matriz@mariaflow.com',
      cnpj: '12.345.678/0001-90',
      status: 'active',
      is_active: true
    },
    {
      name: 'MariaFlow Filial Norte',
      code: 'mf-norte', 
      address: 'Av. Norte, 456 - Zona Norte - São Paulo/SP',
      phone: '(11) 99999-0002',
      email: 'norte@mariaflow.com',
      cnpj: '12.345.678/0002-71',
      status: 'active',
      is_active: true
    },
    {
      name: 'MariaFlow Filial Sul',
      code: 'mf-sul',
      address: 'Rua Sul, 789 - Zona Sul - São Paulo/SP', 
      phone: '(11) 99999-0003',
      email: 'sul@mariaflow.com',
      cnpj: '12.345.678/0003-52',
      status: 'active',
      is_active: true
    }
  ];

  try {
    for (const unitData of testUnits) {
      console.log(`📝 Criando unidade: ${unitData.name}`);
      
      const { data, error } = await supabase
        .from('units')
        .insert(unitData)
        .select()
        .single();

      if (error) {
        console.error(`❌ Erro ao criar ${unitData.name}:`, error);
      } else {
        console.log(`✅ ${unitData.name} criada com sucesso! ID: ${data.id}`);
      }
    }
    
    // Verificar se foram criadas
    console.log('\n🔍 Verificando unidades criadas...');
    const { data: units, error } = await supabase
      .from('units')
      .select('*');
      
    if (error) {
      console.error('❌ Erro ao verificar unidades:', error);
    } else {
      console.log(`✅ Total de unidades no banco: ${units.length}`);
      units.forEach(unit => {
        console.log(`  - ${unit.name} (${unit.code})`);
      });
    }
    
  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

createTestUnits();
