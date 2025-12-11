import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { LucideIcon } from 'lucide-react';

export type HabitCompletion = {
  date: string; // ISO 8601 format
};

export type Habit = {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'weekdays' | 'weekends';
  timeOfDay: 'any' | 'morning' | 'afternoon' | 'evening';
  createdAt: string;
  completions: HabitCompletion[];
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
  icon: React.ComponentType<{ className?: string }> | LucideIcon;
};
