'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { useHabit } from '@/hooks/use-habit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isToday, isWeekend, parseISO } from 'date-fns';
import { getFlowerStage, flowerStages } from '@/lib/flower';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function FlowerFriend() {
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
  
  const completionPercentage = todaysHabits.length > 0 ? completedCount / todaysHabits.length : 0;
  
  const currentStage = getFlowerStage(completionPercentage);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Flower Friend</CardTitle>
        <CardDescription>{currentStage.message}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <div className="relative w-48 h-48">
          {flowerStages.map((stage, index) => (
            <Image
              key={stage.level}
              src={stage.image.imageUrl}
              alt={stage.name}
              width={192}
              height={192}
              className={cn(
                "absolute inset-0 rounded-full object-cover transition-opacity duration-700 ease-in-out",
                currentStage.level >= stage.level ? "opacity-100" : "opacity-0"
              )}
              data-ai-hint={stage.image.imageHint}
              priority={index === 0}
            />
          ))}
        </div>
        <div className='w-full space-y-1'>
            <div className='flex justify-between text-sm font-medium text-muted-foreground'>
                <span>Growth</span>
                <span>{Math.round(completionPercentage * 100)}%</span>
            </div>
            <Progress value={completionPercentage * 100} />
        </div>
      </CardContent>
    </Card>
  );
}
