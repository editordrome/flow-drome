import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Building2, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function ConfiguracaoModulosModule() {
  const { user } = useAuth();

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
            <p>Você não tem permissão para acessar a configuração de módulos.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-6 w-6 text-purple-600" />
        <h1 className="text-2xl font-bold text-gray-900">Configuração de Módulos</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Configuração por Unidade
            </CardTitle>
            <CardDescription>
              Configure quais módulos estão disponíveis para cada unidade do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Para configurar módulos de uma unidade específica, acesse <strong>"Gestão de Unidades"</strong> 
              e clique em <strong>"Configurar Módulos"</strong> na unidade desejada.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">Como configurar:</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Acesse "Gestão de Unidades" no menu Super Admin</li>
                <li>2. Encontre a unidade que deseja configurar</li>
                <li>3. Clique em "Configurar Módulos"</li>
                <li>4. Use os toggles para ativar/desativar módulos</li>
                <li>5. As alterações são aplicadas imediatamente</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Módulos Disponíveis</CardTitle>
            <CardDescription>
              Lista de todos os módulos do sistema MariaFlow organizados por categoria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { category: 'Core', modules: ['Dashboard', 'Usuários'], color: 'red' },
                { category: 'Atendimento', modules: ['Agenda', 'Clientes', 'Pipeline', 'Tickets'], color: 'blue' },
                { category: 'Financeiro', modules: ['Financeiro', 'Cashback'], color: 'green' },
                { category: 'Gestão', modules: ['Profissionais', 'Materiais', 'Uniformes'], color: 'purple' },
                { category: 'Marketing', modules: ['Marketing', 'Publicações'], color: 'pink' },
                { category: 'Educação', modules: ['MariaUni', 'Base de Conhecimento'], color: 'indigo' },
                { category: 'RH', modules: ['Recrutadora'], color: 'orange' }
              ].map((category) => (
                <div key={category.category} className={`p-4 border rounded-lg bg-${category.color}-50 border-${category.color}-200`}>
                  <h3 className={`font-medium text-${category.color}-900 mb-2`}>{category.category}</h3>
                  <ul className={`text-sm text-${category.color}-700 space-y-1`}>
                    {category.modules.map((module) => (
                      <li key={module}>• {module}</li>
                    ))}
                  </ul>
                  {category.category === 'Core' && (
                    <p className={`text-xs text-${category.color}-600 mt-2 italic`}>
                      * Módulos essenciais não podem ser desativados
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
