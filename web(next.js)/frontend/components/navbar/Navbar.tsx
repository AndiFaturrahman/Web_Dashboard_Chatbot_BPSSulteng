"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Compass, 
  ChevronRight, 
  Database, 
  Sparkles, 
  Menu, 
  X,
  LayoutDashboard,
  Map,
  TrendingUp,
  HeartHandshake,
  Users,
  DollarSign,
  Layers,
  AlertTriangle,
  Sliders
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <header className="sticky top-0 z-30 w-full border-b border-orange-200/60 bg-white/90 backdrop-blur-md transition-all md:pl-64">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left: Mobile Brand & Hamburger Button */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-200 bg-orange-50/80 text-slate-800 shadow-sm transition-all hover:bg-orange-100 md:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-[#EA580C]" /> : <Menu className="h-5 w-5 text-[#EA580C]" />}
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
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-[11px] font-bold text-emerald-800">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span>BPS Official Data</span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50/60 px-3 py-1 text-[11px] font-bold text-[#EA580C]">
              <Database className="h-3 w-3" />
              <span>13 Wilayah</span>
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

      {/* Mobile Slide-Out Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative flex w-4/5 max-w-xs flex-1 flex-col bg-white shadow-2xl">
            {/* Drawer Header */}
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
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-slate-600 hover:bg-orange-100"
              >
                <X className="h-4 w-4 text-[#EA580C]" />
              </button>
            </div>

            {/* Drawer Links */}
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
                          onClick={() => setMobileMenuOpen(false)}
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

            {/* Drawer Footer */}
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
