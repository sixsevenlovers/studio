'use client';

import type { Habit } from '@/lib/types';
import { useHabit } from '@/hooks/use-habit';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Flame, Repeat, CalendarDays, Sunrise, Sun, Sunset, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

type HabitItemProps = {
  habit: Habit;
};

const frequencyIcons = {
  daily: Repeat,
  weekly: Repeat,
  weekdays: CalendarDays,
  weekends: CalendarDays,
};

const timeOfDayIcons = {
  any: Sparkles,
  morning: Sunrise,
  afternoon: Sun,
evening: Sunset,
};

export function HabitItem({ habit }: HabitItemProps) {
  const { toggleHabitCompletion, isCompletedToday, getStreak } = useHabit();
  const completed = isCompletedToday(habit.id);
  const streak = getStreak(habit.id);
  const FrequencyIcon = frequencyIcons[habit.frequency];
  const TimeIcon = timeOfDayIcons[habit.timeOfDay];

  return (
    <Card className={cn(
        "transition-all duration-300",
        completed ? "bg-primary/10 border-primary/40" : ""
    )}>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-lg">{habit.name}</CardTitle>
                <CardDescription className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1.5 text-xs capitalize">
                        <FrequencyIcon className="size-3.5" />
                        {habit.frequency}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs capitalize">
                        <TimeIcon className="size-3.5" />
                        {habit.timeOfDay}
                    </span>
                </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-primary">
                <Flame className={cn("size-5", streak > 0 ? "text-amber-500" : "text-muted-foreground/50")} />
                <span className="font-bold text-lg">{streak}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          role="button"
          tabIndex={0}
          aria-pressed={completed}
          onClick={() => toggleHabitCompletion(habit.id, new Date())}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleHabitCompletion(habit.id, new Date());
            }
          }}
          className={cn(
            buttonVariants({ variant: completed ? "default" : "outline" }),
            "w-full cursor-pointer"
          )}
        >
          <Checkbox checked={completed} readOnly aria-hidden="true" tabIndex={-1} className="mr-2 pointer-events-none"/>
          <span>
            {completed ? 'Completed Today!' : 'Mark as Complete'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
