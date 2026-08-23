"use client";

import { useState } from "react";
import { Regency } from "@/types";
import { Layers, Sparkles, MapPin, CheckCircle2 } from "lucide-react";

interface GeoMapProps {
  regencies: Regency[];
}

export default function InteractiveGeoMap({ regencies }: GeoMapProps) {
  const [selectedKode, setSelectedKode] = useState<string>("7271");
  const [hoveredKode, setHoveredKode] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<"kemiskinan" | "ipm" | "pertumbuhan" | "ntp" | "pdrb">("kemiskinan");

  const activeReg = regencies.find((r) => r.Kode === selectedKode) || regencies[0];

  // Refined coordinates with clean spacing around Palu, Sigi, Donggala, and Parigi
  const regencyCoords: Record<string, { cx: number; cy: number; label: string; textPos: "top" | "bottom" | "left" | "right" }> = {
    "7207": { cx: 285, cy: 55, label: "Buol", textPos: "top" },
    "7206": { cx: 215, cy: 95, label: "Tolitoli", textPos: "top" },
    "7205": { cx: 105, cy: 205, label: "Donggala", textPos: "left" },
    "7271": { cx: 165, cy: 225, label: "Palu", textPos: "top" },
    "7210": { cx: 150, cy: 300, label: "Sigi", textPos: "bottom" },
    "7208": { cx: 245, cy: 215, label: "Parigi Moutong", textPos: "top" },
    "7204": { cx: 285, cy: 295, label: "Poso", textPos: "bottom" },
    "7209": { cx: 375, cy: 245, label: "Tojo Una-Una", textPos: "top" },
    "7212": { cx: 375, cy: 335, label: "Morowali Utara", textPos: "bottom" },
    "7203": { cx: 440, cy: 405, label: "Morowali", textPos: "bottom" },
    "7201": { cx: 485, cy: 265, label: "Banggai", textPos: "top" },
    "7202": { cx: 560, cy: 315, label: "Banggai Kep.", textPos: "top" },
    "7211": { cx: 605, cy: 365, label: "Banggai Laut", textPos: "bottom" },
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
            Peta geografis Sulawesi Tengah dengan visualisasi tematik indikator resmi BPS
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
        {/* Left: SVG Map Canvas with Geographic Silhouette */}
        <div className="lg:col-span-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-200">
          <div className="relative min-w-[540px] w-full h-[410px] bg-gradient-to-br from-amber-50/30 via-orange-50/20 to-white rounded-3xl border border-orange-200/80 flex items-center justify-center p-2">
            
            {/* Watermark Label */}
            <div className="absolute bottom-3 left-4 text-[10px] font-bold text-slate-400 select-none pointer-events-none">
              Provinsi Sulawesi Tengah · BPS Domain 7200
            </div>

            <svg viewBox="0 0 720 480" className="w-full h-full select-none">
              <defs>
                {/* Silhouette Island Gradients */}
                <linearGradient id="sultengSilhouette" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F58220" stopOpacity="0.10" />
                  <stop offset="50%" stopColor="#EA580C" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#D97706" stopOpacity="0.08" />
                </linearGradient>

                <linearGradient id="sultengCoast" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F58220" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#EA580C" stopOpacity="0.30" />
                </linearGradient>
              </defs>

              {/* 1. CENTRAL SULAWESI GEOGRAPHIC SILHOUETTE (MAINLAND & ARMS) */}
              <g className="pointer-events-none">
                {/* North Arm: Buol & Tolitoli */}
                <path
                  d="M 185,115 C 200,85 240,45 285,40 C 310,38 315,65 295,75 C 270,85 245,115 225,145 Z"
                  fill="url(#sultengSilhouette)"
                  stroke="url(#sultengCoast)"
                  strokeWidth="1.5"
                />

                {/* West Neck: Donggala, Palu, Sigi, Parigi, Poso */}
                <path
                  d="M 90,195 C 105,170 140,185 170,195 C 210,195 255,190 280,215 C 305,240 315,280 295,320 C 275,345 235,340 180,345 C 130,345 110,310 125,260 C 130,240 85,225 90,195 Z"
                  fill="url(#sultengSilhouette)"
                  stroke="url(#sultengCoast)"
                  strokeWidth="1.5"
                />

                {/* East Peninsula: Tojo Una-Una, Banggai mainland */}
                <path
                  d="M 285,250 C 320,240 365,225 410,230 C 455,235 505,245 515,270 C 510,290 470,295 425,285 C 385,275 350,295 315,290 Z"
                  fill="url(#sultengSilhouette)"
                  stroke="url(#sultengCoast)"
                  strokeWidth="1.5"
                />

                {/* Southeast Arm: Morowali Utara, Morowali */}
                <path
                  d="M 295,320 C 330,315 375,305 405,325 C 435,345 465,385 465,420 C 445,435 415,415 390,385 C 365,360 330,350 295,335 Z"
                  fill="url(#sultengSilhouette)"
                  stroke="url(#sultengCoast)"
                  strokeWidth="1.5"
                />

                {/* Banggai Kepulauan & Banggai Laut Archipelago */}
                <ellipse cx="560" cy="315" rx="30" ry="20" fill="url(#sultengSilhouette)" stroke="url(#sultengCoast)" strokeWidth="1.2" />
                <ellipse cx="605" cy="365" rx="24" ry="16" fill="url(#sultengSilhouette)" stroke="url(#sultengCoast)" strokeWidth="1.2" />
                <circle cx="535" cy="275" r="8" fill="url(#sultengSilhouette)" stroke="url(#sultengCoast)" strokeWidth="1" />
                <circle cx="585" cy="335" r="6" fill="url(#sultengSilhouette)" stroke="url(#sultengCoast)" strokeWidth="1" />
              </g>

              {/* 2. REGIONAL CONNECTOR ROUTE NETWORK */}
              <path
                d="M 285,55 L 215,95 L 105,205 L 165,225 L 150,300 M 165,225 L 245,215 L 285,295 L 375,245 L 485,265 L 560,315 L 605,365 M 285,295 L 375,335 L 440,405"
                className="fill-none stroke-orange-300/80 stroke-2"
                strokeDasharray="4 4"
              />

              {/* 3. REGIONAL NODES & CLEAN LABELS */}
              {regencies.map((reg) => {
                const c = regencyCoords[reg.Kode];
                if (!c) return null;
                const isSelected = selectedKode === reg.Kode;
                const isHovered = hoveredKode === reg.Kode;
                const color = getNodeColor(reg);
                const valStr = getMetricValue(reg);

                // Calculate tidy text positioning
                let labelY = c.cy - 18;
                let valY = c.cy + 22;
                let textAnchor: "middle" | "start" | "end" = "middle";
                let labelX = c.cx;

                if (c.textPos === "top") {
                  labelY = c.cy - 18;
                  valY = c.cy - 6;
                } else if (c.textPos === "bottom") {
                  labelY = c.cy + 18;
                  valY = c.cy + 29;
                } else if (c.textPos === "left") {
                  labelX = c.cx - 20;
                  labelY = c.cy - 3;
                  valY = c.cy + 10;
                  textAnchor = "end";
                }

                // Special fine-tuning for Palu & Sigi to avoid any overlap
                if (reg.Kode === "7271") { // Palu
                  labelX = c.cx;
                  labelY = c.cy - 19;
                  valY = c.cy - 7;
                }
                if (reg.Kode === "7210") { // Sigi
                  labelX = c.cx;
                  labelY = c.cy + 20;
                  valY = c.cy + 32;
                }

                return (
                  <g
                    key={reg.Kode}
                    onClick={() => setSelectedKode(reg.Kode)}
                    onMouseEnter={() => setHoveredKode(reg.Kode)}
                    onMouseLeave={() => setHoveredKode(null)}
                    className="cursor-pointer"
                  >
                    {/* Active Selected Steady Halo (No aggressive ping/flicker) */}
                    {isSelected && (
                      <>
                        <circle
                          cx={c.cx}
                          cy={c.cy}
                          r="25"
                          fill={color}
                          fillOpacity="0.20"
                        />
                        <circle
                          cx={c.cx}
                          cy={c.cy}
                          r="23"
                          fill="none"
                          stroke={color}
                          strokeWidth="2"
                          strokeDasharray="4 3"
                          opacity="0.85"
                        />
                      </>
                    )}

                    {/* Hover Steady Outline */}
                    {isHovered && !isSelected && (
                      <circle
                        cx={c.cx}
                        cy={c.cy}
                        r="20"
                        fill={color}
                        fillOpacity="0.15"
                        stroke={color}
                        strokeWidth="1.5"
                        opacity="0.6"
                      />
                    )}

                    {/* Solid Node Body (Stable without CSS scale glitch) */}
                    <circle
                      cx={c.cx}
                      cy={c.cy}
                      r={isSelected ? "16" : isHovered ? "15" : "13"}
                      fill={color}
                      stroke="#FFFFFF"
                      strokeWidth={isSelected ? "3.5" : "2.5"}
                      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}
                    />

                    {/* Regional Name Label */}
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor={textAnchor}
                      className={
                        "select-none transition-colors duration-150 " + 
                        (isSelected 
                          ? "text-[11px] font-black fill-[#EA580C]" 
                          : isHovered 
                            ? "text-[11px] font-black fill-slate-900" 
                            : "text-[10px] font-bold fill-slate-700")
                      }
                    >
                      {c.label}
                    </text>

                    {/* Indicator Value Label */}
                    <text
                      x={labelX}
                      y={valY}
                      textAnchor={textAnchor}
                      className={
                        "select-none transition-colors duration-150 " + 
                        (isSelected 
                          ? "text-[10px] font-black fill-slate-900" 
                          : isHovered 
                            ? "text-[9px] font-extrabold fill-[#EA580C]" 
                            : "text-[9px] font-semibold fill-slate-500")
                      }
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
          <div className="rounded-2xl border-2 border-orange-300 bg-gradient-to-br from-orange-50/95 via-white to-orange-50/60 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#EA580C] px-2.5 py-0.5 text-[10px] font-black text-white flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Wilayah Terpilih
              </span>
              <span className="text-xs font-bold text-slate-400">Kode: {activeReg.Kode}</span>
            </div>

            <h4 className="mt-2 text-xl font-black text-slate-900">{activeReg.Wilayah}</h4>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
              <div className="bg-white p-2.5 rounded-xl border border-orange-100 shadow-xs">
                <div className="text-[10px] text-slate-400">IPM (2024)</div>
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
                <div className="text-[10px] text-slate-400">Pertumbuhan PDRB</div>
                <div className="text-base font-black text-emerald-600">+{activeReg.Pertumbuhan_PDRB}%</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-orange-200/60 pt-3 text-xs font-bold text-slate-600">
              <span>Penduduk: <strong>{activeReg.Penduduk_Ribu} Ribu</strong></span>
              <span>NTP Petani: <strong>{activeReg.NTP}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
