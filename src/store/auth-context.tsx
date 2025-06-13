import { meAuth, signIn, signOut } from '@/lib/serverCalls';
import { NavigationRoute, User } from '@/types';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface AuthContextProps {
  activeUser: User | null;
  setActiveUser: Dispatch<SetStateAction<User | null>>;
  isLoginLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    let isSubscribed = true;

    const tryLogin = async () => {
      setIsLoginLoading(true);
      try {
        const user = await meAuth();
        if (isSubscribed) setActiveUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
        if (!isSubscribed) return;
        setActiveUser(null);
        if (
          ![
            NavigationRoute.LANDING,
            NavigationRoute.LOGIN,
            NavigationRoute.REGISTER,
            NavigationRoute.VERIFY_EMAIL,
          ].includes(location.pathname as NavigationRoute)
        ) {
          navigate(NavigationRoute.LANDING);
        }
      } finally {
        setIsLoginLoading(false);
      }
    };

    tryLogin();
    return () => {
      isSubscribed = false;
    };
  }, [location.pathname, navigate, setActiveUser]);

  return (
    <AuthContext.Provider value={{ activeUser, setActiveUser, isLoginLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
