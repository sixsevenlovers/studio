'use client';

import { useHabit } from '@/hooks/use-habit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
import { useMemo } from 'react';
import { isToday, isWeekend, parseISO } from 'date-fns';

export function DailyProgressChart() {
  const { habits, isCompletedToday } = useHabit();
  
  const todaysHabits = useMemo(() => {
    const today = new Date();
    return habits.filter(habit => {
      switch (habit.frequency) {
        case 'daily':
          return true;
        case 'weekdays':
          return !isWeekend(today);
        case 'weekends':
          return isWeekend(today);
        case 'weekly':
          // Simple weekly check: if it has been completed in the last 7 days, we don't consider it for today's chart
          // A more complex implementation would be needed for true weekly tracking on a specific day.
          const lastCompletion = habit.completions.length > 0 
            ? parseISO(habit.completions[habit.completions.length - 1].date)
            : null;
          return !lastCompletion || !isToday(lastCompletion);
        default:
          return false;
      }
    });
  }, [habits]);

  const completedCount = useMemo(() => todaysHabits.filter(h => isCompletedToday(h.id)).length, [todaysHabits, isCompletedToday]);
  const pendingCount = todaysHabits.length - completedCount;

  const chartData = [
    { name: 'Completed', value: completedCount, fill: 'hsl(var(--primary))' },
    { name: 'Pending', value: pendingCount, fill: 'hsl(var(--muted))' },
  ];

  const chartConfig = {
    completed: { label: 'Completed', color: 'hsl(var(--primary))' },
    pending: { label: 'Pending', color: 'hsl(var(--muted))' },
  };
  
  if (todaysHabits.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Progress</CardTitle>
        <CardDescription>
          You've completed {completedCount} out of {todaysHabits.length} habits scheduled for today.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-48">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
                {chartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
