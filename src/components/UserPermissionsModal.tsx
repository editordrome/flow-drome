import { useState, useEffect } from 'react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  User, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  History,
  Save,
  RotateCcw,
  UserCog,
  KeyRound
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    is_active: boolean;
  };
  unitId: string;
  unitName: string;
  onSuccess: () => void;
}

interface ModuleOption {
  id: string;
  name: string;
  display_name: string;
  category: string;
}

interface CurrentPermission {
  module_id: string;
  module_name: string;
  is_active: boolean;
}

interface PermissionChange {
  moduleId: string;
  moduleName: string;
  oldStatus: boolean;
  newStatus: boolean;
}

export function UserPermissionsModal({ isOpen, onClose, user, unitId, unitName, onSuccess }: UserPermissionsModalProps) {
  const { toast } = useToast();
  const { 
    updateUserPermissions, 
    getUserModulePermissions, 
    getAvailableModules, 
    isLoading 
  } = useUserManagement();
  
  // Estados para permissões
  const [availableModules, setAvailableModules] = useState<ModuleOption[]>([]);
  const [currentPermissions, setCurrentPermissions] = useState<CurrentPermission[]>([]);
  const [newPermissions, setNewPermissions] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [permissionChanges, setPermissionChanges] = useState<PermissionChange[]>([]);
  
  // Estados para edição de dados do usuário
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    is_active: user.is_active
  });
  const [originalUserData, setOriginalUserData] = useState({
    name: user.name,
    email: user.email,
    is_active: user.is_active
  });
  const [hasUserDataChanges, setHasUserDataChanges] = useState(false);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  
  // Estado da aba ativa
  const [activeTab, setActiveTab] = useState('permissions');

  // Carregar dados quando o modal abrir
  useEffect(() => {
    if (isOpen && user.id && unitId) {
      loadUserData();
    }
  }, [isOpen, user.id, unitId]);

  // Limpar dados quando fechar
  useEffect(() => {
    if (!isOpen) {
      resetData();
    }
  }, [isOpen]);

  // Atualizar dados do usuário quando mudarem os props
  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      is_active: user.is_active
    });
    setOriginalUserData({
      name: user.name,
      email: user.email,
      is_active: user.is_active
    });
  }, [user]);

  // Verificar alterações nos dados do usuário
  useEffect(() => {
    const hasChanges = 
      userData.name !== originalUserData.name ||
      userData.email !== originalUserData.email ||
      userData.is_active !== originalUserData.is_active;
    setHasUserDataChanges(hasChanges);
  }, [userData, originalUserData]);

  // Funções para gerenciar dados do usuário
  const handleUserDataChange = (field: keyof typeof userData, value: string | boolean) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateUser = async () => {
    setIsUpdatingUser(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: userData.name,
          email: userData.email,
          is_active: userData.is_active
        })
        .eq('id', user.id);

      if (error) throw error;

      setOriginalUserData(userData);
      setHasUserDataChanges(false);
      
      toast({
        title: "Usuário atualizado",
        description: "Os dados do usuário foram atualizados com sucesso.",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar os dados do usuário. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const resetUserData = () => {
    setUserData(originalUserData);
    setHasUserDataChanges(false);
  };

  const loadUserData = async () => {
    try {
      // Carregar módulos disponíveis na unidade
      const modulesResult = await getAvailableModules(unitId);
      if (modulesResult.success) {
        setAvailableModules(modulesResult.data);
      }

      // Carregar permissões atuais do usuário
      const permissionsResult = await getUserModulePermissions(user.id, unitId);
      if (permissionsResult.success) {
        setCurrentPermissions(permissionsResult.data);
        
        // Criar mapa de permissões atuais
        const currentPermissionsMap: { [key: string]: boolean } = {};
        permissionsResult.data.forEach(permission => {
          currentPermissionsMap[permission.module_id] = permission.is_active;
        });
        
        // Para módulos disponíveis que não têm permissão, assumir false
        modulesResult.data.forEach(module => {
          if (!(module.id in currentPermissionsMap)) {
            currentPermissionsMap[module.id] = false;
          }
        });
        
        setNewPermissions(currentPermissionsMap);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  const resetData = () => {
    setAvailableModules([]);
    setCurrentPermissions([]);
    setNewPermissions({});
    setIsSubmitting(false);
    setHasChanges(false);
    setPermissionChanges([]);
    // Reset user data
    setUserData({
      name: user.name,
      email: user.email,
      is_active: user.is_active
    });
    setHasUserDataChanges(false);
    setActiveTab('permissions');
  };

  const handlePermissionToggle = (moduleId: string) => {
    setNewPermissions(prev => {
      const newValue = !prev[moduleId];
      const updated = { ...prev, [moduleId]: newValue };
      
      // Verificar mudanças
      checkForChanges(updated);
      
      return updated;
    });
  };

  const checkForChanges = (updatedPermissions: { [key: string]: boolean }) => {
    const changes: PermissionChange[] = [];
    
    availableModules.forEach(module => {
      const currentStatus = currentPermissions.find(p => p.module_id === module.id)?.is_active || false;
      const newStatus = updatedPermissions[module.id] || false;
      
      if (currentStatus !== newStatus) {
        changes.push({
          moduleId: module.id,
          moduleName: module.display_name,
          oldStatus: currentStatus,
          newStatus: newStatus
        });
      }
    });
    
    setPermissionChanges(changes);
    setHasChanges(changes.length > 0);
  };

  const handleSave = async () => {
    if (!hasChanges) return;
    
    setIsSubmitting(true);
    
    try {
      // Converter para formato esperado pelo hook
      const modulePermissions = Object.entries(newPermissions).map(([moduleId, isActive]) => ({
        moduleId,
        isActive
      }));
      
      const result = await updateUserPermissions(user.id, unitId, modulePermissions);
      
      if (result.success) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Erro ao salvar permissões:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    // Resetar para permissões originais
    const originalPermissions: { [key: string]: boolean } = {};
    currentPermissions.forEach(permission => {
      originalPermissions[permission.module_id] = permission.is_active;
    });
    
    // Para módulos disponíveis que não têm permissão, assumir false
    availableModules.forEach(module => {
      if (!(module.id in originalPermissions)) {
        originalPermissions[module.id] = false;
      }
    });
    
    setNewPermissions(originalPermissions);
    setHasChanges(false);
    setPermissionChanges([]);
  };

  // Agrupar módulos por categoria
  const modulesByCategory = availableModules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, ModuleOption[]>);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'core': '🏠 Essencial',
      'atendimento': '👥 Atendimento',
      'financeiro': '💰 Financeiro',
      'gestao': '⚙️ Gestão',
      'marketing': '📢 Marketing',
      'educacao': '🎓 Educação',
      'rh': '👤 Recursos Humanos'
    };
    return labels[category] || category;
  };

  const getChangeTypeIcon = (change: PermissionChange) => {
    if (change.newStatus && !change.oldStatus) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (!change.newStatus && change.oldStatus) {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  const getChangeTypeText = (change: PermissionChange) => {
    if (change.newStatus && !change.oldStatus) {
      return "Conceder acesso";
    } else if (!change.newStatus && change.oldStatus) {
      return "Remover acesso";
    }
    return "";
  };

  const getCurrentPermissionForModule = (moduleId: string) => {
    return currentPermissions.find(p => p.module_id === moduleId)?.is_active || false;
  };

  const activeModulesCount = Object.values(newPermissions).filter(Boolean).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <span>Gerenciar Usuário</span>
          </DialogTitle>
          <DialogDescription>
            Edite os dados do usuário e configure as permissões de módulo na unidade selecionada
          </DialogDescription>
          <div className="flex items-center space-x-4 pt-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span><strong>{user.name}</strong> ({user.email})</span>
              <Badge variant={user.is_active ? 'default' : 'secondary'}>
                {user.is_active ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="h-4 w-4" />
              <span>Unidade: <strong>{unitName}</strong></span>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user-data" className="flex items-center space-x-2">
              <UserCog className="h-4 w-4" />
              <span>Dados do Usuário</span>
              {hasUserDataChanges && (
                <Badge variant="destructive" className="ml-2 h-4 w-4 p-0 flex items-center justify-center">
                  !
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center space-x-2">
              <KeyRound className="h-4 w-4" />
              <span>Permissões</span>
              {hasChanges && (
                <Badge variant="destructive" className="ml-2 h-4 w-4 p-0 flex items-center justify-center">
                  {permissionChanges.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Aba de Dados do Usuário */}
          <TabsContent value="user-data" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Formulário de Edição */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <UserCog className="h-5 w-5 text-blue-600" />
                      <span>Informações do Usuário</span>
                    </CardTitle>
                    <CardDescription>
                      Edite os dados básicos do usuário
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        value={userData.name}
                        onChange={(e) => handleUserDataChange('name', e.target.value)}
                        placeholder="Digite o nome completo"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        onChange={(e) => handleUserDataChange('email', e.target.value)}
                        placeholder="Digite o e-mail"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={userData.is_active}
                        onCheckedChange={(checked) => handleUserDataChange('is_active', checked)}
                      />
                      <Label htmlFor="is_active">Usuário ativo</Label>
                      <Badge variant={userData.is_active ? 'default' : 'secondary'}>
                        {userData.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>

                    {!userData.is_active && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Usuários inativos não poderão fazer login no sistema.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Resumo e Ações */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Nome:</span>
                      <Badge variant="outline">{userData.name || 'Sem nome'}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">E-mail:</span>
                      <Badge variant="outline" className="text-xs max-w-[120px] truncate">
                        {userData.email || 'Sem e-mail'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge variant={userData.is_active ? 'default' : 'secondary'}>
                        {userData.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Alterações:</span>
                      <Badge variant={hasUserDataChanges ? 'destructive' : 'secondary'}>
                        {hasUserDataChanges ? 'Pendente' : 'Salvo'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {hasUserDataChanges && (
                  <div className="space-y-2">
                    <Button
                      onClick={handleUpdateUser}
                      disabled={isUpdatingUser}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isUpdatingUser ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Dados
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetUserData}
                      disabled={isUpdatingUser}
                      className="w-full"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Resetar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Aba de Permissões */}
          <TabsContent value="permissions" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[50vh]">
              {/* Coluna Principal - Permissões */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Módulos Disponíveis</span>
                      <Badge variant="outline">
                        {Object.values(newPermissions).filter(Boolean).length} de {availableModules.length} ativos
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Configure quais módulos o usuário pode acessar nesta unidade
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ScrollArea className="h-[350px] pr-4">
                      <div className="space-y-4">
                        {Object.keys(modulesByCategory).map(category => (
                          <div key={category} className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-medium text-gray-700">
                                {getCategoryLabel(category)}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {modulesByCategory[category].length} módulos
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3 pl-4">
                              {modulesByCategory[category].map(module => {
                                const isCurrentlyActive = newPermissions[module.id] || false;
                                const wasActive = getCurrentPermissionForModule(module.id);
                                const hasChanged = isCurrentlyActive !== wasActive;
                                
                                return (
                                  <div 
                                    key={module.id} 
                                    className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                                      isCurrentlyActive
                                        ? 'border-blue-200 bg-blue-50'
                                        : 'border-gray-200'
                                    } ${
                                      hasChanged ? 'ring-2 ring-yellow-200' : ''
                                    }`}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <Switch
                                        checked={isCurrentlyActive}
                                        onCheckedChange={() => handlePermissionToggle(module.id)}
                                      />
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">
                                          {module.display_name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {module.name}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      {hasChanged && (
                                        <Badge variant="outline" className="text-xs">
                                          {isCurrentlyActive ? 'Novo' : 'Removido'}
                                        </Badge>
                                      )}
                                      {isCurrentlyActive && (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Coluna Lateral - Resumo e Alterações */}
              <div className="space-y-4">
                {/* Resumo Atual */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Resumo</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Módulos ativos:</span>
                      <Badge variant="default">{Object.values(newPermissions).filter(Boolean).length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total disponível:</span>
                      <Badge variant="outline">{availableModules.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Alterações:</span>
                      <Badge variant={hasChanges ? "destructive" : "secondary"}>
                        {permissionChanges.length}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Alterações Pendentes */}
                {hasChanges && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <History className="h-4 w-4" />
                        <span>Alterações</span>
                      </CardTitle>
                      <CardDescription>
                        Revise as mudanças antes de salvar
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[150px]">
                        <div className="space-y-2">
                          {permissionChanges.map((change, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 rounded bg-gray-50">
                              {getChangeTypeIcon(change)}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 truncate">
                                  {change.moduleName}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {getChangeTypeText(change)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}

                {/* Aviso para usuário inativo */}
                {!userData.is_active && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Este usuário está <strong>inativo</strong>. As permissões não terão efeito até que o usuário seja reativado.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Botões de Ação - Apenas para permissões */}
                {hasChanges && (
                  <div className="space-y-2">
                    <Button
                      onClick={handleSave}
                      disabled={!hasChanges || isSubmitting || isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Permissões ({permissionChanges.length})
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Resetar Permissões
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        <DialogFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting || isUpdatingUser}
          >
            Fechar
          </Button>
          
          <div className="text-sm text-gray-500">
            {hasUserDataChanges && (
              <span className="text-yellow-600">Dados alterados • </span>
            )}
            {hasChanges && (
              <span className="text-blue-600">{permissionChanges.length} permissões alteradas</span>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
