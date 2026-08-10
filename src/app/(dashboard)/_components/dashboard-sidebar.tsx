"use client";

import {
  CircleHelp,
  ClipboardList,
  LogOut,
  Monitor,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import LogoutModal from "@/components/modals/logout-modal";
import { useState } from "react";
import { toast } from "sonner";

const items = [
  {
    title: "Request List",
    url: "/",
    icon: ClipboardList,
  },
  {
    title: "Feature Section",
    url: "/feature-section",
    icon: Monitor,
  },
  {
    title: "FAQ Section",
    url: "/faq",
    icon: CircleHelp,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathName = usePathname();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handLogout = async () => {
    try {
      toast.success("Logout successful!");
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <>
      <Sidebar className="w-[280px] border-r border-[#e5e5e5] bg-white">
        <SidebarContent className="scrollbar-hide bg-white px-3">
          <Link
            href="/"
            aria-label="Booking Is Yours home"
            className="mt-5 mb-7 flex flex-col items-center text-center text-[18px] font-semibold leading-[16px] text-[#28245f]"
          >
            <span>BOOKING IS</span>
            <span>YOURS</span>
          </Link>

          <SidebarMenu className="gap-2">
            {items.map((item) => {
              const isActive =
                item.url === "/"
                  ? pathName === "/"
                  : pathName === item.url || pathName.startsWith(`${item.url}/`);

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="h-11 gap-3 rounded-md px-5 text-sm font-medium text-[#777777] hover:bg-[#f4f3fa] hover:text-[#2d266d] data-[active=true]:bg-[#2d266d] data-[active=true]:text-white data-[active=true]:shadow-[0_2px_4px_rgba(45,38,109,0.18)]"
                  >
                    <Link href={item.url}>
                      <item.icon className="!h-4 !w-4 stroke-[1.5]" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}

            <SidebarMenuItem className="mt-1">
              <button
                type="button"
                onClick={() => setLogoutModalOpen(true)}
                className="flex h-11 w-full items-center gap-3 rounded-md px-5 text-sm font-medium text-[#ff1f2d] transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 stroke-[1.75]" />
                <span>Log Out</span>
              </button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      {logoutModalOpen && (
        <LogoutModal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handLogout}
        />
      )}
    </>
  );
}
