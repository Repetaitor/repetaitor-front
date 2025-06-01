import { Calendar } from 'lucide-react';
import { Assignment } from '@/types';
import { useCallback } from 'react';

interface AssignmentDetailTitleProps {
  essayTitle: string;
  assignment: Assignment;
}

const AssignmentDetailTitle = ({ essayTitle, assignment }: AssignmentDetailTitleProps) => {
  const formatDate = useCallback((dateString: Date) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  return (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="text-3xl font-bold">{essayTitle}</h1>
        <div className="mt-2 flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">ჩაბარების თარიღი: {formatDate(assignment.dueDate)}</span>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailTitle;
