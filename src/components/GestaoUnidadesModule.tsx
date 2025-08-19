import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Building2, 
  Users, 
  Settings, 
  Shield, 
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  X,
  Database,
  UserPlus,
  UserCheck,
  User,
  Key,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  Save,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useActiveUnit } from '@/hooks/useActiveUnit';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Função utilitária para formatar texto em título (primeira letra maiúscula)
const formatToTitleCase = (text: string | null | undefined): string => {
  // Verificar se text é válido e é uma string
  if (!text || typeof text !== 'string') return '';
  
  // Palavras que devem ficar em minúsculo (exceto no início)
  const lowercaseWords = ['e', 'da', 'de', 'do', 'das', 'dos', 'a', 'o', 'as', 'os', 'em', 'na', 'no', 'nas', 'nos', 'com', 'para', 'por', 'sem'];
  
  return text
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      // Primeira palavra sempre em maiúscula
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      
      // Palavras específicas ficam em minúsculo (exceto a primeira)
      if (lowercaseWords.includes(word)) {
        return word;
      }
      
      // Outras palavras em título
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

// Função para formatar CNPJ enquanto digita
const formatCNPJInput = (value: string): string => {
  // Remove todos os caracteres que não são números
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 14 dígitos
  const limitedNumbers = numbers.slice(0, 14);
  
  // Aplica a formatação XX.XXX.XXX/XXXX-XX
  if (limitedNumbers.length <= 2) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 5) {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2)}`;
  } else if (limitedNumbers.length <= 8) {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2, 5)}.${limitedNumbers.slice(5)}`;
  } else if (limitedNumbers.length <= 12) {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2, 5)}.${limitedNumbers.slice(5, 8)}/${limitedNumbers.slice(8)}`;
  } else {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2, 5)}.${limitedNumbers.slice(5, 8)}/${limitedNumbers.slice(8, 12)}-${limitedNumbers.slice(12)}`;
  }
};

// Função para extrair apenas números do CNPJ
const extractCNPJNumbers = (cnpj: string): string => {
  return cnpj.replace(/\D/g, '');
};

// Função para formatar campos de texto ao sair do campo (onBlur)
const handleTextFormat = (value: string | null | undefined, field: string, isNewUnit: boolean = false) => {
  // Verificar se value é válido
  if (!value || typeof value !== 'string' || !value.trim()) return '';
  
  let formattedValue = value;
  
  // Aplicar formatação baseada no tipo de campo
  switch (field) {
    case 'logradouro':
    case 'complemento':
    case 'bairro':
    case 'cidade':
    case 'razao_social':
    case 'nome_fantasia':
    case 'estado':
    case 'situacao_cadastral':
    case 'porte':
      formattedValue = formatToTitleCase(value);
      break;
    case 'email':
      formattedValue = value.toLowerCase();
      break;
    case 'uf':
      formattedValue = value.toUpperCase();
      break;
    case 'code':
      formattedValue = value.toLowerCase().replace(/\s+/g, '-'); // códigos em lowercase com hífens
      break;
    default:
      formattedValue = value.trim();
  }
  
  return formattedValue;
};

// Interfaces
interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  role_id?: string;
  is_active: boolean;
  roles?: {
    display_name: string;
  };
}

interface Unit {
  id: string;
  name: string;
  code?: string;
  address?: string;
  phone?: string;
  email?: string;
  cnpj?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
  is_active: boolean;
  admins_count: number;
  attendants_count: number;
}

interface UserUnitAssignment {
  id: string;
  user_id: string;
  unit_id: string;
  assigned_by?: string;
  assigned_at: string;
  users?: DatabaseUser;
}

interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

interface UnitModule {
  unit_id: string;
  module_id: string;
  is_active: boolean;
  enabled_by: string;
  enabled_at: string;
}

export default function GestaoUnidadesModule() {
  const { user } = useAuth();
  const { activeUnit } = useActiveUnit();
  const { toast } = useToast();
  const [units, setUnits] = useState<Unit[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [unitModules, setUnitModules] = useState<UnitModule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewUnitModal, setShowNewUnitModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUnitDetails, setSelectedUnitDetails] = useState<Unit | null>(null);
  const [editingUnit, setEditingUnit] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);
  const [userUnits, setUserUnits] = useState<any[]>([]);
  const [userModulePermissions, setUserModulePermissions] = useState<any[]>([]);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [unitUsers, setUnitUsers] = useState<UserUnitAssignment[]>([]);
  const [availableUsers, setAvailableUsers] = useState<DatabaseUser[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'dados' | 'modulos' | 'usuarios' | 'keys'>('dados');
  const [unitKeys, setUnitKeys] = useState<any[]>([]);
  const [creatingKey, setCreatingKey] = useState(false);
  const [editingKey, setEditingKey] = useState<any>(null);
  const [newKeyData, setNewKeyData] = useState({
    name: '',
    description: '',
    key_type: 'api_key',
    value: '',
    is_active: true
  });
  const [unitLogs, setUnitLogs] = useState<any[]>([]);
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: ''
  });
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [creatingUnit, setCreatingUnit] = useState(false);
  const [newUnitData, setNewUnitData] = useState({
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
    cnpj: '',
    // Campos específicos de endereço
    logradouro: '',
    complemento: '',
    bairro: '',
    cep: '',
    cidade: '',
    uf: '',
    // Campos do CNPJ
    razao_social: '',
    nome_fantasia: '',
    estado: '',
    numero: '',
    municipio: '',
    cnae_fiscal: '',
    situacao_cadastral: '',
    porte: ''
  });
  const [loadingCNPJ, setLoadingCNPJ] = useState(false);
  const [cnpjError, setCnpjError] = useState('');

  // Criar unidades de teste (função para debugging)
  const createTestUnits = async () => {
    console.log('🧪 Criando unidades de teste...');
    
    try {
      const testUnits = [
        {
          name: 'MariaFlow Matriz',
          code: 'mf-matriz',
          address: 'Rua Principal, 123 - Centro - São Paulo/SP',
          phone: '(11) 99999-0001',
          email: 'matriz@mariaflow.com',
          cnpj: '12.345.678/0001-90',
          is_active: true
        },
        {
          name: 'MariaFlow Filial Norte',
          code: 'mf-norte',
          address: 'Av. Norte, 456 - Zona Norte - São Paulo/SP',
          phone: '(11) 99999-0002',
          email: 'norte@mariaflow.com',
          cnpj: '12.345.678/0002-71',
          is_active: true
        }
      ];

      for (const unitData of testUnits) {
        const { data, error } = await supabase
          .from('units')
          .insert(unitData)
          .select()
          .single();

        if (error) {
          console.error('Erro ao criar unidade de teste:', error);
        } else {
          console.log('✅ Unidade de teste criada:', data);
        }
      }

      // Recarregar dados após criar unidades
      await loadDashboardData();
      
    } catch (error) {
      console.error('💥 Erro ao criar unidades de teste:', error);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Recarregar dados quando a unidade ativa mudar
  useEffect(() => {
    if (activeUnit && user?.id) {
      console.log('🔄 Unidade ativa mudou para:', activeUnit.name, '(ID:', activeUnit.id, ')');
      loadDashboardData();
    }
  }, [activeUnit?.id, user?.id]);

  // Definir role padrão "Atendente" quando as roles forem carregadas
  useEffect(() => {
    if (availableRoles.length > 0 && !newUserData.role_id) {
      const atendenteRole = availableRoles.find(role => role.name === 'atendente');
      if (atendenteRole) {
        setNewUserData(prev => ({ ...prev, role_id: atendenteRole.id }));
      }
    }
  }, [availableRoles, newUserData.role_id]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Iniciando carregamento de dados...');
      console.log('👤 Usuário:', user?.name, '| Super Admin:', user?.is_super_admin);
      console.log('🏢 Unidade Ativa:', activeUnit?.name, '| ID:', activeUnit?.id);

      // 1. Carregar unit_modules PRIMEIRO para poder contar módulos
      console.log('📦 Carregando configurações de módulos por unidade...');
      const { data: unitModulesData, error: unitModulesError } = await supabase
        .from('unit_modules')
        .select('*');

      if (unitModulesError) {
        console.error('❌ Erro ao carregar unit_modules:', unitModulesError);
        throw unitModulesError;
      }

      console.log('✅ Unit modules carregados:', unitModulesData?.length || 0);

      // 2. Carregar unidades (filtrar por unidade ativa se não for Super Admin)
      console.log('🏢 Carregando unidades...');
      let unitsQuery = supabase
        .from('units')
        .select('*')
        .order('created_at', { ascending: false });

      // Se não for Super Admin e há unidade ativa, filtrar apenas pela unidade ativa
      if (!user?.is_super_admin && activeUnit?.id) {
        console.log('🔒 Filtrando apenas pela unidade ativa:', activeUnit.name);
        unitsQuery = unitsQuery.eq('id', activeUnit.id);
      }

      const { data: unitsData, error: unitsError } = await unitsQuery;

      if (unitsError) {
        console.error('❌ Erro ao carregar unidades:', unitsError);
        throw unitsError;
      }

      console.log('✅ Unidades carregadas:', unitsData?.length || 0, '| Filtradas:', !user?.is_super_admin && activeUnit?.id ? 'SIM' : 'NÃO');

      // 3. Processar unidades com contagem real de usuários e módulos
      const processedUnits = await Promise.all(unitsData?.map(async (unit) => {
        console.log(`🔍 Processando unidade: ${unit.name} (ID: ${unit.id})`);
        
        // Buscar usuários vinculados a esta unidade
        const { data: userAssignments, error: assignmentsError } = await supabase
          .from('user_unit_assignments')
          .select(`
            *,
            users:user_id (
              id,
              name,
              email,
              role_id,
              roles:role_id (
                id,
                name,
                display_name,
                level
              )
            )
          `)
          .eq('unit_id', unit.id);

        if (assignmentsError) {
          console.error(`❌ Erro ao carregar usuários da unidade ${unit.name}:`, assignmentsError);
        }

        // Contar admins (level >= 80) e atendentes (level < 80)
        const adminsCount = userAssignments?.filter(assignment => {
          const level = assignment.users?.roles?.level;
          return level >= 80;
        }).length || 0;

        const attendantsCount = userAssignments?.filter(assignment => {
          const level = assignment.users?.roles?.level;
          return level < 80;
        }).length || 0;

        // Contar módulos ativos usando os dados já carregados
        const modulesCount = unitModulesData?.filter(
          um => um.unit_id === unit.id && um.is_active
        ).length || 0;

        console.log(`📊 ${unit.name}: ${adminsCount} admins, ${attendantsCount} atendentes, ${modulesCount} módulos`);
        console.log(`🔍 Unit ID: ${unit.id}, Módulos para esta unidade:`, 
          unitModulesData?.filter(um => um.unit_id === unit.id)?.map(um => ({
            module_id: um.module_id, 
            is_active: um.is_active
          }))
        );

        return {
          ...unit,
          admins_count: adminsCount,
          attendants_count: attendantsCount,
          modules_count: modulesCount
        };
      }) || []);

      console.log('✅ Unidades processadas:', processedUnits);
      setUnits(processedUnits);
      
      // 4. Salvar unitModules no state para uso posterior
      setUnitModules(unitModulesData || []);

      // 5. Carregar módulos
      console.log('🧩 Carregando módulos...');
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .order('category', { ascending: true });

      if (modulesError) {
        console.error('❌ Erro ao carregar módulos:', modulesError);
        throw modulesError;
      }

      console.log('✅ Módulos carregados:', modulesData?.length || 0);
      setModules(modulesData || []);

      // 6. Carregar usuários
      console.log('👥 Carregando usuários...');
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          *,
          roles:role_id (
            id,
            name,
            display_name,
            level
          )
        `)
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('❌ Erro ao carregar usuários:', usersError);
        throw usersError;
      }

      console.log('✅ Usuários carregados:', usersData?.length || 0);
      setUsers(usersData || []);

      // 7. Carregar roles
      console.log('🎭 Carregando roles...');
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .order('level', { ascending: false });

      if (rolesError) {
        console.error('❌ Erro ao carregar roles:', rolesError);
        throw rolesError;
      }

      console.log('✅ Roles carregados:', rolesData?.length || 0);
      setAvailableRoles(rolesData || []);

      console.log('🎉 Todos os dados carregados com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro geral no carregamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar detalhes do usuário
  const loadUserDetails = async (userId: string) => {
    try {
      setLoadingUserDetails(true);
      console.log('🔄 LoadUserDetails iniciado para userId:', userId, 'selectedUnitDetails:', selectedUnitDetails?.id);
      
      // Buscar dados completos do usuário
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          roles:role_id (
            id,
            name,
            display_name,
            level
          )
        `)
        .eq('id', userId)
        .single();

      if (userError) throw userError;
      console.log('✅ Dados do usuário carregados:', userData);

      // Buscar todas as unidades que o usuário está vinculado
      const { data: userUnitsData, error: unitsError } = await supabase
        .from('user_unit_assignments')
        .select(`
          *,
          units:unit_id (
            id,
            name,
            status
          )
        `)
        .eq('user_id', userId);

      if (unitsError) throw unitsError;
      console.log('✅ Unidades do usuário carregadas:', userUnitsData?.length || 0);

      // Se o usuário for atendente, buscar suas permissões de módulos para a unidade atual
      let modulePermissions = [];
      if (userData.roles?.level <= 30 && selectedUnitDetails?.id) {
        console.log('🔍 Buscando permissões de módulos para atendente...');
        const { data: permissionsData, error: permissionsError } = await supabase
          .from('user_module_permissions')
          .select(`
            *,
            modules:module_id (
              id,
              name,
              display_name,
              category
            )
          `)
          .eq('user_id', userId)
          .eq('unit_id', selectedUnitDetails.id);

        if (!permissionsError) {
          modulePermissions = permissionsData || [];
          console.log('✅ Permissões encontradas:', modulePermissions.length);
        } else {
          console.error('❌ Erro ao buscar permissões:', permissionsError);
        }
      }

      console.log('📊 Estado atual do componente:');
      console.log('   - unitModules.length:', unitModules.length);
      console.log('   - modules.length:', modules.length);
      console.log('   - userModulePermissions.length:', modulePermissions.length);

      setSelectedUserDetails(userData);
      setUserUnits(userUnitsData || []);
      setUserModulePermissions(modulePermissions);
      
    } catch (error) {
      console.error('❌ Erro ao carregar detalhes do usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes do usuário",
        variant: "destructive"
      });
    } finally {
      setLoadingUserDetails(false);
    }
  };

  // Função para abrir modal de detalhes do usuário
  const openUserDetailsModal = async (userId: string) => {
    setShowUserDetailsModal(true);
    await loadUserDetails(userId);
  };

  // Função para alternar permissão de módulo para atendente
  const toggleUserModulePermission = async (userId: string, moduleId: string, hasPermission: boolean) => {
    if (!selectedUnitDetails?.id) return;
    
    try {
      if (hasPermission) {
        // Remover permissão
        await supabase
          .from('user_module_permissions')
          .delete()
          .eq('user_id', userId)
          .eq('unit_id', selectedUnitDetails.id)
          .eq('module_id', moduleId);
      } else {
        // Adicionar permissão
        await supabase
          .from('user_module_permissions')
          .insert({
            user_id: userId,
            unit_id: selectedUnitDetails.id,
            module_id: moduleId,
            granted_by: user.id,
            granted_at: new Date().toISOString()
          });
      }

      // Recarregar permissões
      await loadUserDetails(userId);
      
      toast({
        title: hasPermission ? "Permissão removida" : "Permissão concedida",
        description: `Módulo ${hasPermission ? 'removido' : 'adicionado'} com sucesso`,
        duration: 2000
      });
      
    } catch (error) {
      console.error('Erro ao alterar permissão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar a permissão",
        variant: "destructive"
      });
    }
  };

  // Função para buscar dados do CNPJ na Brasil API
  const fetchCNPJData = async (cnpj: string, isNewUnit: boolean = false) => {
    // Extrair apenas números do CNPJ
    const cleanCNPJ = extractCNPJNumbers(cnpj);
    
    // Validar se CNPJ tem 14 dígitos
    if (cleanCNPJ.length !== 14) {
      setCnpjError('CNPJ deve ter 14 dígitos');
      return;
    }

    try {
      setLoadingCNPJ(true);
      setCnpjError('');
      
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCNPJ}`);
      
      if (!response.ok) {
        throw new Error('CNPJ não encontrado ou inválido');
      }
      
      const data = await response.json();
      console.log('Dados da Brasil API:', data);
      
      // Construir logradouro completo (tipo + nome + número)
      const logradouroCompleto = [
        data.descricao_tipo_logradouro, // Ex: "RUA"
        data.logradouro,                // Ex: "DAS FLORES"
        data.numero                     // Ex: "123"
      ].filter(Boolean).join(' ');
      
      // Construir endereço completo para o campo address (compatibilidade)
      const endereco = [
        logradouroCompleto,
        data.complemento,
        data.bairro
      ].filter(Boolean).join(', ');
      
      // Dados a serem preenchidos com formatação em título
      const cnpjData = {
        // name: Não preencher automaticamente - será manual
        address: `${formatToTitleCase(endereco)} - ${formatToTitleCase(data.municipio || '')}/${(data.uf || '').toString().toUpperCase()}`, // Manter para compatibilidade
        phone: data.ddd_telefone_1 ? `(${data.ddd_telefone_1.substring(0,2)}) ${data.ddd_telefone_1.substring(2)}` : '',
        email: (data.email || '').toString().toLowerCase(), // Email sempre minúsculo
        cnpj: formatCNPJInput(cleanCNPJ), // Aplicar formatação no CNPJ
        // Campos específicos de endereço formatados
        logradouro: formatToTitleCase(logradouroCompleto),
        complemento: formatToTitleCase(data.complemento || ''),
        bairro: formatToTitleCase(data.bairro || ''),
        cep: (data.cep || '').toString(),
        cidade: formatToTitleCase(data.municipio || ''),
        uf: (data.uf || '').toString().toUpperCase(), // UF sempre maiúsculo
        // Outros campos do CNPJ formatados
        razao_social: formatToTitleCase(data.razao_social || ''),
        nome_fantasia: formatToTitleCase(data.nome_fantasia || ''),
        estado: formatToTitleCase(data.descricao_municipio || ''),
        numero: (data.numero || '').toString(),
        municipio: formatToTitleCase(data.municipio || ''),
        cnae_fiscal: data.cnae_fiscal_principal?.codigo || '',
        situacao_cadastral: formatToTitleCase(data.situacao_cadastral || ''),
        porte: formatToTitleCase(data.porte || '')
      };

      if (isNewUnit) {
        // Atualizar dados da nova unidade
        setNewUnitData(prev => ({
          ...prev,
          ...cnpjData
        }));
      } else {
        // Atualizar dados da unidade existente
        setSelectedUnitDetails(prev => ({
          ...prev,
          ...cnpjData
        }));
      }

      toast({
        title: "Dados encontrados!",
        description: `Razão Social: ${data.razao_social || data.nome_fantasia} - Informações preenchidas automaticamente`,
        duration: 3000
      });
      
    } catch (error) {
      setCnpjError(error instanceof Error ? error.message : 'Erro ao buscar CNPJ');
      toast({
        title: "Erro ao buscar CNPJ",
        description: "Verifique o CNPJ informado e tente novamente",
        variant: "destructive"
      });
    } finally {
      setLoadingCNPJ(false);
    }
  };

  // Carregar detalhes da unidade e seus usuários
  const loadUnitDetails = async (unitId: string) => {
    try {
      setLoadingDetails(true);
      
      // Carregar dados da unidade
      const { data: unitData, error: unitError } = await supabase
        .from('units')
        .select('*')
        .eq('id', unitId)
        .single();

      if (unitError) throw unitError;

      // Carregar usuários da unidade
      const { data: unitUsersData, error: usersError } = await supabase
        .from('user_unit_assignments')
        .select(`
          *,
          users:user_id (
            id,
            name,
            email,
            role_id,
            roles:role_id (display_name)
          )
        `)
        .eq('unit_id', unitId);

      if (usersError) {
        console.error('Erro ao carregar usuários da unidade:', usersError);
      }

      // Carregar todos os usuários disponíveis
      const { data: allUsersData, error: allUsersError } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          role_id,
          is_active,
          roles:role_id (display_name)
        `)
        .eq('is_active', true);

      if (allUsersError) {
        console.error('Erro ao carregar usuários disponíveis:', allUsersError);
      }

      // Filtrar usuários que não estão na unidade atual
      const assignedUserIds = unitUsersData?.map(u => u.user_id) || [];
      const availableUsersFiltered = allUsersData?.filter(user => 
        !assignedUserIds.includes(user.id)
      ) || [];

      setSelectedUnitDetails(unitData);
      setUnitUsers(unitUsersData || []);
      setAvailableUsers(availableUsersFiltered);
      
      console.log('Unit details loaded:', {
        unit: unitData,
        unitUsers: unitUsersData?.length || 0,
        availableUsers: availableUsersFiltered.length
      });

      // Carregar keys da unidade
      const { data: unitKeysData, error: keysError } = await supabase
        .from('unit_keys')
        .select('*')
        .eq('unit_id', unitId)
        .order('created_at', { ascending: false });

      if (keysError) {
        console.error('Erro ao carregar keys da unidade:', keysError);
        setUnitKeys([]);
      } else {
        setUnitKeys(unitKeysData || []);
      }

    } catch (error) {
      console.error('Erro ao carregar detalhes da unidade:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Abrir modal de detalhes
  const openDetailsModal = async (unit: Unit) => {
    setSelectedUnitDetails(unit);
    setShowDetailsModal(true);
    setActiveTab('dados'); // Reset para primeira aba
    setUnitUsers([]);
    setAvailableUsers([]);
    setUnitKeys([]);
    
    // Carregar dados em background
    await loadUnitDetails(unit.id);
  };

  // Nova função para abrir modal diretamente na aba módulos
  const openModulesModal = async (unit: Unit) => {
    setSelectedUnitDetails(unit);
    setShowDetailsModal(true);
    setActiveTab('modulos'); // Abrir direto na aba módulos
    setUnitUsers([]);
    setAvailableUsers([]);
    setUnitKeys([]);
    
    // Carregar dados em background
    await loadUnitDetails(unit.id);
  };

  // Criar novo usuário
  const createNewUser = async () => {
    if (!selectedUnitDetails) return;
    
    try {
      setCreatingUser(true);
      
      // Validações
      if (!newUserData.name || !newUserData.email || !newUserData.password) {
        alert('Nome, email e senha são obrigatórios');
        return;
      }
      
      // Buscar o ID da role "Atendente"
      const { data: atendenteRole } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'atendente')
        .single();

      // Criar usuário na tabela users
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          name: newUserData.name,
          email: newUserData.email,
          password: newUserData.password,
          role_id: newUserData.role_id || atendenteRole?.id || '702ecce3-a65e-468d-8a00-f15954d1400d', // Atendente por padrão
          is_active: true
        })
        .select()
        .single();

      if (userError) throw userError;

      // Vincular à unidade
      const { error: assignmentError } = await supabase
        .from('user_unit_assignments')
        .insert({
          user_id: newUser.id,
          unit_id: selectedUnitDetails.id,
          assigned_by: user.id,
          assigned_at: new Date().toISOString()
        });

      if (assignmentError) throw assignmentError;

      // Limpar formulário e manter role padrão (Atendente)
      const atendenteRoleId = availableRoles.find(role => role.name === 'atendente')?.id || '';
      setNewUserData({ 
        name: '', 
        email: '', 
        password: '', 
        role_id: atendenteRoleId 
      });
      
      // Recarregar dados
      await loadUnitDetails(selectedUnitDetails.id);
      alert('Usuário criado e vinculado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      alert('Erro ao criar usuário');
    } finally {
      setCreatingUser(false);
    }
  };

  // ==================== FUNÇÕES DE GERENCIAMENTO DE KEYS ====================
  
  // Criar nova key
  const createKey = async () => {
    if (!selectedUnitDetails) return;
    
    try {
      setCreatingKey(true);
      
      const { data, error } = await supabase
        .from('unit_keys')
        .insert({
          unit_id: selectedUnitDetails.id,
          name: newKeyData.name.trim(),
          description: newKeyData.description.trim(),
          key_type: newKeyData.key_type,
          value: newKeyData.value.trim(),
          is_active: newKeyData.is_active,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar lista local
      setUnitKeys(prev => [data, ...prev]);
      
      // Resetar formulário
      setNewKeyData({
        name: '',
        description: '',
        key_type: 'api_key',
        value: '',
        is_active: true
      });

      toast({
        title: "Key criada com sucesso",
        description: `A key "${data.name}" foi criada para a unidade.`,
        duration: 3000
      });
      
    } catch (error) {
      console.error('Erro ao criar key:', error);
      toast({
        title: "Erro ao criar key",
        description: "Não foi possível criar a key. Tente novamente.",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setCreatingKey(false);
    }
  };

  // Editar key existente
  const updateKey = async () => {
    if (!editingKey) return;
    
    try {
      const { error } = await supabase
        .from('unit_keys')
        .update({
          name: editingKey.name.trim(),
          description: editingKey.description.trim(),
          key_type: editingKey.key_type,
          value: editingKey.value.trim(),
          is_active: editingKey.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingKey.id);

      if (error) throw error;

      // Atualizar lista local
      setUnitKeys(prev => 
        prev.map(key => 
          key.id === editingKey.id ? { ...key, ...editingKey } : key
        )
      );

      setEditingKey(null);

      toast({
        title: "Key atualizada com sucesso",
        description: `A key "${editingKey.name}" foi atualizada.`,
        duration: 3000
      });
      
    } catch (error) {
      console.error('Erro ao atualizar key:', error);
      toast({
        title: "Erro ao atualizar key",
        description: "Não foi possível atualizar a key. Tente novamente.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  // Deletar key
  const deleteKey = async (keyId: string, keyName: string) => {
    if (!confirm(`Tem certeza que deseja deletar a key "${keyName}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('unit_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;

      // Remover da lista local
      setUnitKeys(prev => prev.filter(key => key.id !== keyId));

      toast({
        title: "Key deletada com sucesso",
        description: `A key "${keyName}" foi removida.`,
        duration: 3000
      });
      
    } catch (error) {
      console.error('Erro ao deletar key:', error);
      toast({
        title: "Erro ao deletar key",
        description: "Não foi possível deletar a key. Tente novamente.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  // Toggle status da key
  const toggleKeyStatus = async (keyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('unit_keys')
        .update({
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', keyId);

      if (error) throw error;

      // Atualizar lista local
      setUnitKeys(prev => 
        prev.map(key => 
          key.id === keyId ? { ...key, is_active: !currentStatus } : key
        )
      );

      toast({
        title: `Key ${!currentStatus ? 'ativada' : 'desativada'}`,
        description: "Status da key atualizado com sucesso.",
        duration: 2000
      });
      
    } catch (error) {
      console.error('Erro ao alterar status da key:', error);
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status da key.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  // ==================== FIM DAS FUNÇÕES DE KEYS ====================

  // Salvar alterações da unidade
  const saveUnitChanges = async () => {
    if (!selectedUnitDetails) return;
    
    try {
      setEditingUnit(true);
      
      const { error } = await supabase
        .from('units')
        .update({
          name: selectedUnitDetails.name,
          code: selectedUnitDetails.code,
          address: selectedUnitDetails.address,
          phone: selectedUnitDetails.phone,
          email: selectedUnitDetails.email,
          cnpj: selectedUnitDetails.cnpj,
          status: selectedUnitDetails.status,
          // Novos campos do CNPJ
          razao_social: selectedUnitDetails.razao_social,
          nome_fantasia: selectedUnitDetails.nome_fantasia,
          cep: selectedUnitDetails.cep,
          cidade: selectedUnitDetails.cidade,
          estado: selectedUnitDetails.estado,
          uf: selectedUnitDetails.uf,
          logradouro: selectedUnitDetails.logradouro,
          numero: selectedUnitDetails.numero,
          complemento: selectedUnitDetails.complemento,
          bairro: selectedUnitDetails.bairro,
          municipio: selectedUnitDetails.municipio,
          cnae_fiscal: selectedUnitDetails.cnae_fiscal,
          situacao_cadastral: selectedUnitDetails.situacao_cadastral,
          porte: selectedUnitDetails.porte,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUnitDetails.id);

      if (error) throw error;

      // Recarregar lista de unidades
      await loadDashboardData();
      
      toast({
        title: "Unidade atualizada!",
        description: "As alterações foram salvas com sucesso",
        duration: 3000
      });
      
    } catch (error) {
      console.error('Erro ao salvar unidade:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações",
        variant: "destructive"
      });
    } finally {
      setEditingUnit(false);
    }
  };

  // Adicionar usuário à unidade
  const addUserToUnit = async (userId: string) => {
    if (!selectedUnitDetails) return;
    
    try {
      const { error } = await supabase
        .from('user_unit_assignments')
        .insert({
          user_id: userId,
          unit_id: selectedUnitDetails.id,
          assigned_by: user.id,
          assigned_at: new Date().toISOString()
        });

      if (error) throw error;

      // Recarregar usuários da unidade
      await loadUnitDetails(selectedUnitDetails.id);
      alert('Usuário adicionado à unidade com sucesso!');
      
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      alert(`Erro ao adicionar usuário: ${error.message || error}`);
    }
  };

  // Função para verificar se módulo está ativo para a unidade
  const isModuleActive = (unitId: number | string, moduleId: number | string): boolean => {
    return unitModules.some(
      um => um.unit_id === unitId && um.module_id === moduleId && um.is_active
    );
  };

  // Função para contar módulos ativos da unidade
  const getActiveModulesCount = (unitId: number | string | undefined): number => {
    if (!unitId) return 0;
    return unitModules.filter(
      um => um.unit_id === unitId && um.is_active
    ).length;
  };

  // Função para obter informações dinâmicas do header baseado na aba ativa
  const getDynamicHeaderInfo = () => {
    switch (activeTab) {
      case 'dados':
        return {
          gradient: 'from-blue-50 to-indigo-50',
          borderColor: 'border-blue-100',
          iconBg: 'bg-blue-200 text-blue-700',
          titleColor: 'text-blue-900',
          descriptionColor: 'text-blue-700',
          icon: Building2,
          title: 'Informações da Unidade',
          description: 'Configure os dados principais da unidade'
        };
      case 'modulos':
        return {
          gradient: 'from-green-50 to-emerald-50',
          borderColor: 'border-green-100',
          iconBg: 'bg-green-200 text-green-700',
          titleColor: 'text-green-900',
          descriptionColor: 'text-green-700',
          icon: Settings,
          title: 'Módulos do Sistema',
          description: 'Configure quais módulos estão disponíveis para esta unidade'
        };
      case 'usuarios':
        return {
          gradient: 'from-blue-50 to-indigo-50',
          borderColor: 'border-blue-100',
          iconBg: 'bg-blue-200 text-blue-700',
          titleColor: 'text-blue-900',
          descriptionColor: 'text-blue-700',
          icon: Users,
          title: 'Gestão de Usuários',
          description: 'Gerencie usuários vinculados à esta unidade'
        };
      case 'keys':
        return {
          gradient: 'from-purple-50 to-pink-50',
          borderColor: 'border-purple-100',
          iconBg: 'bg-purple-200 text-purple-700',
          titleColor: 'text-purple-900',
          descriptionColor: 'text-purple-700',
          icon: Key,
          title: 'Chaves e Integrações',
          description: 'Gerenciar APIs, endereços e códigos de integração da unidade'
        };
      default:
        return {
          gradient: 'from-gray-50 to-gray-100',
          borderColor: 'border-gray-100',
          iconBg: 'bg-gray-200 text-gray-700',
          titleColor: 'text-gray-900',
          descriptionColor: 'text-gray-700',
          icon: Building2,
          title: 'Gestão da Unidade',
          description: 'Informações da unidade'
        };
    }
  };

  // Função para alternar ativação de módulo
  const toggleModule = async (unitId: number | string, moduleId: number | string) => {
    try {
      const isCurrentlyActive = isModuleActive(unitId, moduleId);
      const existingRelation = unitModules.find(
        um => um.unit_id === unitId && um.module_id === moduleId
      );

      if (existingRelation) {
        // Atualizar relação existente
        const { error } = await supabase
          .from('unit_modules')
          .update({ is_active: !isCurrentlyActive })
          .eq('id', existingRelation.id);

        if (error) throw error;
      } else {
        // Criar nova relação
        const { error } = await supabase
          .from('unit_modules')
          .insert({
            unit_id: unitId,
            module_id: moduleId,
            is_active: true
          });

        if (error) throw error;
      }

      // Recarregar dados
      await loadDashboardData();
      toast({
        title: isCurrentlyActive ? "Módulo desativado" : "Módulo ativado",
        description: "Configuração atualizada com sucesso"
      });
    } catch (error) {
      console.error('Erro ao alternar módulo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o módulo",
        variant: "destructive"
      });
    }
  };

  // Função para remover usuário da unidade
  const removeUserFromUnit = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_unit_assignments')
        .delete()
        .eq('unit_id', selectedUnitDetails?.id)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Usuário removido",
        description: "Usuário desvinculado da unidade com sucesso"
      });

      // Recarregar usuários da unidade
      await loadUnitDetails(selectedUnitDetails!.id);
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o usuário",
        variant: "destructive"
      });
    }
  };

  // Alternar ativação de módulo para unidade
  const toggleUnitModule = async (unitId: string, moduleId: string, isActive: boolean) => {
    try {
      if (isActive) {
        // Ativar módulo
        await supabase
          .from('unit_modules')
          .upsert({
            unit_id: unitId,
            module_id: moduleId,
            is_active: true,
            enabled_by: user.id,
            enabled_at: new Date().toISOString()
          });
      } else {
        // Desativar módulo
        await supabase
          .from('unit_modules')
          .update({ is_active: false })
          .match({ unit_id: unitId, module_id: moduleId });
      }

      // Recarregar dados
      loadDashboardData();
    } catch (error) {
      console.error('Erro ao alterar status do módulo:', error);
    }
  };

  // Nova função para toggle sem recarregar página
  const toggleModuleStatus = async (unitId: number | string, moduleId: number | string, newStatus: boolean) => {
    try {
      const existingRelation = unitModules.find(
        um => um.unit_id === unitId && um.module_id === moduleId
      );

      if (existingRelation) {
        // Atualizar relação existente
        const { error } = await supabase
          .from('unit_modules')
          .update({ 
            is_active: newStatus,
            enabled_by: user.id,
            enabled_at: newStatus ? new Date().toISOString() : null,
            disabled_at: !newStatus ? new Date().toISOString() : null
          })
          .eq('id', existingRelation.id);

        if (error) throw error;
        
        // Atualizar state local sem recarregar página
        setUnitModules(prev => 
          prev.map(um => 
            um.id === existingRelation.id 
              ? { ...um, is_active: newStatus }
              : um
          )
        );
      } else {
        // Criar nova relação
        const { data, error } = await supabase
          .from('unit_modules')
          .insert({
            unit_id: unitId,
            module_id: moduleId,
            is_active: newStatus,
            enabled_by: user.id,
            enabled_at: newStatus ? new Date().toISOString() : null
          })
          .select()
          .single();

        if (error) throw error;
        
        // Adicionar ao state local
        setUnitModules(prev => [...prev, data]);
      }

      toast({
        title: newStatus ? "Módulo ativado" : "Módulo desativado",
        description: "Configuração atualizada com sucesso",
        duration: 2000
      });
    } catch (error) {
      console.error('Erro ao alternar módulo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o módulo",
        variant: "destructive"
      });
    }
  };

  // Criar nova unidade
  const createNewUnit = async () => {
    try {
      setCreatingUnit(true);
      
      // Validar campo obrigatório
      if (!newUnitData.name.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "Nome da unidade é obrigatório",
          variant: "destructive"
        });
        return;
      }
      
      // Inserir nova unidade
      const { data: newUnit, error } = await supabase
        .from('units')
        .insert({
          name: newUnitData.name,
          code: newUnitData.code || null,
          address: newUnitData.address || null,
          phone: newUnitData.phone || null,
          email: newUnitData.email || null,
          cnpj: newUnitData.cnpj || null,
          status: 'active',
          is_active: true,
          // Novos campos específicos
          logradouro: newUnitData.logradouro || null,
          complemento: newUnitData.complemento || null,
          bairro: newUnitData.bairro || null,
          cep: newUnitData.cep || null,
          cidade: newUnitData.cidade || null,
          uf: newUnitData.uf || null,
          razao_social: newUnitData.razao_social || null,
          nome_fantasia: newUnitData.nome_fantasia || null,
          estado: newUnitData.estado || null,
          numero: newUnitData.numero || null,
          municipio: newUnitData.municipio || null,
          cnae_fiscal: newUnitData.cnae_fiscal || null,
          situacao_cadastral: newUnitData.situacao_cadastral || null,
          porte: newUnitData.porte || null
        })
        .select()
        .single();

      if (error) throw error;

      console.log('Nova unidade criada:', newUnit);

      // Limpar formulário e fechar modal
      setNewUnitData({
        name: '',
        code: '',
        address: '',
        phone: '',
        email: '',
        cnpj: '',
        logradouro: '',
        complemento: '',
        bairro: '',
        cep: '',
        cidade: '',
        uf: '',
        razao_social: '',
        nome_fantasia: '',
        estado: '',
        numero: '',
        municipio: '',
        cnae_fiscal: '',
        situacao_cadastral: '',
        porte: ''
      });
      setShowNewUnitModal(false);

      // Recarregar dados
      await loadDashboardData();
      
      toast({
        title: "Unidade criada!",
        description: "Nova unidade foi criada com sucesso",
        duration: 3000
      });
      
    } catch (error) {
      console.error('Erro ao criar nova unidade:', error);
      toast({
        title: "Erro ao criar unidade",
        description: "Verifique os dados e tente novamente",
        variant: "destructive"
      });
    } finally {
      setCreatingUnit(false);
    }
  };

  // Filtrar unidades por termo de busca
  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (unit.address && unit.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Agrupar módulos por categoria
  const modulesByCategory = Object.entries(
    modules.reduce((acc, module) => {
      if (!acc[module.category]) {
        acc[module.category] = [];
      }
      acc[module.category].push(module);
      return acc;
    }, {} as Record<string, Module[]>)
  ).map(([category, modules]) => ({ category, modules }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando gestão de unidades...</p>
        </div>
      </div>
    );
  }

  // Mostrar lista de unidades
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Unidades</h1>
        </div>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando unidades...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Unidades</h1>
      </div>

      {/* Barra de busca e ações */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar unidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={showNewUnitModal} onOpenChange={setShowNewUnitModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Unidade
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Unidade</DialogTitle>
              <DialogDescription>
                Configure os dados da nova unidade. Digite o CNPJ para preenchimento automático dos dados.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Dados Básicos */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-blue-600" />
                  Dados Básicos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Unidade *</Label>
                    <Input
                      id="name"
                      value={newUnitData.name}
                      onChange={(e) => setNewUnitData({...newUnitData, name: e.target.value})}
                      placeholder="Ex: MB Drome"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Código da Unidade</Label>
                    <Input
                      id="code"
                      value={newUnitData.code}
                      onChange={(e) => setNewUnitData({...newUnitData, code: e.target.value})}
                      onBlur={(e) => {
                        const formatted = handleTextFormat(e.target.value, 'code', true);
                        if (formatted && formatted !== e.target.value) {
                          setNewUnitData({...newUnitData, code: formatted});
                        }
                      }}
                      placeholder="Ex: mb-drome"
                    />
                  </div>
                </div>
                
                {/* Campo Razão Social */}
                <div className="space-y-2">
                  <Label htmlFor="razao_social">Razão Social</Label>
                  <Input
                    id="razao_social"
                    value={newUnitData.razao_social || ''}
                    onChange={(e) => setNewUnitData({...newUnitData, razao_social: e.target.value})}
                    onBlur={(e) => {
                      const formatted = handleTextFormat(e.target.value, 'razao_social', true);
                      if (formatted && formatted !== e.target.value) {
                        setNewUnitData({...newUnitData, razao_social: formatted});
                      }
                    }}
                    placeholder="Razão Social da empresa (preenchido automaticamente pelo CNPJ)"
                    className="bg-gray-50"
                    readOnly
                  />
                  <p className="text-xs text-gray-500">
                    Este campo é preenchido automaticamente ao consultar o CNPJ
                  </p>
                </div>
              </div>

              {/* CNPJ */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-purple-600" />
                  Informações Regulamentares
                </h4>
                <div className="space-y-2">
                  <Label htmlFor="cnpj" className="flex items-center">
                    CNPJ
                    {loadingCNPJ && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 ml-2"></div>
                    )}
                  </Label>
                  <div className="relative">
                    <Input
                      id="cnpj"
                      value={newUnitData.cnpj}
                      onChange={(e) => {
                        // Aplicar formatação automática enquanto digita
                        const formatted = formatCNPJInput(e.target.value);
                        setNewUnitData({...newUnitData, cnpj: formatted});
                        setCnpjError('');
                      }}
                      onBlur={(e) => {
                        const cleanCNPJ = extractCNPJNumbers(e.target.value);
                        if (cleanCNPJ.length === 14) {
                          fetchCNPJData(cleanCNPJ, true); // true indica que é nova unidade
                        }
                      }}
                      placeholder="00.000.000/0000-00"
                      disabled={loadingCNPJ}
                      className={cnpjError ? 'border-red-300 focus:border-red-500' : ''}
                    />
                    {cnpjError && (
                      <p className="text-red-600 text-xs mt-1">{cnpjError}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    💡 Digite o CNPJ para buscar dados automaticamente
                  </p>
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-orange-600" />
                  Endereço
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logradouro">Rua/Avenida</Label>
                    <Input
                      id="logradouro"
                      value={newUnitData.logradouro}
                      onChange={(e) => setNewUnitData({...newUnitData, logradouro: e.target.value})}
                      onBlur={(e) => {
                        const formatted = handleTextFormat(e.target.value, 'logradouro', true);
                        if (formatted && formatted !== e.target.value) {
                          setNewUnitData({...newUnitData, logradouro: formatted});
                        }
                      }}
                      placeholder="Ex: Rua das Flores, 123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                      id="complemento"
                      value={newUnitData.complemento}
                      onChange={(e) => setNewUnitData({...newUnitData, complemento: e.target.value})}
                      onBlur={(e) => {
                        const formatted = handleTextFormat(e.target.value, 'complemento', true);
                        if (formatted && formatted !== e.target.value) {
                          setNewUnitData({...newUnitData, complemento: formatted});
                        }
                      }}
                      placeholder="Apto, Sala, Bloco..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      value={newUnitData.bairro}
                      onChange={(e) => setNewUnitData({...newUnitData, bairro: e.target.value})}
                      onBlur={(e) => {
                        const formatted = handleTextFormat(e.target.value, 'bairro', true);
                        if (formatted && formatted !== e.target.value) {
                          setNewUnitData({...newUnitData, bairro: formatted});
                        }
                      }}
                      placeholder="Nome do bairro"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={newUnitData.cep}
                      onChange={(e) => setNewUnitData({...newUnitData, cep: e.target.value})}
                      placeholder="00000-000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={newUnitData.cidade}
                      onChange={(e) => setNewUnitData({...newUnitData, cidade: e.target.value})}
                      onBlur={(e) => {
                        const formatted = handleTextFormat(e.target.value, 'cidade', true);
                        if (formatted && formatted !== e.target.value) {
                          setNewUnitData({...newUnitData, cidade: formatted});
                        }
                      }}
                      placeholder="Nome da cidade"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uf">Estado</Label>
                    <Input
                      id="uf"
                      value={newUnitData.uf}
                      onChange={(e) => setNewUnitData({...newUnitData, uf: e.target.value})}
                      onBlur={(e) => {
                        const formatted = handleTextFormat(e.target.value, 'uf', true);
                        if (formatted && formatted !== e.target.value) {
                          setNewUnitData({...newUnitData, uf: formatted});
                        }
                      }}
                      placeholder="SP"
                    />
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-green-600" />
                  Informações de Contato
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={newUnitData.phone}
                      onChange={(e) => setNewUnitData({...newUnitData, phone: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUnitData.email}
                      onChange={(e) => setNewUnitData({...newUnitData, email: e.target.value})}
                      onBlur={(e) => {
                        const formatted = handleTextFormat(e.target.value, 'email', true);
                        if (formatted && formatted !== e.target.value) {
                          setNewUnitData({...newUnitData, email: formatted});
                        }
                      }}
                      placeholder="unidade@mariaflow.com"
                    />
                  </div>
                </div>
              </div>

              {/* Preview de dados do CNPJ */}
              {(newUnitData.razao_social || newUnitData.nome_fantasia) && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h6 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Dados Empresariais (Brasil API)
                  </h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {newUnitData.razao_social && (
                      <div>
                        <span className="font-medium text-blue-700">Razão Social:</span>
                        <p className="text-blue-600">{newUnitData.razao_social}</p>
                      </div>
                    )}
                    {newUnitData.situacao_cadastral && (
                      <div>
                        <span className="font-medium text-blue-700">Situação:</span>
                        <p className="text-blue-600">{newUnitData.situacao_cadastral}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowNewUnitModal(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={createNewUnit}
                disabled={!newUnitData.name || creatingUnit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {creatingUnit ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Criando...
                  </>
                ) : (
                  'Criar Unidade'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de unidades */}
      {filteredUnits.length === 0 ? (
        <div className="flex items-center justify-center min-h-96">
          <Card className="w-96 text-center">
            <CardContent className="p-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma unidade encontrada
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Nenhuma unidade corresponde à sua pesquisa.' : 'Ainda não há unidades cadastradas.'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowNewUnitModal(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira unidade
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnits.map(unit => (
          <Card 
            key={unit.id} 
            className="border-0 shadow-kit-lg hover:shadow-kit transition-all duration-300 overflow-hidden bg-white cursor-pointer hover:scale-[1.02]" 
            onDoubleClick={() => openDetailsModal(unit)}
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">{unit.name}</CardTitle>
                </div>
                <Badge 
                  variant={unit.status === 'active' ? 'default' : 'secondary'}
                  className={`${
                    unit.status === 'active' 
                      ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  } font-medium px-3 py-1`}
                >
                  {unit.status === 'active' ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Estatísticas de usuários e módulos */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="text-sm font-semibold text-blue-900">{unit.admins_count}</div>
                      <div className="text-xs text-blue-600">Admin(s)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="text-sm font-semibold text-green-900">{unit.attendants_count}</div>
                      <div className="text-xs text-green-600">Atendente(s)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-purple-50 rounded-lg px-3 py-2">
                    <Settings className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="text-sm font-semibold text-purple-900">{unit.modules_count || 0}</div>
                      <div className="text-xs text-purple-600">Módulo(s)</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {/* Modal de Detalhes da Unidade com Abas */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            {/* Header Dinâmico baseado na aba ativa */}
            {(() => {
              const headerInfo = getDynamicHeaderInfo();
              const IconComponent = headerInfo.icon;
              return (
                <div className={`bg-gradient-to-r ${headerInfo.gradient} rounded-lg p-4 border ${headerInfo.borderColor} mb-4`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${headerInfo.iconBg} rounded-xl flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <DialogTitle className={`text-xl font-semibold ${headerInfo.titleColor}`}>
                        {headerInfo.title}
                      </DialogTitle>
                      <DialogDescription className={`${headerInfo.descriptionColor} mt-1`}>
                        {headerInfo.description}
                      </DialogDescription>
                    </div>
                  </div>
                </div>
              );
            })()}
            
            {/* Sistema de Abas */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg -mx-6 px-6 -mb-6">
              <div className="flex space-x-1 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('dados')}
                  className={`px-6 py-4 text-sm font-medium transition-all duration-200 relative whitespace-nowrap ${
                    activeTab === 'dados' 
                      ? 'text-blue-600 bg-white border-b-2 border-blue-600 rounded-t-lg shadow-lg' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-t-lg'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Dados Gerais
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('modulos')}
                  className={`px-6 py-4 text-sm font-medium transition-all duration-200 relative whitespace-nowrap ${
                    activeTab === 'modulos' 
                      ? 'text-blue-600 bg-white border-b-2 border-blue-600 rounded-t-lg shadow-lg' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-t-lg'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Módulos ({getActiveModulesCount(selectedUnitDetails?.id)})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('usuarios')}
                  className={`px-6 py-4 text-sm font-medium transition-all duration-200 relative whitespace-nowrap ${
                    activeTab === 'usuarios' 
                      ? 'text-blue-600 bg-white border-b-2 border-blue-600 rounded-t-lg shadow-lg' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-t-lg'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Usuários ({unitUsers.length})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('keys')}
                  className={`px-6 py-4 text-sm font-medium transition-all duration-200 relative whitespace-nowrap ${
                    activeTab === 'keys' 
                      ? 'text-blue-600 bg-white border-b-2 border-blue-600 rounded-t-lg shadow-lg' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-t-lg'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Chaves & Integrações ({unitKeys.length})
                  </div>
                </button>
              </div>
            </div>
          </DialogHeader>
          
          {loadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Carregando detalhes...</span>
            </div>
          ) : selectedUnitDetails ? (
            <div className="space-y-6 mt-6">
              {/* Conteúdo das Abas */}
              <div className="bg-white">
                {activeTab === 'dados' && (
                  <div className="space-y-6">
                    {/* Formulário de Dados da Unidade */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 flex items-center">
                          <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                          Dados da Unidade
                        </h4>
                        <div className="flex items-center gap-4">
                          {/* Toggle Status da Unidade */}
                          <div className="flex items-center gap-2">
                            <Label className="text-sm font-medium text-gray-700">Status:</Label>
                            <Switch
                              checked={selectedUnitDetails.status === 'active'}
                              onCheckedChange={async (checked) => {
                                const newStatus = checked ? 'active' : 'inactive';
                                
                                // Atualizar estado local da modal
                                setSelectedUnitDetails({
                                  ...selectedUnitDetails,
                                  status: newStatus
                                });
                                
                                // Salvar automaticamente no banco
                                try {
                                  const { error } = await supabase
                                    .from('units')
                                    .update({
                                      status: newStatus,
                                      updated_at: new Date().toISOString()
                                    })
                                    .eq('id', selectedUnitDetails.id);

                                  if (error) throw error;

                                  // Atualizar também o estado da lista de unidades
                                  setUnits(prevUnits => 
                                    prevUnits.map(unit => 
                                      unit.id === selectedUnitDetails.id 
                                        ? { ...unit, status: newStatus }
                                        : unit
                                    )
                                  );
                                  
                                  toast({
                                    title: checked ? "Unidade ativada!" : "Unidade desativada!",
                                    description: "Status atualizado com sucesso",
                                    duration: 2000
                                  });
                                  
                                } catch (error) {
                                  console.error('Erro ao atualizar status:', error);
                                  toast({
                                    title: "Erro ao atualizar",
                                    description: "Não foi possível alterar o status",
                                    variant: "destructive"
                                  });
                                  
                                  // Reverter o estado local em caso de erro
                                  setSelectedUnitDetails({
                                    ...selectedUnitDetails,
                                    status: selectedUnitDetails.status
                                  });
                                }
                              }}
                              className={`${
                                selectedUnitDetails.status === 'active' 
                                  ? 'data-[state=checked]:bg-green-500' 
                                  : 'bg-gray-300'
                              }`}
                            />
                          </div>
                          {/* Botão Editar */}
                          <button
                            onClick={() => setEditingUnit(!editingUnit)}
                            className="text-gray-600 hover:text-gray-800 transition-colors duration-200 p-1"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Nome da Unidade *</Label>
                          <Input
                            value={selectedUnitDetails.name}
                            onChange={(e) => setSelectedUnitDetails({
                              ...selectedUnitDetails, 
                              name: e.target.value
                            })}
                            placeholder="Nome da unidade"
                            disabled={!editingUnit}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-200 disabled:bg-gray-100"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Código da Unidade</Label>
                          <Input
                            value={selectedUnitDetails.code || ''}
                            onChange={(e) => setSelectedUnitDetails({
                              ...selectedUnitDetails, 
                              code: e.target.value
                            })}
                            onBlur={(e) => {
                              const formatted = handleTextFormat(e.target.value, 'code', false);
                              if (formatted && formatted !== e.target.value) {
                                setSelectedUnitDetails({
                                  ...selectedUnitDetails, 
                                  code: formatted
                                });
                              }
                            }}
                            placeholder="ex: mb-drome"
                            disabled={!editingUnit}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-200 disabled:bg-gray-100"
                          />
                        </div>
                      </div>

                      {/* Informações Regulamentares - Razão Social e CNPJ */}
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-900 mb-4 flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-purple-600" />
                          Informações Regulamentares
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Razão Social</Label>
                            <Input
                              value={selectedUnitDetails.razao_social || ''}
                              onChange={(e) => setSelectedUnitDetails({
                                ...selectedUnitDetails, 
                                razao_social: e.target.value
                              })}
                              onBlur={(e) => {
                                const formatted = handleTextFormat(e.target.value, 'razao_social', false);
                                if (formatted && formatted !== e.target.value) {
                                  setSelectedUnitDetails({
                                    ...selectedUnitDetails, 
                                    razao_social: formatted
                                  });
                                }
                              }}
                              placeholder="Razão Social da empresa"
                              disabled={!editingUnit}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-200 disabled:bg-gray-100"
                            />
                            <p className="text-xs text-gray-500">
                              Este campo é preenchido automaticamente ao consultar o CNPJ
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 flex items-center">
                              CNPJ
                              {loadingCNPJ && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 ml-2"></div>
                              )}
                            </Label>
                            <div className="relative">
                              <Input
                                value={selectedUnitDetails.cnpj || ''}
                                onChange={(e) => {
                                  // Aplicar formatação automática enquanto digita
                                  const formatted = formatCNPJInput(e.target.value);
                                  setSelectedUnitDetails({
                                    ...selectedUnitDetails, 
                                    cnpj: formatted
                                  });
                                  setCnpjError(''); // Limpar erro ao digitar
                                }}
                                onBlur={(e) => {
                                  const cleanCNPJ = extractCNPJNumbers(e.target.value);
                                  if (cleanCNPJ.length === 14 && editingUnit) {
                                    fetchCNPJData(cleanCNPJ, false);
                                  }
                                }}
                                placeholder="00.000.000/0000-00"
                                disabled={!editingUnit || loadingCNPJ}
                                className={`border-gray-300 focus:border-blue-500 focus:ring-blue-200 disabled:bg-gray-100 ${
                                  cnpjError ? 'border-red-300 focus:border-red-500' : ''
                                }`}
                              />
                              {cnpjError && (
                                <p className="text-red-600 text-xs mt-1">{cnpjError}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Informações de Endereço */}
                      <div className="mt-6">
                        <h5 className="font-medium text-gray-900 mb-4 flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-orange-600" />
                          Endereço
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Rua/Avenida</Label>
                            <Input
                              value={selectedUnitDetails.logradouro || ''}
                              onChange={(e) => setSelectedUnitDetails({
                                ...selectedUnitDetails, 
                                logradouro: e.target.value
                              })}
                              onBlur={(e) => {
                                const formatted = handleTextFormat(e.target.value, 'logradouro', false);
                                if (formatted && formatted !== e.target.value) {
                                  setSelectedUnitDetails({
                                    ...selectedUnitDetails, 
                                    logradouro: formatted
                                  });
                                }
                              }}
                              placeholder="Ex: Rua das Flores, 123"
                              disabled={!editingUnit}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-200 disabled:bg-gray-100"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Complemento</Label>
                            <Input
                              value={selectedUnitDetails.complemento || ''}
                              onChange={(e) => setSelectedUnitDetails({
                                ...selectedUnitDetails, 
                                complemento: e.target.value
                              })}
                              onBlur={(e) => {
                                const formatted = handleTextFormat(e.target.value, 'complemento', false);
                                if (formatted && formatted !== e.target.value) {
                                  setSelectedUnitDetails({
                                    ...selectedUnitDetails, 
                                    complemento: formatted
                                  });
                                }
                              }}
                              placeholder="Apto, Sala, Bloco..."
                              disabled={!editingUnit}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-200 disabled:bg-gray-100"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Bairro</Label>
                            <Input
                              value={selectedUnitDetails.bairro || ''}
                              onChange={(e) => setSelectedUnitDetails({
                                ...selectedUnitDetails, 
                                bairro: e.target.value
                              })}
                              onBlur={(e) => {
                                const formatted = handleTextFormat(e.target.value, 'bairro', false);
                                if (formatted && formatted !== e.target.value) {
                                  setSelectedUnitDetails({
                                    ...selectedUnitDetails, 
                                    bairro: formatted
                                  });
                                }
                              }}
                              placeholder="Nome do bairro"
                              disabled={!editingUnit}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-200 disabled:bg-gray-100"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">CEP</Label>
                            <Input
                              value={selectedUnitDetails.cep || ''}
                              onChange={(e) => setSelectedUnitDetails({
                                ...selectedUnitDetails, 
                                cep: e.target.value
                              })}
                              placeholder="00000-000"
                              disabled={!editingUnit}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-200 disabled:bg-gray-100"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Cidade</Label>
                            <Input
                              value={selectedUnitDetails.cidade || ''}
                              onChange={(e) => setSelectedUnitDetails({
                                ...selectedUnitDetails, 
                                cidade: e.target.value
                              })}
                              onBlur={(e) => {
                                const formatted = handleTextFormat(e.target.value, 'cidade', false);
                                if (formatted && formatted !== e.target.value) {
                                  setSelectedUnitDetails({
                                    ...selectedUnitDetails, 
                                    cidade: formatted
                                  });
                                }
                              }}
                              placeholder="Nome da cidade"
                              disabled={!editingUnit}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-200 disabled:bg-gray-100"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Estado</Label>
                            <Input
                              value={selectedUnitDetails.uf || ''}
                              onChange={(e) => setSelectedUnitDetails({
                                ...selectedUnitDetails, 
                                uf: e.target.value
                              })}
                              onBlur={(e) => {
                                const formatted = handleTextFormat(e.target.value, 'uf', false);
                                if (formatted && formatted !== e.target.value) {
                                  setSelectedUnitDetails({
                                    ...selectedUnitDetails, 
                                    uf: formatted
                                  });
                                }
                              }}
                              placeholder="SP"
                              disabled={!editingUnit}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-200 disabled:bg-gray-100"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Informações de Contato */}
                      <div className="mt-6">
                        <h5 className="font-medium text-gray-900 mb-4 flex items-center">
                          <Settings className="h-4 w-4 mr-2 text-green-600" />
                          Informações de Contato
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Telefone</Label>
                            <Input
                              value={selectedUnitDetails.phone || ''}
                              onChange={(e) => setSelectedUnitDetails({
                                ...selectedUnitDetails, 
                                phone: e.target.value
                              })}
                              placeholder="(11) 99999-9999"
                              disabled={!editingUnit}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-200 disabled:bg-gray-100"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Email</Label>
                            <Input
                              type="email"
                              value={selectedUnitDetails.email || ''}
                              onChange={(e) => setSelectedUnitDetails({
                                ...selectedUnitDetails, 
                                email: e.target.value
                              })}
                              onBlur={(e) => {
                                const formatted = handleTextFormat(e.target.value, 'email', false);
                                if (formatted && formatted !== e.target.value) {
                                  setSelectedUnitDetails({
                                    ...selectedUnitDetails, 
                                    email: formatted
                                  });
                                }
                              }}
                              placeholder="contato@unidade.com"
                              disabled={!editingUnit}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-200 disabled:bg-gray-100"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Rodapé com Data de Criação */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="text-center text-sm text-gray-500">
                          <span className="font-medium">Data de Criação:</span> {new Date(selectedUnitDetails.created_at || Date.now()).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'modulos' && (
                  <div className="space-y-4">
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {modulesByCategory.map((category) => (
                        <div key={category.category} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="h-px bg-gray-200 flex-1"></div>
                            <h4 className="text-xs font-semibold text-gray-700 px-2 py-1 bg-gray-100 rounded-full">
                              {category.category}
                            </h4>
                            <div className="h-px bg-gray-200 flex-1"></div>
                          </div>
                          
                          {category.modules.map((module) => {
                            const isActive = isModuleActive(selectedUnitDetails?.id, module.id);
                            return (
                              <div 
                                key={module.id} 
                                className={`p-3 border-2 rounded-lg transition-all duration-200 hover:shadow-sm ${
                                  isActive 
                                    ? 'border-green-200 bg-green-50' 
                                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                        isActive 
                                          ? 'bg-green-200 text-green-700' 
                                          : 'bg-gray-200 text-gray-500'
                                      }`}>
                                        <Settings className="h-4 w-4" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h5 className="font-medium text-gray-900 text-sm truncate">{module.display_name}</h5>
                                          {module.is_core && (
                                            <span className="text-xs px-1.5 py-0.5 rounded bg-blue-200 text-blue-800 flex-shrink-0">
                                              Essencial
                                            </span>
                                          )}
                                        </div>
                                        {module.description && (
                                          <p className="text-xs text-gray-600 truncate">
                                            {module.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="ml-3 flex items-center gap-2 flex-shrink-0">
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      isActive 
                                        ? 'bg-green-200 text-green-800' 
                                        : 'bg-gray-200 text-gray-600'
                                    }`}>
                                      {isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                    <button
                                      onClick={() => toggleModuleStatus(selectedUnitDetails?.id, module.id, !isActive)}
                                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer ${
                                        isActive
                                          ? 'bg-green-600'
                                          : 'bg-gray-300'
                                      }`}
                                    >
                                      <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                          isActive ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'usuarios' && (
                  <div className="space-y-4">
                    {/* Tabela de Usuários */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      {unitUsers.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50">
                          <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">Nenhum usuário vinculado</p>
                          <p className="text-sm text-gray-400 mt-1">Clique no ícone + para adicionar usuários</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Nome</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Função</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-700">Ações</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {unitUsers.map((assignment) => (
                                <tr 
                                  key={assignment.id} 
                                  className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                  onDoubleClick={() => openUserDetailsModal(assignment.user_id)}
                                  title="Duplo clique para ver detalhes"
                                >
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <span className="font-medium text-gray-900 truncate">
                                        {assignment.users?.name || 'Nome não disponível'}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="text-gray-600 truncate block">
                                      {assignment.users?.email || 'Email não disponível'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                      assignment.users?.roles?.level >= 80 
                                        ? 'bg-purple-100 text-purple-800' 
                                        : 'bg-blue-100 text-blue-800'
                                    }`}>
                                      {assignment.users?.roles?.display_name || 'Sem função'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <button
                                      onClick={() => removeUserFromUnit(assignment.user_id)}
                                      className="text-red-600 hover:text-red-800 transition-colors duration-200 p-1 hover:bg-red-50 rounded"
                                      title="Remover usuário"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'keys' && (
                  <div className="space-y-6">
                    {/* Header com botão de criar nova key */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Chaves e Integrações</h3>
                        <p className="text-sm text-gray-600">Gerencie APIs, endereços e códigos de integração desta unidade</p>
                      </div>
                      <Button
                        onClick={() => setCreatingKey(true)}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                        disabled={!user.is_super_admin}
                      >
                        <Plus className="h-4 w-4" />
                        Nova Key
                      </Button>
                    </div>

                    {/* Formulário de criação de nova key */}
                    {creatingKey && (
                      <Card className="border-purple-200 bg-purple-50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Key className="h-5 w-5 text-purple-600" />
                            Criar Nova Key
                          </CardTitle>
                          <CardDescription>
                            Adicione uma nova chave de integração para esta unidade
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="key-name">Nome da Key *</Label>
                              <Input
                                id="key-name"
                                placeholder="Ex: API WhatsApp, Endereço Principal"
                                value={newKeyData.name}
                                onChange={(e) => setNewKeyData(prev => ({ ...prev, name: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="key-type">Tipo *</Label>
                              <select
                                id="key-type"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={newKeyData.key_type}
                                onChange={(e) => setNewKeyData(prev => ({ ...prev, key_type: e.target.value }))}
                              >
                                <option value="api_key">API Key</option>
                                <option value="access_token">Access Token</option>
                                <option value="webhook_url">Webhook URL</option>
                                <option value="endpoint">Endpoint</option>
                                <option value="address">Endereço</option>
                                <option value="code">Código</option>
                                <option value="other">Outro</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="key-description">Descrição</Label>
                            <Textarea
                              id="key-description"
                              placeholder="Descreva o propósito desta key..."
                              rows={2}
                              value={newKeyData.description}
                              onChange={(e) => setNewKeyData(prev => ({ ...prev, description: e.target.value }))}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="key-value">Valor/Conteúdo *</Label>
                            <Textarea
                              id="key-value"
                              placeholder="Cole aqui a key, token, URL, endereço ou código..."
                              rows={3}
                              value={newKeyData.value}
                              onChange={(e) => setNewKeyData(prev => ({ ...prev, value: e.target.value }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="key-active"
                                checked={newKeyData.is_active}
                                onChange={(e) => setNewKeyData(prev => ({ ...prev, is_active: e.target.checked }))}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <Label htmlFor="key-active">Key ativa</Label>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setCreatingKey(false);
                                  setNewKeyData({
                                    name: '',
                                    description: '',
                                    key_type: 'api_key',
                                    value: '',
                                    is_active: true
                                  });
                                }}
                              >
                                Cancelar
                              </Button>
                              <Button
                                onClick={createKey}
                                disabled={!newKeyData.name.trim() || !newKeyData.value.trim()}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                <Save className="h-4 w-4 mr-2" />
                                Salvar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Lista de keys existentes */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {unitKeys.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                          <Key className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">Nenhuma key cadastrada</p>
                          <p className="text-sm text-gray-400 mt-1">
                            {user.is_super_admin 
                              ? 'Clique em "Nova Key" para adicionar sua primeira integração'
                              : 'Apenas Super Admins podem gerenciar keys'
                            }
                          </p>
                        </div>
                      ) : (
                        unitKeys.map((key) => (
                          <Card key={key.id} className={`border transition-all duration-200 hover:shadow-md ${
                            key.is_active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                          }`}>
                            <CardContent className="p-4">
                              {editingKey?.id === key.id ? (
                                // Modo de edição
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Nome da Key</Label>
                                      <Input
                                        value={editingKey.name}
                                        onChange={(e) => setEditingKey(prev => ({ ...prev, name: e.target.value }))}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Tipo</Label>
                                      <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        value={editingKey.key_type}
                                        onChange={(e) => setEditingKey(prev => ({ ...prev, key_type: e.target.value }))}
                                      >
                                        <option value="api_key">API Key</option>
                                        <option value="access_token">Access Token</option>
                                        <option value="webhook_url">Webhook URL</option>
                                        <option value="endpoint">Endpoint</option>
                                        <option value="address">Endereço</option>
                                        <option value="code">Código</option>
                                        <option value="other">Outro</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Descrição</Label>
                                    <Textarea
                                      rows={2}
                                      value={editingKey.description}
                                      onChange={(e) => setEditingKey(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Valor/Conteúdo</Label>
                                    <Textarea
                                      rows={3}
                                      value={editingKey.value}
                                      onChange={(e) => setEditingKey(prev => ({ ...prev, value: e.target.value }))}
                                    />
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        checked={editingKey.is_active}
                                        onChange={(e) => setEditingKey(prev => ({ ...prev, is_active: e.target.checked }))}
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                      />
                                      <Label>Key ativa</Label>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingKey(null)}
                                      >
                                        Cancelar
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={updateKey}
                                        className="bg-purple-600 hover:bg-purple-700"
                                      >
                                        <Save className="h-4 w-4 mr-2" />
                                        Salvar
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                // Modo de visualização
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        key.is_active ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-500'
                                      }`}>
                                        <Key className="h-4 w-4" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-gray-900">{key.name}</h4>
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline" className="text-xs">
                                            {key.key_type.replace('_', ' ').toUpperCase()}
                                          </Badge>
                                          <Badge variant={key.is_active ? 'default' : 'secondary'} className="text-xs">
                                            {key.is_active ? 'Ativa' : 'Inativa'}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {user.is_super_admin && (
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => toggleKeyStatus(key.id, key.is_active)}
                                          className="h-8 w-8 p-0"
                                        >
                                          {key.is_active ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4 text-gray-400" />}
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setEditingKey(key)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => deleteKey(key.id, key.name)}
                                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {key.description && (
                                    <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                                      {key.description}
                                    </p>
                                  )}
                                  
                                  <div className="bg-gray-100 p-3 rounded border font-mono text-sm">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs text-gray-500 font-sans">VALOR:</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          navigator.clipboard.writeText(key.value);
                                          toast({
                                            title: "Copiado!",
                                            description: "Valor copiado para a área de transferência.",
                                            duration: 2000
                                          });
                                        }}
                                        className="h-6 px-2 text-xs"
                                      >
                                        Copiar
                                      </Button>
                                    </div>
                                    <div className="text-gray-700 break-all">
                                      {key.value.length > 100 ? `${key.value.substring(0, 100)}...` : key.value}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>Criado em: {new Date(key.created_at).toLocaleString('pt-BR')}</span>
                                    {key.updated_at && key.updated_at !== key.created_at && (
                                      <span>Atualizado em: {new Date(key.updated_at).toLocaleString('pt-BR')}</span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Erro ao carregar detalhes da unidade</p>
            </div>
          )}

          {/* Botão Flutuante - Adicionar Usuário */}
          {activeTab === 'usuarios' && (
            <button
              onClick={() => setShowUserTypeModal(true)}
              className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 group"
              title="Adicionar usuário"
            >
              <UserPlus className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
            </button>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Seleção do Tipo de Usuário */}
      <Dialog open={showUserTypeModal} onOpenChange={setShowUserTypeModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Adicionar Usuário</DialogTitle>
            <DialogDescription>
              Escolha como você deseja adicionar um usuário a esta unidade
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <button
              onClick={() => {
                setShowUserTypeModal(false);
                setShowCreateUserModal(true);
              }}
              className="w-full p-4 border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 rounded-lg transition-all duration-200 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Criar Novo Usuário</p>
                <p className="text-sm text-gray-600">Criar um novo usuário e vincular à unidade</p>
              </div>
            </button>

            <button
              onClick={() => {
                setShowUserTypeModal(false);
                setShowAddUserModal(true);
              }}
              className="w-full p-4 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Vincular Existente</p>
                <p className="text-sm text-gray-600">Selecionar usuário já cadastrado no sistema</p>
              </div>
            </button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserTypeModal(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Criar Novo Usuário */}
      <Dialog open={showCreateUserModal} onOpenChange={setShowCreateUserModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar um novo usuário e vinculá-lo a esta unidade
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Nome Completo *</Label>
              <Input
                value={newUserData.name}
                onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                placeholder="Nome completo do usuário"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Email *</Label>
              <Input
                type="email"
                value={newUserData.email}
                onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                placeholder="email@exemplo.com"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Senha Temporária *</Label>
              <Input
                type="password"
                value={newUserData.password}
                onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                placeholder="Senha inicial"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Função</Label>
              <select
                value={newUserData.role_id}
                onChange={(e) => setNewUserData({...newUserData, role_id: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-200 bg-white"
              >
                <option value="">Selecione uma função</option>
                {availableRoles.map(role => (
                  <option key={role.id} value={role.id}>{role.display_name}</option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCreateUserModal(false)}
              disabled={creatingUser}
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                createNewUser();
                setShowCreateUserModal(false);
              }}
              disabled={creatingUser || !newUserData.name || !newUserData.email || !newUserData.password}
              className="bg-green-600 hover:bg-green-700"
            >
              {creatingUser ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando...
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Criar e Vincular
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Adicionar Usuário */}
      <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Adicionar Usuário à Unidade</DialogTitle>
            <DialogDescription>
              Selecione um usuário para adicionar a esta unidade
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {availableUsers
              .filter(user => !unitUsers.some(assignment => assignment.user_id === user.id))
              .map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">
                      {user.email} - {user.roles?.display_name || 'Sem função'}
                    </p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => {
                      addUserToUnit(user.id);
                      setShowAddUserModal(false);
                    }}
                  >
                    Adicionar
                  </Button>
                </div>
              ))
            }
            {availableUsers.filter(user => !unitUsers.some(assignment => assignment.user_id === user.id)).length === 0 && (
              <p className="text-gray-500 text-center">Todos os usuários já estão atribuídos a esta unidade</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserModal(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes do Usuário */}
      <Dialog open={showUserDetailsModal} onOpenChange={setShowUserDetailsModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Detalhes do Usuário
            </DialogTitle>
            <DialogDescription>
              Informações detalhadas e permissões do usuário
            </DialogDescription>
          </DialogHeader>
          
          {loadingUserDetails ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Carregando detalhes...</span>
            </div>
          ) : selectedUserDetails ? (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  Informações Pessoais
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Nome:</span>
                    <p className="font-medium text-gray-900">{selectedUserDetails.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <p className="text-gray-900">{selectedUserDetails.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Função:</span>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      selectedUserDetails.roles?.level >= 80 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedUserDetails.roles?.display_name || 'Sem função'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      selectedUserDetails.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedUserDetails.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Unidades Vinculadas */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-green-600" />
                  Unidades Vinculadas ({userUnits.length})
                </h4>
                {userUnits.length === 0 ? (
                  <p className="text-gray-500 text-sm bg-gray-50 p-3 rounded">
                    Este usuário não está vinculado a nenhuma unidade
                  </p>
                ) : (
                  <div className="space-y-2">
                    {userUnits.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{assignment.units?.name}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          assignment.units?.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {assignment.units?.status === 'active' ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Permissões de Módulos (apenas para atendentes) */}
              {selectedUserDetails.roles?.level <= 30 && selectedUnitDetails?.id && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-orange-600" />
                    Permissões de Módulos - {selectedUnitDetails.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Como atendente, este usuário precisa de permissões específicas para acessar módulos nesta unidade.
                  </p>
                  
                  {/* Obter módulos disponíveis para a unidade atual */}
                  {(() => {
                    console.log('🔍 Modal Debug - Processando módulos:');
                    console.log('   - selectedUnitDetails:', selectedUnitDetails);
                    console.log('   - unitModules.length:', unitModules.length);
                    console.log('   - modules.length:', modules.length);
                    console.log('   - userModulePermissions.length:', userModulePermissions.length);
                    
                    const availableModules = unitModules
                      .filter(um => {
                        const isRightUnit = um.unit_id === selectedUnitDetails?.id;
                        const isActive = um.is_active;
                        console.log(`   - Unit Module ${um.module_id}: unit=${isRightUnit}, active=${isActive}`);
                        return isRightUnit && isActive;
                      })
                      .map(um => {
                        const module = modules.find(m => m.id === um.module_id);
                        console.log(`   - Found module for ${um.module_id}:`, module?.display_name || 'NOT FOUND');
                        return module;
                      })
                      .filter(Boolean);
                    
                    console.log('✅ Modal Debug - Módulos disponíveis finais:', availableModules.length);
                    availableModules.forEach(m => console.log(`   - ${m.display_name} (${m.category})`));
                    
                    const groupedModules = availableModules.reduce((acc, module) => {
                      const category = module.category;
                      if (!acc[category]) acc[category] = [];
                      acc[category].push(module);
                      return acc;
                    }, {} as Record<string, any[]>);

                    return (
                      <div className="space-y-4">
                        {Object.entries(groupedModules).map(([category, categoryModules]) => (
                          <div key={category} className="border border-gray-200 rounded-lg p-3">
                            <h5 className="font-medium text-gray-700 mb-2 capitalize">{category}</h5>
                            <div className="space-y-2">
                              {categoryModules.map((module) => {
                                console.log(`🔍 Modal Permission Check - ${module.display_name}:`);
                                console.log(`   - module.id: ${module.id}`);
                                console.log(`   - selectedUserDetails.id: ${selectedUserDetails?.id}`);
                                console.log(`   - userModulePermissions.length: ${userModulePermissions.length}`);
                                
                                const hasPermission = userModulePermissions.some(p => {
                                  const matches = p.module_id === module.id && p.user_id === selectedUserDetails?.id;
                                  console.log(`   - Checking permission: module=${p.module_id}, user=${p.user_id}, matches=${matches}`);
                                  return matches;
                                });
                                
                                console.log(`   - Final hasPermission: ${hasPermission}`);
                                console.log(`   - module.is_core: ${module.is_core}`);
                                
                                return (
                                  <div key={module.id} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                        <span className="text-xs text-blue-600">M</span>
                                      </div>
                                      <span className="text-sm font-medium text-gray-900">{module.display_name}</span>
                                      {module.is_core && (
                                        <span className="text-xs px-1.5 py-0.5 rounded bg-blue-200 text-blue-800">
                                          Essencial
                                        </span>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => toggleUserModulePermission(selectedUserDetails.id, module.id, hasPermission)}
                                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer ${
                                        hasPermission
                                          ? 'bg-green-600'
                                          : 'bg-gray-300'
                                      }`}
                                    >
                                      <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                          hasPermission ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                      />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserDetailsModal(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
