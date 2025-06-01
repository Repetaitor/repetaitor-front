import { User } from '@/types/user.types.ts';

export type Group = {
  id: number;
  owner: User;
  groupName: string;
  groupCode: string;
  studentsCount: number;
  createDate: Date;
};
