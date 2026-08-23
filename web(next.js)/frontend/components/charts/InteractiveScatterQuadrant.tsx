"use client";

import { useState } from "react";
import { Regency } from "@/types";

interface ScatterProps {
  title: string;
  regencies: Regency[];
}

export default function InteractiveScatterQuadrant({ title, regencies }: ScatterProps) {
  const [selectedReg, setSelectedReg] = useState<Regency | null>(null);

  // X Axis = Kemiskinan (range 5 - 18 %)
  // Y Axis = IPM (range 65 - 85)
  const minX = 5, maxX = 18;
  const minY = 65, maxY = 85;
  const midX = 11.5; // Threshold kemiskinan rata-rata
  const midY = 71.0; // Threshold IPM rata-rata

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-200/60 pb-3">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">
            🎯 {title}
          </h3>
          <p className="text-xs text-slate-500">
            Matriks 4 Kuadran: Sumbu X (Kemiskinan %) vs Sumbu Y (IPM) dengan ukuran bubble (Penduduk)
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-bold">
          <span className="text-emerald-700">★ Kuadran I: Prima</span>
          <span className="text-rose-700">▲ Kuadran IV: Prioritas Intervensi</span>
        </div>
      </div>

      <div className="relative mt-6 h-80 w-full rounded-2xl border border-orange-200/70 bg-gradient-to-br from-orange-50/30 to-amber-50/20 p-6">
        {/* Quadrant Lines */}
        <div
          className="absolute top-0 bottom-0 border-r border-dashed border-orange-300"
          style={{ left: (((midX - minX) / (maxX - minX)) * 100) + "%" }}
        />
        <div
          className="absolute left-0 right-0 border-b border-dashed border-orange-300"
          style={{ bottom: (((midY - minY) / (maxY - minY)) * 100) + "%" }}
        />

        {/* Quadrant Labels */}
        <div className="absolute top-3 left-4 text-[10px] font-black text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full">
          Kuadran I: IPM Tinggi, Kemiskinan Rendah (Prima)
        </div>
        <div className="absolute top-3 right-4 text-[10px] font-black text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full">
          Kuadran II: IPM Tinggi, Kemiskinan Tinggi
        </div>
        <div className="absolute bottom-3 left-4 text-[10px] font-black text-blue-800 bg-blue-100/90 px-2 py-0.5 rounded-full">
          Kuadran III: IPM Moderat, Kemiskinan Rendah
        </div>
        <div className="absolute bottom-3 right-4 text-[10px] font-black text-rose-800 bg-rose-100/90 px-2 py-0.5 rounded-full">
          Kuadran IV: Perlu Intervensi Khusus
        </div>

        {/* Scatter Bubbles */}
        {regencies.map((reg) => {
          const posX = ((reg.Kemiskinan_Persen - minX) / (maxX - minX)) * 100;
          const posY = ((reg.IPM - minY) / (maxY - minY)) * 100;
          const size = Math.max(22, Math.min(50, (reg.Penduduk_Ribu / 450) * 45));
          const isSelected = selectedReg?.Kode === reg.Kode;

          return (
            <div
              key={reg.Kode}
              onClick={() => setSelectedReg(reg)}
              className="absolute -translate-x-1/2 translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-125 hover:z-20"
              style={{
                left: posX + "%",
                bottom: posY + "%",
              }}
            >
              <div
                className={
                  "flex items-center justify-center rounded-full border-2 text-[10px] font-black text-white shadow-lg transition-all " +
                  (reg.IPM >= midY && reg.Kemiskinan_Persen <= midX
                    ? "border-emerald-200 bg-emerald-600"
                    : reg.Kemiskinan_Persen > midX && reg.IPM < midY
                    ? "border-rose-200 bg-rose-600"
                    : "border-orange-200 bg-[#F58220]")
                }
                style={{ width: size + "px", height: size + "px" }}
                title={reg.Wilayah + " (IPM: " + reg.IPM + ", Kemiskinan: " + reg.Kemiskinan_Persen + "%)"}
              >
                {reg.Wilayah.replace("Kab. ", "").replace("Kota ", "").slice(0, 3)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex justify-between text-xs font-bold text-slate-500">
        <span>← Kemiskinan Rendah (5%)</span>
        <span className="text-slate-800">Sumbu X: Persentase Kemiskinan</span>
        <span>Kemiskinan Tinggi (18%) →</span>
      </div>

      {selectedReg && (
        <div className="mt-4 flex flex-wrap items-center justify-between rounded-xl border border-orange-300 bg-orange-100/70 p-4 text-xs font-bold text-slate-800">
          <div>
            📍 Terpilih: <span className="text-base font-black text-slate-900">{selectedReg.Wilayah}</span>
          </div>
          <div className="flex gap-4">
            <span>❤️ IPM: <strong className="text-[#EA580C]">{selectedReg.IPM}</strong></span>
            <span>💰 Kemiskinan: <strong className="text-rose-600">{selectedReg.Kemiskinan_Persen}%</strong></span>
            <span>👥 Penduduk: <strong>{selectedReg.Penduduk_Ribu} Ribu Jiwa</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
