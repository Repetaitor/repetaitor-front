import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NavigationRoute } from '@/types';

interface GroupDetailHeaderProps {
  groupName: string;
}

const GroupDetailHeader = ({ groupName }: GroupDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={() => navigate(NavigationRoute.GROUPS)}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{groupName}</h1>
        <p className="text-muted-foreground">მართე ჯგუფის დავალებები და სტუდენტები.</p>
      </div>
    </div>
  );
};

export default GroupDetailHeader;
