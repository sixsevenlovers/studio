import { AppHeader } from "@/components/layout/app-header";
import { AddHabitDialog } from "@/components/dashboard/add-habit-dialog";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default function DashboardPage() {
  return (
    <>
      <AppHeader title="Dashboard">
        <AddHabitDialog />
      </AppHeader>
      <main className="flex flex-1 flex-col">
        <DashboardClient />
      </main>
    </>
  );
}
