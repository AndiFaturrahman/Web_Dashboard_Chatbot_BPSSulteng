"use client";
import { useEffect, useState } from "react";
import { fetchMlAnomalies } from "@/lib/api";
import { AnomalyResponse } from "@/types";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

export default function AnomalyPage() {
  const [anomalyData, setAnomalyData] = useState<AnomalyResponse | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchMlAnomalies();
        setAnomalyData(res);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  if (!anomalyData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F58220] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-rose-100/70 px-3 py-1 text-xs font-black text-rose-800">
          <AlertTriangle className="h-3.5 w-3.5" /> ISOLATION FOREST ANOMALY RADAR
        </div>
        <h1 className="mt-2 text-2xl font-black text-slate-900">
          Deteksi Anomali Statistik — Sulawesi Tengah
        </h1>
        <p className="text-xs text-slate-500">
          AI mendeteksi lonjakan ekstrem, pergeseran pola temporal mendadak, dan diskrepansi antardaerah untuk validasi Official Statistics
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-2xl p-5 border-l-4 border-rose-500">
          <div className="text-xs font-black uppercase text-slate-400">Total Anomali Ditemukan</div>
          <div className="mt-2 text-3xl font-black text-rose-600">{anomalyData.anomalies_detected} Wilayah</div>
          <div className="mt-1 text-[11px] font-medium text-slate-500">Dari total {anomalyData.total_checked} entitas terverifikasi</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border-l-4 border-[#F58220]">
          <div className="text-xs font-black uppercase text-slate-400">Model Algoritma</div>
          <div className="mt-2 text-xl font-black text-slate-900">{anomalyData.model}</div>
          <div className="mt-1 text-[11px] font-medium text-slate-500">Contamination Factor 20%</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border-l-4 border-emerald-500">
          <div className="text-xs font-black uppercase text-slate-400">Status Integritas Data BPS</div>
          <div className="mt-2 text-xl font-black text-emerald-700">Terpantau & Terverifikasi</div>
          <div className="mt-1 text-[11px] font-medium text-slate-500">Real-time Statistical Quality Control</div>
        </div>
      </div>

      <div className="space-y-4">
        {anomalyData.anomalies.map((item, idx) => (
          <div
            key={idx}
            className={
              "glass-card rounded-2xl p-6 transition-all " +
              (item.is_anomaly ? "border-2 border-rose-300 bg-rose-50/30" : "border border-emerald-200 bg-emerald-50/20")
            }
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-black " +
                      (item.is_anomaly ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800")
                    }
                  >
                    {item.is_anomaly ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                    {item.severity}
                  </span>
                  <span className="text-xs font-bold text-slate-400">Kode BPS: {item.kode}</span>
                </div>
                <h3 className="mt-2 text-lg font-black text-slate-900">{item.wilayah}</h3>
                <div className="text-xs font-bold text-[#EA580C]">{item.indicator}</div>
              </div>

              <div className="rounded-xl bg-white/80 px-3 py-1.5 text-right shadow-sm">
                <div className="text-[10px] font-bold text-slate-400">Anomaly Score</div>
                <div className="text-sm font-black text-slate-800">{item.score}</div>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-white/90 p-3.5 text-xs leading-relaxed text-slate-700 shadow-sm">
              <strong>🔍 Analisis AI:</strong> {item.explanation}
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-xl bg-orange-100/70 p-3 text-xs font-medium text-slate-800">
              <Info className="h-4 w-4 shrink-0 text-[#EA580C] mt-0.5" />
              <div>
                <strong>Rekomendasi Kebijakan BPS:</strong> {item.recommendation}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
