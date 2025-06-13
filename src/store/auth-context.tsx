import { signIn, signOut } from '@/lib/serverCalls';
import { NavigationRoute, User } from '@/types';
import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextProps {
  activeUser: User | null;
  setActiveUser: Dispatch<SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [activeUser, setActiveUser] = useState<User | null>(null);

  const navigate = useNavigate();

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
    navigate(NavigationRoute.LANDING);
  }, [navigate]);

  return <AuthContext.Provider value={{ activeUser, setActiveUser, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
