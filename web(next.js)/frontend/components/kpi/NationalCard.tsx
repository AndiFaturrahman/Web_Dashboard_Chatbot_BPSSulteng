"use client";

interface NationalCardProps {
  data: {
    penduduk: string;
    ipm: string;
    kemiskinan: string;
    pengangguran: string;
    pertumbuhan_ekonomi: string;
    inflasi: string;
  };
}

export default function NationalCard({ data }: NationalCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-orange-500/40 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 text-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🇮🇩</span>
          <div>
            <div className="text-lg font-black text-white">
              BPS Pusat (Nasional RI) — Tolok Ukur Indonesia
            </div>
            <div className="text-xs font-medium text-slate-400">
              Data Resmi Pembanding Badan Pusat Statistik Nasional 2024
            </div>
          </div>
        </div>
        <div className="rounded-full bg-gradient-to-r from-[#F58220] to-[#EA580C] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white">
          Pembanding Nasional
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-xl border border-slate-700/60 bg-white/5 p-3">
          <div className="text-[11px] font-bold uppercase text-slate-400">👥 Penduduk RI</div>
          <div className="mt-1 text-xl font-black text-slate-100">{data.penduduk}</div>
        </div>
        <div className="rounded-xl border border-slate-700/60 bg-white/5 p-3">
          <div className="text-[11px] font-bold uppercase text-slate-400">❤️ IPM Nasional</div>
          <div className="mt-1 text-xl font-black text-slate-100">{data.ipm}</div>
        </div>
        <div className="rounded-xl border border-slate-700/60 bg-white/5 p-3">
          <div className="text-[11px] font-bold uppercase text-slate-400">💰 Kemiskinan RI</div>
          <div className="mt-1 text-xl font-black text-slate-100">{data.kemiskinan}</div>
        </div>
        <div className="rounded-xl border border-slate-700/60 bg-white/5 p-3">
          <div className="text-[11px] font-bold uppercase text-slate-400">💼 TPT Pengangguran</div>
          <div className="mt-1 text-xl font-black text-slate-100">{data.pengangguran}</div>
        </div>
        <div className="rounded-xl border border-slate-700/60 bg-white/5 p-3">
          <div className="text-[11px] font-bold uppercase text-slate-400">📈 Pertumbuhan PDB</div>
          <div className="mt-1 text-xl font-black text-slate-100">{data.pertumbuhan_ekonomi}</div>
        </div>
        <div className="rounded-xl border border-slate-700/60 bg-white/5 p-3">
          <div className="text-[11px] font-bold uppercase text-slate-400">🏷️ Inflasi Nasional</div>
          <div className="mt-1 text-xl font-black text-slate-100">{data.inflasi}</div>
        </div>
      </div>
    </div>
  );
}
