"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Sparkles, Database, Compass, ChevronRight } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  // Dynamic breadcrumb title based on route
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
    <header className="sticky top-0 z-30 w-full border-b border-orange-200/60 bg-white/80 backdrop-blur-md transition-all md:pl-64">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Mobile Brand & Desktop Breadcrumbs */}
        <div className="flex items-center gap-3">
          {/* Mobile only logo (sidebar is hidden on mobile) */}
          <Link href="/" className="flex items-center gap-2.5 md:hidden">
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
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-[11px] font-bold text-emerald-800">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span>Official BPS API Active</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50/60 px-3 py-1 text-[11px] font-bold text-[#EA580C]">
            <Database className="h-3 w-3" />
            <span>13 Wilayah Sulteng</span>
          </div>

          <Link
            href="/forecasting"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#F58220] to-[#EA580C] px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:scale-105"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Forecast</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
