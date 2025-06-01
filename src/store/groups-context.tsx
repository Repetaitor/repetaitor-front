import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Group, UserRole } from '@/types';
import { addStudentToGroup, createGroup, deleteGroup, getStudentGroup, getTeacherGroups } from '@/lib/serverCalls';
import { useAuthContext } from '@/store';

interface GroupsContextType {
  groups: Group[];
  studentGroup: Group | undefined;
  groupsLoading: boolean;
  createNewGroup: (groupName: string) => Promise<void>;
  refetchTeacherGroups: () => Promise<void>;
  removeGroup: (groupId: number) => Promise<void>;
  joinGroup: (groupCode: string) => Promise<Group>;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export const GroupsProvider = ({ children }: { children: ReactNode }) => {
  const { activeUser } = useAuthContext();

  const [groups, setGroups] = useState<Group[]>([]);
  const [studentGroup, setStudentGroup] = useState<Group>();
  const [groupsLoading, setGroupsLoading] = useState(true);

  const fetchTeacherGroups = useCallback(async () => {
    if (!activeUser || activeUser.role !== UserRole.TEACHER) return;
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
  }, [activeUser]);

  useEffect(() => {
    fetchTeacherGroups();
  }, [fetchTeacherGroups]);

  const createNewGroup = useCallback(async (groupName: string) => {
    const newGroup = await createGroup(groupName);
    setGroups((prev) => [...prev, newGroup]);
  }, []);

  const removeGroup = useCallback(async (groupId: number) => {
    await deleteGroup(groupId);
    setGroups((prev) => prev.filter((group) => group.id !== groupId));
  }, []);

  const fetchStudentGroup = useCallback(async () => {
    if (!activeUser || activeUser.role !== UserRole.STUDENT) return;
    setGroupsLoading(true);
    try {
      const fetchedGroups = await getStudentGroup();
      setStudentGroup(fetchedGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setStudentGroup(undefined);
    } finally {
      setGroupsLoading(false);
    }
  }, [activeUser]);

  useEffect(() => {
    fetchStudentGroup();
  }, [fetchStudentGroup]);

  const joinGroup = useCallback(
    async (groupCode: string) => {
      if (!activeUser || activeUser.role !== UserRole.STUDENT) throw new Error('User is not a student');

      await addStudentToGroup(groupCode);
      const fetchedGroups = await getStudentGroup();
      setStudentGroup(fetchedGroups);
      return fetchedGroups;
    },
    [activeUser],
  );

  return (
    <GroupsContext.Provider
      value={{
        groups,
        studentGroup,
        groupsLoading,
        createNewGroup,
        refetchTeacherGroups: fetchTeacherGroups,
        removeGroup,
        joinGroup,
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
