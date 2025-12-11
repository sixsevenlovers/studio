'use client';

import { useHabit } from '@/hooks/use-habit';
import { HabitListClient } from './habit-list-client';
import { EmptyState } from './empty-state';
import { Skeleton } from '../ui/skeleton';
import { DailyProgressChart } from './daily-progress-chart';
import { FlowerFriend } from './flower-friend';

export function DashboardClient() {
  const { habits, loading } = useHabit();

  if (loading) {
    return <div className="flex-1 p-4 md:p-6"><Skeleton className="h-48 w-full" /></div>;
  }
  
  return (
    <div className="flex-1 p-4 md:p-6">
      {habits.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <FlowerFriend />
            <DailyProgressChart />
          </div>
          <div className="lg:col-span-2">
            <HabitListClient />
          </div>
        </div>
      ) : <EmptyState />}
    </div>
  );
}
