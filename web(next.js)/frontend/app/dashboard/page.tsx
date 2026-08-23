"use client";

import { useEffect, useState } from "react";
import KpiCard from "@/components/kpi/KpiCard";
import NationalCard from "@/components/kpi/NationalCard";
import InteractiveHeatmap from "@/components/charts/InteractiveHeatmap";
import InteractiveRadarChart from "@/components/charts/InteractiveRadarChart";
import InteractiveDonutChart from "@/components/charts/InteractiveDonutChart";
import AiInsightBox from "@/components/ai/AiInsightBox";
import { fetchDashboardSummary, fetchRegencies, fetchAiInsight } from "@/lib/api";
import { DashboardSummary, Regency, AiInsight } from "@/types";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [aiInsight, setAiInsight] = useState<AiInsight | null>(null);

  useEffect(() => {
    async function load() {
      const sum = await fetchDashboardSummary();
      const regs = await fetchRegencies();
      const ai = await fetchAiInsight("Dashboard Eksekutif", "Sulawesi Tengah");
      setSummary(sum);
      setRegencies(regs);
      setAiInsight(ai);
    }
    load();
  }, []);

  if (!summary || regencies.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F58220] border-t-transparent" />
      </div>
    );
  }

  const s = summary.sulteng;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Dashboard Eksekutif Multidimensi</h1>
        <p className="text-xs font-medium text-slate-500">
          Analisis komprehensif indikator makro, heatmap kinerja, dan spider polygon daerah
        </p>
      </div>

      <NationalCard data={summary.nasional} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard title="Penduduk" item={s.penduduk} icon="👥" />
        <KpiCard title="IPM" item={s.ipm} icon="❤️" />
        <KpiCard title="Kemiskinan" item={s.kemiskinan} icon="💰" />
        <KpiCard title="Pengangguran" item={s.pengangguran} icon="💼" />
        <KpiCard title="Pertumbuhan PDRB" item={s.pertumbuhan_ekonomi} icon="📈" />
        <KpiCard title="Inflasi" item={s.inflasi} icon="🏷️" />
      </div>

      {/* Visual Variasi 1: Heatmap Matriks 13 Wilayah */}
      <InteractiveHeatmap title="Heatmap Kinerja 6 Indikator Makro (13 Wilayah)" regencies={regencies} />

      {/* Visual Variasi 2: Radar Chart & Donut Chart */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <InteractiveRadarChart title="Spider Radar 6 Pilar Pembangunan" regencies={regencies} />
        <InteractiveDonutChart title="Distribusi Pangsa Ekonomi Daerah" regencies={regencies} />
      </div>

      {aiInsight && (
        <AiInsightBox title="AI Strategic Briefing Eksekutif" insight={aiInsight} />
      )}
    </div>
  );
}
