import { AppHeader } from "@/components/layout/app-header";
import { ProgressClient } from "@/components/progress/progress-client";

export default function ProgressPage() {
  return (
    <>
      <AppHeader title="Daily Progress" />
      <main className="flex-1 p-4 md:p-6">
        <ProgressClient />
      </main>
    </>
  );
}
