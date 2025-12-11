'use client';

import type { Habit, HabitCompletion } from '@/lib/types';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { differenceInCalendarDays, isSameDay, parseISO, startOfDay } from 'date-fns';

interface HabitContextType {
  habits: Habit[];
  loading: boolean;
  addHabit: (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => void;
  toggleHabitCompletion: (habitId: string, date: Date) => void;
  isCompletedToday: (habitId: string) => boolean;
  getCompletionForToday: (habitId: string) => HabitCompletion | undefined;
  getStreak: (habitId: string) => number;
  deleteHabit: (habitId: string) => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const HABITS_STORAGE_KEY = 'habitual-habits';

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      }
    } catch (error) {
      console.error("Failed to parse habits from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
      } catch (error) {
        console.error("Failed to save habits to localStorage", error);
      }
    }
  }, [habits, loading]);

  const addHabit = useCallback((habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completions: [],
    };
    setHabits(prev => [...prev, newHabit]);
  }, []);

  const deleteHabit = useCallback((habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
  }, []);

  const toggleHabitCompletion = useCallback((habitId: string, date: Date) => {
    setHabits(prev =>
      prev.map(habit => {
        if (habit.id === habitId) {
          const completionIndex = habit.completions.findIndex(c => isSameDay(parseISO(c.date), date));
          const newCompletions = [...habit.completions];
          if (completionIndex > -1) {
            newCompletions.splice(completionIndex, 1);
          } else {
            newCompletions.push({ date: date.toISOString() });
          }
          return { ...habit, completions: newCompletions };
        }
        return habit;
      })
    );
  }, []);

  const getCompletionForToday = useCallback((habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return undefined;
    const today = new Date();
    return habit.completions.find(c => isSameDay(parseISO(c.date), today));
  }, [habits]);

  const isCompletedToday = useCallback((habitId: string) => {
    return !!getCompletionForToday(habitId);
  }, [getCompletionForToday]);
  
  const getStreak = useCallback((habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit || habit.completions.length === 0) return 0;

    const sortedDates = habit.completions
      .map(c => startOfDay(parseISO(c.date)))
      .sort((a, b) => b.getTime() - a.getTime());

    const uniqueDates = sortedDates.filter((date, index, self) =>
      index === self.findIndex(d => isSameDay(d, date))
    );

    if (uniqueDates.length === 0) return 0;
    
    const today = startOfDay(new Date());
    const mostRecentCompletion = uniqueDates[0];

    const diffFromToday = differenceInCalendarDays(today, mostRecentCompletion);

    if (diffFromToday > 1) {
      return 0;
    }
    
    let streak = 0;
    if (diffFromToday === 0 || diffFromToday === 1) {
      streak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
          const diff = differenceInCalendarDays(uniqueDates[i-1], uniqueDates[i]);
          if (diff === 1) {
              streak++;
          } else {
              break;
          }
      }
    }
    
    return streak;
  }, [habits]);

  return (
    <HabitContext.Provider value={{ habits, loading, addHabit, deleteHabit, toggleHabitCompletion, isCompletedToday, getCompletionForToday, getStreak }}>
      {children}
    </HabitContext.Provider>
  );
};

export default HabitContext;
