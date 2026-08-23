"use client";

import { useState } from "react";
import { Regency } from "@/types";
import { Layers, Sparkles, MapPin, CheckCircle2, Info } from "lucide-react";

interface GeoMapProps {
  regencies: Regency[];
}

export default function InteractiveGeoMap({ regencies }: GeoMapProps) {
  const [selectedKode, setSelectedKode] = useState<string>("7271");
  const [hoveredKode, setHoveredKode] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<"kemiskinan" | "ipm" | "pertumbuhan" | "ntp" | "pdrb">("pertumbuhan");

  const activeReg = regencies.find((r) => r.Kode === selectedKode) || regencies[0];

  // Clean, spacious coordinates for clear reading
  const regencyCoords: Record<string, { cx: number; cy: number; label: string; textYOffset: number; textXOffset?: number }> = {
    "7207": { cx: 300, cy: 55, label: "Buol", textYOffset: -22 },
    "7206": { cx: 225, cy: 95, label: "Tolitoli", textYOffset: -22 },
    "7205": { cx: 95, cy: 210, label: "Donggala", textYOffset: -22 },
    "7271": { cx: 175, cy: 220, label: "Palu", textYOffset: -24 },
    "7210": { cx: 155, cy: 310, label: "Sigi", textYOffset: 24 },
    "7208": { cx: 260, cy: 205, label: "Parigi Moutong", textYOffset: -22 },
    "7204": { cx: 300, cy: 295, label: "Poso", textYOffset: 24 },
    "7209": { cx: 395, cy: 235, label: "Tojo Una-Una", textYOffset: -22 },
    "7212": { cx: 395, cy: 335, label: "Morowali Utara", textYOffset: 24 },
    "7203": { cx: 460, cy: 410, label: "Morowali", textYOffset: 24 },
    "7201": { cx: 505, cy: 255, label: "Banggai", textYOffset: -22 },
    "7202": { cx: 580, cy: 305, label: "Banggai Kep.", textYOffset: -22 },
    "7211": { cx: 625, cy: 360, label: "Banggai Laut", textYOffset: 24 },
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
      if (r.Kemiskinan_Persen > 15) return "#E11D48"; // Merah: Tinggi
      if (r.Kemiskinan_Persen > 12) return "#F58220"; // Oren: Sedang
      return "#10B981"; // Hijau: Rendah/Bagus
    }
    if (activeMetric === "ipm") {
      if (r.IPM >= 75) return "#10B981"; // Hijau: Tinggi
      if (r.IPM >= 68) return "#F58220"; // Oren: Sedang
      return "#E11D48"; // Merah: Rendah
    }
    if (activeMetric === "pertumbuhan") {
      if (r.Pertumbuhan_PDRB > 10) return "#8B5CF6"; // Ungu: Sangat Tinggi (>10%)
      if (r.Pertumbuhan_PDRB > 6) return "#10B981"; // Hijau: Tinggi (6-10%)
      return "#F58220"; // Oren: Sedang (<6%)
    }
    if (activeMetric === "ntp") {
      if (r.NTP > 110) return "#10B981"; // Hijau: Surplus
      if (r.NTP >= 106) return "#F58220"; // Oren: Seimbang
      return "#E11D48"; // Merah: Rendah
    }
    if (activeMetric === "pdrb") {
      if (r.PDRB_Triliun > 30) return "#8B5CF6"; // Ungu: > 30T
      if (r.PDRB_Triliun >= 10) return "#10B981"; // Hijau: 10-30T
      return "#F58220"; // Oren: < 10T
    }
    return "#EA580C";
  };

  // Dynamic Legend Items based on Active Metric
  const getLegendItems = () => {
    switch (activeMetric) {
      case "pertumbuhan":
        return [
          { color: "#8B5CF6", label: "Sangat Tinggi (> 10%)", desc: "Morowali & Morut (Hilirisasi Industri)" },
          { color: "#10B981", label: "Tinggi (6% – 10%)", desc: "Palu, Banggai, Sigi" },
          { color: "#F58220", label: "Sedang (< 6%)", desc: "Donggala, Poso, Tolitoli, dll." },
        ];
      case "kemiskinan":
        return [
          { color: "#10B981", label: "Rendah / Bagus (< 12%)", desc: "Palu (6.54%), Banggai (7.32%), Sigi (11.95%)" },
          { color: "#F58220", label: "Sedang (12% – 15%)", desc: "Morowali, Buol, Tolitoli, Parigi" },
          { color: "#E11D48", label: "Tinggi (> 15%)", desc: "Donggala (16.48%), Tojo Una-Una, Poso" },
        ];
      case "ipm":
        return [
          { color: "#10B981", label: "Sangat Tinggi (≥ 75)", desc: "Kota Palu (82.52 — Kategori Sangat Tinggi)" },
          { color: "#F58220", label: "Tinggi / Sedang (68 – 74.9)", desc: "Morowali, Poso, Banggai, Sigi, Buol" },
          { color: "#E11D48", label: "Sedang (< 68)", desc: "Donggala, Tolitoli, Parigi, Banggai Kep/Laut" },
        ];
      case "pdrb":
        return [
          { color: "#8B5CF6", label: "Sangat Besar (> Rp 30 T)", desc: "Morowali (Rp 64,2T), Morut (Rp 36,1T), Palu (Rp 32,4T)" },
          { color: "#10B981", label: "Menengah (Rp 10 – 30 T)", desc: "Banggai, Parigi Moutong, Poso, Donggala, Tolitoli" },
          { color: "#F58220", label: "Berkembang (< Rp 10 T)", desc: "Sigi, Tojo Una-Una, Buol, Banggai Kep/Laut" },
        ];
      case "ntp":
        return [
          { color: "#10B981", label: "Petani Sejahtera (> 110 Poin)", desc: "Morowali, Morut, Sigi, Parigi Moutong" },
          { color: "#F58220", label: "Petani Seimbang (105 – 110)", desc: "Banggai, Poso, Tolitoli, Buol, Touna" },
          { color: "#E11D48", label: "Perlu Dukungan (< 105)", desc: "Banggai Kepulauan & Banggai Laut" },
        ];
    }
  };

  return (
    <div className="glass-card rounded-3xl p-4 sm:p-6 overflow-hidden">
      {/* Header & Thematic Metric Tabs */}
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
            Pilih metrik indikator untuk melihat distribusi warna tematik resmi BPS
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-orange-50/80 rounded-xl border border-orange-200">
          {(["pertumbuhan", "kemiskinan", "ipm", "pdrb", "ntp"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setActiveMetric(m)}
              className={
                "px-3 py-1 text-[11px] font-black rounded-lg transition-all capitalize " +
                (activeMetric === m 
                  ? "bg-gradient-to-r from-[#F58220] to-[#EA580C] text-white shadow-sm" 
                  : "text-slate-600 hover:text-[#EA580C]")
              }
            >
              {m === "pertumbuhan" ? "Pertumbuhan (%)" : m === "pdrb" ? "PDRB (Triliun)" : m === "kemiskinan" ? "Kemiskinan (%)" : m === "ipm" ? "IPM" : "NTP Petani"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left: Clean SVG Map Canvas without Silhouette */}
        <div className="lg:col-span-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-200">
          <div className="relative min-w-[560px] w-full h-[430px] bg-gradient-to-br from-amber-50/20 via-orange-50/10 to-white rounded-3xl border border-orange-200/80 flex items-center justify-center p-3">
            
            {/* Watermark Label */}
            <div className="absolute bottom-3 left-4 text-[10px] font-bold text-slate-400 select-none pointer-events-none">
              Provinsi Sulawesi Tengah · BPS Domain 7200
            </div>

            <svg viewBox="0 0 740 480" className="w-full h-full select-none">
              {/* Regional Connector Network Routes */}
              <g className="pointer-events-none">
                <path
                  d="M 300,55 L 225,95 L 95,210 L 175,220 L 155,310 M 175,220 L 260,205 L 300,295 L 395,235 L 505,255 L 580,305 L 625,360 M 300,295 L 395,335 L 460,410"
                  className="fill-none stroke-orange-200/90 stroke-2"
                  strokeDasharray="5 5"
                />
              </g>

              {/* Regional Nodes with Clean Placement */}
              {regencies.map((reg) => {
                const c = regencyCoords[reg.Kode];
                if (!c) return null;
                const isSelected = selectedKode === reg.Kode;
                const isHovered = hoveredKode === reg.Kode;
                const color = getNodeColor(reg);
                const valStr = getMetricValue(reg);

                const labelY = c.cy + (c.textYOffset < 0 ? c.textYOffset - 4 : c.textYOffset);
                const valY = c.cy + (c.textYOffset < 0 ? c.textYOffset + 8 : c.textYOffset + 12);

                return (
                  <g
                    key={reg.Kode}
                    onClick={() => setSelectedKode(reg.Kode)}
                    onMouseEnter={() => setHoveredKode(reg.Kode)}
                    onMouseLeave={() => setHoveredKode(null)}
                    className="cursor-pointer"
                  >
                    {/* Active Selected Steady Halo Ring (No flickering/animation) */}
                    {isSelected && (
                      <>
                        <circle
                          cx={c.cx}
                          cy={c.cy}
                          r="26"
                          fill={color}
                          fillOpacity="0.18"
                        />
                        <circle
                          cx={c.cx}
                          cy={c.cy}
                          r="24"
                          fill="none"
                          stroke={color}
                          strokeWidth="2.5"
                          strokeDasharray="4 3"
                          opacity="0.9"
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
                      />
                    )}

                    {/* Solid Node Body with Drop Shadow */}
                    <circle
                      cx={c.cx}
                      cy={c.cy}
                      r={isSelected ? "17" : "14"}
                      fill={color}
                      stroke="#FFFFFF"
                      strokeWidth={isSelected ? "3.5" : "2.5"}
                      style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.18))" }}
                    />

                    {/* Regional Name Label */}
                    <text
                      x={c.cx}
                      y={labelY}
                      textAnchor="middle"
                      className={
                        "select-none " + 
                        (isSelected 
                          ? "text-[12px] font-black fill-[#EA580C]" 
                          : isHovered 
                            ? "text-[11px] font-black fill-slate-900" 
                            : "text-[11px] font-bold fill-slate-800")
                      }
                    >
                      {c.label}
                    </text>

                    {/* Value Badge Label */}
                    <text
                      x={c.cx}
                      y={valY}
                      textAnchor="middle"
                      className={
                        "select-none " + 
                        (isSelected 
                          ? "text-[10px] font-black fill-slate-900" 
                          : isHovered 
                            ? "text-[9px] font-black fill-[#EA580C]" 
                            : "text-[9px] font-bold fill-slate-500")
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

        {/* Right: Selected Region Inspector & Dynamic Color Legend */}
        <div className="lg:col-span-4 space-y-4">
          {/* 1. Selected Region Detail Card */}
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
                <div className="text-[10px] text-slate-400">Pertumbuhan PDRB</div>
                <div className="text-base font-black text-emerald-600">+{activeReg.Pertumbuhan_PDRB}%</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-orange-100 shadow-xs">
                <div className="text-[10px] text-slate-400">Kemiskinan</div>
                <div className="text-base font-black text-rose-600">{activeReg.Kemiskinan_Persen}%</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-orange-100 shadow-xs">
                <div className="text-[10px] text-slate-400">IPM (2024)</div>
                <div className="text-base font-black text-[#EA580C]">{activeReg.IPM}</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-orange-100 shadow-xs">
                <div className="text-[10px] text-slate-400">PDRB Riil</div>
                <div className="text-base font-black text-slate-800">Rp {activeReg.PDRB_Triliun} T</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-orange-200/60 pt-3 text-xs font-bold text-slate-600">
              <span>Penduduk: <strong>{activeReg.Penduduk_Ribu} Ribu</strong></span>
              <span>NTP Petani: <strong>{activeReg.NTP}</strong></span>
            </div>
          </div>

          {/* 2. DYNAMIC COLOR LEGEND (KETERANGAN WARNA NODE) */}
          <div className="rounded-2xl border border-orange-200/90 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-slate-700 pb-2 border-b border-orange-100">
              <Info className="h-3.5 w-3.5 text-[#EA580C]" />
              <span>Keterangan Warna Node ({activeMetric.toUpperCase()})</span>
            </div>

            <div className="mt-3 space-y-2.5">
              {getLegendItems().map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <span
                    className="h-3.5 w-3.5 rounded-full shrink-0 mt-0.5 shadow-xs border border-white"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <div className="font-black text-slate-900">{item.label}</div>
                    <div className="text-[11px] font-medium text-slate-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
