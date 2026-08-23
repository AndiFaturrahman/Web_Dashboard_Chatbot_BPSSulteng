"use client";

import { useState } from "react";
import { Regency } from "@/types";

interface RadarProps {
  title: string;
  regencies: Regency[];
}

export default function InteractiveRadarChart({ title, regencies }: RadarProps) {
  const [selectedKode, setSelectedKode] = useState<string>(regencies[0].Kode);

  const selected = regencies.find((r) => r.Kode === selectedKode) || regencies[0];

  const axes = [
    { label: "IPM", val: ((selected.IPM - 60) / 25) * 100, raw: selected.IPM + " Poin" },
    { label: "PDRB", val: Math.min(100, (selected.PDRB_Triliun / 65) * 100), raw: "Rp " + selected.PDRB_Triliun + " T" },
    { label: "Pertumbuhan", val: Math.min(100, (selected.Pertumbuhan_PDRB / 25) * 100), raw: selected.Pertumbuhan_PDRB + "%" },
    { label: "Kesejahteraan (Anti-Miskin)", val: Math.max(0, 100 - (selected.Kemiskinan_Persen / 20) * 100), raw: (100 - selected.Kemiskinan_Persen).toFixed(1) + "%" },
    { label: "Ketenagakerjaan", val: Math.max(0, 100 - (selected.Pengangguran_Persen / 8) * 100), raw: (100 - selected.Pengangguran_Persen).toFixed(1) + "%" },
    { label: "NTP Petani", val: ((selected.NTP - 95) / 25) * 100, raw: selected.NTP + " Poin" },
  ];

  const size = 300;
  const center = size / 2;
  const radius = size * 0.38;
  const numAxes = axes.length;
  const angleSlice = (Math.PI * 2) / numAxes;

  const points = axes.map((axis, i) => {
    const r = (Math.min(100, Math.max(10, axis.val)) / 100) * radius;
    const x = center + r * Math.cos(angleSlice * i - Math.PI / 2);
    const y = center + r * Math.sin(angleSlice * i - Math.PI / 2);
    return x + "," + y;
  }).join(" ");

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-200/60 pb-4">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">
            🕸️ {title}
          </h3>
          <p className="text-xs text-slate-500">Polygon 6 dimensi ketahanan & daya saing daerah</p>
        </div>
        <select
          value={selectedKode}
          onChange={(e) => setSelectedKode(e.target.value)}
          className="rounded-xl border border-orange-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 outline-none shadow-sm"
        >
          {regencies.map((r) => (
            <option key={r.Kode} value={r.Kode}>
              {r.Wilayah}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid grid-cols-1 items-center gap-6 md:grid-cols-2">
        <div className="flex justify-center">
          <svg width={size} height={size} className="overflow-visible">
            {[0.25, 0.5, 0.75, 1].map((level, lvlIdx) => {
              const poly = axes.map((_, i) => {
                const r = level * radius;
                const x = center + r * Math.cos(angleSlice * i - Math.PI / 2);
                const y = center + r * Math.sin(angleSlice * i - Math.PI / 2);
                return x + "," + y;
              }).join(" ");
              return (
                <polygon
                  key={lvlIdx}
                  points={poly}
                  fill="none"
                  stroke="#FED7AA"
                  strokeWidth="1"
                  strokeDasharray={lvlIdx < 3 ? "3 3" : "none"}
                />
              );
            })}

            {axes.map((axis, i) => {
              const x2 = center + radius * Math.cos(angleSlice * i - Math.PI / 2);
              const y2 = center + radius * Math.sin(angleSlice * i - Math.PI / 2);
              const tx = center + (radius + 22) * Math.cos(angleSlice * i - Math.PI / 2);
              const ty = center + (radius + 22) * Math.sin(angleSlice * i - Math.PI / 2);
              return (
                <g key={i}>
                  <line x1={center} y1={center} x2={x2} y2={y2} stroke="#FDBA74" strokeWidth="1" />
                  <text
                    x={tx}
                    y={ty}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[10px] font-black fill-slate-700"
                  >
                    {axis.label}
                  </text>
                </g>
              );
            })}

            <polygon
              points={points}
              fill="rgba(245, 130, 32, 0.35)"
              stroke="#F58220"
              strokeWidth="2.5"
              className="transition-all duration-700"
            />
          </svg>
        </div>

        <div className="space-y-2.5">
          <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-3">
            <div className="text-xs font-black text-slate-900">{selected.Wilayah}</div>
            <div className="text-[11px] font-medium text-slate-500">Skor agregat pilar pembangunan</div>
          </div>
          {axes.map((ax, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-1.5 text-xs shadow-sm">
              <span className="font-bold text-slate-600">{ax.label}</span>
              <span className="font-black text-[#EA580C]">{ax.raw}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
