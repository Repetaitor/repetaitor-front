import DashboardLayout from '@/components/dashboardLayout/DashboardLayout.tsx';
import ScorePerformanceChart from '@/components/mainDashboard/ScorePerformanceChart';
import StudentGroupInformation from '@/components/mainDashboard/StudentGroupInformation.tsx';
import StudentStatistic from '@/components/mainDashboard/StudentStatistic.tsx';
import { getStudentDashboardInfo } from '@/lib/serverCalls';
import { useAuthContext, useGroupsContext } from '@/store';
import { StudentDashboardInfo } from '@/types';
import { useEffect, useState } from 'react';

const StudentDashboard = () => {
  const { activeUser } = useAuthContext();
  const { groupsLoading } = useGroupsContext();
  const [studentDashboardInfo, setStudentDashboardInfo] = useState<StudentDashboardInfo>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
    if (!activeUser) return;
    const fetchStudentDashboardInfo = async () => {
      try {
        setIsLoading(true);
        const studentDashboardInfo = await getStudentDashboardInfo(activeUser.id);
        if (isSubscribed) {
          setStudentDashboardInfo(studentDashboardInfo);
        }
      } catch (err) {
        console.error('Error fetching student dashboard info:', err);
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };
    fetchStudentDashboardInfo();

    return () => {
      isSubscribed = false;
    };
  }, [activeUser]);

  return (
    <DashboardLayout isPageLoading={groupsLoading || isLoading}>
      <div className="space-y-6">
        <StudentGroupInformation />

        <StudentStatistic studentDashboardInfo={studentDashboardInfo} />

        <ScorePerformanceChart
          title="საშუალო შედეგები"
          timeBasedAvgScores={studentDashboardInfo?.userPerformanceStats}
        />
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
