import { useAuthContext } from '@/store';
import { UserRole } from '@/types';
import StudentDashboard from '@/pages/StudentDashboard.tsx';
import TeacherDashboard from '@/pages/TeacherDashboard.tsx';

const Dashboard = () => {
  const { activeUser } = useAuthContext();

  if (activeUser?.role === UserRole.STUDENT) {
    return <StudentDashboard />;
  }

  return <TeacherDashboard />;
};

export default Dashboard;
