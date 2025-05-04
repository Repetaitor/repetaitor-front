import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Essay } from '@/types';
import { useAuthContext } from '@/store';
import { addNewEssay, deleteEssay, getEssays, updateEssay } from '@/lib/serverCalls/essayCalls.ts';

interface EssaysContextType {
  essays: Essay[];
  essaysLoading: boolean;
  createNewEssay: (essayTitle: string, essayDescription: string, expectedWordCount: number) => Promise<void>;
  refetchEssays: () => Promise<void>;
  removeEssay: (essayId: number) => Promise<void>;
  editEssay: (
    essayId: number,
    essayTitle: string,
    essayDescription: string,
    expectedWordCount: number,
  ) => Promise<void>;
}

const EssaysContext = createContext<EssaysContextType | undefined>(undefined);

export const EssaysProvider = ({ children }: { children: ReactNode }) => {
  const { activeUser } = useAuthContext();

  const [essays, setEssays] = useState<Essay[]>([]);
  const [essaysLoading, setEssaysLoading] = useState(true);

  const fetchEssays = useCallback(async () => {
    setEssaysLoading(true);
    try {
      const fetchedEssays = await getEssays();
      setEssays(fetchedEssays);
    } catch (error) {
      console.error('Error fetching essays:', error);
      setEssays([]);
    } finally {
      setEssaysLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEssays();
  }, [fetchEssays, activeUser]);

  const createNewEssay = useCallback(
    async (essayTitle: string, essayDescription: string, expectedWordCount: number) => {
      const newEssay = await addNewEssay(essayTitle, essayDescription, expectedWordCount);
      setEssays((prevEssays) => [...prevEssays, newEssay]);
    },
    [],
  );

  const removeEssay = useCallback(async (essayId: number) => {
    await deleteEssay(essayId);
    setEssays((prevEssays) => prevEssays.filter((essay) => essay.id !== essayId));
  }, []);

  const editEssay = useCallback(
    async (essayId: number, essayTitle: string, essayDescription: string, expectedWordCount: number) => {
      const updatedEssay = await updateEssay(essayId, essayTitle, essayDescription, expectedWordCount);
      setEssays((prevEssays) => prevEssays.map((essay) => (essay.id === essayId ? updatedEssay : essay)));
    },
    [],
  );

  return (
    <EssaysContext.Provider
      value={{
        essays,
        essaysLoading,
        createNewEssay,
        refetchEssays: fetchEssays,
        removeEssay,
        editEssay,
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
