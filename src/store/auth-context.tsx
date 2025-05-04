import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { meAuth, signIn, signOut } from '@/lib/serverCalls';
import { User } from '@/types';

interface AuthContextProps {
  activeUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [activeUser, setActiveUser] = useState<User | null>(null);

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
      try {
        const user = await meAuth();
        if (isSubscribed) setActiveUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    tryLogin();
    return () => {
      isSubscribed = false;
    };
  }, []);

  return <AuthContext.Provider value={{ activeUser, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
