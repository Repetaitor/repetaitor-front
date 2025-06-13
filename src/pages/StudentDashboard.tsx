import DashboardLayout from '@/components/dashboardLayout/DashboardLayout.tsx';
import ScorePerformanceChart from '@/components/mainDashboard/ScorePerformanceChart';
import StudentGroupInformation from '@/components/mainDashboard/StudentGroupInformation.tsx';
import StudentStatistic from '@/components/mainDashboard/StudentStatistic.tsx';
import UserInformation from '@/components/mainDashboard/UserInformation';
import { getStudentDashboardInfo, getUserInfoById } from '@/lib/serverCalls';
import { useAuthContext, useGroupsContext } from '@/store';
import { NavigationRoute, StudentDashboardInfo, User } from '@/types';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const StudentDashboard = () => {
  const { userId } = useParams<{ userId: string }>();
  const { activeUser } = useAuthContext();
  const { groupsLoading } = useGroupsContext();

  const location = useLocation();

  const [studentDashboardInfo, setStudentDashboardInfo] = useState<StudentDashboardInfo>();
  const [isLoadingDashboardInfo, setIsLoadingDashboardInfo] = useState(true);

  const [userInfo, setUserInfo] = useState<User>();
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    const fetchStudentDashboardInfo = async () => {
      try {
        const id = userId ? Number(userId) : activeUser?.id;
        if (!id) return;
        setIsLoadingDashboardInfo(true);
        const studentDashboardInfo = await getStudentDashboardInfo(id);
        if (isSubscribed) {
          setStudentDashboardInfo(studentDashboardInfo);
        }
      } catch (err) {
        console.error('Error fetching student dashboard info:', err);
      } finally {
        if (isSubscribed) {
          setIsLoadingDashboardInfo(false);
        }
      }
    };
    fetchStudentDashboardInfo();

    return () => {
      isSubscribed = false;
    };
  }, [activeUser, userId]);

  useEffect(() => {
    const isSubscribed = true;
    const fetchUserInfo = async () => {
      try {
        const id = userId ? Number(userId) : activeUser?.id;
        if (!id) return;
        setIsLoadingUserInfo(true);
        const userInfo = await getUserInfoById(id);
        if (isSubscribed) {
          setUserInfo(userInfo);
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      } finally {
        if (isSubscribed) {
          setIsLoadingUserInfo(false);
        }
      }
    };
    fetchUserInfo();
  }, [activeUser, userId]);

  return (
    <DashboardLayout isPageLoading={groupsLoading || isLoadingDashboardInfo || isLoadingUserInfo}>
      <div className="space-y-6">
        {location.pathname === NavigationRoute.DASHBOARD ? (
          <StudentGroupInformation />
        ) : (
          <UserInformation user={userInfo} />
        )}

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
