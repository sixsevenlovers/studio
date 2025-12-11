import { AddHabitDialog } from './add-habit-dialog';

export function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          You have no habits yet
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Start building a better you by adding your first habit.
        </p>
        <div className="flex gap-4">
          <AddHabitDialog />
        </div>
      </div>
    </div>
  );
}
