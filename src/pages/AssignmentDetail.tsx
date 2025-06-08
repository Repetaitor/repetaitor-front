import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Assignment, AssignmentStatus, NavigationRoute, StudentAssignment, UserRole } from '@/types';
import { useAuthContext, useGroupsContext } from '@/store';
import DashboardLayout from '@/components/dashboardLayout/DashboardLayout.tsx';
import AssignmentDetailTitle from '@/components/assignmentDetail/AssignmentDetailTitle';
import AssignmentDetailEssay from '@/components/assignmentDetail/AssignmentDetailEssay.tsx';
import { getAssignmentBaseInfoById, getUsersTasksByAssignment } from '@/lib/serverCalls';
import AssignmentDetailStatistic from '@/components/assignmentDetail/AssignmentDetailStatistic.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssignmentDetailStudents from '@/components/assignmentDetail/AssignmentDetailStudents';
import { isAssignmentByAI } from '@/lib/assignments.utils';

const AssignmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { activeUser } = useAuthContext();
  const { groups } = useGroupsContext();

  const [assignment, setAssignment] = useState<Assignment>();
  const [isAssignmentLoading, setIsAssignmentLoading] = useState(true);

  const [studentSubmissions, setStudentSubmissions] = useState<StudentAssignment[]>([]);
  const [isStudentSubmissionsLoading, setIsStudentSubmissionsLoading] = useState(true);

  const isTeacher = activeUser?.role === UserRole.TEACHER;

  const isAIAssignment = useMemo(() => assignment && isAssignmentByAI(assignment), [assignment]);

  useEffect(() => {
    if (!id) return;

    let isSubscribed = true;

    const fetchAssignment = async () => {
      setIsAssignmentLoading(true);
      try {
        const fetchedAssignment: Assignment = await getAssignmentBaseInfoById(Number(id));
        if (!isSubscribed) return;
        setAssignment(fetchedAssignment);
      } catch {
        if (!isSubscribed) return;
        setAssignment(undefined);
      } finally {
        if (isSubscribed) {
          setIsAssignmentLoading(false);
        }
      }
    };

    fetchAssignment();

    return () => {
      isSubscribed = false;
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;

    let isSubscribed = true;

    const fetchStudentSubmissions = async () => {
      setIsStudentSubmissionsLoading(true);
      try {
        const fetchedSubmissions: StudentAssignment[] = await getUsersTasksByAssignment(Number(id));
        if (!isSubscribed) return;
        setStudentSubmissions(fetchedSubmissions);
      } catch (error) {
        console.error('Error fetching student submissions:', error);
        if (!isSubscribed) return;
        setStudentSubmissions([]);
      } finally {
        if (isSubscribed) {
          setIsStudentSubmissionsLoading(false);
        }
      }
    };

    fetchStudentSubmissions();

    return () => {
      isSubscribed = false;
    };
  }, [assignment, id]);

  const completedSubmissions = useMemo(
    () => studentSubmissions.filter((s) => s.status.name === AssignmentStatus.Complete),
    [studentSubmissions],
  );
  const inProgressSubmissions = useMemo(
    () => studentSubmissions.filter((s) => s.status.name === AssignmentStatus.InProgress),
    [studentSubmissions],
  );
  const notStartedSubmissions = useMemo(
    () => studentSubmissions.filter((s) => s.status.name === AssignmentStatus.Pending),
    [studentSubmissions],
  );

  const totalCount = useMemo(() => studentSubmissions.length, [studentSubmissions]);
  const completionRate = useMemo(
    () => (totalCount > 0 ? Math.round((completedSubmissions.length / totalCount) * 100) : 0),
    [completedSubmissions.length, totalCount],
  );

  const groupName = useMemo(
    () => groups?.find((g) => g.id === assignment?.groupId)?.groupName || 'უცნობი ჯგუფი',
    [assignment, groups],
  );

  if (!assignment) {
    return (
      <DashboardLayout isPageLoading={isAssignmentLoading || isStudentSubmissionsLoading}>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="mb-4 h-12 w-12 text-yellow-500" />
          <h1 className="mb-2 text-2xl font-bold">დავალება ვერ მოიძებნა</h1>
          <p className="mb-6 text-muted-foreground">არ არსებობს დავალება ამ ID-ით.</p>
          <Link to={isAIAssignment ? NavigationRoute.AI_ASSIGNMENTS : NavigationRoute.ASSIGNMENTS}>
            <Button>უკან დაბრუნება</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isPageLoading={isAssignmentLoading || isStudentSubmissionsLoading}>
      <div className="space-y-6">
        <AssignmentDetailTitle assignment={assignment} essayTitle={assignment.essay.essayTitle} />

        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-primary"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <div className="flex justify-end">
          <span className="text-sm text-muted-foreground">
            {completionRate}% ({completedSubmissions.length}/{totalCount})
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <AssignmentDetailEssay essay={assignment.essay} />

          <AssignmentDetailStatistic
            completedCount={completedSubmissions.length}
            inProgressCount={inProgressSubmissions.length}
            notStartedCount={notStartedSubmissions.length}
            totalCount={totalCount}
          />
        </div>

        {assignment.instructions && (
          <Card>
            <CardHeader>
              <CardTitle>ინსტრუქციები</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">{assignment.instructions}</CardContent>
          </Card>
        )}

        {isTeacher && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">{groupName} ჯგუფის ნაშრომები</h2>

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">ყველა</TabsTrigger>
                <TabsTrigger value="completed">შესრულებული</TabsTrigger>
                <TabsTrigger value="in-progress">პროგრესშია</TabsTrigger>
                <TabsTrigger value="not-started">დასაწყები</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <AssignmentDetailStudents
                  studentSubmissions={studentSubmissions}
                  essayWordCount={assignment.essay.expectedWordCount}
                />
              </TabsContent>

              <TabsContent value="completed" className="mt-4">
                <AssignmentDetailStudents
                  studentSubmissions={completedSubmissions}
                  essayWordCount={assignment.essay.expectedWordCount}
                />
              </TabsContent>
              <TabsContent value="in-progress" className="mt-4">
                <AssignmentDetailStudents
                  studentSubmissions={inProgressSubmissions}
                  essayWordCount={assignment.essay.expectedWordCount}
                />
              </TabsContent>
              <TabsContent value="not-started" className="mt-4">
                <AssignmentDetailStudents
                  studentSubmissions={notStartedSubmissions}
                  essayWordCount={assignment.essay.expectedWordCount}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AssignmentDetail;
