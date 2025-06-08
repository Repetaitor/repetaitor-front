import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { FileText, Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/dashboardLayout/DashboardLayout.tsx';
import { useStudentAssignments } from '@/hooks';
import AssignmentOverview from '@/components/assignments/AssignmentOverview.tsx';
import { AssignmentStatus } from '@/types';

interface AssignmentsProps {
  isAIAssignment?: boolean;
}

const Assignments = ({ isAIAssignment = false }: AssignmentsProps) => {
  const { assignments, isAssignmentsLoading } = useStudentAssignments(isAIAssignment);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string>('ყველა');

  const filteredAssignments = useMemo(
    () =>
      assignments.filter((assignment) => {
        const matchesSearch =
          assignment.assignment.essay.essayTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assignment.assignment.essay.essayDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assignment.assignment.instructions.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
          filter === 'ყველა' ||
          (filter === 'შესრულებული' && assignment.status.name === AssignmentStatus.Complete) ||
          (filter === 'დაწყებული' && assignment.status.name === AssignmentStatus.InProgress) ||
          (filter === 'დასაწერი' && assignment.status.name === AssignmentStatus.Pending);

        return matchesSearch && matchesFilter;
      }),
    [assignments, searchQuery, filter],
  );

  return (
    <DashboardLayout isPageLoading={isAssignmentsLoading}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">დავალებები</h1>
            <p className="mt-1 text-muted-foreground">შეასრულეთ თქვენი დავალებები და ნახეთ მასწავლებლის შეფასებები.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="მოძებნე დავალებები..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue={filter} onValueChange={setFilter} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="ყველა">ყველა</TabsTrigger>
              <TabsTrigger value="დასაწერი">დასაწერი</TabsTrigger>
              <TabsTrigger value="დაწყებული">დაწყებული</TabsTrigger>
              <TabsTrigger value="შესრულებული">შესრულებული</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment) => (
              <AssignmentOverview assignment={assignment} key={assignment.assignment.id} />
            ))
          ) : (
            <div className="p-8 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">დავალებები არ მოიძებნა</h3>
              <p className="mt-1 text-muted-foreground">
                {searchQuery ? 'ასეთი დავალება ვერ მოიძებნა.' : 'თქვენ არ გაქვთ დავალება მასწავლებლისგან.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Assignments;
