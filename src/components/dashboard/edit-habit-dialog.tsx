'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Habit } from '@/lib/types';
import { useHabit } from '@/hooks/use-habit';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const habitSchema = z.object({
  name: z.string().min(3, { message: 'Habit name must be at least 3 characters long.' }),
  frequency: z.enum(['daily', 'weekly', 'weekdays', 'weekends']),
  timeOfDay: z.enum(['any', 'morning', 'afternoon', 'evening']),
});

type HabitFormData = z.infer<typeof habitSchema>;

type EditHabitDialogProps = {
  habit: Habit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditHabitDialog({ habit, open, onOpenChange }: EditHabitDialogProps) {
  const { updateHabit } = useHabit();
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: habit.name,
      frequency: habit.frequency,
      timeOfDay: habit.timeOfDay,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: habit.name,
        frequency: habit.frequency,
        timeOfDay: habit.timeOfDay,
      });
    }
  }, [habit, open, reset]);

  const onSubmit = (data: HabitFormData) => {
    updateHabit(habit.id, data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>
              Update the details of your habit.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Habit
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  placeholder="e.g., Read for 15 minutes"
                  {...register('name')}
                />
                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">
                Frequency
              </Label>
              <Controller
                name="frequency"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="weekdays">Weekdays</SelectItem>
                      <SelectItem value="weekends">Weekends</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="timeOfDay" className="text-right">
                Time of Day
              </Label>
              <Controller
                name="timeOfDay"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select time of day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Time</SelectItem>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
