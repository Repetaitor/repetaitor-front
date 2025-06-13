import DashboardLayout from '@/components/dashboardLayout/DashboardLayout';
import ScorePerformanceChart from '@/components/mainDashboard/ScorePerformanceChart';
import TeacherStatistic from '@/components/mainDashboard/TeacherStatistic';
import { Button } from '@/components/ui/button';
import { getTeacherDashboardInfo } from '@/lib/serverCalls';
import { NavigationRoute, TeacherDashboardInfo } from '@/types';
import { BookOpen, ClipboardCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const [teacherDashboardInfo, setTeacherDashboardInfo] = useState<TeacherDashboardInfo>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    const fetchDashboardInfo = async () => {
      try {
        setIsLoading(true);
        const fetchedData = await getTeacherDashboardInfo();

        if (isSubscribed) {
          setTeacherDashboardInfo(fetchedData);
        }
      } catch (err) {
        console.error('Error fetching assignments:', err);
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    fetchDashboardInfo();

    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <DashboardLayout isPageLoading={isLoading}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">მასწავლებლის პანელი</h1>
          <p className="mt-1 text-muted-foreground">მართეთ თქვენი სტუდენტებისა და დავალებების სიები</p>
        </div>

        {/* Stats Overview */}
        <TeacherStatistic teacherDashboardInfo={teacherDashboardInfo} />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Button variant="outline" className="h-auto flex-col gap-2 py-6" asChild>
            <Link to={NavigationRoute.GROUPS}>
              <Users className="mb-2 h-8 w-8" />
              <span className="text-base font-medium">ჯგუფების მართვა</span>
              <span className="text-xs text-muted-foreground">სტუდენტური ჯგუფების ნახვა და ორგანიზება</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-6" asChild>
            <Link to={NavigationRoute.ESSAYS}>
              <BookOpen className="mb-2 h-8 w-8" />
              <span className="text-base font-medium">ახალი ესეს შექმნა</span>
              <span className="text-xs text-muted-foreground">დაამატეთ ახალი ესეები</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-6" asChild>
            <Link to={NavigationRoute.SUBMISSIONS}>
              <ClipboardCheck className="mb-2 h-8 w-8" />
              <span className="text-base font-medium">ნაშრომები</span>
              <span className="text-xs text-muted-foreground">გახსენით მოსწავლეების ნაშრომები</span>
            </Link>
          </Button>
        </div>

        <ScorePerformanceChart
          title="სტუდენტების საშუალო შედეგები"
          timeBasedAvgScores={teacherDashboardInfo?.groupPerformanceStats}
        />
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
