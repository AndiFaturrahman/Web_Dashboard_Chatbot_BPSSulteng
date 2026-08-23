"use client";

import { useState } from "react";
import { Regency } from "@/types";
import { Sparkles, TrendingDown, Target, Info, CheckCircle2 } from "lucide-react";

interface ScatterQuadrantProps {
  title: string;
  regencies: Regency[];
}

export default function InteractiveScatterQuadrant({ title, regencies }: ScatterQuadrantProps) {
  const [selectedReg, setSelectedReg] = useState<Regency | null>(null);

  const avgIPM = 71.38;
  const avgKemiskinan = 11.77;

  const minX = 4;
  const maxX = 18;
  const minY = 64;
  const maxY = 84;

  const q1 = regencies.filter((r) => r.IPM >= avgIPM && r.Kemiskinan_Persen <= avgKemiskinan);
  const q2 = regencies.filter((r) => r.IPM >= avgIPM && r.Kemiskinan_Persen > avgKemiskinan);
  const q3 = regencies.filter((r) => r.IPM < avgIPM && r.Kemiskinan_Persen <= avgKemiskinan);
  const q4 = regencies.filter((r) => r.IPM < avgIPM && r.Kemiskinan_Persen > avgKemiskinan);

  return (
    <div className="glass-card rounded-2xl p-5 overflow-hidden flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-200/60 pb-3">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-800 flex items-center gap-1.5">
              🎯 {title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sumbu X = Kemiskinan (%) · Sumbu Y = IPM · Garis Oranye = Rata-Rata Provinsi BPS
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-orange-100/80 px-2.5 py-1 text-[11px] font-black text-[#EA580C]">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>Korelasi Pearson: r = -0.74</span>
          </div>
        </div>

        {/* Scrollable Canvas Container */}
        <div className="mt-4 overflow-x-auto pb-2 scrollbar-thin">
          <div className="relative h-72 min-w-[500px] w-full rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50/40 via-white to-amber-50/30 p-4">
            {/* Average Axis Lines */}
            <div 
              className="absolute top-0 bottom-0 border-r-2 border-dashed border-[#F58220] z-0 opacity-80"
              style={{ left: `${((avgKemiskinan - minX) / (maxX - minX)) * 100}%` }}
            >
              <span className="absolute top-2 left-2 rounded-md bg-orange-100/90 px-1.5 py-0.5 text-[9px] font-black text-[#EA580C] shadow-xs">
                Rata-rata Kemiskinan ({avgKemiskinan}%)
              </span>
            </div>

            <div 
              className="absolute left-0 right-0 border-b-2 border-dashed border-[#F58220] z-0 opacity-80"
              style={{ bottom: `${((avgIPM - minY) / (maxY - minY)) * 100}%` }}
            >
              <span className="absolute bottom-2 left-2 rounded-md bg-orange-100/90 px-1.5 py-0.5 text-[9px] font-black text-[#EA580C] shadow-xs">
                Rata-rata IPM ({avgIPM})
              </span>
            </div>

            {/* Quadrant Badge Labels */}
            <div className="absolute top-2 left-2 text-[9px] font-black text-emerald-700 uppercase bg-emerald-100/90 px-2 py-0.5 rounded-md shadow-xs">
              Kuadran I: PRIMA (IPM Tinggi, Kemiskinan Rendah)
            </div>
            <div className="absolute top-2 right-2 text-[9px] font-black text-amber-700 uppercase bg-amber-100/90 px-2 py-0.5 rounded-md shadow-xs">
              Kuadran II: IPM Tinggi, Kemiskinan Tinggi
            </div>
            <div className="absolute bottom-2 left-2 text-[9px] font-black text-blue-700 uppercase bg-blue-100/90 px-2 py-0.5 rounded-md shadow-xs">
              Kuadran III: IPM Rendah, Kemiskinan Terkendali
            </div>
            <div className="absolute bottom-2 right-2 text-[9px] font-black text-rose-700 uppercase bg-rose-100/90 px-2 py-0.5 rounded-md shadow-xs">
              Kuadran IV: PRIORITAS INTERVENSI
            </div>

            {/* Regional Bubbles */}
            {regencies.map((reg) => {
              const posX = ((reg.Kemiskinan_Persen - minX) / (maxX - minX)) * 100;
              const posY = ((reg.IPM - minY) / (maxY - minY)) * 100;
              const isSelected = selectedReg?.Kode === reg.Kode;

              return (
                <div
                  key={reg.Kode}
                  onClick={() => setSelectedReg(reg)}
                  className="group absolute -translate-x-1/2 translate-y-1/2 cursor-pointer z-10"
                  style={{ left: `${posX}%`, bottom: `${posY}%` }}
                >
                  <div 
                    className={
                      "flex items-center justify-center rounded-full text-[10px] font-black text-white shadow-md transition-all duration-200 group-hover:scale-110 " +
                      (isSelected 
                        ? "h-10 w-10 bg-slate-900 ring-4 ring-orange-400 z-20" 
                        : (reg.IPM >= avgIPM && reg.Kemiskinan_Persen <= avgKemiskinan 
                            ? "h-8 w-8 bg-emerald-500" 
                            : (reg.IPM < avgIPM && reg.Kemiskinan_Persen > avgKemiskinan 
                                ? "h-8 w-8 bg-rose-500" 
                                : "h-7 w-7 bg-[#F58220]")))
                    }
                    title={`${reg.Wilayah} (IPM: ${reg.IPM}, Kemiskinan: ${reg.Kemiskinan_Persen}%)`}
                  >
                    {reg.Wilayah.replace("Kabupaten ", "").replace("Kab. ", "").replace("Kota ", "").slice(0, 3).toUpperCase()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Inspection Banner */}
      {selectedReg && (
        <div className="rounded-xl border border-orange-300 bg-orange-50/90 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-black text-slate-900 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#EA580C]" />
              {selectedReg.Wilayah}
            </span>
            <div className="flex flex-wrap gap-2.5 font-bold text-slate-700">
              <span>IPM: <strong className="text-[#EA580C]">{selectedReg.IPM}</strong></span>
              <span>Kemiskinan: <strong className="text-rose-600">{selectedReg.Kemiskinan_Persen}%</strong></span>
              <span>PDRB: <strong>Rp {selectedReg.PDRB_Triliun} T</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* RICH SUMMARY SECTION (FILLING EMPTY SPACE PERFECTLY) */}
      <div className="rounded-2xl border border-orange-200/90 bg-gradient-to-br from-orange-50/60 via-white to-amber-50/40 p-4 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-slate-800">
          <Target className="h-4 w-4 text-[#EA580C]" />
          <span>Tipologi Wilayah Sulawesi Tengah (4 Kuadran Kebijakan)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Kuadran 1 */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-emerald-800">🟢 Kuadran I (Prima)</span>
              <span className="text-[10px] font-bold text-emerald-600">{q1.length} Wilayah</span>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-emerald-900">
              Kota Palu & Kab. Banggai — IPM tinggi didukung kemiskinan rendah.
            </p>
          </div>

          {/* Kuadran 2 */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-2.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-amber-800">🟠 Kuadran II (Transisi)</span>
              <span className="text-[10px] font-bold text-amber-600">{q2.length} Wilayah</span>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-amber-900">
              Morowali & Poso — IPM tinggi, perlu akselerasi pemerataan pendapatan.
            </p>
          </div>

          {/* Kuadran 3 */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-2.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-blue-800">🔵 Kuadran III (Stabil)</span>
              <span className="text-[10px] font-bold text-blue-600">{q3.length} Wilayah</span>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-blue-900">
              Kab. Sigi — Kemiskinan terkendali, penguatan sektor pendidikan/kesehatan.
            </p>
          </div>

          {/* Kuadran 4 */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-2.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-rose-800">🔴 Kuadran IV (Prioritas)</span>
              <span className="text-[10px] font-bold text-rose-600">{q4.length} Wilayah</span>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-rose-900">
              Donggala, Tojo Una-Una, Buol, Parigi, Tolitoli, Banggai Kep/Laut.
            </p>
          </div>
        </div>

        <div className="border-t border-orange-200/60 pt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>💡 Klik bulatan wilayah pada diagram untuk melihat profil detail.</span>
          <span className="font-bold text-slate-700">Sumber: BPS Sulteng</span>
        </div>
      </div>
    </div>
  );
}
