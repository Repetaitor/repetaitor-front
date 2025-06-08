import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { User as UserIcon, UserPlus, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';
import { getFullName } from '@/lib/users.utils';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useGroupsContext } from '@/store';
import { useToast } from '@/hooks';
import { useCallback, useState } from 'react';

const StudentGroupInformation = () => {
  const { studentGroup, joinGroup } = useGroupsContext();
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

  if (studentGroup)
    return (
      <Card className="border-muted/30">
        <CardHeader>
          <CardTitle>შენი ჯგუფი</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-muted p-3 text-blue-500">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium">{studentGroup.groupName}</h3>
                <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1">
                  <p className="text-sm text-muted-foreground">ჯგუფის კოდი:</p>
                  <p className="text-sm font-medium">{studentGroup.groupCode}</p>
                  <p className="text-sm text-muted-foreground">სტუდენტები:</p>
                  <p className="text-sm font-medium">{studentGroup.studentsCount}</p>
                  <p className="text-sm text-muted-foreground">შექმნის თარიღი:</p>
                  <p className="text-sm font-medium">{new Date(studentGroup.createDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Teacher Information */}
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getFullName(studentGroup.owner)
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{getFullName(studentGroup.owner)}</h3>
                <div className="mt-1 grid grid-cols-1 gap-y-1">
                  <div className="flex items-center gap-1">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{studentGroup.owner.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );

  return (
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
  );
};

export default StudentGroupInformation;
