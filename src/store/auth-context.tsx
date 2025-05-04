import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { meAuth, signIn, signOut } from '@/lib/serverCalls';
import { User } from '@/types';

interface AuthContextProps {
  activeUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoginLoading: boolean;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    const user = await signIn(email, password);
    if (!user) {
      throw new Error('Invalid login credentials');
    }
    setActiveUser(user);
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setActiveUser(null);
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const tryLogin = async () => {
      setIsLoginLoading(true);
      try {
        const user = await meAuth();
        if (isSubscribed) setActiveUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoginLoading(false);
      }
    };

    tryLogin();
    return () => {
      isSubscribed = false;
    };
  }, []);

  return <AuthContext.Provider value={{ activeUser, login, logout, isLoginLoading }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
