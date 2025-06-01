import { Card, CardContent } from '@/components/ui/card.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { AssignmentStatus, NavigationRoute, StudentAssignment } from '@/types';
import { getFullName } from '@/lib/users.ts';

interface AssignmentDetailStudentsProps {
  studentSubmissions: StudentAssignment[];
  essayWordCount: number;
}

const AssignmentDetailStudents = ({ studentSubmissions, essayWordCount }: AssignmentDetailStudentsProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>სტუდენტები</TableHead>
              <TableHead>სტატუსი</TableHead>
              <TableHead>სიტყვების რაოდენობა</TableHead>
              <TableHead>ქულა</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentSubmissions.map((submission) => (
              <TableRow key={`${submission.student.id}-${submission.assignment.id}`}>
                <TableCell className="font-medium">{getFullName(submission.student)}</TableCell>
                <TableCell>
                  {submission.status.name === AssignmentStatus.Complete ? (
                    <Badge variant="outline" className="border-green-500/30 bg-green-500/20 text-green-500">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      შესრულებულია
                    </Badge>
                  ) : submission.status.name === AssignmentStatus.InProgress ? (
                    <Badge variant="outline" className="border-yellow-500/30 bg-yellow-500/20 text-yellow-500">
                      <Clock className="mr-1 h-3 w-3" />
                      მიმდინარეობს
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-red-500/30 bg-red-500/20 text-red-500">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      არ დაუწყია
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {submission.actualWordCount} / {essayWordCount}
                </TableCell>

                <TableCell>{submission.totalScore || 'არ შეფასებულა'}</TableCell>
                <TableCell className="text-right">
                  {submission.status.name === AssignmentStatus.Complete && !submission.isEvaluated && (
                    <Link to={`${NavigationRoute.EVALUATE}/${submission.student.id}/${submission.assignment.id}`}>
                      <Button size="sm">შეაფასე</Button>
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AssignmentDetailStudents;
