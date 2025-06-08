import { Assignment } from '@/types';

const AI_CREATOR_USER_ID = 1019;

export const isAssignmentByAI = (assignment: Assignment) => {
  return assignment.creator.id === AI_CREATOR_USER_ID;
};
