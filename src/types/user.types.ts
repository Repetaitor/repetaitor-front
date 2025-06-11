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

type TimeBasedAvgScore = {
  dateTime: string;
  totalScoreAvg: number;
  grammarScoreAvg: number;
  fluencyScoreAvg: number;
};

export type TeacherDashboardInfo = {
  groupsCount: number;
  enrolledStudentsCount: number;
  assignmentsCount: number;
  needEvaluateAssignmentsCount: number;
  groupPerformanceStats: TimeBasedAvgScore[];
};
