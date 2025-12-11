'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { useHabit } from '@/hooks/use-habit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isToday, isWeekend, parseISO } from 'date-fns';
import { getFlowerStage } from '@/lib/flower';
import { Progress } from '@/components/ui/progress';

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
  
  const stage = getFlowerStage(completionPercentage);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Flower Friend</CardTitle>
        <CardDescription>{stage.message}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <div className="relative w-48 h-48">
           <Image
            src={stage.image.imageUrl}
            alt={stage.name}
            width={192}
            height={192}
            className="rounded-full object-cover"
            data-ai-hint={stage.image.imageHint}
          />
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
