import { AppHeader } from "@/components/layout/app-header";
import { YearlyProgressClient } from "@/components/progress/yearly-progress-client";

export default function YearlyProgressPage() {
  return (
    <>
      <AppHeader title="Yearly Progress" />
      <main className="flex-1 p-4 md:p-6">
        <YearlyProgressClient />
      </main>
    </>
  );
}
