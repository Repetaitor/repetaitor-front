import { formatAverageScore } from '@/lib/formatters.utils';
import { StudentDashboardInfo } from '@/types';
import { AlertTriangle, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { useMemo } from 'react';
import StatisticsCards from './StatisticsCards';

interface StudentStatisticProps {
  studentDashboardInfo?: StudentDashboardInfo;
}

const StudentStatistic = ({ studentDashboardInfo }: StudentStatisticProps) => {
  const statistics = useMemo(
    () => [
      {
        title: 'შესრულებული დავალებები',
        value: studentDashboardInfo?.completedAssignmentsCount || 0,
        icon: CheckCircle2,
        color: 'text-green-500',
      },
      {
        title: 'დაწყებული დავალებები',
        value: studentDashboardInfo?.inProgressAssignmentsCount || 0,
        icon: Clock,
        color: 'text-yellow-500',
      },
      {
        title: 'დასაწერი დავალებები',
        value: studentDashboardInfo?.pendingAssignmentsCount || 0,
        icon: AlertTriangle,
        color: 'text-blue-500',
      },
      {
        title: 'საშუალო ქულა',
        value: formatAverageScore(studentDashboardInfo?.userScoresStats.avgTotalScore || 0),
        icon: BookOpen,
        color: 'text-violet-500',
      },
    ],
    [studentDashboardInfo],
  );

  return <StatisticsCards statCards={statistics} />;
};

export default StudentStatistic;
