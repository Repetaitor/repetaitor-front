import { TeacherDashboardInfo } from '@/types';
import StatisticsCards from './StatisticsCards';
import { Users, BookOpen, Clock } from 'lucide-react';
import { useMemo } from 'react';

interface TeacherStatisticProps {
  teacherDashboardInfo?: TeacherDashboardInfo;
}

const TeacherStatistic = ({ teacherDashboardInfo }: TeacherStatisticProps) => {
  const statCards = useMemo(
    () => [
      {
        title: 'ჯგუფები',
        value: teacherDashboardInfo?.groupsCount ?? 0,
        icon: Users,
        color: 'text-blue-500',
      },
      {
        title: 'სტუდენტები',
        value: teacherDashboardInfo?.enrolledStudentsCount ?? 0,
        icon: Users,
        color: 'text-violet-500',
      },
      {
        title: 'ესეები',
        value: teacherDashboardInfo?.essayCount ?? 0,
        icon: BookOpen,
        color: 'text-amber-500',
      },
      {
        title: 'გასასწორებელი დავალებები',
        value: teacherDashboardInfo?.needEvaluateAssignmentsCount ?? 0,
        icon: Clock,
        color: 'text-red-500',
      },
    ],
    [teacherDashboardInfo],
  );

  return <StatisticsCards statCards={statCards} />;
};

export default TeacherStatistic;
