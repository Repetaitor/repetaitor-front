import { getFullName } from '@/lib/users.utils';
import { User } from '@/types';
import { UserIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';

interface UserInformationProps {
  user?: User;
}

const UserInformation = ({ user }: UserInformationProps) => {
  if (!user) return null;

  return (
    <Card className="border-muted/30">
      <CardHeader>
        <CardTitle>სტუდენტი</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getFullName(user)
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{getFullName(user)}</h3>
            <div className="mt-1 grid grid-cols-1 gap-y-1">
              <div className="flex items-center gap-1">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInformation;
