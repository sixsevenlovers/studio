'use client';

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