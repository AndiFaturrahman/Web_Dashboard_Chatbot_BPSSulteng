"use client";

import { AiInsight } from "@/types";
import { Sparkles, Activity, AlertTriangle, Lightbulb, Compass } from "lucide-react";

interface AiInsightBoxProps {
  title: string;
  insight: AiInsight;
}

export default function AiInsightBox({ title, insight }: AiInsightBoxProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-amber-400/70 bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/60 p-6 shadow-md">
      <div className="flex items-center justify-between border-b border-amber-300/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="text-base font-extrabold text-amber-900">
            AI Statistical Insight — {title}
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1 text-xs font-black text-white shadow-sm">
          <span className="h-2 w-2 animate-ping rounded-full bg-white" />
          AI LIVE ANALYSIS
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-amber-300/50 bg-white/90 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-amber-800">
            <Compass className="h-4 w-4 text-[#F58220]" />
            1. Temuan Utama
          </div>
          <div className="mt-2 text-sm leading-relaxed text-slate-700">
            {insight.summary}
          </div>
        </div>

        <div className="rounded-xl border border-amber-300/50 bg-white/90 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-amber-800">
            <Activity className="h-4 w-4 text-emerald-600" />
            2. Analisis Tren & Komparasi
          </div>
          <div className="mt-2 text-sm leading-relaxed text-slate-700">
            {insight.trend}
          </div>
        </div>

        <div className="rounded-xl border border-amber-300/50 bg-white/90 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-rose-800">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            3. Titik Kritis & Wilayah Prioritas
          </div>
          <div className="mt-2 text-sm leading-relaxed text-slate-700">
            <p><strong>Tertinggi:</strong> {insight.best_region}</p>
            <p className="mt-1"><strong>Perlu Perhatian:</strong> {insight.lowest_region}</p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-300/50 bg-white/90 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-amber-800">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            4. Rekomendasi Kebijakan AI
          </div>
          <div className="mt-2 text-sm leading-relaxed text-slate-700">
            {insight.recommendation}
          </div>
        </div>
      </div>
    </div>
  );
}
