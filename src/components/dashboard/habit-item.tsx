'use client';

import { useState, useMemo } from 'react';
import type { Habit } from '@/lib/types';
import { useHabit } from '@/hooks/use-habit';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Flame, Repeat, CalendarDays, Sunrise, Sun, Sunset, Sparkles, MoreVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format, isToday, parseISO } from 'date-fns';

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
  const { toggleHabitCompletion, getCompletionForToday, getStreak, deleteHabit } = useHabit();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const completion = useMemo(() => getCompletionForToday(habit.id), [habit.id, getCompletionForToday]);
  const completed = !!completion;
  const streak = getStreak(habit.id);
  const FrequencyIcon = frequencyIcons[habit.frequency];
  const TimeIcon = timeOfDayIcons[habit.timeOfDay];

  const handleDelete = () => {
    deleteHabit(habit.id);
    setShowDeleteConfirm(false);
  };

  const today = new Date();

  const completionTime = useMemo(() => {
    if (completion) {
      return parseISO(completion.date);
    }
    return null;
  }, [completion]);

  return (
    <>
      <Card className={cn(
          "transition-all duration-300",
          completed ? "bg-primary/10 border-primary/40" : ""
      )}>
        <CardHeader>
          <div className="flex justify-between items-start">
              <div className='flex-1 pr-4'>
                  <CardTitle className="text-lg">{habit.name}</CardTitle>
                  <CardDescription className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1">
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
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-primary">
                  <Flame className={cn("size-5", streak > 0 ? "text-amber-500" : "text-muted-foreground/50")} />
                  <span className="font-bold text-lg">{streak}</span>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setShowDeleteConfirm(true)} className="text-destructive">
                            <Trash2 className="mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
            <span className="flex-1 text-left">
              {completed && completionTime ? `Completed at ${format(completionTime, 'p')}` : 'Mark as Complete'}
            </span>
            <span className="text-xs opacity-70">{format(today, 'MMM d')}</span>
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{habit.name}" habit and all its completion data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
