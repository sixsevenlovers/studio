'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getHabitSuggestions } from '@/app/suggest/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Plus, Sparkles, Loader2 } from 'lucide-react';
import { useHabit } from '@/hooks/use-habit';
import { useToast } from '@/hooks/use-toast';
import { AddHabitDialog } from '../dashboard/add-habit-dialog';

const initialState = {
  message: null,
  errors: null,
  suggestions: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2" />}
      Get Suggestions
    </Button>
  );
}

export function HabitSuggester() {
  const [state, formAction] = useFormState(getHabitSuggestions, initialState);
  const { addHabit } = useHabit();
  const { toast } = useToast();

  const handleAddHabit = (name: string) => {
    addHabit({
      name,
      frequency: 'daily',
      timeOfDay: 'any',
    });
    toast({
      title: 'Habit Added!',
      description: `"${name}" has been added to your dashboard.`,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>AI Habit Suggestions</CardTitle>
          <CardDescription>Tell us your goals and interests, and our AI will suggest relevant habits for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="goal">Your Main Goal</Label>
              <Input id="goal" name="goal" placeholder="e.g., Be more physically active" required />
              {state.errors?.goal && <p className="text-destructive text-sm mt-1">{state.errors.goal}</p>}
            </div>
            <div>
              <Label htmlFor="interests">Your Interests</Label>
              <Input id="interests" name="interests" placeholder="e.g., Hiking, reading, technology" required />
              {state.errors?.interests && <p className="text-destructive text-sm mt-1">{state.errors.interests}</p>}
            </div>
            <div>
              <Label htmlFor="calendarEvents">Existing Routines (Optional)</Label>
              <Textarea
                id="calendarEvents"
                name="calendarEvents"
                placeholder="Paste any existing calendar events or routines to help us tailor suggestions (e.g., 'Work meetings every weekday 9am-11am')"
                className="min-h-24"
              />
            </div>
            <div className="flex justify-end gap-2">
              <AddHabitDialog />
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Suggested Habits</CardTitle>
          <CardDescription>Here are some habits tailored for you. Add the ones you like!</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {state.suggestions ? (
            <ul className="space-y-3">
              {state.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-center justify-between gap-4 p-3 bg-secondary rounded-lg">
                  <span className="flex-1">{suggestion}</span>
                  <Button size="icon" variant="ghost" onClick={() => handleAddHabit(suggestion)}>
                    <Plus className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center bg-muted/50 rounded-lg p-6">
              <Lightbulb className="size-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your suggestions will appear here.</p>
            </div>
          )}
          {state.message && state.message !== 'Success' && <p className="text-destructive text-sm mt-4">{state.message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
