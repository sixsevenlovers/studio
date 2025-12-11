'use client';

import { useMemo } from 'react';
import { useHabit } from '@/hooks/use-habit';
import { isSameMonth, subMonths, format, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export function YearlyProgressChart() {
  const { habits } = useHabit();

  const yearlyData = useMemo(() => {
    const today = new Date();
    const last12Months = Array.from({ length: 12 }, (_, i) => subMonths(today, i)).reverse();

    const allCompletions = habits.flatMap(habit => habit.completions);

    const data = last12Months.map(month => {
      const monthCompletions = allCompletions.filter(completion =>
        isSameMonth(parseISO(completion.date), month)
      );
      return {
        name: format(month, 'MMM'),
        completions: monthCompletions.length,
      };
    });
    
    return data;
  }, [habits]);

  const chartConfig = {
    completions: {
      label: 'Completions',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Progress</CardTitle>
        <CardDescription>Your habit completions over the last 12 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <BarChart data={yearlyData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="completions" fill="var(--color-completions)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  </change>
  <change>
    <file>/src/components/progress/yearly-progress-client.tsx</file>
    <content><![CDATA['use client';

import { useHabit } from '@/hooks/use-habit';
import { Skeleton } from '@/components/ui/skeleton';
import { YearlyProgressChart } from '@/components/progress/yearly-progress-chart';
import { EmptyState } from '../dashboard/empty-state';

export function YearlyProgressClient() {
  const { habits, loading } = useHabit();

  if (loading) {
    return (
        <Skeleton className="h-96 w-full" />
    );
  }

  if (habits.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-6">
      <YearlyProgressChart />
    </div>
  );
}
