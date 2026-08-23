"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  LayoutDashboard, 
  Map, 
  TrendingUp, 
  Menu,
  Sparkles
} from "lucide-react";
import { useSidebar } from "@/components/common/SidebarContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { toggleMobile } = useSidebar();

  const navItems = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/peta", label: "Peta", icon: Map },
    { href: "/forecasting", label: "AI Forecast", icon: Sparkles },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-orange-200/90 bg-white/95 px-2 backdrop-blur-xl shadow-2xl md:hidden"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              "flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 transition-all " +
              (isActive
                ? "text-[#EA580C] font-black"
                : "text-slate-500 hover:text-[#EA580C]")
            }
          >
            <div
              className={
                "flex h-8 w-8 items-center justify-center rounded-xl transition-all " +
                (isActive
                  ? "bg-gradient-to-tr from-[#F58220] to-[#EA580C] text-white shadow-md shadow-orange-500/30 scale-105"
                  : "bg-transparent text-slate-500")
              }
            >
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
          </Link>
        );
      })}

      {/* Menu Drawer Toggle Button */}
      <button
        onClick={toggleMobile}
        className="flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 text-slate-500 hover:text-[#EA580C] transition-all"
        aria-label="Buka Semua Menu"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100/80 text-[#EA580C] shadow-xs">
          <Menu className="h-4 w-4" />
        </div>
        <span className="text-[10px] font-black tracking-tight text-[#EA580C]">Semua Menu</span>
      </button>
    </nav>
  );
}
