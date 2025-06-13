import DashboardLayout from '@/components/dashboardLayout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePublicAssignments } from '@/hooks';
import { getFullName } from '@/lib/users.utils';
import { cn } from '@/lib/utils';
import { NavigationRoute } from '@/types';
import { ArrowLeft, Calendar, Eye, User } from 'lucide-react';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PublicSubmissions = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();

  const navigate = useNavigate();

  const { publicAssignments, isPublicAssignmentsLoading } = usePublicAssignments(Number(assignmentId));

  const getScoreColor = useCallback((score: number) => {
    if (score >= 14) return 'bg-green-500';
    if (score >= 10) return 'bg-yellow-500';
    return 'bg-red-500';
  }, []);

  const handleViewFeedback = useCallback(
    (assignmentId: number, userId: number) => {
      navigate(`${NavigationRoute.FEEDBACK}/${assignmentId}/${userId}`);
    },
    [navigate],
  );

  return (
    <DashboardLayout isPageLoading={isPublicAssignmentsLoading}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            უკან
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              სხვა მოხმარებლების ნამუშევარები
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>მოხმარებლის სახელი</TableHead>
                  <TableHead>გაგზავნილი თარიღი</TableHead>
                  <TableHead>სიტყვების რაოდენობა</TableHead>
                  <TableHead>სტუდენტის შეფასება</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {publicAssignments.map((submission) => (
                  <TableRow key={`${submission.assignment.id}-${submission.student.id}`}>
                    <TableCell className="font-medium">{getFullName(submission.student)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(submission.submitDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{submission.actualWordCount} სიტყვა</TableCell>
                    <TableCell>
                      <Badge className={cn('border-0 text-white', getScoreColor(submission.totalScore))}>
                        {submission.totalScore}/16
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewFeedback(submission.assignment.id, submission.student.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        ნამუშევარის ნახვა
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PublicSubmissions;
