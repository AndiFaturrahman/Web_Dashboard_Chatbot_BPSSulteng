"use client";

import { useEffect, useState } from "react";
import InteractiveDonutChart from "@/components/charts/InteractiveDonutChart";
import InteractiveAreaChart from "@/components/charts/InteractiveAreaChart";
import InteractiveBarChart from "@/components/charts/InteractiveBarChart";
import AiInsightBox from "@/components/ai/AiInsightBox";
import { fetchRegencies, fetchAiInsight } from "@/lib/api";
import { Regency, AiInsight } from "@/types";

export default function PdrbPage() {
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [aiInsight, setAiInsight] = useState<AiInsight | null>(null);

  useEffect(() => {
    async function load() {
      const regs = await fetchRegencies();
      const ai = await fetchAiInsight("PDRB & Hilirisasi Nikel", "Sulawesi Tengah");
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
        <h1 className="text-2xl font-black text-slate-900">PDRB & Transformasi Ekonomi Industri</h1>
        <p className="text-xs font-medium text-slate-500">
          Analisis kontribusi hilirisasi nikel di Morowali dan struktur perekonomian wilayah
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <InteractiveDonutChart title="Pangsa PDRB per Kabupaten/Kota" regencies={regencies} />
        <InteractiveAreaChart
          title="Akselerasi Pertumbuhan PDRB Sulteng vs Nasional (2018-2024)"
          years={["2018", "2019", "2020", "2021", "2022", "2023", "2024"]}
          sultengData={[6.30, 8.83, 4.86, 11.70, 15.17, 11.91, 11.45]}
          nasionalData={[5.17, 5.02, -2.07, 3.69, 5.31, 5.05, 5.08]}
          unit="%"
        />
      </div>

      <InteractiveBarChart
        title="Laju Pertumbuhan Ekonomi per Wilayah (%)"
        labels={regencies.map((r) => r.Wilayah)}
        values={regencies.map((r) => r.Pertumbuhan_PDRB)}
        unit="%"
      />

      {aiInsight && <AiInsightBox title="AI Insight PDRB & Hilirisasi" insight={aiInsight} />}
    </div>
  );
}
