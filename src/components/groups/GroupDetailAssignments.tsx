import { Card, CardContent } from '@/components/ui/card.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { Button } from '@/components/ui/button.tsx';
import { FileText, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddAssignmentButton from '@/components/groups/AddAssignmentButton.tsx';
import { useToast } from '@/hooks';
import { Assignment, NavigationRoute } from '@/types';
import { useCallback } from 'react';
import { useEssaysContext } from '@/store';

interface GroupDetailAssignmentsProps {
  groupAssignments: Assignment[];
  removeAssignment: (assignmentId: number) => void;
  addAssignment: (essayId: number, dueDate: Date, instructions?: string) => Promise<void>;
}

const GroupDetailAssignments = ({ groupAssignments, removeAssignment, addAssignment }: GroupDetailAssignmentsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { essays } = useEssaysContext();

  const handleViewAssignment = useCallback(
    (assignmentId: number) => {
      navigate(`${NavigationRoute.ASSIGNMENTS}/${assignmentId}`);
    },
    [navigate],
  );

  const handleDeleteAssignment = useCallback(
    (assignmentId: number) => {
      removeAssignment(assignmentId);

      toast({
        title: 'დავალება წაშლილია',
      });
    },
    [removeAssignment, toast],
  );

  return (
    <Card>
      <CardContent className="p-0">
        {groupAssignments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ესე</TableHead>
                <TableHead>ჩაბარების თარიღი</TableHead>
                <TableHead>შესრულებულია</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupAssignments.map((assignment) => {
                const essay = essays.find((e) => e.id === assignment.essay.id);
                const essayTitle = essay ? essay.essayTitle : 'Unknown Essay';

                return (
                  <TableRow
                    key={assignment.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewAssignment(assignment.id)}
                  >
                    <TableCell>{essayTitle}</TableCell>
                    <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>10%</TableCell> {/* Placeholder for completion percentage */}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event
                          handleDeleteAssignment(assignment.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-danger" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center p-6 text-center">
            <div className="space-y-2">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">დავალებები არაა ჯერ დამატებული</h3>
              <p className="text-muted-foreground">შექმენი პირველი დავალება ჯგუფისთვის.</p>
              <AddAssignmentButton addAssignment={addAssignment} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupDetailAssignments;
