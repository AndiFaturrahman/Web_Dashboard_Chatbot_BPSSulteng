"use client";

import { useState } from "react";
import { Regency } from "@/types";

interface DonutProps {
  title: string;
  regencies: Regency[];
}

export default function InteractiveDonutChart({ title, regencies }: DonutProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const totalPDRB = regencies.reduce((acc, r) => acc + r.PDRB_Triliun, 0);

  const colors = [
    "#F58220", "#EA580C", "#C2410C", "#9A3412", "#FB923C", 
    "#FDBA74", "#FED7AA", "#38BDF8", "#0284C7", "#0369A1",
    "#10B981", "#059669", "#047857"
  ];

  let cumulativeAngle = 0;
  const slices = regencies.map((reg, idx) => {
    const pct = (reg.PDRB_Triliun / totalPDRB) * 100;
    const angle = (pct / 100) * 360;
    const start = cumulativeAngle;
    cumulativeAngle += angle;
    return {
      wilayah: reg.Wilayah,
      pdrb: reg.PDRB_Triliun,
      pct: pct.toFixed(1),
      startAngle: start,
      endAngle: cumulativeAngle,
      color: colors[idx % colors.length],
    };
  });

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="border-b border-orange-200/60 pb-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">
          🍩 {title}
        </h3>
        <p className="text-xs text-slate-500">Pangsa PDRB Riil per Kabupaten/Kota (Total Rp {totalPDRB.toFixed(1)} Triliun)</p>
      </div>

      <div className="mt-4 grid grid-cols-1 items-center gap-6 md:grid-cols-2">
        <div className="relative flex justify-center">
          <svg viewBox="-1.2 -1.2 2.4 2.4" className="h-64 w-64 -rotate-90">
            {slices.map((slice, idx) => {
              const startX = Math.cos((slice.startAngle * Math.PI) / 180);
              const startY = Math.sin((slice.startAngle * Math.PI) / 180);
              const endX = Math.cos((slice.endAngle * Math.PI) / 180);
              const endY = Math.sin((slice.endAngle * Math.PI) / 180);
              const largeArcFlag = slice.endAngle - slice.startAngle > 180 ? 1 : 0;
              const pathData = "M 0 0 L " + startX + " " + startY + " A 1 1 0 " + largeArcFlag + " 1 " + endX + " " + endY + " Z";

              const isHovered = hoveredIdx === idx;

              return (
                <path
                  key={idx}
                  d={pathData}
                  fill={slice.color}
                  opacity={hoveredIdx === null || isHovered ? 1 : 0.4}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="cursor-pointer transition-all duration-300 hover:scale-105"
                  stroke="#FFFFFF"
                  strokeWidth="0.02"
                />
              );
            })}
            <circle cx="0" cy="0" r="0.62" fill="#FFFDF9" />
          </svg>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {hoveredIdx !== null ? (
              <>
                <div className="text-[11px] font-bold text-slate-500">{slices[hoveredIdx].wilayah}</div>
                <div className="text-xl font-black text-[#EA580C]">{slices[hoveredIdx].pct}%</div>
                <div className="text-[10px] font-black text-slate-800">Rp {slices[hoveredIdx].pdrb} T</div>
              </>
            ) : (
              <>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total PDRB</div>
                <div className="text-lg font-black text-slate-900">Rp {totalPDRB.toFixed(0)} T</div>
                <div className="text-[10px] font-bold text-[#F58220]">13 Wilayah</div>
              </>
            )}
          </div>
        </div>

        <div className="max-h-60 space-y-1.5 overflow-y-auto pr-2">
          {slices.map((slice, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={
                "flex items-center justify-between rounded-lg p-2 text-xs transition-all cursor-pointer " +
                (hoveredIdx === idx ? "bg-orange-100/90 font-black shadow-sm" : "hover:bg-orange-50/70")
              }
            >
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: slice.color }} />
                <span className="font-bold text-slate-800">{slice.wilayah}</span>
              </div>
              <span className="font-black text-slate-900">{slice.pct}% (Rp {slice.pdrb}T)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
