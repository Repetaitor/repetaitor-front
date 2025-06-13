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

export type TimeBasedAvgScore = {
  dateTime: string;
  totalScoreAvg: number;
  grammarScoreAvg: number;
  fluencyScoreAvg: number;
};

export type TeacherDashboardInfo = {
  groupsCount: number;
  enrolledStudentsCount: number;
  assignmentsCount: number;
  essayCount: number;
  needEvaluateAssignmentsCount: number;
  groupPerformanceStats: TimeBasedAvgScore[];
};

export type StudentDashboardInfo = {
  completedAssignmentsCount: number;
  inProgressAssignmentsCount: number;
  pendingAssignmentsCount: number;
  userScoresStats: {
    avgTotalScore: number;
    avgGrammarScore: number;
    avgFluencyScore: number;
  };
  userPerformanceStats: TimeBasedAvgScore[];
};
