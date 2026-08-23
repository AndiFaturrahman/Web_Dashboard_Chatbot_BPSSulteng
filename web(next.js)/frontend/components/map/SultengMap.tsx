"use client";

import { Regency } from "@/types";
import { useState } from "react";

interface MapProps {
  regencies: Regency[];
}

export default function SultengMap({ regencies }: MapProps) {
  const [selected, setSelected] = useState<Regency>(regencies[0]);
  const [metric, setMetric] = useState<keyof Regency>("Kemiskinan_Persen");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="glass-card lg:col-span-2 rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-200/60 pb-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-700">
            🗺️ Sebaran 13 Kabupaten/Kota di Sulawesi Tengah
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setMetric("Kemiskinan_Persen")}
              className={"rounded-xl px-3 py-1 text-xs font-bold transition-all " + (metric === "Kemiskinan_Persen" ? "bg-[#F58220] text-white" : "bg-orange-100/70 text-slate-700")}
            >
              Kemiskinan
            </button>
            <button
              onClick={() => setMetric("IPM")}
              className={"rounded-xl px-3 py-1 text-xs font-bold transition-all " + (metric === "IPM" ? "bg-[#F58220] text-white" : "bg-orange-100/70 text-slate-700")}
            >
              IPM
            </button>
            <button
              onClick={() => setMetric("Pertumbuhan_PDRB")}
              className={"rounded-xl px-3 py-1 text-xs font-bold transition-all " + (metric === "Pertumbuhan_PDRB" ? "bg-[#F58220] text-white" : "bg-orange-100/70 text-slate-700")}
            >
              Pertumbuhan PDRB
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {regencies.map((reg) => {
            const isSelected = selected.Kode === reg.Kode;
            const cardClass = isSelected
              ? "border-[#F58220] bg-orange-100/80 shadow-md ring-2 ring-orange-400/40"
              : "border-orange-200/50 bg-white/70 hover:bg-orange-50/70";
            return (
              <button
                key={reg.Kode}
                onClick={() => setSelected(reg)}
                className={"flex flex-col items-start rounded-2xl border p-3 text-left transition-all " + cardClass}
              >
                <div className="text-xs font-black text-slate-900">{reg.Wilayah}</div>
                <div className="mt-1 text-lg font-black text-[#EA580C]">
                  {reg[metric]} {metric === "IPM" ? "" : "%"}
                </div>
                <div className="text-[10px] font-medium text-slate-400">Kode: {reg.Kode}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Profil Wilayah</h3>
        <div className="mt-2 text-2xl font-black text-slate-900">{selected.Wilayah}</div>
        <div className="text-xs font-semibold text-[#F58220]">Kode BPS: {selected.Kode} ({selected.Tipe})</div>

        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-orange-50/80 p-3">
            <div className="text-[11px] font-bold text-slate-500">👥 Jumlah Penduduk</div>
            <div className="text-lg font-black text-slate-900">{selected.Penduduk_Ribu} Ribu Jiwa</div>
          </div>
          <div className="rounded-xl bg-orange-50/80 p-3">
            <div className="text-[11px] font-bold text-slate-500">❤️ Indeks Pembangunan Manusia</div>
            <div className="text-lg font-black text-slate-900">{selected.IPM}</div>
          </div>
          <div className="rounded-xl bg-orange-50/80 p-3">
            <div className="text-[11px] font-bold text-slate-500">💰 Persentase Kemiskinan</div>
            <div className="text-lg font-black text-slate-900">{selected.Kemiskinan_Persen}%</div>
          </div>
          <div className="rounded-xl bg-orange-50/80 p-3">
            <div className="text-[11px] font-bold text-slate-500">📈 Pertumbuhan PDRB</div>
            <div className="text-lg font-black text-slate-900">{selected.Pertumbuhan_PDRB}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
