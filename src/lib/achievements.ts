import type { Achievement, Habit, HabitCompletion } from '@/lib/types';
import { differenceInCalendarDays, isSameDay, parseISO, startOfDay } from 'date-fns';

const getStreak = (completions: HabitCompletion[]): number => {
    if (completions.length === 0) return 0;

    const sortedDates = completions
      .map(c => startOfDay(parseISO(c.date)))
      .sort((a, b) => b.getTime() - a.getTime());

    const uniqueDates = sortedDates.filter((date, index, self) =>
      index === self.findIndex(d => isSameDay(d, date))
    );

    if (uniqueDates.length === 0) return 0;

    const today = startOfDay(new Date());
    if (differenceInCalendarDays(today, uniqueDates[0]) > 1) {
        return 0; // Streak is broken if the last completion was more than a day ago.
    }

    let streak = 1;
    if (differenceInCalendarDays(today, uniqueDates[0]) <= 1) {
      for (let i = 1; i < uniqueDates.length; i++) {
          const diff = differenceInCalendarDays(uniqueDates[i-1], uniqueDates[i]);
          if (diff === 1) {
              streak++;
          } else {
              break; // End of consecutive days.
          }
      }
    }
    
    return streak;
};

export const achievements: Achievement[] = [
  {
    id: 'first-habit-completed',
    title: 'First Step',
    description: 'Complete any habit for the first time.',
    emoji: '🚀',
    difficulty: 'easy',
    isUnlocked: (habits: Habit[]) => habits.some(h => h.completions.length > 0),
  },
  {
    id: 'habit-collector',
    title: 'Habit Collector',
    description: 'Create at least 5 different habits.',
    emoji: '📚',
    difficulty: 'easy',
    isUnlocked: (habits: Habit[]) => habits.length >= 5,
  },
  {
    id: '7-day-streak',
    title: 'Week-long Warrior',
    description: 'Maintain a 7-day streak for any habit.',
    emoji: '⚔️',
    difficulty: 'easy',
    isUnlocked: (habits: Habit[]) => habits.some(h => getStreak(h.completions) >= 7),
  },
  {
    id: '30-day-streak',
    title: 'Month of Mastery',
    description: 'Maintain a 30-day streak for any habit.',
    emoji: '🏆',
    difficulty: 'medium',
    isUnlocked: (habits: Habit[]) => habits.some(h => getStreak(h.completions) >= 30),
  },
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Complete a morning habit 10 times.',
    emoji: '☀️',
    difficulty: 'medium',
    isUnlocked: (habits: Habit[]) => {
      const morningHabits = habits.filter(h => h.timeOfDay === 'morning');
      return morningHabits.some(h => h.completions.length >= 10);
    }
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Complete an evening habit 10 times.',
    emoji: '🌙',
    difficulty: 'medium',
    isUnlocked: (habits: Habit[]) => {
        const eveningHabits = habits.filter(h => h.timeOfDay === 'evening');
        return eveningHabits.some(h => h.completions.length >= 10);
    }
  },
  {
    id: '60-day-streak',
    title: 'Two-Month Titan',
    description: 'Maintain a 60-day streak for any habit.',
    emoji: '💪',
    difficulty: 'hard',
    isUnlocked: (habits: Habit[]) => habits.some(h => getStreak(h.completions) >= 60),
  },
  {
    id: '90-day-streak',
    title: 'Three-Month Triumph',
    description: 'Maintain a 90-day streak for any habit.',
    emoji: '🎉',
    difficulty: 'hard',
    isUnlocked: (habits: Habit[]) => habits.some(h => getStreak(h.completions) >= 90),
  },
  {
    id: '180-day-streak',
    title: 'Half-Year Hero',
    description: 'Maintain a 180-day streak for any habit.',
    emoji: '🦸',
    difficulty: 'hard',
    isUnlocked: (habits: Habit[]) => habits.some(h => getStreak(h.completions) >= 180),
  },
  {
    id: '365-day-streak',
    title: 'Yearly Legend',
    description: 'Maintain a 365-day streak for any habit.',
    emoji: '⭐',
    difficulty: 'hard',
    isUnlocked: (habits: Habit[]) => habits.some(h => getStreak(h.completions) >= 365),
  },
  {
    id: 'perfect-week',
    title: 'Perfect Week',
    description: 'Complete all your daily habits for 7 consecutive days.',
    emoji: '🌟',
    difficulty: 'hard',
    isUnlocked: (habits: Habit[]) => {
      const dailyHabits = habits.filter(h => h.frequency === 'daily');
      if(dailyHabits.length === 0) return false;
      return dailyHabits.every(h => getStreak(h.completions) >= 7);
    }
  },
  {
    id: 'perfect-month',
    title: 'Perfect Month',
    description: 'Complete all your daily habits for 30 consecutive days.',
    emoji: '🏅',
    difficulty: 'hard',
    isUnlocked: (habits: Habit[]) => {
        const dailyHabits = habits.filter(h => h.frequency === 'daily');
        if (dailyHabits.length === 0) return false;
        return dailyHabits.every(h => getStreak(h.completions) >= 30);
    }
  },
  {
    id: 'habit-master',
    title: 'Habit Master',
    description: 'Complete any habit 100 times.',
    emoji: '👑',
    difficulty: 'hard',
    isUnlocked: (habits: Habit[]) => habits.some(h => h.completions.length >= 100),
  }
];
