import { useEffect, useMemo, useState } from 'react';
import { getUserAssignment } from '@/lib/serverCalls';
import { AssignmentEvaluation } from '@/types';
import { useSubmissions } from '@/hooks/useSubmissions.ts';

export const useEvaluate = (userId: number, assignmentId: number) => {
  const [assignmentEvaluation, setAssignmentEvaluation] = useState<AssignmentEvaluation>();
  const [isAssignmentEvaluationLoading, setIsAssignmentEvaluationLoading] = useState(true);

  const { submissions, isSubmissionsLoading } = useSubmissions();

  useEffect(() => {
    let isSubscribed = true;
    const fetchAssignmentEvaluation = async () => {
      if (!userId || !assignmentId) return;
      setIsAssignmentEvaluationLoading(true);
      try {
        const fetchedAssignmentEvaluation = await getUserAssignment(userId, assignmentId);
        if (!isSubscribed) return;
        setAssignmentEvaluation(fetchedAssignmentEvaluation);
      } catch (error) {
        console.error('Error fetching assignment:', error);
      } finally {
        setIsAssignmentEvaluationLoading(false);
      }
    };

    fetchAssignmentEvaluation();

    return () => {
      isSubscribed = false;
    };
  }, [assignmentId, userId]);

  const currentSubmission = useMemo(
    () =>
      submissions.find((submission) => submission.assignment.id === assignmentId && submission.student.id === userId),
    [submissions, assignmentId, userId],
  );

  return {
    currentSubmission,
    assignmentEvaluation,
    isEvaluateInfoLoading: isAssignmentEvaluationLoading || isSubmissionsLoading,
  };
};
