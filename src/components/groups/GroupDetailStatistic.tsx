import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Group } from '@/types';

interface GroupDetailStatisticProps {
  group: Group;
  totalStudents: number;
  totalAssignments: number;
}

const GroupDetailStatistic = ({ group, totalStudents, totalAssignments }: GroupDetailStatisticProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ჯგუფის სტატისტიკა</CardTitle>
        <CardDescription>ჯგუფის დეტალები</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">სტუდენტების რაოდენობა:</span>
          <span className="font-medium">{totalStudents}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">შექმნის თარიღი:</span>
          <span className="font-medium">{new Date(group.createDate).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">აქტიური დავალებები:</span>
          <span className="font-medium">{totalAssignments}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupDetailStatistic;
