"use client";
import { useEffect, useState } from "react";
import { fetchMlForecast, fetchRegencies } from "@/lib/api";
import { ForecastResponse, Regency } from "@/types";
import { Sparkles, ShieldCheck, Activity } from "lucide-react";

export default function ForecastingPage() {
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [selectedKode, setSelectedKode] = useState<string>("7271");
  const [selectedIndicator, setSelectedIndicator] = useState<string>("PDRB_Triliun");
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadRegs() {
      const regs = await fetchRegencies();
      setRegencies(regs);
    }
    loadRegs();
  }, []);

  useEffect(() => {
    async function loadForecast() {
      setIsLoading(true);
      try {
        const fc = await fetchMlForecast(selectedKode, selectedIndicator);
        setForecastData(fc);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadForecast();
  }, [selectedKode, selectedIndicator]);

  const indicators = [
    { key: "PDRB_Triliun", label: "PDRB Riil (Triliun Rp)" },
    { key: "IPM", label: "Indeks Pembangunan Manusia (Poin)" },
    { key: "Kemiskinan_Persen", label: "Tingkat Kemiskinan (%)" },
    { key: "Pengangguran_Persen", label: "Tingkat Pengangguran TPT (%)" },
    { key: "Penduduk_Ribu", label: "Jumlah Penduduk (Ribu Jiwa)" },
    { key: "Inflasi_Persen", label: "Inflasi Tahunan (%)" },
  ];

  if (!forecastData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F58220] border-t-transparent" />
      </div>
    );
  }

  const d = forecastData.data;
  const allPoints = [
    ...d.historical.map((h) => ({ tahun: h.tahun, val: h.nilai, isForecast: false, upper: h.nilai, lower: h.nilai })),
    ...d.forecast.map((f) => ({ tahun: f.tahun, val: f.prediksi, isForecast: true, upper: f.upper_bound, lower: f.lower_bound }))
  ];

  const minVal = Math.min(...allPoints.map((p) => p.lower)) * 0.95;
  const maxVal = Math.max(...allPoints.map((p) => p.upper)) * 1.05;

  return (
    <div className="space-y-6 sm:space-y-8 overflow-hidden w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-100/70 px-3 py-1 text-xs font-black text-[#EA580C]">
            <Sparkles className="h-3.5 w-3.5" /> AI PREDICTIVE ANALYTICS
          </div>
          <h1 className="mt-2 text-xl sm:text-2xl font-black text-slate-900">
            AI Forecasting Center — BPS Sulawesi Tengah
          </h1>
          <p className="text-xs text-slate-500">
            Prediksi statistik multivariat 2026–2030 berbasis Hybrid Time Series Ensemble (XGBoost + Ridge Trend)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-800">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Confidence: {d.confidence_level}
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-800">
            <Activity className="h-4 w-4 text-blue-600" />
            MAPE: {d.mape}%
          </div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="glass-card rounded-2xl p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="text-[11px] font-black uppercase text-slate-500">Pilih Wilayah</label>
            <select
              value={selectedKode}
              onChange={(e) => setSelectedKode(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-orange-200 bg-white p-2.5 text-xs font-bold text-slate-800 outline-none shadow-sm"
            >
              {regencies.map((r) => (
                <option key={r.Kode} value={r.Kode}>
                  {r.Wilayah} ({r.Tipe})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-black uppercase text-slate-500">Pilih Indikator Strategis</label>
            <select
              value={selectedIndicator}
              onChange={(e) => setSelectedIndicator(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-orange-200 bg-white p-2.5 text-xs font-bold text-slate-800 outline-none shadow-sm"
            >
              {indicators.map((ind) => (
                <option key={ind.key} value={ind.key}>
                  {ind.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-black uppercase text-slate-500">Horizon Prediksi</label>
            <div className="mt-1.5 flex items-center justify-between rounded-xl border border-orange-300 bg-orange-50/80 px-3 py-2.5 text-xs font-black text-[#EA580C]">
              <span>2026 → 2030 (5 Tahun)</span>
              <span>16 Observasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Forecast Visualizer */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-orange-200/60 pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              📈 Proyeksi {d.nama} — {forecastData.wilayah} (2015 – 2030)
            </h3>
            <p className="text-xs text-slate-500">
              Garis Solid = Historis BPS · Garis Oranye Putus-Putus = Prediksi AI · Area Shaded = 95% Confidence Interval
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="h-3 w-3 rounded-full bg-slate-800" /> Historis (2015-2025)
            </span>
            <span className="flex items-center gap-1.5 text-[#EA580C]">
              <span className="h-3 w-3 rounded-full bg-[#EA580C]" /> Prediksi AI (2026-2030)
            </span>
          </div>
        </div>

        {/* Scrollable Forecast Canvas on Mobile */}
        <div className="mt-8 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-orange-200">
          <div className="min-w-[680px] flex h-72 items-end justify-between gap-2 border-b border-orange-300 pb-2 px-2">
            {allPoints.map((pt, idx) => {
              const heightPct = Math.min(100, Math.max(10, ((pt.val - minVal) / (maxVal - minVal)) * 100));
              const barHeight = (heightPct / 100) * 210;

              return (
                <div key={idx} className="group relative flex flex-1 flex-col items-center">
                  {/* Confidence Interval upper marker */}
                  {pt.isForecast && (
                    <div
                      className="absolute w-2.5 rounded-full bg-orange-300/60 transition-all group-hover:bg-orange-400"
                      style={{
                        bottom: `${((pt.lower - minVal) / (maxVal - minVal)) * 210 + 24}px`,
                        height: `${((pt.upper - pt.lower) / (maxVal - minVal)) * 210 + 8}px`
                      }}
                      title={`95% CI: ${pt.lower} - ${pt.upper}`}
                    />
                  )}

                  {/* Point Marker */}
                  <div
                    className={`z-10 flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black text-white shadow-md transition-all duration-300 group-hover:scale-125 ${
                      pt.isForecast ? "bg-[#EA580C] ring-4 ring-orange-200" : "bg-slate-800"
                    }`}
                    style={{ marginBottom: `${barHeight}px` }}
                  >
                    {pt.val}
                  </div>

                  <div className="mt-2 text-[10px] font-black text-slate-500 group-hover:text-slate-900">
                    {pt.tahun}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prediction Narrative Card */}
        <div className="mt-6 rounded-2xl border border-orange-300 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F58220] text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-[#EA580C]">Interpretasi Sintesis Model AI</div>
              <p className="mt-1 text-xs sm:text-sm font-semibold leading-relaxed text-slate-800">
                {d.insight}
              </p>
              <div className="mt-2 text-[10px] sm:text-[11px] font-medium text-slate-500">
                Model: <strong>{d.model}</strong> · Evaluasi Error Residual: <strong>MAPE {d.mape}%</strong> · Tingkat Keyakinan: <strong>{d.confidence_level}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
