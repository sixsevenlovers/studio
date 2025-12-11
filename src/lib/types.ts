import type { ImagePlaceholder } from '@/lib/placeholder-images';

export type Habit = {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'weekdays' | 'weekends';
  timeOfDay: 'any' | 'morning' | 'afternoon' | 'evening';
  createdAt: string;
  completions: { date: string }[];
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  image: ImagePlaceholder;
  isUnlocked: (habits: Habit[]) => boolean;
};

export type NavItem = {
  href: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
};
