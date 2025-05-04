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
