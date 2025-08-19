import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserManagement } from '@/hooks/useUserManagement';
import { UserCreationModal } from '@/components/UserCreationModal';
import { UserPermissionsModal } from '@/components/UserPermissionsModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Users, Plus, Search, Settings, UserCheck, UserX, Building2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AttendantUser {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  created_at: string;
  role: {
    name: string;
    display_name: string;
    level: number;
  };
}

export function GestaoUsuariosModule() {
  const { user } = useAuth();
  const {
    isLoading,
    getAttendantsByUnit,
    toggleUserStatus,
    getAvailableModules,
    getAdminUnits
  } = useUserManagement();

  const [attendants, setAttendants] = useState<AttendantUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [selectedUnitName, setSelectedUnitName] = useState<string>('');
  const [availableModules, setAvailableModules] = useState<any[]>([]);
  const [availableUnits, setAvailableUnits] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AttendantUser | null>(null);

  // Filtrar atendentes baseado na busca
  const filteredAttendants = attendants.filter(attendant =>
    attendant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Log para debug da renderização
  console.log('🎨 GestaoUsuariosModule - Estado atual da renderização:');
  console.log('   - attendants.length:', attendants.length);
  console.log('   - filteredAttendants.length:', filteredAttendants.length);
  console.log('   - selectedUnit:', selectedUnit);
  console.log('   - selectedUnitName:', selectedUnitName);
  console.log('   - searchTerm:', searchTerm);
  console.log('   - isLoading:', isLoading);

  // Carregar unidades do usuário atual (considerando hierarquia)
  const loadAdminUnits = async () => {
    if (!user?.id) return;
    
    const result = await getAdminUnits(user.id, user.is_super_admin);
    if (result.success) {
      setAvailableUnits(result.data);
    }
  };

  // Carregar atendentes da unidade
  const loadAttendants = async (unitId: string) => {
    if (!unitId) return;
    
    console.log('🔄 GestaoUsuariosModule.loadAttendants iniciado para unitId:', unitId);
    
    const result = await getAttendantsByUnit(unitId);
    console.log('📊 GestaoUsuariosModule.loadAttendants - Resultado:', result);
    
    if (result.success) {
      console.log('✅ GestaoUsuariosModule.loadAttendants - Definindo attendants:', result.data.length, 'atendentes');
      setAttendants(result.data);
    } else {
      console.error('❌ GestaoUsuariosModule.loadAttendants - Erro:', result.error);
      setAttendants([]);
    }
  };

  // Carregar módulos disponíveis
  const loadAvailableModules = async (unitId: string) => {
    if (!unitId) return;
    
    const result = await getAvailableModules(unitId);
    if (result.success) {
      setAvailableModules(result.data);
    }
  };

  // Alternar status do usuário
  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    const result = await toggleUserStatus(userId, !currentStatus);
    if (result.success && selectedUnit) {
      loadAttendants(selectedUnit);
    }
  };

  // Abrir modal de permissões
  const handleOpenPermissions = (attendant: AttendantUser) => {
    setSelectedUser(attendant);
    setShowPermissionsModal(true);
  };

  // Callback para sucesso na criação de usuário
  const handleCreateSuccess = () => {
    if (selectedUnit) {
      loadAttendants(selectedUnit);
    }
  };

  // Callback para sucesso na edição de permissões
  const handlePermissionsSuccess = () => {
    if (selectedUnit) {
      loadAttendants(selectedUnit);
    }
  };

  // Callback para seleção de unidade
  const handleUnitSelection = (unitId: string, unitName: string) => {
    console.log('🏢 GestaoUsuariosModule.handleUnitSelection - Unidade selecionada:', unitName, '(', unitId, ')');
    setSelectedUnit(unitId);
    setSelectedUnitName(unitName);
  };

  // Formatear data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Efeito para carregar unidades do usuário ao inicializar
  useEffect(() => {
    if (user?.id) {
      loadAdminUnits();
    }
  }, [user?.id]);

  // Efeito para carregar dados quando unidade é selecionada
  useEffect(() => {
    console.log('🔄 GestaoUsuariosModule.useEffect - selectedUnit mudou:', selectedUnit);
    if (selectedUnit) {
      console.log('📞 GestaoUsuariosModule.useEffect - Chamando loadAttendants e loadAvailableModules');
      loadAttendants(selectedUnit);
      loadAvailableModules(selectedUnit);
    }
  }, [selectedUnit]);

  // Se não é admin, não pode acessar
  if (!user || (user.role_level < 80 && !user.is_super_admin)) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert className="max-w-md">
          <AlertDescription>
            Você não tem permissão para acessar a gestão de usuários.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com mesmo estilo do GestaoUnidadesModule */}
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h1>
      </div>

      {/* Barra de busca e ações - mesmo padrão */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {selectedUnit && (
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Atendente
          </Button>
        )}
      </div>

      {/* Lista de unidades - mesmo estilo de cards */}
      {!selectedUnit ? (
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Selecionar Unidade</h2>
            <p className="text-gray-600">
              {user?.is_super_admin 
                ? 'Como Super Admin, você pode gerenciar todas as unidades do sistema'
                : 'Selecione uma das unidades às quais você tem acesso como Admin'
              }
            </p>
          </div>

          {availableUnits.length === 0 ? (
            <div className="flex items-center justify-center min-h-96">
              <Card className="w-96 text-center">
                <CardContent className="p-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhuma unidade encontrada
                  </h3>
                  <p className="text-gray-600">
                    {user?.is_super_admin 
                      ? 'Nenhuma unidade cadastrada no sistema'
                      : 'Você não possui acesso a nenhuma unidade. Entre em contato com o Super Admin.'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableUnits.map(unit => (
                <Card 
                  key={unit.id} 
                  className="border-0 shadow-kit-lg hover:shadow-kit transition-all duration-300 overflow-hidden bg-white cursor-pointer hover:scale-[1.02]" 
                  onClick={() => handleUnitSelection(unit.id, unit.name)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-gray-900 mb-2">{unit.name}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>Clique para gerenciar usuários</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {user?.is_super_admin ? 'Acesso total' : 'Unidade designada'}
                      </span>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        Acessar →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Breadcrumb de navegação */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedUnit('')}
              className="p-0 h-auto font-medium text-blue-600 hover:text-blue-700"
            >
              ← Voltar às unidades
            </Button>
            <span>/</span>
            <span className="font-medium text-gray-900">{selectedUnitName}</span>
          </div>

          {/* Estatísticas da unidade */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="border-0 shadow-kit-sm bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total de Usuários</p>
                    <p className="text-2xl font-bold text-blue-900">{attendants.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-kit-sm bg-gradient-to-r from-green-50 to-green-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Usuários Ativos</p>
                    <p className="text-2xl font-bold text-green-900">
                      {attendants.filter(a => a.is_active).length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-green-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-kit-sm bg-gradient-to-r from-red-50 to-red-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700">Usuários Inativos</p>
                    <p className="text-2xl font-bold text-red-900">
                      {attendants.filter(a => !a.is_active).length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-red-200 rounded-lg flex items-center justify-center">
                    <UserX className="h-5 w-5 text-red-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Usuários */}
          <Card className="border-0 shadow-kit-lg">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    Usuários da Unidade ({filteredAttendants.length})
                  </CardTitle>
                  <CardDescription>
                    Gerencie os atendentes e suas permissões para esta unidade
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-gray-500">Carregando usuários...</div>
                </div>
              ) : filteredAttendants.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 space-y-4">
                  <Users className="h-12 w-12 text-gray-300" />
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">
                      {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado nesta unidade'}
                    </p>
                    <p className="text-sm text-gray-400">
                      Use o botão "Novo Atendente" para adicionar o primeiro usuário
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">Nome</TableHead>
                        <TableHead className="font-semibold text-gray-700">Email</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Criado em</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAttendants.map((attendant) => (
                        <TableRow key={attendant.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-gray-900">
                            {attendant.name}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {attendant.email}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={attendant.is_active}
                                onCheckedChange={() => handleToggleStatus(attendant.id, attendant.is_active)}
                                disabled={isLoading}
                              />
                              <Badge 
                                variant={attendant.is_active ? 'default' : 'secondary'}
                                className={attendant.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                              >
                                {attendant.is_active ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {formatDate(attendant.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenPermissions(attendant)}
                                className="border-blue-200 text-blue-600 hover:bg-blue-50"
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                              
                              {attendant.is_active ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleStatus(attendant.id, attendant.is_active)}
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <UserX className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleStatus(attendant.id, attendant.is_active)}
                                  className="text-green-600 border-green-200 hover:bg-green-50"
                                >
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Modal de Criação de Usuário */}
      <UserCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        unitId={selectedUnit}
        unitName={selectedUnitName}
        onSuccess={handleCreateSuccess}
      />

      {/* Modal de Permissões */}
      {showPermissionsModal && selectedUser && (
        <UserPermissionsModal
          isOpen={showPermissionsModal}
          onClose={() => setShowPermissionsModal(false)}
          user={{
            id: selectedUser.id,
            name: selectedUser.name,
            email: selectedUser.email,
            is_active: selectedUser.is_active
          }}
          unitId={selectedUnit}
          unitName={selectedUnitName}
          onSuccess={handlePermissionsSuccess}
        />
      )}
    </div>
  );
}
