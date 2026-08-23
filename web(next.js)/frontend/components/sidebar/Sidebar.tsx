"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Map, 
  TrendingUp, 
  HeartHandshake, 
  Users, 
  DollarSign, 
  Sparkles,
  Layers,
  AlertTriangle,
  Sliders,
  ChevronLeft,
  X
} from "lucide-react";
import { useSidebar } from "@/components/common/SidebarContext";

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggleSidebar, isMobileOpen, closeMobile } = useSidebar();

  const navGroups = [
    {
      title: "Menu Utama",
      items: [
        { href: "/", label: "Beranda", icon: LayoutDashboard },
        { href: "/dashboard", label: "Dashboard Eksekutif", icon: LayoutDashboard },
        { href: "/peta", label: "Peta Interaktif", icon: Map },
        { href: "/ai-insight", label: "AI Insight BPS", icon: Sparkles, badge: "LLM" },
      ]
    },
    {
      title: "AI Predictive Analytics",
      items: [
        { href: "/forecasting", label: "AI Forecasting", icon: TrendingUp, badge: "ML" },
        { href: "/clustering", label: "Cluster Daerah", icon: Layers, badge: "K-Means" },
        { href: "/anomaly", label: "Deteksi Anomali", icon: AlertTriangle, badge: "Outlier" },
        { href: "/simulator", label: "Simulator Kebijakan", icon: Sliders, badge: "What-If" },
      ]
    },
    {
      title: "Indikator BPS",
      items: [
        { href: "/pdrb", label: "PDRB & Ekonomi", icon: DollarSign },
        { href: "/ipm", label: "IPM & Kesejahteraan", icon: HeartHandshake },
        { href: "/kemiskinan", label: "Kemiskinan & NTP", icon: TrendingUp },
        { href: "/penduduk", label: "Kependudukan & TPT", icon: Users },
      ]
    }
  ];

  return (
    <>
      {/* 1. Desktop Sidebar (Collapsible with smooth transition) */}
      <aside
        className={
          "fixed top-0 left-0 bottom-0 z-40 hidden flex-col border-r border-orange-200/80 bg-white/95 backdrop-blur-xl transition-all duration-300 ease-in-out md:flex " +
          (isOpen 
            ? "w-64 translate-x-0 opacity-100 shadow-lg shadow-orange-500/5" 
            : "w-0 -translate-x-full opacity-0 pointer-events-none")
        }
      >
        {/* Brand Header with Desktop Collapse Button */}
        <div className="flex h-16 items-center justify-between border-b border-orange-200/80 px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F58220] to-[#EA580C] text-white shadow-lg shadow-orange-500/20 ring-2 ring-white">
              <span className="text-lg font-black tracking-wider">ST</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-tight text-slate-900">BPS Sulteng</span>
                <span className="rounded-full bg-orange-100 px-1.5 py-0.2 text-[9px] font-extrabold text-[#EA580C]">AI 2.0</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-400">Official Statistics</p>
            </div>
          </Link>

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200 bg-orange-50/80 text-slate-500 hover:bg-orange-100 hover:text-[#EA580C] transition-all"
            title="Tutup Sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Nav Groups */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                {group.title}
              </div>
              <div className="mt-1 space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={
                        "group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all " +
                        (isActive
                          ? "bg-gradient-to-r from-[#F58220] to-[#EA580C] text-white shadow-md shadow-orange-500/20 font-black"
                          : "text-slate-600 hover:bg-orange-50 hover:text-[#EA580C]")
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={"h-4 w-4 " + (isActive ? "text-white" : "text-slate-400 group-hover:text-[#EA580C]")} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={
                            "rounded-full px-1.5 py-0.5 text-[9px] font-black " +
                            (isActive
                              ? "bg-white/20 text-white"
                              : "bg-orange-100 text-[#EA580C]")
                          }
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="border-t border-orange-200/80 p-4">
          <div className="rounded-2xl border border-orange-200/80 bg-orange-50/60 p-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Official BPS Domain 7200</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-500">
              13 Kabupaten/Kota Sulawesi Tengah
            </p>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={closeMobile}
          />

          {/* Drawer Body */}
          <div className="relative flex w-4/5 max-w-xs flex-1 flex-col bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="flex h-16 items-center justify-between border-b border-orange-200/80 px-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#F58220] to-[#EA580C] text-white shadow-md">
                  <span className="text-base font-black">ST</span>
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">BPS Sulteng AI</div>
                  <div className="text-[10px] font-bold text-slate-400">Menu Navigasi</div>
                </div>
              </div>

              <button
                onClick={closeMobile}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-slate-600 hover:bg-orange-100"
              >
                <X className="h-4 w-4 text-[#EA580C]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {navGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {group.title}
                  </div>
                  <div className="mt-1 space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobile}
                          className={
                            "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all " +
                            (isActive
                              ? "bg-gradient-to-r from-[#F58220] to-[#EA580C] text-white shadow-md shadow-orange-500/20 font-black"
                              : "text-slate-700 hover:bg-orange-50 hover:text-[#EA580C]")
                          }
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={"h-4 w-4 " + (isActive ? "text-white" : "text-slate-400")} />
                            <span>{item.label}</span>
                          </div>

                          {item.badge && (
                            <span
                              className={
                                "rounded-full px-2 py-0.5 text-[9px] font-black " +
                                (isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-orange-100 text-[#EA580C]")
                              }
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-orange-200/80 p-4">
              <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-3 text-center">
                <div className="text-[11px] font-black text-slate-800">Domain 7200 (Sulawesi Tengah)</div>
                <p className="mt-0.5 text-[10px] text-slate-500">Official Statistics BPS RI</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
