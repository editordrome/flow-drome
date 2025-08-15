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
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Unit {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  created_at: string;
  admins_count: number;
  attendants_count: number;
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
  activated_by: string;
  activated_at: string;
}

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [units, setUnits] = useState<Unit[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [unitModules, setUnitModules] = useState<UnitModule[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'units' | 'modules' | 'users'>('units');
  const [showNewUnitModal, setShowNewUnitModal] = useState(false);
  const [creatingUnit, setCreatingUnit] = useState(false);
  const [newUnitData, setNewUnitData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    cnpj: ''
  });

  // Verificar se é Super Admin
  if (!user || user.access_level !== 100) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Acesso Negado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Você não tem permissão para acessar o painel de Super Admin.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Carregar dados iniciais
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Carregar unidades com contagem de usuários
      const { data: unitsData } = await supabase
        .from('units')
        .select(`
          *,
          user_unit_assignments!inner(
            users!inner(role)
          )
        `);

      // Processar unidades com contagem
      const processedUnits = unitsData?.map(unit => ({
        ...unit,
        admins_count: unit.user_unit_assignments?.filter(
          (assignment: any) => assignment.users.role === 'admin'
        ).length || 0,
        attendants_count: unit.user_unit_assignments?.filter(
          (assignment: any) => assignment.users.role === 'attendant'
        ).length || 0
      })) || [];

      setUnits(processedUnits);

      // Carregar módulos
      const { data: modulesData } = await supabase
        .from('modules')
        .select('*')
        .order('category', { ascending: true });

      setModules(modulesData || []);

      // Carregar configurações de módulos por unidade
      const { data: unitModulesData } = await supabase
        .from('unit_modules')
        .select('*');

      setUnitModules(unitModulesData || []);

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
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
      
      // Inserir nova unidade
      const { data: newUnit, error } = await supabase
        .from('units')
        .insert({
          name: newUnitData.name,
          address: newUnitData.address,
          phone: newUnitData.phone,
          email: newUnitData.email,
          cnpj: newUnitData.cnpj,
          status: 'active',
          is_active: true,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Ativar todos os módulos para a nova unidade
      const { error: modulesError } = await supabase
        .from('unit_modules')
        .insert(
          modules.map(module => ({
            unit_id: newUnit.id,
            module_id: module.id,
            is_active: true,
            enabled_by: user.id,
            enabled_at: new Date().toISOString()
          }))
        );

      if (modulesError) throw modulesError;

      // Limpar formulário e fechar modal
      setNewUnitData({
        name: '',
        address: '',
        phone: '',
        email: '',
        cnpj: ''
      });
      setShowNewUnitModal(false);

      // Recarregar dados
      await loadDashboardData();
      
    } catch (error) {
      console.error('Erro ao criar nova unidade:', error);
      alert('Erro ao criar unidade. Verifique os dados e tente novamente.');
    } finally {
      setCreatingUnit(false);
    }
  };  // Filtrar unidades por termo de busca
  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando painel Super Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Painel Super Admin</h1>
        </div>
        <p className="text-gray-600">Gestão completa do sistema MariaFlow - Acesso Global</p>
      </div>

      {/* Tabs de navegação */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'units', label: 'Unidades', icon: Building2 },
            { 
              id: 'modules', 
              label: selectedUnit ? `Módulos - ${units.find(u => u.id === selectedUnit)?.name || 'Unidade'}` : 'Módulos', 
              icon: Settings 
            },
            { id: 'users', label: 'Usuários', icon: Users }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id !== 'modules') {
                  setSelectedUnit(null);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.id === 'modules' && selectedUnit && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Configurando
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo das tabs */}
      {activeTab === 'units' && (
        <div className="space-y-6">
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
                <Button className="bg-purple-600 hover:bg-purple-700">
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
                    <Label htmlFor="name">Nome da Unidade</Label>
                    <Input
                      id="name"
                      value={newUnitData.name}
                      onChange={(e) => setNewUnitData({...newUnitData, name: e.target.value})}
                      placeholder="Ex: MariaFlow Shopping Center"
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
                    disabled={!newUnitData.name || !newUnitData.address || creatingUnit}
                    className="bg-purple-600 hover:bg-purple-700"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnits.map(unit => (
              <Card key={unit.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{unit.name}</CardTitle>
                      <CardDescription>{unit.address}</CardDescription>
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
                      <p><strong>Email:</strong> {unit.email}</p>
                      <p><strong>Telefone:</strong> {unit.phone}</p>
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
                        onClick={() => {
                          setSelectedUnit(unit.id);
                          setActiveTab('modules');
                        }}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Módulos
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'modules' && selectedUnit && (
        <ModuleManagementPanel 
          unitId={selectedUnit} 
          modules={modules}
          unitModules={unitModules}
          onToggleModule={toggleUnitModule}
          onBack={() => {
            setSelectedUnit(null);
            setActiveTab('units');
          }}
        />
      )}

      {activeTab === 'users' && (
        <UserManagementPanel />
      )}
    </div>
  );
}

// Componente para gerenciar módulos de uma unidade
function ModuleManagementPanel({ 
  unitId, 
  modules, 
  unitModules, 
  onToggleModule, 
  onBack 
}: {
  unitId: string;
  modules: Module[];
  unitModules: UnitModule[];
  onToggleModule: (unitId: string, moduleId: string, isActive: boolean) => void;
  onBack: () => void;
}) {
  const [unit, setUnit] = useState<Unit | null>(null);

  useEffect(() => {
    loadUnitDetails();
  }, [unitId]);

  const loadUnitDetails = async () => {
    const { data } = await supabase
      .from('units')
      .select('*')
      .eq('id', unitId)
      .single();
    
    setUnit(data);
  };

  // Agrupar módulos por categoria
  const modulesByCategory = modules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, Module[]>);

  const isModuleActive = (moduleId: string) => {
    const unitModule = unitModules.find(
      um => um.unit_id === unitId && um.module_id === moduleId
    );
    return unitModule?.is_active || false;
  };

  if (!unit) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="outline">
          ← Voltar
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Módulos - {unit.name}</h2>
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
                const isActive = isModuleActive(module.id);
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
                        onCheckedChange={(checked) => onToggleModule(unitId, module.id, checked)}
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

// Componente para gerenciamento de usuários
function UserManagementPanel() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Painel de gerenciamento de usuários será implementado aqui.</p>
            <p className="text-sm mt-2">
              Funcionalidades: Criar admins, visualizar hierarquia, gerenciar permissões
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
