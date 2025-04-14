import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { signIn } from '@/lib/serverCalls';
import { User } from '@/types';

interface AuthContextProps {
  activeUser: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const { user, jwtToken } = await signIn(email, password);
    if (!user || !jwtToken) {
      throw new Error('Invalid login credentials');
    }
    setActiveUser(user);
    setAccessToken(jwtToken);
  }, []);

  const logout = useCallback(() => {
    setActiveUser(null);
  }, []);

  return <AuthContext.Provider value={{ activeUser, accessToken, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
