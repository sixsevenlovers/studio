'use client';

import { useContext } from 'react';
import HabitContext from '@/context/HabitProvider';

export const useHabit = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
};
