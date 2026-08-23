"use client";

import { useState } from "react";
import { Regency } from "@/types";

interface RadarProps {
  title: string;
  regencies: Regency[];
}

export default function InteractiveRadarChart({ title, regencies }: RadarProps) {
  const [selectedKode, setSelectedKode] = useState<string>("7271");

  const activeReg = regencies.find((r) => r.Kode === selectedKode) || regencies[0];

  const axes = [
    { label: "IPM", max: 85, getVal: (r: Regency) => r.IPM },
    { label: "PDRB Riil", max: 65, getVal: (r: Regency) => r.PDRB_Triliun },
    { label: "Pertumbuhan", max: 25, getVal: (r: Regency) => r.Pertumbuhan_PDRB },
    { label: "Kesejahteraan", max: 15, getVal: (r: Regency) => Math.max(0, 20 - r.Kemiskinan_Persen) },
    { label: "Ketenagakerjaan", max: 8, getVal: (r: Regency) => Math.max(0, 8 - r.Pengangguran_Persen) },
    { label: "NTP Petani", max: 120, getVal: (r: Regency) => r.NTP },
  ];

  const size = 280;
  const center = size / 2;
  const radius = 105;

  const getCoordinates = (index: number, total: number, valueRatio: number) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const r = radius * valueRatio;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const polyPoints = axes
    .map((axis, i) => {
      const val = axis.getVal(activeReg);
      const ratio = Math.max(0.1, Math.min(1, val / axis.max));
      const { x, y } = getCoordinates(i, axes.length, ratio);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-200/60 pb-4">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">
            🕸️ {title}
          </h3>
          <p className="text-xs text-slate-500">
            Evaluasi multi-sektor ketahanan daerah (6 Dimensi Pembangunan)
          </p>
        </div>
        <select
          value={selectedKode}
          onChange={(e) => setSelectedKode(e.target.value)}
          className="rounded-xl border border-orange-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm"
        >
          {regencies.map((r) => (
            <option key={r.Kode} value={r.Kode}>
              {r.Wilayah}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* Radar SVG */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg width={size} height={size} className="overflow-visible">
            {[0.25, 0.5, 0.75, 1].map((lvl, idx) => {
              const gridPts = axes
                .map((_, i) => {
                  const { x, y } = getCoordinates(i, axes.length, lvl);
                  return `${x},${y}`;
                })
                .join(" ");
              return (
                <polygon
                  key={idx}
                  points={gridPts}
                  className="fill-none stroke-orange-200"
                  strokeWidth="1"
                />
              );
            })}

            {axes.map((_, i) => {
              const { x, y } = getCoordinates(i, axes.length, 1);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  className="stroke-orange-200"
                  strokeWidth="1"
                />
              );
            })}

            <polygon
              points={polyPoints}
              className="fill-[#F58220]/30 stroke-[#EA580C] stroke-2"
            />

            {axes.map((axis, i) => {
              const val = axis.getVal(activeReg);
              const ratio = Math.max(0.1, Math.min(1, val / axis.max));
              const { x, y } = getCoordinates(i, axes.length, ratio);
              const labelCoord = getCoordinates(i, axes.length, 1.22);

              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="4" className="fill-[#EA580C] stroke-white stroke-2" />
                  <text
                    x={labelCoord.x}
                    y={labelCoord.y}
                    textAnchor="middle"
                    className="text-[10px] font-black fill-slate-700"
                  >
                    {axis.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Breakdown Card */}
        <div className="w-full sm:w-64 space-y-2 text-xs">
          <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-3 font-bold">
            <div className="text-[10px] uppercase text-slate-400">Wilayah Terpilih</div>
            <div className="text-sm font-black text-slate-900">{activeReg.Wilayah}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-700">
            <div className="bg-white p-2 rounded-lg border border-orange-100">IPM: <span className="text-[#EA580C]">{activeReg.IPM}</span></div>
            <div className="bg-white p-2 rounded-lg border border-orange-100">PDRB: <span>Rp {activeReg.PDRB_Triliun}T</span></div>
            <div className="bg-white p-2 rounded-lg border border-orange-100">Kemiskinan: <span>{activeReg.Kemiskinan_Persen}%</span></div>
            <div className="bg-white p-2 rounded-lg border border-orange-100">NTP: <span>{activeReg.NTP}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
