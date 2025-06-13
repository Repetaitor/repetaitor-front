import { getPublicUserAssignments } from '@/lib/serverCalls/assignmentCalls';
import { StudentAssignment } from '@/types';
import { useEffect, useState } from 'react';

export const usePublicAssignments = (assignmentId?: number) => {
  const [publicAssignments, setPublicAssignments] = useState<StudentAssignment[]>([]);
  const [isPublicAssignmentsLoading, setIsPublicAssignmentsLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    const fetchPublicAssignments = async () => {
      try {
        setIsPublicAssignmentsLoading(true);
        if (!assignmentId) return;
        const assignments = await getPublicUserAssignments(assignmentId);
        if (!isSubscribed) return;
        console.log(assignments);
        setPublicAssignments(assignments);
      } catch (error) {
        console.error('Error fetching public assignments:', error);
      } finally {
        setIsPublicAssignmentsLoading(false);
      }
    };
    fetchPublicAssignments();

    return () => {
      isSubscribed = false;
    };
  }, [assignmentId]);

  return { publicAssignments, isPublicAssignmentsLoading };
};
