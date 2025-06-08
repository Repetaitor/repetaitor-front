import { ChevronRight, FileText } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/paginaion';
import { useNavigate } from 'react-router-dom';
import { NavigationRoute, StudentAssignment } from '@/types';
import { getFullName } from '@/lib/users.utils';

interface SubmissionsListProps {
  submissions: StudentAssignment[];
}

const SubmissionsList = ({ submissions }: SubmissionsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  // Pagination logic
  const totalPages = useMemo(() => Math.ceil(submissions.length / itemsPerPage), [submissions.length]);
  const currentSubmissions = useMemo(
    () => submissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [currentPage, submissions],
  );

  const handleEvaluate = useCallback(
    (userId: number, assignmentId: number) => {
      navigate(`${NavigationRoute.EVALUATE}/${userId}/${assignmentId}`);
    },
    [navigate],
  );

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-medium">ნაშრომები არ მოიძებნა</h3>
        <p className="mt-1 max-w-md text-center text-muted-foreground">
          ამჯამად თქვენ არ გაქვთ გასასწორებელი ნაშრომები. ახალი ნაშრომები გამოჩნდება აქ, როდესაც სტუდენტები გამოგზავნიან
          თავიანთ ნაშრომებს.
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ესე</TableHead>
            <TableHead>სტუდენტი</TableHead>
            <TableHead>სიტყვები</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentSubmissions.map((submission) => (
            <TableRow key={`${submission.student.id}- ${submission.assignment.id}`}>
              <TableCell className="font-medium">{submission.assignment.essay.essayTitle}</TableCell>
              <TableCell>{getFullName(submission.student)}</TableCell>
              <TableCell>{submission.actualWordCount}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" onClick={() => handleEvaluate(submission.student.id, submission.assignment.id)}>
                  გასწორება
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};

export default SubmissionsList;
