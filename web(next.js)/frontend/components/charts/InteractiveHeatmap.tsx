"use client";

import { useState } from "react";
import { Regency } from "@/types";

interface HeatmapProps {
  title: string;
  regencies: Regency[];
}

export default function InteractiveHeatmap({ title, regencies }: HeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    wilayah: string;
    indicator: string;
    value: number;
    unit: string;
  } | null>(null);

  const indicators = [
    { key: "IPM", label: "IPM", min: 65, max: 85, unit: "Poin", higherIsBetter: true },
    { key: "Kemiskinan_Persen", label: "Kemiskinan", min: 5, max: 18, unit: "%", higherIsBetter: false },
    { key: "Pertumbuhan_PDRB", label: "Pertumbuhan", min: 4, max: 25, unit: "%", higherIsBetter: true },
    { key: "Pengangguran_Persen", label: "Pengangguran", min: 2, max: 6, unit: "%", higherIsBetter: false },
    { key: "NTP", label: "NTP Petani", min: 100, max: 115, unit: "Poin", higherIsBetter: true },
    { key: "PDRB_Triliun", label: "PDRB (Triliun)", min: 3, max: 65, unit: "T", higherIsBetter: true },
  ];

  const getColor = (val: number, min: number, max: number, higherIsBetter: boolean) => {
    let score = (val - min) / (max - min);
    score = Math.max(0, Math.min(1, score));
    if (!higherIsBetter) score = 1 - score;

    if (score >= 0.75) return "bg-emerald-500 text-white";
    if (score >= 0.50) return "bg-amber-400 text-slate-900";
    if (score >= 0.25) return "bg-orange-400 text-white";
    return "bg-rose-500 text-white";
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-200/60 pb-4">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">
            🔥 {title}
          </h3>
          <p className="text-xs text-slate-500">
            Matriks evaluasi kinerja komparatif 13 Kabupaten/Kota Sulawesi Tengah
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold">
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-emerald-500"></span> Prima</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-amber-400"></span> Cukup</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-orange-400"></span> Waspada</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-rose-500"></span> Kritis</span>
        </div>
      </div>

      {/* Scrollable Container with Minimum Width */}
      <div className="mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-200">
        <table className="min-w-[640px] w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-2.5 text-left font-black text-slate-700 bg-orange-50/50 rounded-l-lg">Kabupaten / Kota</th>
              {indicators.map((ind, i) => (
                <th key={ind.key} className={"p-2.5 text-center font-black text-slate-700 bg-orange-50/50 " + (i === indicators.length - 1 ? "rounded-r-lg" : "")}>
                  {ind.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {regencies.map((reg) => (
              <tr key={reg.Kode} className="border-t border-orange-100 hover:bg-orange-50/40 transition-all">
                <td className="p-2.5 font-bold text-slate-800 whitespace-nowrap">{reg.Wilayah}</td>
                {indicators.map((ind) => {
                  const val = reg[ind.key as keyof Regency] as number;
                  const cellColor = getColor(val, ind.min, ind.max, ind.higherIsBetter);
                  return (
                    <td
                      key={ind.key}
                      className="p-1.5 text-center"
                      onMouseEnter={() => setHoveredCell({ wilayah: reg.Wilayah, indicator: ind.label, value: val, unit: ind.unit })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div className={"rounded-lg py-1.5 font-black text-[11px] transition-all hover:scale-105 shadow-sm " + cellColor}>
                        {val} {ind.unit !== "Poin" && ind.unit !== "%" ? ind.unit : ""}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hover Info Badge */}
      <div className="mt-4 flex min-h-[32px] items-center justify-between rounded-xl bg-orange-50/70 px-4 py-2 text-xs font-bold text-slate-700">
        {hoveredCell ? (
          <div>
            📍 <span className="text-[#EA580C]">{hoveredCell.wilayah}</span> — {hoveredCell.indicator}: <span className="font-black text-slate-900">{hoveredCell.value} {hoveredCell.unit}</span>
          </div>
        ) : (
          <div className="text-slate-400 italic text-[11px]">
            💡 Geser atau arahkan kursor ke sel untuk melihat detail nilai indikator
          </div>
        )}
      </div>
    </div>
  );
}
