'use client';

import type { Habit } from '@/lib/types';
import { useHabit } from '@/hooks/use-habit';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Flame, Repeat, CalendarDays, Sunrise, Sun, Sunset, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        <Button
            variant={completed ? "default" : "outline"}
            className="w-full"
            onClick={() => toggleHabitCompletion(habit.id, new Date())}
        >
            <Checkbox checked={completed} className="mr-2" readOnly/>
            {completed ? 'Completed Today!' : 'Mark as Complete'}
        </Button>
      </CardContent>
    </Card>
  );
}
