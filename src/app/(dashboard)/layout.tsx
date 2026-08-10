import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { DashboardSidebar } from "./_components/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SidebarProvider defaultOpen={true}>
        <div style={{ "--sidebar-width": "280px" } as React.CSSProperties}>
          <DashboardSidebar />
        </div>
        <main className="w-full">
          <div className="lg:hidden">
            <SidebarTrigger />
          </div>
          <div className="w-full">
            <div className="bg-[#F8F9FA] min-h-screen">{children}</div>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
