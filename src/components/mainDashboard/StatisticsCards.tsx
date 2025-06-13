import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';
import { LucideSVG } from '@/types';

interface StatisticsCardProps {
  statCards: { title: string; description?: string; color: string; icon: LucideSVG; value: number | string }[];
}

const StatisticsCards = ({ statCards }: StatisticsCardProps) => {
  return (
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
  );
};

export default StatisticsCards;
