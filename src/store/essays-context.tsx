import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Essay } from '@/types';
import { useAuthContext } from '@/store';

interface EssaysContextType {
  essays: Essay[];
  essaysLoading: boolean;
  createNewEssay: (title: string) => Promise<void>;
  refetchEssays: () => Promise<void>;
  removeEssay: (essayId: number) => Promise<void>;
}

const EssaysContext = createContext<EssaysContextType | undefined>(undefined);

export const EssaysProvider = ({ children }: { children: ReactNode }) => {
  const { activeUser } = useAuthContext();

  const [essays, setEssays] = useState<Essay[]>([]);
  const [essaysLoading, setEssaysLoading] = useState(true);

  const fetchEssays = useCallback(async () => {
    setEssaysLoading(true);
    try {
    } catch (error) {
      console.error('Error fetching essays:', error);
    } finally {
      setEssaysLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEssays();
  }, [fetchEssays, activeUser]);

  const createNewEssay = useCallback(async (title: string) => {}, []);

  const removeEssay = useCallback(async (essayId: number) => {}, []);

  return (
    <EssaysContext.Provider
      value={{
        essays,
        essaysLoading,
        createNewEssay,
        refetchEssays: fetchEssays,
        removeEssay,
      }}
    >
      {children}
    </EssaysContext.Provider>
  );
};

export const useEssaysContext = () => {
  const context = useContext(EssaysContext);
  if (!context) {
    throw new Error('useEssaysContext must be used within an EssaysProvider');
  }
  return context;
};
