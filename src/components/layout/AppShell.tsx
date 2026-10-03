import { UnitProvider } from "@/features/units/UnitContext";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  return (
    <UnitProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </UnitProvider>
  );
}
