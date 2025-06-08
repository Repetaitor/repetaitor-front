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

export type TeacherDashboardInfo = {
  groupsCount: number;
  enrolledStudentsCount: number;
  assignmentsCount: number;
  needEvaluateAssignmentsCount: number;
  groupPerformanceStats: {
    dateTime: string;
    totalScoreAvg: number;
    grammarScoreAvg: number;
    fluencyScoreAvg: number;
  }[];
};
