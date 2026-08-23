"use client";

import { useState } from "react";
import { Regency } from "@/types";

interface ScatterQuadrantProps {
  title: string;
  regencies: Regency[];
}

export default function InteractiveScatterQuadrant({ title, regencies }: ScatterQuadrantProps) {
  const [selectedReg, setSelectedReg] = useState<Regency | null>(null);

  const avgIPM = 71.38;
  const avgKemiskinan = 11.77;

  const minX = 4;
  const maxX = 18;
  const minY = 64;
  const maxY = 84;

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-200/60 pb-4">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">
            🎯 {title}
          </h3>
          <p className="text-xs text-slate-500">
            Sumbu X = Tingkat Kemiskinan (%) · Sumbu Y = IPM · Garis Putus-Putus = Rata-Rata Provinsi
          </p>
        </div>
      </div>

      {/* Scrollable Canvas Container */}
      <div className="mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-200">
        <div className="relative h-80 min-w-[540px] w-full rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50/40 via-white to-amber-50/40 p-4">
          {/* Average Axis Lines */}
          <div 
            className="absolute top-0 bottom-0 border-r-2 border-dashed border-[#F58220]/60 z-0"
            style={{ left: `${((avgKemiskinan - minX) / (maxX - minX)) * 100}%` }}
          >
            <span className="absolute top-2 left-2 rounded bg-orange-100 px-1.5 py-0.5 text-[9px] font-black text-[#EA580C]">
              Rata-rata Kemiskinan ({avgKemiskinan}%)
            </span>
          </div>

          <div 
            className="absolute left-0 right-0 border-b-2 border-dashed border-[#F58220]/60 z-0"
            style={{ bottom: `${((avgIPM - minY) / (maxY - minY)) * 100}%` }}
          >
            <span className="absolute bottom-2 left-2 rounded bg-orange-100 px-1.5 py-0.5 text-[9px] font-black text-[#EA580C]">
              Rata-rata IPM ({avgIPM})
            </span>
          </div>

          {/* Quadrant Labels */}
          <div className="absolute top-2 right-2 text-[10px] font-black text-rose-500 uppercase bg-rose-50/80 px-2 py-0.5 rounded">
            Kuadran II: IPM Tinggi, Kemiskinan Tinggi
          </div>
          <div className="absolute top-2 left-2 text-[10px] font-black text-emerald-600 uppercase bg-emerald-50/80 px-2 py-0.5 rounded">
            Kuadran I: PRIMA (IPM Tinggi, Kemiskinan Rendah)
          </div>
          <div className="absolute bottom-2 left-2 text-[10px] font-black text-amber-600 uppercase bg-amber-50/80 px-2 py-0.5 rounded">
            Kuadran III: IPM Rendah, Kemiskinan Rendah
          </div>
          <div className="absolute bottom-2 right-2 text-[10px] font-black text-rose-700 uppercase bg-rose-100/90 px-2 py-0.5 rounded">
            Kuadran IV: PRIORITAS INTERVENSI
          </div>

          {/* Bubbles */}
          {regencies.map((reg) => {
            const posX = ((reg.Kemiskinan_Persen - minX) / (maxX - minX)) * 100;
            const posY = ((reg.IPM - minY) / (maxY - minY)) * 100;
            const isSelected = selectedReg?.Kode === reg.Kode;

            return (
              <div
                key={reg.Kode}
                onClick={() => setSelectedReg(reg)}
                className="group absolute -translate-x-1/2 translate-y-1/2 cursor-pointer z-10"
                style={{ left: `${posX}%`, bottom: `${posY}%` }}
              >
                <div 
                  className={
                    "flex items-center justify-center rounded-full text-[10px] font-black text-white shadow-md transition-all duration-300 group-hover:scale-125 " +
                    (isSelected 
                      ? "h-10 w-10 bg-slate-900 ring-4 ring-orange-400 z-20" 
                      : (reg.IPM >= avgIPM && reg.Kemiskinan_Persen <= avgKemiskinan 
                          ? "h-8 w-8 bg-emerald-500" 
                          : (reg.IPM < avgIPM && reg.Kemiskinan_Persen > avgKemiskinan 
                              ? "h-8 w-8 bg-rose-500" 
                              : "h-7 w-7 bg-[#F58220]")))
                  }
                  title={`${reg.Wilayah} (IPM: ${reg.IPM}, Kemiskinan: ${reg.Kemiskinan_Persen}%)`}
                >
                  {reg.Wilayah.replace("Kabupaten ", "").replace("Kab. ", "").replace("Kota ", "").slice(0, 3).toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Box */}
      {selectedReg && (
        <div className="mt-4 rounded-xl border border-orange-300 bg-orange-50/80 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-black text-slate-900">📍 {selectedReg.Wilayah}</h4>
            <div className="flex flex-wrap gap-3 text-xs font-bold text-slate-700">
              <span>IPM: <strong className="text-[#EA580C]">{selectedReg.IPM}</strong></span>
              <span>Kemiskinan: <strong className="text-rose-600">{selectedReg.Kemiskinan_Persen}%</strong></span>
              <span>PDRB: <strong>Rp {selectedReg.PDRB_Triliun} T</strong></span>
              <span>Penduduk: <strong>{selectedReg.Penduduk_Ribu} Ribu</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
