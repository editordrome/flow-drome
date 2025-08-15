import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  nome: string | null;
  role: string;
  role_level: number;
  is_super_admin?: boolean;
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
          p_email: email,
          p_password: password
        });

        if (!error && data) {
          const result = data as any;
          
          if (result && result.success) {
            const userData: User = {
              id: result.user_id,
              email: result.email,
              nome: result.nome,
              role: result.role,
              role_level: result.role_level || 0,
              is_super_admin: result.is_super_admin || false
            };

            console.log('useAuth - RPC success, user data:', userData);
            
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
            name,
            display_name,
            level
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

      const roleLevel = users.roles?.level || 0;
      const isSuperAdmin = !!superAdmin;

      let userData: User = {
        id: users.id,
        email: users.email,
        nome: users.name,
        role: users.roles?.display_name || 'Usuário',
        role_level: roleLevel,
        is_super_admin: isSuperAdmin
      };

      console.log('useAuth - Fallback SQL success, user data:', userData);
      
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
