import { TimeBasedAvgScore } from '@/types';
import { useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

type MonthlyAverageScore = {
  date: string; // Format: "MM/YYYY"
  score: number;
};

interface ScorePerformanceChartProps {
  title: string;
  timeBasedAvgScores?: TimeBasedAvgScore[];
}

const ScorePerformanceChart = ({ title, timeBasedAvgScores }: ScorePerformanceChartProps) => {
  const monthlyAverages = useMemo((): MonthlyAverageScore[] => {
    if (!timeBasedAvgScores) return [];

    return timeBasedAvgScores.map((avgScore) => {
      const date = new Date(avgScore.dateTime);
      const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

      return {
        date: formattedDate,
        score: avgScore.totalScoreAvg,
      };
    });
  }, [timeBasedAvgScores]);

  const tooltipFormatter = useCallback((value: number) => [`საშუალო ქულა: ${value} / 16`], []);

  const tooltipLabelFormatter = useCallback((label: string) => `თარიღი: ${label}`, []);

  if (monthlyAverages.length < 2) {
    return null;
  }

  return (
    <Card className="glass border-border/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer
            className="h-80 w-full"
            config={{
              score: {
                theme: {
                  light: '#9333ea',
                  dark: '#9333ea',
                },
                label: 'Average Score',
              },
            }}
          >
            <LineChart data={monthlyAverages} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" stroke="#6a7387" />
              <YAxis domain={[0, 16]} stroke="#6a7387" />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={tooltipFormatter}
                labelFormatter={tooltipLabelFormatter}
              />

              <Line
                type="monotone"
                dataKey="score"
                name="score"
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

export default ScorePerformanceChart;
