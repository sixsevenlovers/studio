'use client';

import { useHabit } from '@/hooks/use-habit';
import { HabitListClient } from './habit-list-client';
import { EmptyState } from './empty-state';
import { Skeleton } from '../ui/skeleton';

export function DashboardClient() {
  const { habits, loading } = useHabit();

  if (loading) {
    return <div className="flex-1 p-4 md:p-6"><Skeleton className="h-48 w-full" /></div>;
  }
  
  return (
    <div className="flex-1 p-4 md:p-6">
      {habits.length > 0 ? <HabitListClient /> : <EmptyState />}
    </div>
  );
}
