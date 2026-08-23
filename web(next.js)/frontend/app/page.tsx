"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/hero/HeroSection";
import KpiCard from "@/components/kpi/KpiCard";
import NationalCard from "@/components/kpi/NationalCard";
import InteractiveGeoMap from "@/components/map/InteractiveGeoMap";
import InteractiveScatterQuadrant from "@/components/charts/InteractiveScatterQuadrant";
import InteractiveDonutChart from "@/components/charts/InteractiveDonutChart";
import InteractiveAreaChart from "@/components/charts/InteractiveAreaChart";
import AiInsightBox from "@/components/ai/AiInsightBox";
import { fetchDashboardSummary, fetchRegencies, fetchAiInsight } from "@/lib/api";
import { DashboardSummary, Regency, AiInsight } from "@/types";

export default function HomePage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [aiInsight, setAiInsight] = useState<AiInsight | null>(null);

  useEffect(() => {
    async function loadData() {
      const sum = await fetchDashboardSummary();
      const regs = await fetchRegencies();
      const ai = await fetchAiInsight("PDRB dan Makroekonomi", "Sulawesi Tengah");
      setSummary(sum);
      setRegencies(regs);
      setAiInsight(ai);
    }
    loadData();
  }, []);

  if (!summary || regencies.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F58220] border-t-transparent mx-auto" />
          <p className="mt-3 text-xs font-bold text-slate-500">Memuat Visualisasi Data BPS...</p>
        </div>
      </div>
    );
  }

  const s = summary.sulteng;

  return (
    <div className="space-y-10">
      <HeroSection />

      {/* Keycard BPS Pusat (Nasional RI) */}
      <NationalCard data={summary.nasional} />

      {/* 6 KPI Sulawesi Tengah */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900">
              📊 Indikator Strategis Utama Sulawesi Tengah
            </h2>
            <p className="text-xs text-slate-500">Data resmi terverifikasi rilis BPS Provinsi Sulawesi Tengah</p>
          </div>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-[#EA580C]">
            Tahun 2024
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KpiCard title="Penduduk Sulteng" item={s.penduduk} icon="👥" />
          <KpiCard title="IPM Sulawesi Tengah" item={s.ipm} icon="❤️" />
          <KpiCard title="Tingkat Kemiskinan" item={s.kemiskinan} icon="💰" />
          <KpiCard title="Pengangguran (TPT)" item={s.pengangguran} icon="💼" />
          <KpiCard title="Pertumbuhan PDRB" item={s.pertumbuhan_ekonomi} icon="📈" />
          <KpiCard title="Inflasi Tahunan" item={s.inflasi} icon="🏷️" />
        </div>
      </div>

      {/* Peta Spasial Geografis 13 Wilayah */}
      <InteractiveGeoMap regencies={regencies} />

      {/* Variasi Visual: Donut Chart PDRB & Area Spline Growth */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <InteractiveDonutChart title="Pangsa PDRB 13 Kabupaten/Kota" regencies={regencies} />
        <InteractiveAreaChart
          title="Tren Laju Pertumbuhan Ekonomi (2018 - 2024)"
          years={["2018", "2019", "2020", "2021", "2022", "2023", "2024"]}
          sultengData={[6.30, 8.83, 4.86, 11.70, 15.17, 11.91, 11.45]}
          nasionalData={[5.17, 5.02, -2.07, 3.69, 5.31, 5.05, 5.08]}
          unit="%"
        />
      </div>

      {/* Variasi Visual: 4-Quadrant Bubble Scatter Plot */}
      <InteractiveScatterQuadrant
        title="Matriks Kuadran Sosio-Ekonomi (IPM vs Kemiskinan)"
        regencies={regencies}
      />

      {/* AI Graph Insight Narrative Box */}
      {aiInsight && (
        <AiInsightBox title="Analisis Sintesis AI BPS Sulawesi Tengah" insight={aiInsight} />
      )}
    </div>
  );
}
