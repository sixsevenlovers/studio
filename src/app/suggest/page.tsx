import { AppHeader } from "@/components/layout/app-header";
import { HabitSuggester } from "@/components/suggest/habit-suggester";

export default function SuggestPage() {
  return (
    <>
      <AppHeader title="AI Suggestions" />
      <main className="flex-1 p-4 md:p-6">
        <HabitSuggester />
      </main>
    </>
  );
}
