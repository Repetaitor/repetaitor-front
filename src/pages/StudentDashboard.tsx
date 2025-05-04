import DashboardLayout from '@/components/dashboardLayout/DashboardLayout.tsx';
import { useGroupsContext } from '@/store';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks';
import { useCallback, useState } from 'react';

const StudentDashboard = () => {
  const { studentGroup, joinGroup, groupsLoading } = useGroupsContext();
  const { toast } = useToast();

  const [groupCode, setGroupCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinGroup = useCallback(async () => {
    if (!groupCode.trim()) {
      toast({
        title: 'ჯგუფის კოდი არ არის მითითებული',
        variant: 'danger',
      });
      return;
    }

    setIsJoining(true);
    try {
      const myGroup = await joinGroup(groupCode);

      toast({
        title: 'წარმატებით გაწევრიანდით ჯგუფში',
        description: `თქვენ წარმატებით გაწევრიანდით ჯგუფში ${myGroup.groupName}`,
      });

      setGroupCode('');
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        title: 'მოხდა შეცდომა',
        description: 'ვერ მოხერხდა ჯგუფში გაწევრიანება. გთხოვთ, სცადოთ კიდევ ერთხელ.',
        variant: 'danger',
      });
    } finally {
      setIsJoining(false);
    }
  }, [groupCode, joinGroup, toast]);

  return (
    <DashboardLayout isPageLoading={groupsLoading}>
      {!studentGroup && (
        <Card className="border-muted/30">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="flex-1">
                <h3 className="text-lg font-medium">გაწევრიანდი ჯგუფში</h3>
                <p className="mt-1 text-sm text-muted-foreground">შეიყვანე ჯგუფის კოდი</p>
              </div>
              <div className="flex w-full gap-2 md:w-auto">
                <Input
                  placeholder="შეიყვანე ჯგუფის კოდი"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                  className="md:w-52"
                />
                <Button onClick={handleJoinGroup} disabled={isJoining}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {isJoining ? 'წევრიანდები...' : 'გაწევრიანება'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
