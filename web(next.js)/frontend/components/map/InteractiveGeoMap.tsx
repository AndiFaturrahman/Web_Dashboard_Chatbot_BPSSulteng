"use client";

import { useState } from "react";
import { Regency } from "@/types";

interface GeoMapProps {
  regencies: Regency[];
}

export default function InteractiveGeoMap({ regencies }: GeoMapProps) {
  const [selectedMetric, setSelectedMetric] = useState<keyof Regency>("Kemiskinan_Persen");
  const [activeReg, setActiveReg] = useState<Regency>(regencies[0]);

  // Spatial Relative Positions representing Sulawesi Tengah's Geography
  const spatialNodes = [
    { code: "7207", name: "Kab. Buol", x: 180, y: 40, width: 85, height: 50 },
    { code: "7206", name: "Kab. Tolitoli", x: 90, y: 70, width: 85, height: 55 },
    { code: "7205", name: "Kab. Donggala", x: 50, y: 150, width: 80, height: 60 },
    { code: "7271", name: "Kota Palu", x: 100, y: 220, width: 80, height: 45 },
    { code: "7208", name: "Kab. Parigi Moutong", x: 190, y: 170, width: 110, height: 60 },
    { code: "7210", name: "Kab. Sigi", x: 90, y: 280, width: 85, height: 60 },
    { code: "7204", name: "Kab. Poso", x: 190, y: 250, width: 95, height: 65 },
    { code: "7209", name: "Kab. Tojo Una-Una", x: 300, y: 200, width: 105, height: 60 },
    { code: "7201", name: "Kab. Banggai", x: 410, y: 230, width: 100, height: 65 },
    { code: "7212", name: "Kab. Morowali Utara", x: 260, y: 320, width: 105, height: 60 },
    { code: "7203", name: "Kab. Morowali", x: 340, y: 380, width: 100, height: 65 },
    { code: "7202", name: "Kab. Banggai Kepulauan", x: 480, y: 310, width: 95, height: 55 },
    { code: "7211", name: "Kab. Banggai Laut", x: 500, y: 380, width: 90, height: 50 },
  ];

  const getMetricColor = (val: number, metric: keyof Regency) => {
    if (metric === "Kemiskinan_Persen" || metric === "Pengangguran_Persen") {
      if (val <= 7.0) return "#10B981"; // Hijau (Prima)
      if (val <= 12.0) return "#F58220"; // Oranye BPS
      if (val <= 14.5) return "#EA580C"; // Oranye Tua
      return "#E11D48"; // Merah (Kritis)
    } else if (metric === "IPM") {
      if (val >= 75) return "#10B981";
      if (val >= 70) return "#F58220";
      return "#F97316";
    } else {
      if (val >= 15) return "#10B981";
      if (val >= 6) return "#F58220";
      return "#FB923C";
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-orange-200/60 pb-4">
        <div>
          <h3 className="text-base font-extrabold uppercase tracking-wide text-slate-900">
            🗺️ Peta Spasial Choropleth Sulawesi Tengah (13 Wilayah)
          </h3>
          <p className="text-xs text-slate-500">
            Visualisasi geospasial tematik resmi Badan Pusat Statistik
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "Kemiskinan_Persen", label: "Tingkat Kemiskinan (%)" },
            { key: "IPM", label: "Indeks Pembangunan Manusia" },
            { key: "Pertumbuhan_PDRB", label: "Pertumbuhan PDRB (%)" },
            { key: "PDRB_Triliun", label: "Total PDRB (Triliun)" },
            { key: "NTP", label: "NTP Petani" },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setSelectedMetric(m.key as keyof Regency)}
              className={
                "rounded-xl px-3 py-1.5 text-xs font-black transition-all " +
                (selectedMetric === m.key
                  ? "bg-[#F58220] text-white shadow-md shadow-orange-500/25"
                  : "bg-orange-100/70 text-slate-700 hover:bg-orange-200/60")
              }
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 items-center gap-6 lg:grid-cols-3">
        {/* SVG Spatial GIS Map Canvas */}
        <div className="lg:col-span-2 relative flex justify-center rounded-2xl border border-orange-200/80 bg-gradient-to-b from-sky-50/50 via-orange-50/30 to-amber-50/40 p-4">
          <svg viewBox="0 0 630 460" className="w-full h-auto max-h-[460px]">
            {/* Watermark Grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FED7AA" strokeWidth="0.5" strokeOpacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Connecting spatial lines */}
            <polyline
              points="140,240 230,200 240,280 350,230 460,260 520,330"
              fill="none"
              stroke="#FDBA74"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Spatial Island Nodes */}
            {spatialNodes.map((node) => {
              const regData = regencies.find((r) => r.Kode === node.code) || regencies[0];
              const val = regData[selectedMetric] as number;
              const color = getMetricColor(val, selectedMetric);
              const isSelected = activeReg.Kode === node.code;

              return (
                <g
                  key={node.code}
                  onClick={() => setActiveReg(regData)}
                  className="cursor-pointer transition-all duration-300 group"
                >
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    rx="14"
                    fill={color}
                    stroke={isSelected ? "#1E293B" : "#FFFFFF"}
                    strokeWidth={isSelected ? "3" : "1.5"}
                    className="transition-all duration-300 hover:brightness-110 shadow-lg"
                    opacity={isSelected ? 1 : 0.88}
                  />
                  <text
                    x={node.x + node.width / 2}
                    y={node.y + 20}
                    textAnchor="middle"
                    className="fill-white text-[11px] font-black pointer-events-none drop-shadow"
                  >
                    {node.name.replace("Kab. ", "").replace("Kota ", "")}
                  </text>
                  <text
                    x={node.x + node.width / 2}
                    y={node.y + 36}
                    textAnchor="middle"
                    className="fill-amber-100 text-[10px] font-extrabold pointer-events-none drop-shadow"
                  >
                    {val} {selectedMetric === "IPM" || selectedMetric === "NTP" ? "" : selectedMetric === "PDRB_Triliun" ? "T" : "%"}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Regency Inspector Card */}
        <div className="glass-card rounded-2xl p-5 border-2 border-[#F58220]/40">
          <div className="flex items-center justify-between border-b border-orange-200 pb-3">
            <div>
              <div className="text-xs font-black uppercase text-slate-400">Inspeksi Detail</div>
              <h4 className="text-xl font-black text-slate-900">{activeReg.Wilayah}</h4>
            </div>
            <span className="rounded-full bg-[#EA580C] px-3 py-1 text-xs font-bold text-white">
              Kode {activeReg.Kode}
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between rounded-xl bg-orange-50/80 p-2.5">
              <span className="text-xs font-bold text-slate-600">👥 Jumlah Penduduk</span>
              <span className="text-sm font-black text-slate-900">{activeReg.Penduduk_Ribu} Ribu Jiwa</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-orange-50/80 p-2.5">
              <span className="text-xs font-bold text-slate-600">❤️ IPM (Pembangunan)</span>
              <span className="text-sm font-black text-emerald-700">{activeReg.IPM} Poin</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-orange-50/80 p-2.5">
              <span className="text-xs font-bold text-slate-600">💰 Persentase Kemiskinan</span>
              <span className="text-sm font-black text-rose-600">{activeReg.Kemiskinan_Persen}%</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-orange-50/80 p-2.5">
              <span className="text-xs font-bold text-slate-600">📈 Pertumbuhan PDRB</span>
              <span className="text-sm font-black text-[#EA580C]">{activeReg.Pertumbuhan_PDRB}%</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-orange-50/80 p-2.5">
              <span className="text-xs font-bold text-slate-600">🌾 Nilai Tukar Petani (NTP)</span>
              <span className="text-sm font-black text-blue-700">{activeReg.NTP} Poin</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-orange-50/80 p-2.5">
              <span className="text-xs font-bold text-slate-600">💼 Tingkat Pengangguran</span>
              <span className="text-sm font-black text-slate-800">{activeReg.Pengangguran_Persen}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
