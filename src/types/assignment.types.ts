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
