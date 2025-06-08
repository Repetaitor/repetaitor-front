import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import DashboardLayout from '@/components/dashboardLayout/DashboardLayout';
import SubmissionsList from '@/components/submissions/SubmissionsList';
import { useSubmissions } from '@/hooks';
import { AssignmentStatus } from '@/types';
import { getFullName } from '@/lib/users.utils';

const Submissions = () => {
  const { submissions, isSubmissionsLoading } = useSubmissions();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter submitted essays that need evaluation
  const pendingSubmissions = useMemo(
    () =>
      submissions.filter(
        (submission) =>
          submission.status.name === AssignmentStatus.Complete &&
          (submission.assignment.essay.essayTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            getFullName(submission.student).toLowerCase().includes(searchQuery.toLowerCase())),
      ),
    [submissions, searchQuery],
  );

  return (
    <DashboardLayout isPageLoading={isSubmissionsLoading}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ნაშრომები</h1>
            <p className="mt-1 text-muted-foreground">შეასწორე სტუდენტის ნაშრომები და გაუგზავნე შეფასება.</p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>გასასწორებელი ნაშრომები</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="მოძებნე ნაშრომი..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <CardDescription>{submissions.length} ნაშრომი გაქვს გასასწორებელი</CardDescription>
          </CardHeader>
          <CardContent>
            <SubmissionsList submissions={pendingSubmissions} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Submissions;
