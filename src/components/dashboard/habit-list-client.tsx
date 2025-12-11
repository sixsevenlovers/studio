'use client';

import { useHabit } from '@/hooks/use-habit';
import { HabitItem } from './habit-item';
import { Skeleton } from '@/components/ui/skeleton';

export function HabitListClient() {
  const { habits, loading } = useHabit();

  if (loading) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-44 w-full" />
            ))}
        </div>
    );
  }

  const sortedHabits = [...habits].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
      {sortedHabits.map(habit => (
        <HabitItem key={habit.id} habit={habit} />
      ))}
    </div>
  );
}
