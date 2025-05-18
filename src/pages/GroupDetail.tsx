import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext, useGroupsContext } from '@/store';
import DashboardLayout from '@/components/dashboardLayout/DashboardLayout.tsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input.tsx';
import { useEffect, useMemo, useState } from 'react';
import { NavigationRoute, User, UserRole } from '@/types';
import GroupDetailHeader from '@/components/groups/GroupDetailHeader.tsx';
import GroupDetailCode from '@/components/groups/GroupDetailCode';
import GroupDetailStatistic from '@/components/groups/GroupDetailStatistic.tsx';
import GroupDetailAssignments from '@/components/groups/GroupDetailAssignments';
import GroupDetailStudents from '@/components/groups/GroupDetailStudents.tsx';
import AddAssignmentButton from '@/components/groups/AddAssignmentButton.tsx';
import { useGroupAssignments } from '@/hooks/useGroupAssignments.ts';
import { getGroupStudents } from '@/lib/serverCalls';

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeUser } = useAuthContext();
  const { groups } = useGroupsContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<User[]>([]);

  const group = useMemo(() => groups.find((g) => g.id === Number(id)), [groups, id]);

  const { groupAssignments, addAssignment } = useGroupAssignments(group?.id);

  useEffect(() => {
    if (group) {
      getGroupStudents(group.id).then((students) => {
        setStudents(students);
      });
    }
  }, [group]);

  if (activeUser?.role !== UserRole.TEACHER || !group) {
    return (
      <DashboardLayout>
        <div className="flex h-full flex-col items-center justify-center">
          <h1 className="mb-4 text-2xl font-bold">ჯგუფი არ მოიძებნა</h1>
          <Button variant="outline" className="mt-4" onClick={() => navigate(NavigationRoute.DASHBOARD)}>
            უკან დაბრუნება
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GroupDetailHeader groupName={group.groupName} />

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <GroupDetailCode group={group} />
          <GroupDetailStatistic
            group={group}
            totalAssignments={groupAssignments.length}
            totalStudents={students.length}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">დავალებები</h2>
            <AddAssignmentButton addAssignment={addAssignment} />
          </div>
          <GroupDetailAssignments
            groupAssignments={groupAssignments}
            removeAssignment={() => {}}
            addAssignment={addAssignment}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">სტუდენტების სია</h2>
            <Input
              placeholder="მოძებნე სტუდენტი..."
              className="max-w-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <GroupDetailStudents searchQuery={searchQuery} students={students} setStudents={setStudents} group={group} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GroupDetail;
