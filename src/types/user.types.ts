export enum UserRole {
  STUDENT = 'Student',
  TEACHER = 'Teacher',
}

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
};
