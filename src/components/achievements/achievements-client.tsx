'use client';

import { useHabit } from '@/hooks/use-habit';
import { achievements } from '@/lib/achievements';
import { AchievementCard } from './achievement-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import type { Achievement } from '@/lib/types';

export function AchievementsClient() {
  const { habits, loading } = useHabit();

  const groupedAchievements = useMemo(() => {
    const groups: Record<string, Achievement[]> = {
      easy: [],
      medium: [],
      hard: [],
    };

    const sortedAchievements = [...achievements].sort((a, b) => {
        const aUnlocked = a.isUnlocked(habits);
        const bUnlocked = b.isUnlocked(habits);
        if (aUnlocked === bUnlocked) return 0;
        return aUnlocked ? -1 : 1;
    });

    sortedAchievements.forEach(achievement => {
      groups[achievement.difficulty].push(achievement);
    });

    return groups;
  }, [habits]);

  if (loading) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-28 w-full" />
            ))}
        </div>
    );
  }

  const difficultyOrder: (keyof typeof groupedAchievements)[] = ['easy', 'medium', 'hard'];

  return (
    <div className="space-y-8">
      {difficultyOrder.map(difficulty => (
        groupedAchievements[difficulty].length > 0 && (
          <section key={difficulty}>
            <h2 className="text-2xl font-bold tracking-tight mb-4 capitalize">{difficulty} Achievements</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groupedAchievements[difficulty].map(achievement => (
                <AchievementCard 
                  key={achievement.id}
                  achievement={achievement}
                  isUnlocked={achievement.isUnlocked(habits)}
                />
              ))}
            </div>
          </section>
        )
      ))}
    </div>
  );
}
