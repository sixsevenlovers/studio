'use client';

import type { Habit } from '@/lib/types';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { differenceInCalendarDays, isSameDay, parseISO, startOfDay } from 'date-fns';

interface HabitContextType {
  habits: Habit[];
  loading: boolean;
  addHabit: (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => void;
  toggleHabitCompletion: (habitId: string, date: Date) => void;
  isCompletedToday: (habitId: string) => boolean;
  getStreak: (habitId: string) => number;
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

  const isCompletedToday = useCallback((habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return false;
    const today = new Date();
    return habit.completions.some(c => isSameDay(parseISO(c.date), today));
  }, [habits]);
  
  const getStreak = useCallback((habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit || habit.completions.length === 0) return 0;

    const sortedDates = habit.completions
      .map(c => startOfDay(parseISO(c.date)))
      .sort((a, b) => b.getTime() - a.getTime());

    const uniqueDates = sortedDates.filter((date, index, self) =>
      index === self.findIndex(d => isSameDay(d, date))
    );

    let streak = 0;
    const today = startOfDay(new Date());

    if (uniqueDates.length > 0 && (isSameDay(uniqueDates[0], today) || differenceInCalendarDays(today, uniqueDates[0]) === 1)) {
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
    <HabitContext.Provider value={{ habits, loading, addHabit, toggleHabitCompletion, isCompletedToday, getStreak }}>
      {children}
    </HabitContext.Provider>
  );
};

export default HabitContext;
