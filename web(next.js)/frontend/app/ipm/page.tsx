"use client";

import { useEffect, useState } from "react";
import InteractiveScatterQuadrant from "@/components/charts/InteractiveScatterQuadrant";
import InteractiveRadarChart from "@/components/charts/InteractiveRadarChart";
import InteractiveLineChart from "@/components/charts/InteractiveLineChart";
import AiInsightBox from "@/components/ai/AiInsightBox";
import { fetchRegencies, fetchAiInsight } from "@/lib/api";
import { Regency, AiInsight } from "@/types";

export default function IpmPage() {
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [aiInsight, setAiInsight] = useState<AiInsight | null>(null);

  useEffect(() => {
    async function load() {
      const regs = await fetchRegencies();
      const ai = await fetchAiInsight("Indeks Pembangunan Manusia", "Sulawesi Tengah");
      setRegencies(regs);
      setAiInsight(ai);
    }
    load();
  }, []);

  if (regencies.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F58220] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Indeks Pembangunan Manusia (IPM)</h1>
        <p className="text-xs font-medium text-slate-500">
          Analisis umur panjang, pengetahuan, dan standar hidup layak masyarakat Sulawesi Tengah
        </p>
      </div>

      <InteractiveScatterQuadrant
        title="Matriks Kuadran IPM vs Kemiskinan 13 Wilayah"
        regencies={regencies}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <InteractiveLineChart
          title="Tren Peningkatan IPM Sulteng vs BPS Nasional"
          years={["2018", "2019", "2020", "2021", "2022", "2023", "2024"]}
          sulteng={[68.88, 69.50, 69.55, 69.79, 70.28, 70.80, 71.38]}
          nasional={[71.39, 71.92, 71.94, 72.29, 72.91, 73.55, 74.39]}
        />
        <InteractiveRadarChart title="Peta Radar Daya Saing Daerah" regencies={regencies} />
      </div>

      {aiInsight && <AiInsightBox title="AI Insight IPM & Kesejahteraan" insight={aiInsight} />}
    </div>
  );
}
