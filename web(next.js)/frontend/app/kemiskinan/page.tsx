"use client";

import { useEffect, useState } from "react";
import InteractiveHeatmap from "@/components/charts/InteractiveHeatmap";
import InteractiveScatterQuadrant from "@/components/charts/InteractiveScatterQuadrant";
import InteractiveBarChart from "@/components/charts/InteractiveBarChart";
import AiInsightBox from "@/components/ai/AiInsightBox";
import { fetchRegencies, fetchAiInsight } from "@/lib/api";
import { Regency, AiInsight } from "@/types";

export default function KemiskinanPage() {
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [aiInsight, setAiInsight] = useState<AiInsight | null>(null);

  useEffect(() => {
    async function load() {
      const regs = await fetchRegencies();
      const ai = await fetchAiInsight("Kemiskinan & NTP Petani", "Sulawesi Tengah");
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
        <h1 className="text-2xl font-black text-slate-900">Kemiskinan & Kesejahteraan Petani (NTP)</h1>
        <p className="text-xs font-medium text-slate-500">
          Evaluasi disparitas kemiskinan dan daya beli petani pedesaan di Sulawesi Tengah
        </p>
      </div>

      <InteractiveHeatmap title="Matriks Heatmap Kerentanan Kemiskinan" regencies={regencies} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <InteractiveScatterQuadrant
          title="Korelasi Kemiskinan vs IPM per Wilayah"
          regencies={regencies}
        />
        <InteractiveBarChart
          title="Nilai Tukar Petani (NTP) per Wilayah"
          labels={regencies.map((r) => r.Wilayah)}
          values={regencies.map((r) => r.NTP)}
          unit="Poin"
        />
      </div>

      {aiInsight && <AiInsightBox title="AI Insight Kemiskinan & Solusi Pangan" insight={aiInsight} />}
    </div>
  );
}
