"use client";

import React from "react";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { useSidebar } from "@/components/common/SidebarContext";

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FFFDF9]">
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <main
          className={
            "flex-1 w-full min-w-0 px-3.5 py-6 sm:px-6 md:px-8 transition-all duration-300 ease-in-out " +
            (isOpen ? "md:ml-64" : "md:ml-0")
          }
        >
          <div className="mx-auto max-w-7xl w-full overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
