"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Clock, MapPin, Database } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Makassar",
        }) + " WITA"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-orange-200/60 bg-gradient-to-br from-[#FFF7ED] via-[#FFEDD5] to-[#FED7AA] p-8 sm:p-12 shadow-glass">
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-radial from-[#F58220]/25 to-transparent animate-pulse-orb pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-radial from-[#FFA64D]/25 to-transparent animate-pulse-orb pointer-events-none" />

      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-100/80 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-[#C2410C]">
          <ShieldCheck className="h-4 w-4" />
          Official Data & AI Analytics Portal BPS Sulawesi Tengah
        </div>

        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          BPS Sulteng <span className="bg-gradient-to-r from-[#EA580C] via-[#F58220] to-[#D97706] bg-clip-text text-transparent">Insight AI</span>
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Platform pemantauan data strategis, visualisasi geospasial 13 kabupaten/kota, komparasi tolok ukur nasional BPS Pusat, serta penafsiran grafik cerdas otomatis berbasis Artificial Intelligence.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#EA580C] px-6 py-3.5 text-base font-extrabold text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-105"
          >
            <Sparkles className="h-5 w-5" />
            Jelajahi Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/peta"
            className="flex items-center gap-2 rounded-2xl border border-orange-300 bg-white/80 px-6 py-3.5 text-base font-extrabold text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:text-[#F58220]"
          >
            🗺️ Peta Interaktif 13 Wilayah
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-orange-200/60 pt-6 text-sm font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-[#F58220]" />
            Domain: 7200 (Sulawesi Tengah)
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#F58220]" />
            {timeStr || "Waktu WITA"}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#F58220]" />
            1 Kota & 12 Kabupaten
          </div>
        </div>
      </div>
    </div>
  );
}
