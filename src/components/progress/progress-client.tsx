'use client';

import { useHabit } from '@/hooks/use-habit';
import { Skeleton } from '@/components/ui/skeleton';
import { DailyProgressChart } from '@/components/dashboard/daily-progress-chart';
import { ProgressComparisonChart } from '@/components/dashboard/progress-comparison-chart';
import { EmptyState } from '../dashboard/empty-state';

export function ProgressClient() {
  const { habits, loading } = useHabit();

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (habits.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <DailyProgressChart />
      <ProgressComparisonChart />
    </div>
  );
}
