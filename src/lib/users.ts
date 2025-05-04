import { User } from '@/types';

export const getFullName = (user: User) => {
  return `${user.firstName} ${user.lastName}`;
};
