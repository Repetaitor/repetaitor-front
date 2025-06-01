import { Card, CardContent } from '@/components/ui/card.tsx';
import { useMemo } from 'react';
import { AssignmentStatus, StudentAssignment } from '@/types';
import { AlertTriangle, BookOpen, CheckCircle2, Clock } from 'lucide-react';

interface StudentStatisticProps {
  assignments: StudentAssignment[];
}

const StudentStatistic = ({ assignments }: StudentStatisticProps) => {
  const completedAssignments = useMemo(
    () => assignments.filter((assignment) => assignment.status.name === AssignmentStatus.Complete),
    [assignments],
  );

  const inProgressAssignments = useMemo(
    () => assignments.filter((assignment) => assignment.status.name === AssignmentStatus.InProgress),
    [assignments],
  );

  const pendingAssignments = useMemo(
    () => assignments.filter((assignment) => assignment.status.name === AssignmentStatus.Pending),
    [assignments],
  );

  const averageScore = useMemo(() => {
    if (completedAssignments.length === 0) return `N/A`;
    const totalScore = completedAssignments.reduce((sum, assignment) => sum + (assignment.totalScore || 0), 0);
    const average = totalScore / (completedAssignments.length * 16);
    return `${average.toFixed(2)}/16`;
  }, [completedAssignments]);

  const statistics = useMemo(
    () => [
      {
        title: 'Completed',
        value: completedAssignments.length,
        icon: CheckCircle2,
        color: 'text-green-500',
        description: 'Assignments completed',
      },
      {
        title: 'In Progress',
        value: inProgressAssignments.length,
        icon: Clock,
        color: 'text-yellow-500',
        description: 'Assignments in progress',
      },
      {
        title: 'Pending',
        value: pendingAssignments.length,
        icon: AlertTriangle,
        color: 'text-blue-500',
        description: 'Assignments pending',
      },
      {
        title: 'Average Score',
        value: averageScore,
        icon: BookOpen,
        color: 'text-violet-500',
        description: 'Overall performance',
      },
    ],
    [averageScore, completedAssignments.length, inProgressAssignments.length, pendingAssignments.length],
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statistics.map((stat, i) => (
        <Card key={i} className="glass border-border/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="mt-1 text-2xl font-bold">{stat.value}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
              </div>
              <div className={`rounded-full p-3 ${stat.color} bg-muted`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StudentStatistic;
