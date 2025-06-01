import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { AlertTriangle, CheckCircle2, Clock, Users } from 'lucide-react';
import { useMemo } from 'react';

interface AssignmentDetailStatisticProps {
  completedCount: number;
  inProgressCount: number;
  notStartedCount: number;
  totalCount: number;
}

const AssignmentDetailStatistic = ({
  completedCount,
  inProgressCount,
  notStartedCount,
  totalCount,
}: AssignmentDetailStatisticProps) => {
  const statistics = useMemo(
    () => [
      {
        title: 'სტუდენტები',
        value: totalCount,
        icon: Users,
        color: 'bg-blue-500/10 text-blue-500',
      },
      {
        title: 'შეფასებული',
        value: completedCount,
        icon: CheckCircle2,
        color: 'bg-green-500/10 text-green-500',
      },
      {
        title: 'შესაფასებელი',
        value: inProgressCount,
        icon: Clock,
        color: 'bg-yellow-500/10 text-yellow-500',
      },
      {
        title: 'გამოსაგზავნი',
        value: notStartedCount,
        icon: AlertTriangle,
        color: 'bg-red-500/10 text-red-500',
      },
    ],
    [completedCount, inProgressCount, notStartedCount, totalCount],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>სტატისტიკა</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {statistics.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`mr-3 rounded-full p-2 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="font-medium">{stat.title}</span>
            </div>
            <span className="text-xl font-bold">{stat.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AssignmentDetailStatistic;
