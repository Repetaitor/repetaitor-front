import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Group } from '@/types';
import { createGroup, deleteGroup, getTeacherGroups } from '@/lib/serverCalls';
import { useAuthContext } from '@/store';

interface GroupsContextType {
  groups: Group[];
  groupsLoading: boolean;
  createNewGroup: (groupName: string) => Promise<void>;
  refetchGroups: () => Promise<void>;
  removeGroup: (groupId: number) => Promise<void>;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export const GroupsProvider = ({ children }: { children: ReactNode }) => {
  const { activeUser } = useAuthContext();

  const [groups, setGroups] = useState<Group[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(true);

  const fetchGroups = useCallback(async () => {
    setGroupsLoading(true);
    try {
      const fetchedGroups = await getTeacherGroups();
      setGroups(fetchedGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroups([]);
    } finally {
      setGroupsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups, activeUser]);

  const createNewGroup = useCallback(async (groupName: string) => {
    const newGroup = await createGroup(groupName);
    setGroups((prev) => [...prev, newGroup]);
  }, []);

  const removeGroup = useCallback(async (groupId: number) => {
    await deleteGroup(groupId);
    setGroups((prev) => prev.filter((group) => group.id !== groupId));
  }, []);

  return (
    <GroupsContext.Provider
      value={{
        groups,
        groupsLoading,
        createNewGroup,
        refetchGroups: fetchGroups,
        removeGroup,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
};

export const useGroupsContext = () => {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error('useGroupsContext must be used within a GroupsProvider');
  }
  return context;
};
