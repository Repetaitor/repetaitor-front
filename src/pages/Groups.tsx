import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClipboardCopy, PlusCircle, Users } from 'lucide-react';
import DashboardLayout from '@/components/dashboardLayout/DashboardLayout';
import { useAuthContext, useGroupsContext } from '@/store';
import { useToast } from '@/hooks';
import { NavigationRoute, UserRole } from '@/types';
import CreateNewGroup from '@/components/groups/CreateNewGroup.tsx';

const Groups = () => {
  const { activeUser } = useAuthContext();
  const { groups, groupsLoading } = useGroupsContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [openNewGroupDialog, setOpenNewGroupDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopyCode = useCallback(
    (code: string) => {
      navigator.clipboard.writeText(code).then(() => {
        toast({
          title: 'კოდი დაკოპირებულია',
        });
      });
    },
    [toast],
  );

  const handleViewGroup = useCallback(
    (groupId: number) => {
      navigate(`${NavigationRoute.GROUPS}/${groupId}`);
    },
    [navigate],
  );

  const filteredGroups = useMemo(
    () => groups.filter((group) => group.groupName.toLowerCase().includes(searchQuery.toLowerCase())),
    [groups, searchQuery],
  );

  if (activeUser?.role !== UserRole.TEACHER) {
    return (
      <DashboardLayout isPageLoading={groupsLoading}>
        <div className="flex h-full flex-col items-center justify-center">
          <h1 className="mb-4 text-2xl font-bold">წვდომა შეუძლებელია</h1>
          <p>ამ გვერდის ნახვა შეუძლიათ მხოლოდ მასწავლებლებს.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isPageLoading={groupsLoading}>
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ჯგუფები</h1>
            <p className="text-muted-foreground">მართე ჯგუფები და მიეცით დავალებები სტუდენტებს.</p>
          </div>

          <CreateNewGroup openNewGroupDialog={openNewGroupDialog} setOpenNewGroupDialog={setOpenNewGroupDialog} />
        </div>

        <div className="mb-6 flex items-center justify-between">
          <Input
            placeholder="მოძებნე ჯგუფი..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {groups.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">ჯგუფი არ არის შექმნილი</h3>
              <p className="mb-6 mt-1 max-w-md text-center text-muted-foreground">
                შექმენი შენი პირველი ჯგუფი და მიეცი დავალებები სტუდენტებს.
              </p>
              <Button onClick={() => setOpenNewGroupDialog(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                შექმენი ახალი ჯგუფი
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <Card
                key={group.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => handleViewGroup(group.id)}
              >
                <CardHeader>
                  <CardTitle>{group.groupName}</CardTitle>
                  <CardDescription>შექმნის თარიღი: {new Date(group.createDate).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">სტუდენტები</span>
                    <span className="font-medium">{group.studentsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">ჯგუფის კოდი</span>
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-2 py-1 text-sm">{group.groupCode}</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyCode(group.groupCode);
                        }}
                      >
                        <ClipboardCopy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Groups;
