import { useEffect, useState } from 'react';
import { StudentAssignment } from '@/types';
import { getNeedEvaluationAssignments } from '@/lib/serverCalls';

export const useSubmissions = () => {
  const [submissions, setSubmissions] = useState<StudentAssignment[]>([]);
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    const fetchSubmissions = async () => {
      setIsSubmissionsLoading(true);
      try {
        const fetchedAssignments = await getNeedEvaluationAssignments();
        if (!isSubscribed) return;
        setSubmissions(fetchedAssignments);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setIsSubmissionsLoading(false);
      }
    };

    fetchSubmissions();

    return () => {
      isSubscribed = false;
    };
  }, []);

  return { submissions, isSubmissionsLoading };
};
