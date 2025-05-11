import { cn } from '@/lib/utils.ts';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { AlertTriangle, BookOpen, Calendar, CheckCircle2, Clock, FileText } from 'lucide-react';
import { getFullName } from '@/lib/users.ts';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { AssignmentStatus, StudentAssignment } from '@/types';

interface AssignmentOverviewProps {
  assignment: StudentAssignment;
}

const AssignmentOverview = ({ assignment }: AssignmentOverviewProps) => {
  return (
    <Card className="glass overflow-hidden border-muted/30">
      <div
        className={cn(
          'h-1.5',
          assignment.status.name === AssignmentStatus.Complete && 'bg-green-500',
          assignment.status.name === AssignmentStatus.InProgress ? 'bg-yellow-500' : 'bg-blue-500',
        )}
      />
      <CardContent className="pt-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-medium">{assignment.assignment.essay.essayTitle}</h3>
              <div className="flex items-center">
                {assignment.status.name === AssignmentStatus.Complete ? (
                  <Badge variant="outline" className="border-green-500/30 bg-green-500/20 text-green-500">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    შესრულებული
                  </Badge>
                ) : assignment.status.name === AssignmentStatus.InProgress ? (
                  <Badge variant="outline" className="border-yellow-500/30 bg-yellow-500/20 text-yellow-500">
                    <Clock className="mr-1 h-3 w-3" />
                    დაწყებული
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-blue-500/30 bg-blue-500/20 text-blue-500">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    დასაწერი
                  </Badge>
                )}
              </div>
            </div>

            <p className="mt-2 text-muted-foreground">{assignment.assignment.essay.essayDescription}</p>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">ჩაბარების თარიღი</p>
                  <p className="text-sm">{new Date(assignment.assignment.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">სიტყვების რაოდენობა</p>
                  <p className="text-sm">{assignment.assignment.essay.expectedWordCount} სიტყვა</p>
                </div>
              </div>

              <div className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">ავტორი</p>
                  <p className="text-sm">{getFullName(assignment.assignment.creator)}</p>
                </div>
              </div>

              {assignment.isEvaluated && (
                <div className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className="text-sm">{assignment.totalScore}/16</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row items-center justify-between gap-2 md:flex-col md:items-end md:justify-center">
            {assignment.status.name === AssignmentStatus.Complete ? (
              <Link to={`/feedback/${assignment.assignment.id}`}>
                <Button>შეფასება</Button>
              </Link>
            ) : (
              <Link
                to={
                  assignment.status.name === AssignmentStatus.InProgress
                    ? `/essay/${assignment.assignment.id}`
                    : `/essay/${assignment.assignment.id}`
                }
              >
                <Button>{assignment.status.name === AssignmentStatus.InProgress ? 'გაგრძელება' : 'დაწყება'}</Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentOverview;
