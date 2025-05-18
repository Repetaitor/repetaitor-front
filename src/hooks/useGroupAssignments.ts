import { Assignment } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { createNewAssignment, getGroupAssignments } from '@/lib/serverCalls/assignmentCalls.ts';

export const useGroupAssignments = (groupId?: number) => {
  const [groupAssignments, setGroupAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    let isSubscribed = true;
    const fetchAssignments = async () => {
      if (!groupId) return;
      try {
        const fetchedAssignments = await getGroupAssignments(groupId); // Replace with actual group ID
        if (isSubscribed) setGroupAssignments(fetchedAssignments);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };
    fetchAssignments();
    return () => {
      isSubscribed = false;
    };
  }, [groupId]);

  const addAssignment = useCallback(
    async (essayId: number, dueDate: Date, instructions?: string) => {
      if (!groupId) return;
      const newAss = await createNewAssignment(groupId, essayId, dueDate, instructions);
      setGroupAssignments((prev) => [...prev, newAss]);
    },
    [groupId],
  );

  return { groupAssignments, addAssignment };
};
