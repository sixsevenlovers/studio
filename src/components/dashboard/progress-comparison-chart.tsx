'use client';

import { useMemo } from 'react';
import { useHabit } from '@/hooks/use-habit';
import { isSameDay, isWeekend, subDays, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export function ProgressComparisonChart() {
  const { habits } = useHabit();

  const getHabitsForDate = (date: Date) => {
    return habits.filter(habit => {
      switch (habit.frequency) {
        case 'daily':
          return true;
        case 'weekdays':
          return !isWeekend(date);
        case 'weekends':
          return isWeekend(date);
        case 'weekly':
          const lastCompletion = habit.completions.length > 0
            ? parseISO(habit.completions[habit.completions.length - 1].date)
            : null;
          if (!lastCompletion) return true;
          // Check if it was completed in the 7 days prior to 'date'
          const diff = Math.abs(date.getTime() - lastCompletion.getTime());
          const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
          return diffDays >= 7;
        default:
          return false;
      }
    });
  };

  const getCompletedCountForDate = (date: Date) => {
    const relevantHabits = getHabitsForDate(date);
    return relevantHabits.filter(habit =>
      habit.completions.some(c => isSameDay(parseISO(c.date), date))
    ).length;
  };
  
  const comparisonData = useMemo(() => {
    const today = new Date();
    const yesterday = subDays(today, 1);

    const todaysHabits = getHabitsForDate(today);
    const yesterdaysHabits = getHabitsForDate(yesterday);

    const todayCompleted = getCompletedCountForDate(today);
    const yesterdayCompleted = getCompletedCountForDate(yesterday);

    const todayPercentage = todaysHabits.length > 0 ? (todayCompleted / todaysHabits.length) * 100 : 0;
    const yesterdayPercentage = yesterdaysHabits.length > 0 ? (yesterdayCompleted / yesterdaysHabits.length) * 100 : 0;

    return [
      { name: 'Yesterday', completed: Math.round(yesterdayPercentage) },
      { name: 'Today', completed: Math.round(todayPercentage) },
    ];
  }, [habits]);

  const chartConfig = {
    completed: {
      label: 'Completed',
      color: 'hsl(var(--primary))',
    },
  };

  if (habits.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Comparison</CardTitle>
        <CardDescription>Your habit completion for today vs. yesterday.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-48 w-full">
            <BarChart data={comparisonData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis unit="%" tickLine={false} tickMargin={10} axisLine={false} domain={[0, 100]} />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
