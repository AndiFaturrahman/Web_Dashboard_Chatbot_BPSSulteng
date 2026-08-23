"use client";

import { useState } from "react";
import { Regency } from "@/types";
import { MapPin, Info, Layers, Sparkles, CheckCircle2 } from "lucide-react";

interface GeoMapProps {
  regencies: Regency[];
}

export default function InteractiveGeoMap({ regencies }: GeoMapProps) {
  const [selectedKode, setSelectedKode] = useState<string>("7271");
  const [activeMetric, setActiveMetric] = useState<"kemiskinan" | "ipm" | "pertumbuhan" | "ntp" | "pdrb">("kemiskinan");

  const activeReg = regencies.find((r) => r.Kode === selectedKode) || regencies[0];

  const regencyCoords: Record<string, { cx: number; cy: number; label: string }> = {
    "7207": { cx: 270, cy: 60, label: "Buol" },
    "7206": { cx: 210, cy: 90, label: "Tolitoli" },
    "7205": { cx: 120, cy: 220, label: "Donggala" },
    "7271": { cx: 155, cy: 240, label: "Palu" },
    "7210": { cx: 145, cy: 290, label: "Sigi" },
    "7208": { cx: 230, cy: 230, label: "Parigi Moutong" },
    "7204": { cx: 270, cy: 300, label: "Poso" },
    "7209": { cx: 370, cy: 260, label: "Tojo Una-Una" },
    "7212": { cx: 370, cy: 340, label: "Morowali Utara" },
    "7203": { cx: 430, cy: 400, label: "Morowali" },
    "7201": { cx: 480, cy: 270, label: "Banggai" },
    "7202": { cx: 550, cy: 320, label: "Banggai Kep." },
    "7211": { cx: 590, cy: 360, label: "Banggai Laut" },
  };

  const getMetricValue = (r: Regency) => {
    switch (activeMetric) {
      case "kemiskinan": return `${r.Kemiskinan_Persen}%`;
      case "ipm": return r.IPM.toString();
      case "pertumbuhan": return `${r.Pertumbuhan_PDRB}%`;
      case "ntp": return r.NTP.toString();
      case "pdrb": return `Rp ${r.PDRB_Triliun} T`;
    }
  };

  const getNodeColor = (r: Regency) => {
    if (activeMetric === "kemiskinan") {
      if (r.Kemiskinan_Persen > 15) return "#E11D48";
      if (r.Kemiskinan_Persen > 12) return "#F58220";
      return "#10B981";
    }
    if (activeMetric === "ipm") {
      if (r.IPM >= 75) return "#10B981";
      if (r.IPM >= 68) return "#F58220";
      return "#E11D48";
    }
    if (activeMetric === "pertumbuhan") {
      if (r.Pertumbuhan_PDRB > 10) return "#8B5CF6";
      if (r.Pertumbuhan_PDRB > 6) return "#10B981";
      return "#F58220";
    }
    return "#EA580C";
  };

  return (
    <div className="glass-card rounded-3xl p-4 sm:p-6 overflow-hidden">
      {/* Header & Thematic Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-orange-200/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-100 text-[#EA580C]">
              <Layers className="h-4 w-4" />
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              Peta Tematik Spasial 13 Kabupaten/Kota Sulawesi Tengah
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pilih wilayah pada peta untuk menampilkan profil statistik lengkap di panel samping
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-orange-50/80 rounded-xl border border-orange-200">
          {(["kemiskinan", "ipm", "pertumbuhan", "ntp", "pdrb"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setActiveMetric(m)}
              className={
                "px-2.5 py-1 text-[11px] font-black rounded-lg transition-all capitalize " +
                (activeMetric === m 
                  ? "bg-gradient-to-r from-[#F58220] to-[#EA580C] text-white shadow-sm" 
                  : "text-slate-600 hover:text-[#EA580C]")
              }
            >
              {m === "pdrb" ? "PDRB (Triliun)" : m === "kemiskinan" ? "Kemiskinan (%)" : m}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
        {/* Left: Scrollable SVG Map Canvas */}
        <div className="lg:col-span-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-200">
          <div className="relative min-w-[500px] w-full h-[380px] bg-gradient-to-br from-orange-50/40 via-amber-50/20 to-white rounded-2xl border border-orange-200/80 flex items-center justify-center p-4">
            <svg viewBox="0 0 700 480" className="w-full h-full">
              {/* Island Connectors */}
              <path
                d="M 210,90 L 270,60 M 210,90 L 120,220 L 155,240 L 145,290 M 155,240 L 230,230 L 270,300 L 370,260 L 480,270 L 550,320 L 590,360 M 270,300 L 370,340 L 430,400"
                className="fill-none stroke-orange-300/60 stroke-2 stroke-dasharray-4"
                strokeDasharray="4 4"
              />

              {/* Regional Circular Nodes */}
              {regencies.map((reg) => {
                const c = regencyCoords[reg.Kode];
                if (!c) return null;
                const isSelected = selectedKode === reg.Kode;
                const color = getNodeColor(reg);
                const valStr = getMetricValue(reg);

                return (
                  <g
                    key={reg.Kode}
                    onClick={() => setSelectedKode(reg.Kode)}
                    className="cursor-pointer transition-all duration-300 group"
                  >
                    {/* Elegant Static Selected Halo (Replaced harsh infinite ping loop) */}
                    {isSelected && (
                      <>
                        <circle
                          cx={c.cx}
                          cy={c.cy}
                          r="25"
                          fill={color}
                          fillOpacity="0.18"
                        />
                        <circle
                          cx={c.cx}
                          cy={c.cy}
                          r="24"
                          fill="none"
                          stroke={color}
                          strokeWidth="2"
                          strokeDasharray="3 3"
                          className="animate-spin-slow"
                        />
                      </>
                    )}

                    {/* Node Body */}
                    <circle
                      cx={c.cx}
                      cy={c.cy}
                      r={isSelected ? "17" : "13"}
                      fill={color}
                      className="transition-all duration-300 drop-shadow-md group-hover:scale-110"
                      stroke="#FFFFFF"
                      strokeWidth={isSelected ? "3" : "2"}
                    />

                    {/* Node Text Label */}
                    <text
                      x={c.cx}
                      y={c.cy - 20}
                      textAnchor="middle"
                      className={"text-[11px] select-none " + (isSelected ? "font-black fill-[#EA580C]" : "font-bold fill-slate-800")}
                    >
                      {c.label}
                    </text>

                    {/* Metric Sub-Label */}
                    <text
                      x={c.cx}
                      y={c.cy + 25}
                      textAnchor="middle"
                      className={"text-[9px] select-none " + (isSelected ? "font-black fill-slate-900" : "font-bold fill-slate-500")}
                    >
                      {valStr}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right: Selected Region Inspector Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border-2 border-orange-300 bg-gradient-to-br from-orange-50/90 via-white to-orange-50/60 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#EA580C] px-2.5 py-0.5 text-[10px] font-black text-white">
                Wilayah Aktif
              </span>
              <span className="text-xs font-bold text-slate-400">Kode: {activeReg.Kode}</span>
            </div>

            <h4 className="mt-2 text-xl font-black text-slate-900">{activeReg.Wilayah}</h4>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
              <div className="bg-white p-2.5 rounded-xl border border-orange-100 shadow-xs">
                <div className="text-[10px] text-slate-400">IPM</div>
                <div className="text-base font-black text-[#EA580C]">{activeReg.IPM}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-orange-100 shadow-xs">
                <div className="text-[10px] text-slate-400">Kemiskinan</div>
                <div className="text-base font-black text-rose-600">{activeReg.Kemiskinan_Persen}%</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-orange-100 shadow-xs">
                <div className="text-[10px] text-slate-400">PDRB Riil</div>
                <div className="text-base font-black text-slate-800">Rp {activeReg.PDRB_Triliun} T</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-orange-100 shadow-xs">
                <div className="text-[10px] text-slate-400">Pertumbuhan</div>
                <div className="text-base font-black text-emerald-600">+{activeReg.Pertumbuhan_PDRB}%</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-orange-200/60 pt-3 text-xs font-bold text-slate-600">
              <span>Penduduk: <strong>{activeReg.Penduduk_Ribu} Ribu</strong></span>
              <span>NTP: <strong>{activeReg.NTP}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
