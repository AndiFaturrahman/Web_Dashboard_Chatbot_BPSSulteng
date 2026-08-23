"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Compass, 
  ChevronRight, 
  Database, 
  Sparkles, 
  Menu, 
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { useSidebar } from "@/components/common/SidebarContext";

export default function Navbar() {
  const pathname = usePathname();
  const { isOpen, toggleSidebar, toggleMobile } = useSidebar();

  const getPageTitle = () => {
    switch (pathname) {
      case "/": return "Beranda Utama";
      case "/dashboard": return "Dashboard Eksekutif";
      case "/peta": return "Peta Spasial Choropleth";
      case "/ai-insight": return "AI Insight & Analysis";
      case "/forecasting": return "AI Forecasting Center";
      case "/clustering": return "K-Means Regional Clustering";
      case "/anomaly": return "Deteksi Anomali Statistik";
      case "/simulator": return "Simulator Kebijakan Daerah";
      case "/pdrb": return "Statistik PDRB & Ekonomi";
      case "/ipm": return "Indeks Pembangunan Manusia";
      case "/kemiskinan": return "Kemiskinan & NTP Petani";
      case "/penduduk": return "Kependudukan & Ketenagakerjaan";
      default: return "Portal Data BPS";
    }
  };

  return (
    <header 
      className={
        "sticky top-0 z-30 w-full border-b border-orange-200/60 bg-white/90 backdrop-blur-md transition-all duration-300 ease-in-out " +
        (isOpen ? "md:pl-64" : "md:pl-0")
      }
    >
      <div className="flex h-16 items-center justify-between px-3 sm:px-6 lg:px-8">
        
        {/* Left: Mobile Toggle & Desktop Sidebar Toggle & Breadcrumbs */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMobile}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-200 bg-orange-50/80 text-slate-800 shadow-sm transition-all hover:bg-orange-100 md:hidden"
            aria-label="Buka menu navigasi mobile"
          >
            <Menu className="h-5 w-5 text-[#EA580C]" />
          </button>

          {/* Desktop Sidebar Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="hidden h-9 w-9 items-center justify-center rounded-xl border border-orange-200 bg-orange-50/80 text-slate-700 shadow-sm transition-all hover:bg-orange-100 hover:text-[#EA580C] md:flex"
            title={isOpen ? "Tutup Sidebar (Perluas Layar)" : "Buka Sidebar"}
          >
            {isOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4 text-[#EA580C]" />}
          </button>

          {/* Mobile Brand Logo */}
          <Link href="/" className="flex items-center gap-2 md:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#F58220] to-[#EA580C] text-white shadow-md">
              <span className="text-base font-black">ST</span>
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 leading-tight">
                BPS Sulteng <span className="text-[#EA580C]">AI</span>
              </div>
              <div className="text-[9px] font-bold text-slate-400">Official Statistics</div>
            </div>
          </Link>

          {/* Desktop Breadcrumb Navigation */}
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link href="/" className="hover:text-[#EA580C] transition-colors flex items-center gap-1">
              <Compass className="h-3.5 w-3.5" />
              <span>Sulteng Insight</span>
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="font-bold text-slate-800 bg-orange-50/80 px-2.5 py-1 rounded-lg border border-orange-200/60">
              {getPageTitle()}
            </span>
          </div>
        </div>

        {/* Right: Status Pills & Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-[11px] font-bold text-emerald-800">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span>Official BPS</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50/60 px-3 py-1 text-[11px] font-bold text-[#EA580C]">
            <Database className="h-3 w-3" />
            <span>13 Wilayah</span>
          </div>

          <Link
            href="/forecasting"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#F58220] to-[#EA580C] px-3 py-1.5 sm:px-3.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:scale-105"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Forecast</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
