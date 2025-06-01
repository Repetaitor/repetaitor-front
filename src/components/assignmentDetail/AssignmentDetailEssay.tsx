import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Essay } from '@/types';

interface AssignmentDetailEssayProps {
  essay: Essay;
}

const AssignmentDetailEssay = ({ essay }: AssignmentDetailEssayProps) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>ესეს დეტალები</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 font-medium">აღწერა</h3>
          <p className="text-muted-foreground">{essay.essayDescription}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-muted/30 pt-4">
          <div>
            <h3 className="mb-1 text-sm font-medium">საჭირო სიტყვების რაოდენობა</h3>
            <p>{essay.expectedWordCount} სიტყვა</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentDetailEssay;
