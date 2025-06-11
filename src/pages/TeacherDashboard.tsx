import DashboardLayout from '@/components/dashboardLayout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTeacherDashboardInfo } from '@/lib/serverCalls';
import { cn } from '@/lib/utils';
import { NavigationRoute, TeacherDashboardInfo } from '@/types';
import { BookOpen, ClipboardCheck, Clock, Users } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
interface PerformanceData {
  month: string;
  score: number;
}

const TeacherDashboard = () => {
  const [teacherDashboardInfo, setTeacherDashboardInfo] = useState<TeacherDashboardInfo>();
  const [isLoading, setIsLoading] = useState(false);

  const statCards = useMemo(
    () => [
      {
        title: 'ჯგუფები',
        value: teacherDashboardInfo?.groupsCount ?? 0,
        icon: Users,
        color: 'text-blue-500',
        description: 'აქტიური ჯგუფები',
      },
      {
        title: 'სტუდენტები',
        value: teacherDashboardInfo?.enrolledStudentsCount ?? 0,
        icon: Users,
        color: 'text-violet-500',
        description: 'ყველა მონაწილე',
      },
      {
        title: 'ესეები',
        value: teacherDashboardInfo?.assignmentsCount ?? 0,
        icon: BookOpen,
        color: 'text-amber-500',
        description: 'შექმნილი ესეები',
      },
      {
        title: 'მიმდინარე დავალებები',
        value: teacherDashboardInfo?.needEvaluateAssignmentsCount ?? 0,
        icon: Clock,
        color: 'text-red-500',
        description: 'შესაფასებელი ესეები',
      },
    ],
    [teacherDashboardInfo],
  );

  const studentPerformanceData = useMemo((): PerformanceData[] => {
    if (!teacherDashboardInfo?.groupPerformanceStats) return [];

    return teacherDashboardInfo.groupPerformanceStats.map((assignment) => {
      const date = new Date(assignment.dateTime);
      const month = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

      return {
        month,
        score: assignment.totalScoreAvg,
      };
    });
  }, [teacherDashboardInfo?.groupPerformanceStats]);

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

  const tooltipFormatter = useCallback((value: number) => [`${value} / 16`, 'Average Score'], []);
  const tooltipLabelFormatter = useCallback((label: string) => `Month: ${label}`, []);

  const chartMargin = useMemo(() => ({ top: 5, right: 30, left: 20, bottom: 5 }), []);

  const tooltipStyle = useMemo(
    () => ({
      backgroundColor: 'hsl(var(--card))',
      borderColor: 'hsl(var(--muted))',
      borderRadius: '0.5rem',
    }),
    [],
  );

  return (
    <DashboardLayout isPageLoading={isLoading}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">მასწავლებლის პანელი</h1>
          <p className="mt-1 text-muted-foreground">მართეთ თქვენი სტუდენტებისა და დავალებების სიები</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map(({ title, description, color, icon, value }) => {
            const IconComponent = icon;
            return (
              <Card key={title} className="glass border-muted/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{title}</p>
                      <h3 className="mt-1 text-2xl font-bold">{value}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                    </div>
                    <div className={cn('rounded-full p-3', color, 'bg-muted')}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

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

        {/* Student Performance Chart */}
        {studentPerformanceData.length >= 2 && (
          <Card className="glass border-muted/30">
            <CardHeader>
              <CardTitle>სტუდენტების საშუალოშედეგები</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={studentPerformanceData} margin={chartMargin}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" stroke="#6a7387" />
                    <YAxis domain={[0, 10]} stroke="#6a7387" />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={tooltipFormatter}
                      labelFormatter={tooltipLabelFormatter}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name="Average Score"
                      stroke="#4d84e7"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
