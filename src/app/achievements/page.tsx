import { AppHeader } from "@/components/layout/app-header";
import { AchievementsClient } from "@/components/achievements/achievements-client";

export default function AchievementsPage() {
  return (
    <>
      <AppHeader title="Achievements" />
      <main className="flex-1 p-4 md:p-6">
        <AchievementsClient />
      </main>
    </>
  );
}
