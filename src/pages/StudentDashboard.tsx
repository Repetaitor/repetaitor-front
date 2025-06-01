import DashboardLayout from '@/components/dashboardLayout/DashboardLayout.tsx';
import { useGroupsContext } from '@/store';
import StudentGroupInformation from '@/components/mainDashboard/StudentGroupInformation.tsx';
import { useStudentAssignments } from '@/hooks';
import StudentStatistic from '@/components/mainDashboard/StudentStatistic.tsx';

const StudentDashboard = () => {
  const { groupsLoading } = useGroupsContext();
  const { assignments, isAssignmentsLoading } = useStudentAssignments();

  return (
    <DashboardLayout isPageLoading={groupsLoading || isAssignmentsLoading}>
      <div className="space-y-6">
        <StudentGroupInformation />

        <StudentStatistic assignments={assignments} />
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
