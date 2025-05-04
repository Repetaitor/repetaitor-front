import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ClipboardCopy, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks';
import { Group, NavigationRoute } from '@/types';
import { useGroupsContext } from '@/store';
import { useCallback, useState } from 'react';

interface GroupDetailCodeProps {
  group: Group;
}

const GroupDetailCode = ({ group }: GroupDetailCodeProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { removeGroup } = useGroupsContext();

  const [isDeletingGroup, setIsDeletingGroup] = useState(false);

  const handleCopyCode = useCallback(
    (code: string) => {
      navigator.clipboard.writeText(code).then(() =>
        toast({
          title: 'კოდი დაკოპირებულია',
        }),
      );
    },
    [toast],
  );

  const handleDeleteGroup = useCallback(async () => {
    setIsDeletingGroup(true);
    removeGroup(group.id)
      .then(() => {
        toast({
          title: 'ჯგუფი წაშლილია',
          description: `${group.groupName} ჯგუფი წარმატებით წაიშალა.`,
        });
        navigate(NavigationRoute.GROUPS);
      })
      .catch(() => {
        toast({
          title: 'ჯგუფის წაშლის შეცდომა',
          description: 'გთხოვთ, სცადოთ თავიდან.',
          variant: 'danger',
        });
      })
      .finally(() => {
        setIsDeletingGroup(false);
      });
  }, [group.groupName, group.id, navigate, removeGroup, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>ჯგუფის კოდი</CardTitle>
        <CardDescription>გაუზიარე კოდი სტუდენტებს, რათა შეძლონ გაწევრიანება.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <span className="flex-1 rounded-md bg-muted p-3 text-center text-2xl font-bold tracking-wider">
            {group.groupCode}
          </span>
          <Button variant="outline" onClick={() => handleCopyCode(group.groupCode)}>
            <ClipboardCopy className="mr-2 h-4 w-4" />
            დაკოპირება
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="danger" onClick={handleDeleteGroup} disabled={isDeletingGroup}>
          <Trash2 className="mr-2 h-4 w-4" />
          {isDeletingGroup ? 'იშლება ჯგუფი...' : 'წაშალე ჯგუფი'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GroupDetailCode;
