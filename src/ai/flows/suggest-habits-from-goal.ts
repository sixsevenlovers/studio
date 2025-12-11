'use server';
/**
 * @fileOverview This file defines a Genkit flow that suggests relevant habits based on user-defined goals and interests.
 *
 * - suggestHabitsFromGoal - A function that takes user goals and interests as input and returns a list of suggested habits.
 * - SuggestHabitsFromGoalInput - The input type for the suggestHabitsFromGoal function.
 * - SuggestHabitsFromGoalOutput - The output type for the suggestHabitsFromGoal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHabitsFromGoalInputSchema = z.object({
  goal: z
    .string()
    .describe('The user-defined goal for which habits are to be suggested.'),
  interests: z
    .string()
    .describe('The user-defined interests to tailor the habit suggestions.'),
  calendarEvents: z
    .string()
    .optional()
    .describe('User calendar events to incorporate into habit suggestions')
});
export type SuggestHabitsFromGoalInput = z.infer<typeof SuggestHabitsFromGoalInputSchema>;

const SuggestHabitsFromGoalOutputSchema = z.object({
  suggestedHabits: z
    .array(z.string())
    .describe('A list of suggested habits based on the user goal and interests.'),
});
export type SuggestHabitsFromGoalOutput = z.infer<typeof SuggestHabitsFromGoalOutputSchema>;

export async function suggestHabitsFromGoal(input: SuggestHabitsFromGoalInput): Promise<SuggestHabitsFromGoalOutput> {
  return suggestHabitsFromGoalFlow(input);
}

const suggestHabitsFromGoalPrompt = ai.definePrompt({
  name: 'suggestHabitsFromGoalPrompt',
  input: {schema: SuggestHabitsFromGoalInputSchema},
  output: {schema: SuggestHabitsFromGoalOutputSchema},
  prompt: `You are a helpful AI assistant that suggests habits to users based on their goals and interests.

  Goal: {{{goal}}}
  Interests: {{{interests}}}
  Calendar Events: {{{calendarEvents}}}

  Please suggest a list of habits that would help the user achieve their goal, considering their interests and calendar events if present. The habits should be specific, measurable, achievable, relevant, and time-bound (SMART).

  Format your response as a JSON array of strings. Each string in the array should be a suggested habit.
  `,
});

const suggestHabitsFromGoalFlow = ai.defineFlow(
  {
    name: 'suggestHabitsFromGoalFlow',
    inputSchema: SuggestHabitsFromGoalInputSchema,
    outputSchema: SuggestHabitsFromGoalOutputSchema,
  },
  async input => {
    const {output} = await suggestHabitsFromGoalPrompt(input);
    return output!;
  }
);
