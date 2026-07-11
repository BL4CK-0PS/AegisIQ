import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-surface-950">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)] p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
