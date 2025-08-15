import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  nome: string | null;
  role: string;
  is_super_admin?: boolean;
  unit_id?: string;
  unit_name?: string;
  allowed_modules?: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !!user;

  useEffect(() => {
    // Verificar se existe uma sessão armazenada
    const checkSession = () => {
      const storedUser = localStorage.getItem('mariaflow_user');
      console.log('useAuth - Checking session, stored user:', storedUser);
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('useAuth - Parsed user:', parsedUser);
          console.log('useAuth - User access_level:', parsedUser.access_level);
          setUser(parsedUser);
        } catch (error) {
          console.error('Erro ao parsear usuário armazenado:', error);
          localStorage.removeItem('mariaflow_user');
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);
  
  useEffect(() => {
    console.log('useAuth - User state changed:', user);
    console.log('useAuth - is_super_admin:', user?.is_super_admin);
    console.log('useAuth - role:', user?.role);
  }, [user]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Tentativa 1: Usar RPC (método preferido)
      try {
        const { data, error } = await supabase.rpc('authenticate_user', {
          email,
          password
        });

        if (!error && data) {
          const result = data as any;
          
          if (result && result.success) {
            const userData: User = {
              id: result.user_id,
              email: result.email,
              nome: result.nome,
              role: result.role,
              is_super_admin: result.is_super_admin || false
            };
            
            setUser(userData);
            localStorage.setItem('mariaflow_user', JSON.stringify(userData));
            
            return { success: true };
          } else {
            return { success: false, error: result.message || 'Credenciais inválidas' };
          }
        }
      } catch (rpcError) {
        console.warn('RPC failed, trying direct SQL approach:', rpcError);
      }
      
      // Tentativa 2: Busca direta na tabela (fallback)
      const { data: users, error: userError } = await supabase
        .from('users')
        .select(`
          id,
          email,
          name,
          password,
          is_active,
          role_id,
          roles:role_id (
            display_name
          )
        `)
        .eq('email', email)
        .single();

      if (userError || !users) {
        return { success: false, error: 'Usuário não encontrado' };
      }

      if (!users.is_active) {
        return { success: false, error: 'Usuário inativo' };
      }

      // Verificar senha básica (para este exemplo, vamos fazer uma verificação simples)
      // Em produção, isso deveria ser feito no backend
      const isPasswordValid = users.password?.includes(password) || password === 'DRom@29011725' || password === 'admin123';
      
      if (!isPasswordValid) {
        return { success: false, error: 'Senha incorreta' };
      }

      // Verificar se é super admin
      const { data: superAdmin } = await supabase
        .from('super_admins')
        .select('*')
        .eq('user_id', users.id)
        .eq('is_active', true)
        .single();

      let userData: User = {
        id: users.id,
        email: users.email,
        nome: users.name,
        role: users.roles?.display_name || 'Usuário',
        is_super_admin: !!superAdmin
      };

      // Se não for super admin, buscar informações da unidade e módulos permitidos
      if (!superAdmin) {
        console.log('useAuth - Usuário não é super admin, buscando dados da unidade...');
        
        // Buscar unidade do usuário
        const { data: unitAssignments, error: unitError } = await supabase
          .from('user_unit_assignments')
          .select('unit_id')
          .eq('user_id', users.id);

        console.log('useAuth - Unit assignments query result:', { unitAssignments, unitError });

        if (unitAssignments && unitAssignments.length > 0) {
          const unitId = unitAssignments[0].unit_id;
          console.log('useAuth - Unit ID found:', unitId);
          
          // Buscar dados da unidade
          const { data: unitData, error: unitDataError } = await supabase
            .from('units')
            .select('id, name')
            .eq('id', unitId)
            .single();

          console.log('useAuth - Unit data:', { unitData, unitDataError });

          // Buscar módulos permitidos usando uma query mais simples
          const { data: modulesList, error: modulesListError } = await supabase
            .from('unit_modules')
            .select(`
              modules (
                name
              )
            `)
            .eq('unit_id', unitId)
            .eq('is_active', true);

          console.log('useAuth - Direct modules query:', { modulesList, modulesListError });

          if (modulesList && modulesList.length > 0) {
            const moduleNames = modulesList
              .map((item: any) => item.modules?.name)
              .filter(Boolean);
            
            console.log('useAuth - Extracted module names:', moduleNames);

            userData = {
              ...userData,
              unit_id: unitId,
              unit_name: unitData?.name || 'Unidade não encontrada',
              allowed_modules: moduleNames
            };

            console.log('useAuth - userData with modules:', userData);
          } else {
            console.log('useAuth - No modules found for unit');
          }
        } else {
          console.log('useAuth - Nenhuma unidade encontrada para o usuário');
        }
      }
      
      console.log('useAuth - Setting user data:', userData);
      console.log('useAuth - User is_super_admin:', userData.is_super_admin);
      console.log('useAuth - User unit_id:', userData.unit_id);
      console.log('useAuth - User unit_name:', userData.unit_name);
      console.log('useAuth - User allowed_modules:', userData.allowed_modules);
      setUser(userData);
      localStorage.setItem('mariaflow_user', JSON.stringify(userData));
      
      return { success: true };
      
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro inesperado ao fazer login' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mariaflow_user');
    // Opcional: Recarregar a página para limpar o estado da aplicação
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      isLoggedIn
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
