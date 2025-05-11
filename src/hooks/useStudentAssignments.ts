import { useAuthContext } from '@/store';
import { useEffect, useState } from 'react';
import { StudentAssignment } from '@/types';
import { getStudentAssignments } from '@/lib/serverCalls';

export const useStudentAssignments = () => {
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [isAssignmentsLoading, setIsAssignmentsLoading] = useState(true);

  const { activeUser } = useAuthContext();

  useEffect(() => {
    let isSubscribed = true;
    const fetchAssignments = async () => {
      if (!activeUser) return;
      setIsAssignmentsLoading(true);
      try {
        const fetchedAssignments = await getStudentAssignments(activeUser.id);
        if (!isSubscribed) return;
        setAssignments(fetchedAssignments);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setIsAssignmentsLoading(false);
      }
    };

    fetchAssignments();

    return () => {
      isSubscribed = false;
    };
  }, [activeUser]);

  return { assignments, isAssignmentsLoading };
};
