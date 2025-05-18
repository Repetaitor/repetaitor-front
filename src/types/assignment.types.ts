import { Essay } from '@/types/essay.types.ts';
import { User } from '@/types/user.types.ts';

export type Assignment = {
  id: number;
  instructions: string;
  groupId: number;
  essay: Essay;
  creator: User;
  creationTime: Date;
  dueDate: Date;
};

export enum AssignmentStatus {
  Complete = 'Complete',
  InProgress = 'In Progress',
  Pending = 'Pending',
}

export type AssignmentStatusType = {
  id: number;
  name: AssignmentStatus;
};

export type StudentAssignment = {
  student: User;
  status: AssignmentStatusType;
  assignment: Assignment;
  isEvaluated: boolean;
  submitDate: Date;
  totalScore: number;
  actualWordCount: number;
};

export type AssignmentEvaluation = {
  assignmentId: number;
  assignDate: Date;
  userId: number;
  status: AssignmentStatusType;
  text: string;
  wordCount: number;
  isEvaluated: boolean;
  grammarScore: number;
  fluencyScore: number;
  generalComments: string[];
  evaluationComments: string[];
  feedbackSeen: boolean;
};

export enum EvaluationCommentStatus {
  Strength = 1,
  Suggestion = 2,
  Improvement = 3,
}

export type EvaluationComment = {
  statusId: EvaluationCommentStatus;
  comment: string;
};

export type EvaluationTextComment = EvaluationComment & {
  startIndex: number;
  endIndex: number;
};
