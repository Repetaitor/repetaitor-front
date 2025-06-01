import DashboardLayout from '@/components/dashboardLayout/DashboardLayout.tsx';
import { useGroupsContext } from '@/store';
import StudentGroupInformation from '@/components/mainDashboard/StudentGroupInformation.tsx';

const StudentDashboard = () => {
  const { groupsLoading } = useGroupsContext();

  return (
    <DashboardLayout isPageLoading={groupsLoading}>
      <StudentGroupInformation />
    </DashboardLayout>
  );
};

export default StudentDashboard;
