import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserManagement } from '@/hooks/useUserManagement';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserPlus, 
  Mail, 
  User, 
  Lock, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  UserCog,
  KeyRound,
  Shield,
  Save,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
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

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  selectedModules: string[];
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  modules?: string;
}

export function UserCreationModal({ isOpen, onClose, unitId, unitName, onSuccess }: UserCreationModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { createAttendant, getAvailableModules, isLoading } = useUserManagement();
  
  // Estados para dados do usuário
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    selectedModules: []
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para permissões
  const [availableModules, setAvailableModules] = useState<ModuleOption[]>([]);
  
  // Estado da aba ativa
  const [activeTab, setActiveTab] = useState('user-data');

  // Carregar módulos disponíveis quando o modal abrir
  useEffect(() => {
    if (isOpen && unitId) {
      loadAvailableModules();
    }
  }, [isOpen, unitId]);

  // Limpar formulário quando fechar
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const loadAvailableModules = async () => {
    console.log('🔄 UserCreationModal.loadAvailableModules - Iniciando para unitId:', unitId);
    const result = await getAvailableModules(unitId);
    console.log('📦 UserCreationModal.loadAvailableModules - Resultado:', result);
    if (result.success) {
      console.log('✅ UserCreationModal.loadAvailableModules - Módulos carregados:', result.data.length);
      setAvailableModules(result.data);
    } else {
      console.error('❌ UserCreationModal.loadAvailableModules - Erro:', result.error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      selectedModules: []
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsSubmitting(false);
    setActiveTab('user-data');
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido';
    }

    // Validar senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Validar confirmação de senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    // Validar seleção de módulos
    if (formData.selectedModules.length === 0) {
      newErrors.modules = 'Selecione pelo menos um módulo para o atendente';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleModuleToggle = (moduleId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedModules: prev.selectedModules.includes(moduleId)
        ? prev.selectedModules.filter(id => id !== moduleId)
        : [...prev.selectedModules, moduleId]
    }));

    // Limpar erro de módulos se algum for selecionado
    if (errors.modules) {
      setErrors(prev => ({ ...prev, modules: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user?.id) return;

    setIsSubmitting(true);

    try {
      const result = await createAttendant(
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          selectedModules: formData.selectedModules
        },
        unitId,
        user.id
      );

      if (result.success) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Erro ao criar atendente:', error);
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            <span>Criar Novo Atendente</span>
          </DialogTitle>
          <DialogDescription>
            Criar um novo usuário atendente para <strong>{unitName}</strong> e configurar suas permissões
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user-data" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Dados Pessoais</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Permissões</span>
              {formData.selectedModules.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-4 w-4 p-0 flex items-center justify-center">
                  {formData.selectedModules.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Aba de Dados Pessoais */}
          <TabsContent value="user-data" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Coluna Principal - Formulário */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span>Dados Pessoais</span>
                    </CardTitle>
                    <CardDescription>
                      Preencha as informações básicas do atendente
                    </CardDescription>
                  </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Ex: João Silva"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-600 flex items-center space-x-1">
                            <AlertCircle className="h-3 w-3" />
                            <span>{errors.name}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="joao@email.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-sm text-red-600 flex items-center space-x-1">
                            <AlertCircle className="h-3 w-3" />
                            <span>{errors.email}</span>
                          </p>
                        )}
                      </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Mínimo 6 caracteres"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>{errors.password}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Repita a senha"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>{errors.confirmPassword}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coluna Lateral - Resumo Dados Pessoais */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="sticky top-0">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span>Resumo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-gray-500">Unidade:</span>
                      <Badge variant="outline" className="text-xs justify-start">
                        {unitName}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-gray-500">Nome:</span>
                      <Badge variant={formData.name ? 'default' : 'secondary'} className="text-xs justify-start">
                        {formData.name || 'Não informado'}
                      </Badge>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-gray-500">Email:</span>
                      <Badge variant={formData.email ? 'default' : 'secondary'} className="text-xs justify-start truncate">
                        {formData.email || 'Não informado'}
                      </Badge>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-gray-500">Senha:</span>
                      <Badge variant={formData.password ? 'default' : 'secondary'} className="text-xs justify-start">
                        {formData.password ? 'Definida' : 'Não definida'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Aba de Permissões */}
        <TabsContent value="permissions" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[50vh]">
            {/* Coluna Principal - Permissões */}
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-blue-600" />
                      <span>Permissões de Módulos</span>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {formData.selectedModules.length} de {availableModules.length} selecionados
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Selecione os módulos que o atendente poderá acessar. Você pode alterar isso depois.
                  </CardDescription>
                  {errors.modules && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.modules}</AlertDescription>
                    </Alert>
                  )}
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
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                            {modulesByCategory[category].map(module => (
                              <div 
                                key={module.id} 
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                                  formData.selectedModules.includes(module.id)
                                    ? 'border-blue-200 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <Switch
                                    checked={formData.selectedModules.includes(module.id)}
                                    onCheckedChange={() => handleModuleToggle(module.id)}
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
                                
                                {formData.selectedModules.includes(module.id) && (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Coluna Lateral - Resumo Permissões */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="sticky top-0">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-blue-600" />
                    <span>Permissões</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-gray-500">Total disponível:</span>
                      <Badge variant="outline" className="text-xs justify-start">
                        {availableModules.length} módulos
                      </Badge>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-gray-500">Selecionados:</span>
                      <Badge variant={formData.selectedModules.length > 0 ? 'default' : 'secondary'} className="text-xs justify-start">
                        {formData.selectedModules.length} módulos
                      </Badge>
                    </div>
                  </div>

                  {formData.selectedModules.length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <h4 className="text-xs font-medium text-gray-700 mb-2">Módulos Selecionados:</h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {formData.selectedModules.map(moduleId => {
                          const module = availableModules.find(m => m.id === moduleId);
                          return module ? (
                            <div key={moduleId} className="flex items-center justify-between text-xs">
                              <span className="text-gray-600 truncate">{module.display_name}</span>
                              <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0 ml-1" />
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Criando...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Criar Atendente
            </>
          )}
        </Button>
      </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
