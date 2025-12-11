'use server';

import { suggestHabitsFromGoal, SuggestHabitsFromGoalInput } from '@/ai/flows/suggest-habits-from-goal';
import { z } from 'zod';

const SuggestSchema = z.object({
  goal: z.string().min(1, "Goal is required."),
  interests: z.string().min(1, "Interests are required."),
  calendarEvents: z.string().optional(),
});

export async function getHabitSuggestions(prevState: any, formData: FormData) {
  const validatedFields = SuggestSchema.safeParse({
    goal: formData.get('goal'),
    interests: formData.get('interests'),
    calendarEvents: formData.get('calendarEvents'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
      suggestions: null,
    };
  }
  
  try {
    const input: SuggestHabitsFromGoalInput = {
      goal: validatedFields.data.goal,
      interests: validatedFields.data.interests,
      calendarEvents: validatedFields.data.calendarEvents,
    };

    const result = await suggestHabitsFromGoal(input);
    return {
      message: 'Success',
      errors: null,
      suggestions: result.suggestedHabits,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred while getting suggestions.',
      errors: null,
      suggestions: null,
    };
  }
}
