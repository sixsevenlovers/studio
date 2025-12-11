import type { Achievement, Habit, HabitCompletion } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { differenceInCalendarDays, isSameDay, parseISO, startOfDay } from 'date-fns';

const getImage = (id: string) => {
  const img = PlaceHolderImages.find(p => p.id === id);
  if (!img) throw new Error(`Placeholder image with id "${id}" not found.`);
  return img;
};

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
    for (let i = 1; i < uniqueDates.length; i++) {
        const diff = differenceInCalendarDays(uniqueDates[i-1], uniqueDates[i]);
        if (diff === 1) {
            streak++;
        } else {
            break; // End of consecutive days.
        }
    }

    return streak;
};

export const achievements: Achievement[] = [
  {
    id: 'first-habit-completed',
    title: 'First Step',
    description: 'Complete any habit for the first time.',
    image: getImage('first-habit-completed'),
    difficulty: 'easy',
    isUnlocked: (habits: Habit[]) => habits.some(h => h.completions.length > 0),
  },
  {
    id: '7-day-streak',
    title: 'Week-long Warrior',
    description: 'Maintain a 7-day streak for any habit.',
    image: getImage('7-day-streak'),
    difficulty: 'easy',
    isUnlocked: (habits: Habit[]) => habits.some(h => getStreak(h.completions) >= 7),
  },
  {
    id: '30-day-streak',
    title: 'Month of Mastery',
    description: 'Maintain a 30-day streak for any habit.',
    image: getImage('30-day-streak'),
    difficulty: 'medium',
    isUnlocked: (habits: Habit[]) => habits.some(h => getStreak(h.completions) >= 30),
  },
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Complete a morning habit 10 times.',
    image: getImage('early-bird'),
    difficulty: 'medium',
    isUnlocked: (habits: Habit[]) => {
      const morningHabits = habits.filter(h => h.timeOfDay === 'morning');
      return morningHabits.some(h => h.completions.length >= 10);
    }
  },
  {
    id: 'perfect-week',
    title: 'Perfect Week',
    description: 'Complete all your daily habits for 7 consecutive days.',
    image: getImage('perfect-week'),
    difficulty: 'hard',
    isUnlocked: (habits: Habit[]) => {
      const dailyHabits = habits.filter(h => h.frequency === 'daily');
      if(dailyHabits.length === 0) return false;
      return dailyHabits.every(h => getStreak(h.completions) >= 7);
    }
  },
  {
    id: 'habit-master',
    title: 'Habit Master',
    description: 'Complete any habit 100 times.',
    image: getImage('habit-master'),
    difficulty: 'hard',
    isUnlocked: (habits: Habit[]) => habits.some(h => h.completions.length >= 100),
  }
];
