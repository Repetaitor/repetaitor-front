import { AssignmentWithCompletion } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { createNewAssignment, deleteAssignment, getGroupAssignments } from '@/lib/serverCalls/assignmentCalls.ts';

export const useGroupAssignments = (groupId?: number) => {
  const [groupAssignments, setGroupAssignments] = useState<AssignmentWithCompletion[]>([]);
  const [isLoadingGroupAssignments, setIsLoadingGroupAssignments] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    const fetchAssignments = async () => {
      try {
        if (!groupId) return;
        setIsLoadingGroupAssignments(true);
        const fetchedAssignments = await getGroupAssignments(groupId); // Replace with actual group ID
        if (isSubscribed) setGroupAssignments(fetchedAssignments);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        if (isSubscribed) setIsLoadingGroupAssignments(false);
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
      setGroupAssignments((prev) => [...prev, { ...newAss, completedPercentage: 0 }]);
    },
    [groupId],
  );

  const removeAssignment = useCallback(
    async (assignmentId: number) => {
      if (!groupId) return;
      try {
        setIsLoadingGroupAssignments(true);
        await deleteAssignment(assignmentId);
        setGroupAssignments((prev) => prev.filter((assignment) => assignment.id !== assignmentId));
      } catch (error) {
        console.error('Error deleting assignment:', error);
      } finally {
        setIsLoadingGroupAssignments(false);
      }
    },
    [groupId],
  );

  return { groupAssignments, addAssignment, isLoadingGroupAssignments, removeAssignment };
};
