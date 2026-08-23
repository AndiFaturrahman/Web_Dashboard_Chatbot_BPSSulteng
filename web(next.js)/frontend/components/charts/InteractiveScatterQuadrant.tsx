"use client";

import { useState } from "react";
import { Regency } from "@/types";
import { Sparkles, TrendingDown, Target, Info, CheckCircle2, MapPin } from "lucide-react";

interface ScatterQuadrantProps {
  title: string;
  regencies: Regency[];
}

export default function InteractiveScatterQuadrant({ title, regencies }: ScatterQuadrantProps) {
  const [selectedReg, setSelectedReg] = useState<Regency | null>(null);
  const [hoveredReg, setHoveredReg] = useState<Regency | null>(null);

  const avgIPM = 71.38;
  const avgKemiskinan = 11.77;

  // Expanded scale to ensure bubbles never clip or overlap boundaries
  const minX = 4;
  const maxX = 19;
  const minY = 63;
  const maxY = 86;

  const q1 = regencies.filter((r) => r.IPM >= avgIPM && r.Kemiskinan_Persen <= avgKemiskinan);
  const q2 = regencies.filter((r) => r.IPM >= avgIPM && r.Kemiskinan_Persen > avgKemiskinan);
  const q3 = regencies.filter((r) => r.IPM < avgIPM && r.Kemiskinan_Persen <= avgKemiskinan);
  const q4 = regencies.filter((r) => r.IPM < avgIPM && r.Kemiskinan_Persen > avgKemiskinan);

  // Short clean names for bubbles
  const getShortName = (name: string) => {
    if (name.includes("Palu")) return "PAL";
    if (name.includes("Banggai Kepulauan")) return "B.KEP";
    if (name.includes("Banggai Laut")) return "B.LAU";
    if (name.includes("Banggai")) return "BAN";
    if (name.includes("Morowali Utara")) return "MORUT";
    if (name.includes("Morowali")) return "MOR";
    if (name.includes("Poso")) return "POS";
    if (name.includes("Donggala")) return "DON";
    if (name.includes("Tolitoli")) return "TOL";
    if (name.includes("Buol")) return "BUO";
    if (name.includes("Parigi")) return "PAR";
    if (name.includes("Tojo")) return "TOU";
    if (name.includes("Sigi")) return "SIG";
    return name.slice(0, 3).toUpperCase();
  };

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
              Sumbu X = Tingkat Kemiskinan (%) · Sumbu Y = IPM (Indeks Pembangunan Manusia)
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-orange-100/80 px-2.5 py-1 text-[11px] font-black text-[#EA580C]">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>Korelasi Negatif: r = -0.74</span>
          </div>
        </div>

        {/* 4 Quadrant Reference Bar (Placed neatly ABOVE the graph so it never collides with bubbles) */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-black">
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-1 text-emerald-800 flex items-center justify-between">
            <span>Kuadran I: PRIMA</span>
            <span className="bg-emerald-200/70 px-1 rounded text-[9px]">IPM ↑ Kem ↓</span>
          </div>
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-2 py-1 text-amber-800 flex items-center justify-between">
            <span>Kuadran II: TRANSISI</span>
            <span className="bg-amber-200/70 px-1 rounded text-[9px]">IPM ↑ Kem ↑</span>
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-200 px-2 py-1 text-blue-800 flex items-center justify-between">
            <span>Kuadran III: STABIL</span>
            <span className="bg-blue-200/70 px-1 rounded text-[9px]">IPM ↓ Kem ↓</span>
          </div>
          <div className="rounded-lg bg-rose-50 border border-rose-200 px-2 py-1 text-rose-800 flex items-center justify-between">
            <span>Kuadran IV: PRIORITAS</span>
            <span className="bg-rose-200/70 px-1 rounded text-[9px]">IPM ↓ Kem ↑</span>
          </div>
        </div>

        {/* Scatter Plot Canvas with Clean Non-Overlapping Watermarks */}
        <div className="mt-3 overflow-x-auto pb-2 scrollbar-thin">
          <div className="relative h-80 min-w-[520px] w-full rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50/30 via-white to-amber-50/20 p-4">
            
            {/* Watermark Roman Numerals in Background */}
            <div className="absolute top-6 left-6 text-3xl font-black text-emerald-950/10 select-none pointer-events-none">
              I
            </div>
            <div className="absolute top-6 right-8 text-3xl font-black text-amber-950/10 select-none pointer-events-none">
              II
            </div>
            <div className="absolute bottom-6 left-6 text-3xl font-black text-blue-950/10 select-none pointer-events-none">
              III
            </div>
            <div className="absolute bottom-6 right-8 text-3xl font-black text-rose-950/10 select-none pointer-events-none">
              IV
            </div>

            {/* Average Axis Lines */}
            <div 
              className="absolute top-0 bottom-0 border-r-2 border-dashed border-[#F58220] z-0 opacity-80"
              style={{ left: `${((avgKemiskinan - minX) / (maxX - minX)) * 100}%` }}
            >
              <span className="absolute bottom-1 -translate-x-1/2 left-0 whitespace-nowrap rounded-md bg-orange-100/95 border border-orange-300 px-1.5 py-0.5 text-[9px] font-black text-[#EA580C] shadow-xs">
                Rata-rata Kemiskinan ({avgKemiskinan}%)
              </span>
            </div>

            <div 
              className="absolute left-0 right-0 border-b-2 border-dashed border-[#F58220] z-0 opacity-80"
              style={{ bottom: `${((avgIPM - minY) / (maxY - minY)) * 100}%` }}
            >
              <span className="absolute left-2 -translate-y-full top-0 rounded-md bg-orange-100/95 border border-orange-300 px-1.5 py-0.5 text-[9px] font-black text-[#EA580C] shadow-xs">
                Rata-rata IPM ({avgIPM})
              </span>
            </div>

            {/* Regional Bubbles */}
            {regencies.map((reg) => {
              const posX = ((reg.Kemiskinan_Persen - minX) / (maxX - minX)) * 100;
              const posY = ((reg.IPM - minY) / (maxY - minY)) * 100;
              const isSelected = selectedReg?.Kode === reg.Kode;
              const isHovered = hoveredReg?.Kode === reg.Kode;

              return (
                <div
                  key={reg.Kode}
                  onClick={() => setSelectedReg(reg)}
                  onMouseEnter={() => setHoveredReg(reg)}
                  onMouseLeave={() => setHoveredReg(null)}
                  className="group absolute -translate-x-1/2 translate-y-1/2 cursor-pointer z-10"
                  style={{ left: `${posX}%`, bottom: `${posY}%` }}
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold text-white shadow-xl z-30 pointer-events-none">
                      {reg.Wilayah} · IPM {reg.IPM} · {reg.Kemiskinan_Persen}%
                    </div>
                  )}

                  <div 
                    className={
                      "flex items-center justify-center rounded-full text-[9px] font-black text-white shadow-md transition-all duration-200 select-none " +
                      (isSelected 
                        ? "h-11 w-11 bg-slate-900 ring-4 ring-[#EA580C] z-20" 
                        : isHovered
                          ? "h-10 w-10 ring-2 ring-white scale-110 z-20 " + (reg.IPM >= avgIPM && reg.Kemiskinan_Persen <= avgKemiskinan ? "bg-emerald-600" : reg.IPM >= avgIPM ? "bg-amber-600" : reg.Kemiskinan_Persen <= avgKemiskinan ? "bg-blue-600" : "bg-rose-600")
                          : (reg.IPM >= avgIPM && reg.Kemiskinan_Persen <= avgKemiskinan 
                              ? "h-8 w-8 bg-emerald-500" 
                              : (reg.IPM >= avgIPM && reg.Kemiskinan_Persen > avgKemiskinan 
                                  ? "h-8 w-8 bg-amber-500" 
                                  : (reg.IPM < avgIPM && reg.Kemiskinan_Persen <= avgKemiskinan 
                                      ? "h-8 w-8 bg-blue-500" 
                                      : "h-8 w-8 bg-rose-500"))))
                    }
                    title={`${reg.Wilayah} (IPM: ${reg.IPM}, Kemiskinan: ${reg.Kemiskinan_Persen}%)`}
                  >
                    {getShortName(reg.Wilayah)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Region Inspection Banner */}
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

      {/* 4-QUADRANT POLICY TYPOLOGY DETAIL CARDS */}
      <div className="rounded-2xl border border-orange-200/90 bg-gradient-to-br from-orange-50/60 via-white to-amber-50/40 p-4 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-slate-800">
          <Target className="h-4 w-4 text-[#EA580C]" />
          <span>Klasifikasi Tipologi Daerah Sulawesi Tengah</span>
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
              Kab. Sigi — Kemiskinan terkendali, penguatan sektor layanan dasar.
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
          <span>💡 Arahkan kursor atau klik bulatan wilayah untuk melihat detail data.</span>
          <span className="font-bold text-slate-700">Sumber: BPS Sulteng</span>
        </div>
      </div>
    </div>
  );
}
