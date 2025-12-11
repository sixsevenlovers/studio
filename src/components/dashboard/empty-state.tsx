import { AddHabitDialog } from './add-habit-dialog';
import { Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          You have no habits yet
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Start building a better you. Add your first habit or get some AI-powered suggestions to get started.
        </p>
        <div className="flex gap-4">
          <AddHabitDialog />
          <Button variant="outline" asChild>
            <Link href="/suggest">
                <Lightbulb className="mr-2" />
                Get Suggestions
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
