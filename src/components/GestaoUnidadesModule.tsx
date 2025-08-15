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
  Activity,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [units, setUnits] = useState<Unit[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [unitModules, setUnitModules] = useState<UnitModule[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewUnitModal, setShowNewUnitModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUnitDetails, setSelectedUnitDetails] = useState<Unit | null>(null);
  const [editingUnit, setEditingUnit] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [unitUsers, setUnitUsers] = useState<UserUnitAssignment[]>([]);
  const [availableUsers, setAvailableUsers] = useState<DatabaseUser[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'dados' | 'modulos' | 'usuarios' | 'logs'>('dados');
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
    cnpj: ''
  });

  // Verificar se é Super Admin
  if (!user || !user.is_super_admin) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Acesso Negado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Você não tem permissão para acessar a gestão de unidades.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Carregar dados iniciais
  useEffect(() => {
    loadDashboardData();
  }, []);

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
      // Carregar unidades primeiro
      const { data: unitsData, error: unitsError } = await supabase
        .from('units')
        .select('*')
        .order('created_at', { ascending: false });

      if (unitsError) {
        console.error('Erro ao carregar unidades:', unitsError);
        throw unitsError;
      }

      // Processar unidades (por enquanto sem contagem de usuários)
      const processedUnits = unitsData?.map(unit => ({
        ...unit,
        admins_count: 0,
        attendants_count: 0
      })) || [];

      console.log('Unidades carregadas:', processedUnits);
      setUnits(processedUnits);

      // Carregar módulos
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .order('category', { ascending: true });

      if (modulesError) {
        console.error('Erro ao carregar módulos:', modulesError);
      } else {
        console.log('Módulos carregados:', modulesData?.length || 0);
        setModules(modulesData || []);
      }

      // Carregar configurações de módulos por unidade
      const { data: unitModulesData, error: unitModulesError } = await supabase
        .from('unit_modules')
        .select('*');

      if (unitModulesError) {
        console.error('Erro ao carregar unit_modules:', unitModulesError);
      } else {
        console.log('Unit modules carregados:', unitModulesData?.length || 0);
        setUnitModules(unitModulesData || []);
      }

      // Carregar roles disponíveis
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .order('level', { ascending: false });

      if (rolesError) {
        console.error('Erro ao carregar roles:', rolesError);
      } else {
        setAvailableRoles(rolesData || []);
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
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

      // Carregar logs da unidade (simulação - você pode implementar uma tabela de logs)
      const unitLogsSimulation = [
        {
          id: '1',
          action: 'Unidade criada',
          user: user.name,
          timestamp: unitData.created_at,
          details: 'Unidade foi criada no sistema'
        },
        {
          id: '2', 
          action: 'Dados atualizados',
          user: user.name,
          timestamp: unitData.updated_at || unitData.created_at,
          details: 'Informações da unidade foram modificadas'
        }
      ];
      setUnitLogs(unitLogsSimulation);

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
    setUnitLogs([]);
    
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
          status: selectedUnitDetails.status
        })
        .eq('id', selectedUnitDetails.id);

      if (error) throw error;

      // Recarregar lista de unidades
      await loadDashboardData();
      alert('Unidade atualizada com sucesso!');
      
    } catch (error) {
      console.error('Erro ao salvar unidade:', error);
      alert('Erro ao salvar alterações');
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
      um => um.unit_id == unitId && um.module_id == moduleId && um.is_active
    );
  };

  // Função para alternar ativação de módulo
  const toggleModule = async (unitId: number | string, moduleId: number | string) => {
    try {
      const isCurrentlyActive = isModuleActive(unitId, moduleId);
      const existingRelation = unitModules.find(
        um => um.unit_id == unitId && um.module_id == moduleId
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

  // Criar nova unidade
  const createNewUnit = async () => {
    try {
      setCreatingUnit(true);
      
      // Validar campo obrigatório
      if (!newUnitData.name.trim()) {
        alert('Nome da unidade é obrigatório');
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
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      // Para este exemplo inicial, vamos apenas criar a unidade
      // Os módulos podem ser ativados posteriormente pelo Super Admin
      console.log('Nova unidade criada:', newUnit);

      // Limpar formulário e fechar modal
      setNewUnitData({
        name: '',
        code: '',
        address: '',
        phone: '',
        email: '',
        cnpj: ''
      });
      setShowNewUnitModal(false);

      // Recarregar dados
      await loadDashboardData();
      
      alert('Unidade criada com sucesso!');
      
    } catch (error) {
      console.error('Erro ao criar nova unidade:', error);
      alert('Erro ao criar unidade. Verifique os dados e tente novamente.');
    } finally {
      setCreatingUnit(false);
    }
  };

  // Filtrar unidades por termo de busca
  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar módulos por categoria
  const modulesByCategory = modules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, Module[]>);

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

  // Se uma unidade está selecionada, mostrar painel de módulos
  if (selectedUnit) {
    const unit = units.find(u => u.id === selectedUnit);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => setSelectedUnit(null)} variant="outline">
            ← Voltar para Unidades
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Módulos - {unit?.name}</h2>
            <p className="text-gray-600">Configure quais módulos estão disponíveis para esta unidade</p>
          </div>
        </div>

        {Object.entries(modulesByCategory).map(([category, categoryModules]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryModules.map(module => {
                  const isActive = isModuleActive(selectedUnit, module.id);
                  return (
                    <div
                      key={module.id}
                      className={`p-4 border rounded-lg ${
                        isActive ? 'border-green-200 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{module.icon}</span>
                            <h3 className="font-medium">{module.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600">{module.description}</p>
                        </div>
                        <Switch
                          checked={isActive}
                          onCheckedChange={(checked) => toggleUnitModule(selectedUnit, module.id, checked)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Unidade</DialogTitle>
              <DialogDescription>
                Configure os dados da nova unidade MariaFlow. Todos os módulos serão ativados por padrão.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome da Unidade *</Label>
                <Input
                  id="name"
                  value={newUnitData.name}
                  onChange={(e) => setNewUnitData({...newUnitData, name: e.target.value})}
                  placeholder="Ex: MB Drome"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Código da Unidade</Label>
                <Input
                  id="code"
                  value={newUnitData.code}
                  onChange={(e) => setNewUnitData({...newUnitData, code: e.target.value})}
                  placeholder="Ex: mb-drome"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Endereço</Label>
                <Textarea
                  id="address"
                  value={newUnitData.address}
                  onChange={(e) => setNewUnitData({...newUnitData, address: e.target.value})}
                  placeholder="Endereço completo da unidade"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={newUnitData.phone}
                    onChange={(e) => setNewUnitData({...newUnitData, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={newUnitData.cnpj}
                    onChange={(e) => setNewUnitData({...newUnitData, cnpj: e.target.value})}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUnitData.email}
                  onChange={(e) => setNewUnitData({...newUnitData, email: e.target.value})}
                  placeholder="unidade@mariaflow.com"
                />
              </div>
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
          <Card key={unit.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{unit.name}</CardTitle>
                  <CardDescription>
                    {unit.code ? `Código: ${unit.code}` : 'Sem código'}
                  </CardDescription>
                  {unit.address && (
                    <div className="text-sm text-gray-500 mt-1">{unit.address}</div>
                  )}
                </div>
                <Badge 
                  variant={unit.status === 'active' ? 'default' : 'secondary'}
                  className={unit.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                >
                  {unit.status === 'active' ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p><strong>Email:</strong> {unit.email || 'Não informado'}</p>
                  <p><strong>Telefone:</strong> {unit.phone || 'Não informado'}</p>
                  {unit.cnpj && <p><strong>CNPJ:</strong> {unit.cnpj}</p>}
                </div>
                
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    {unit.admins_count} Admin(s)
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-green-600" />
                    {unit.attendants_count} Atendente(s)
                  </span>
                </div>

                <div className="flex gap-2 pt-3">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedUnit(unit.id)}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Configurar Módulos
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => openDetailsModal(unit)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Detalhes
                  </Button>
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
            <DialogTitle>Detalhes da Unidade</DialogTitle>
            <DialogDescription>
              Gerencie informações, módulos e usuários da unidade
            </DialogDescription>
          </DialogHeader>
          
          {loadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Carregando detalhes...</span>
            </div>
          ) : selectedUnitDetails ? (
            <div className="space-y-6">
              {/* Sistema de Abas */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('dados')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'dados' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Database className="h-4 w-4 inline mr-2" />
                  Dados
                </button>
                <button
                  onClick={() => setActiveTab('modulos')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'modulos' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Settings className="h-4 w-4 inline mr-2" />
                  Módulos
                </button>
                <button
                  onClick={() => setActiveTab('usuarios')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'usuarios' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Users className="h-4 w-4 inline mr-2" />
                  Usuários
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'logs' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Activity className="h-4 w-4 inline mr-2" />
                  Logs
                </button>
              </div>

              {/* Conteúdo das Abas */}
              <div className="mt-6">
                {activeTab === 'dados' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informações da Unidade</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-name">Nome *</Label>
                        <Input
                          id="edit-name"
                          value={selectedUnitDetails.name}
                          onChange={(e) => setSelectedUnitDetails({
                            ...selectedUnitDetails, 
                            name: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-code">Código</Label>
                        <Input
                          id="edit-code"
                          value={selectedUnitDetails.code || ''}
                          onChange={(e) => setSelectedUnitDetails({
                            ...selectedUnitDetails, 
                            code: e.target.value
                          })}
                          placeholder="ex: mb-drome"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="edit-address">Endereço</Label>
                      <Textarea
                        id="edit-address"
                        value={selectedUnitDetails.address || ''}
                        onChange={(e) => setSelectedUnitDetails({
                          ...selectedUnitDetails, 
                          address: e.target.value
                        })}
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-phone">Telefone</Label>
                        <Input
                          id="edit-phone"
                          value={selectedUnitDetails.phone || ''}
                          onChange={(e) => setSelectedUnitDetails({
                            ...selectedUnitDetails, 
                            phone: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                          id="edit-email"
                          value={selectedUnitDetails.email || ''}
                          onChange={(e) => setSelectedUnitDetails({
                            ...selectedUnitDetails, 
                            email: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-cnpj">CNPJ</Label>
                        <Input
                          id="edit-cnpj"
                          value={selectedUnitDetails.cnpj || ''}
                          onChange={(e) => setSelectedUnitDetails({
                            ...selectedUnitDetails, 
                            cnpj: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-status">Status</Label>
                        <select
                          id="edit-status"
                          value={selectedUnitDetails.status}
                          onChange={(e) => setSelectedUnitDetails({
                            ...selectedUnitDetails, 
                            status: e.target.value as 'active' | 'inactive'
                          })}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="active">Ativa</option>
                          <option value="inactive">Inativa</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'modulos' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Módulos da Unidade</h3>
                    <p className="text-gray-600 text-sm">Configure quais módulos estão disponíveis para esta unidade</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                      {modules.map(module => {
                        const isActive = isModuleActive(selectedUnitDetails.id, module.id);
                        return (
                          <div
                            key={module.id}
                            className={`p-4 border rounded-lg transition-colors ${
                              isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{module.name}</p>
                                <p className="text-sm text-gray-600">{module.description}</p>
                              </div>
                              <button
                                onClick={() => toggleModule(selectedUnitDetails.id, module.id)}
                                className="transition-colors"
                              >
                                {isActive ? (
                                  <ToggleRight className="h-8 w-8 text-green-600" />
                                ) : (
                                  <ToggleLeft className="h-8 w-8 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'usuarios' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Usuários da Unidade</h3>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => setShowAddUserModal(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Vincular Existente
                        </Button>
                      </div>
                    </div>

                    {/* Formulário para Criar Novo Usuário */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Criar Novo Usuário</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Nome *</Label>
                          <Input
                            value={newUserData.name}
                            onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                            placeholder="Nome completo"
                          />
                        </div>
                        <div>
                          <Label>Email *</Label>
                          <Input
                            type="email"
                            value={newUserData.email}
                            onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                            placeholder="email@exemplo.com"
                          />
                        </div>
                        <div>
                          <Label>Senha *</Label>
                          <Input
                            type="password"
                            value={newUserData.password}
                            onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                            placeholder="Senha temporária"
                          />
                        </div>
                        <div>
                          <Label>Função</Label>
                          <select
                            value={newUserData.role_id}
                            onChange={(e) => setNewUserData({...newUserData, role_id: e.target.value})}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="">Selecione uma função</option>
                            {availableRoles.map(role => (
                              <option key={role.id} value={role.id}>{role.display_name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <Button 
                        onClick={createNewUser}
                        disabled={creatingUser}
                        className="mt-3 bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        {creatingUser ? 'Criando...' : 'Criar e Vincular'}
                      </Button>
                    </div>

                    {/* Lista de Usuários */}
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {unitUsers.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-4">Nenhum usuário atribuído a esta unidade</p>
                      ) : (
                        unitUsers.map((assignment) => (
                          <div key={assignment.id} className="flex items-center justify-between p-3 bg-white border rounded">
                            <div>
                              <p className="font-medium">{assignment.users?.name || 'Nome não disponível'}</p>
                              <p className="text-sm text-gray-600">
                                {assignment.users?.email} - {assignment.users?.roles?.display_name || 'Sem função'}
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => removeUserFromUnit(assignment.user_id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'logs' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Histórico de Ações</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {unitLogs.map((log) => (
                        <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                          <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{log.action}</p>
                              <span className="text-xs text-gray-500">
                                {new Date(log.timestamp).toLocaleString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{log.details}</p>
                            <p className="text-xs text-gray-500 mt-1">Por: {log.user}</p>
                          </div>
                        </div>
                      ))}
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

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
              Fechar
            </Button>
            {!loadingDetails && activeTab === 'dados' && (
              <Button 
                onClick={saveUnitChanges}
                disabled={editingUnit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editingUnit ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            )}
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

    </div>
  );
}
