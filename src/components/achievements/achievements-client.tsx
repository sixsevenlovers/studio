'use client';

import { useHabit } from '@/hooks/use-habit';
import { achievements } from '@/lib/achievements';
import { AchievementCard } from './achievement-card';
import { Skeleton } from '@/components/ui/skeleton';

export function AchievementsClient() {
  const { habits, loading } = useHabit();

  if (loading) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-28 w-full" />
            ))}
        </div>
    );
  }

  const sortedAchievements = [...achievements].sort((a, b) => {
    const aUnlocked = a.isUnlocked(habits);
    const bUnlocked = b.isUnlocked(habits);
    if (aUnlocked === bUnlocked) return 0;
    return aUnlocked ? -1 : 1;
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sortedAchievements.map(achievement => (
        <AchievementCard 
          key={achievement.id}
          achievement={achievement}
          isUnlocked={achievement.isUnlocked(habits)}
        />
      ))}
    </div>
  );
}
