import { StudentAssignment } from '@/types';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

type MonthlyAverageScore = {
  date: string; // Format: "MM/YYYY"
  total: number;
};

interface PerformanceChartProps {
  assignments: StudentAssignment[];
}

const StudentPerformanceChart = ({ assignments }: PerformanceChartProps) => {
  const monthlyAverages = useMemo(() => {
    const groupedByMonth = assignments.reduce(
      (acc, assignment) => {
        const submitDate = new Date(assignment.submitDate);
        const monthYear = `${(submitDate.getMonth() + 1).toString().padStart(2, '0')}/${submitDate.getFullYear()}`;

        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(assignment);

        return acc;
      },
      {} as Record<string, StudentAssignment[]>,
    );

    const result: MonthlyAverageScore[] = Object.entries(groupedByMonth).map(([date, assignmentsInMonth]) => {
      const totalScore = assignmentsInMonth.reduce((sum, assignment) => sum + assignment.totalScore, 0);
      const averageTotalScore = totalScore / assignmentsInMonth.length;

      return {
        date,
        total: Math.round(averageTotalScore * 100) / 100, // Round to 2 decimal places
      };
    });

    return result.sort((a, b) => {
      const [monthA, yearA] = a.date.split('/').map(Number);
      const [monthB, yearB] = b.date.split('/').map(Number);

      if (yearA !== yearB) return yearA - yearB;
      return monthA - monthB;
    });
  }, [assignments]);

  if (monthlyAverages.length < 2) {
    return null;
  }

  return (
    <Card className="glass border-border/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer
            className="h-80 w-full"
            config={{
              total: {
                theme: {
                  light: '#9333ea',
                  dark: '#9333ea',
                },
                label: 'Total Score',
              },
            }}
          >
            <LineChart data={monthlyAverages} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" stroke="#6a7387" />
              <YAxis domain={[0, 8]} stroke="#6a7387" />
              <ChartTooltip content={<ChartTooltipContent />} />

              <Line
                type="monotone"
                dataKey="total"
                name="total"
                stroke="#9333ea"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentPerformanceChart;
