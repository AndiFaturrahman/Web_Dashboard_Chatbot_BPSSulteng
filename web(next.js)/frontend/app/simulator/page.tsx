"use client";
import { useEffect, useState } from "react";
import { fetchMlSimulatePolicy } from "@/lib/api";
import { PolicySimResponse } from "@/types";
import { Sliders, Sparkles, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function SimulatorPage() {
  const [eduInvest, setEduInvest] = useState<number>(50);
  const [infraInvest, setInfraInvest] = useState<number>(100);
  const [industryProjects, setIndustryProjects] = useState<number>(5);
  const [umkmUnits, setUmkmUnits] = useState<number>(1000);

  const [simResult, setSimResult] = useState<PolicySimResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function runSim() {
      setIsLoading(true);
      try {
        const res = await fetchMlSimulatePolicy({
          edu_invest_miliar: eduInvest,
          infra_invest_miliar: infraInvest,
          industry_projects: industryProjects,
          umkm_assistance_units: umkmUnits,
        });
        setSimResult(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    runSim();
  }, [eduInvest, infraInvest, industryProjects, umkmUnits]);

  if (!simResult) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F58220] border-t-transparent" />
      </div>
    );
  }

  const sim = simResult.simulated;
  const base = simResult.baseline;

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-100/70 px-3 py-1 text-xs font-black text-[#EA580C]">
          <Sliders className="h-3.5 w-3.5" /> EXPLAINABLE POLICY SIMULATOR
        </div>
        <h1 className="mt-2 text-2xl font-black text-slate-900">
          Simulator Kebijakan Pembangunan Daerah (What-If AI)
        </h1>
        <p className="text-xs text-slate-500">
          Ubah parameter alokasi anggaran daerah untuk melihat simulasi dampak terhadap IPM, Kemiskinan, dan Pertumbuhan PDRB
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="glass-card lg:col-span-6 rounded-3xl p-6 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-800 border-b border-orange-200 pb-3">
            🎛️ Pengaturan Parameter Intervensi Kebijakan
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>🎓 Investasi Pendidikan & Beasiswa</span>
              <span className="text-[#EA580C] font-black">Rp {eduInvest} Miliar</span>
            </div>
            <input
              type="range"
              min={20}
              max={150}
              step={5}
              value={eduInvest}
              onChange={(e) => setEduInvest(parseFloat(e.target.value))}
              className="w-full accent-[#F58220] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Rp 20 M</span>
              <span>Rp 150 M</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>🛣️ Anggaran Infrastruktur & Konektivitas</span>
              <span className="text-[#EA580C] font-black">Rp {infraInvest} Miliar</span>
            </div>
            <input
              type="range"
              min={50}
              max={300}
              step={10}
              value={infraInvest}
              onChange={(e) => setInfraInvest(parseFloat(e.target.value))}
              className="w-full accent-[#F58220] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Rp 50 M</span>
              <span>Rp 300 M</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>🏭 Proyek Hilirisasi Industri & Smelter</span>
              <span className="text-[#EA580C] font-black">{industryProjects} Proyek</span>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              step={1}
              value={industryProjects}
              onChange={(e) => setIndustryProjects(parseInt(e.target.value))}
              className="w-full accent-[#F58220] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 Unit</span>
              <span>25 Unit</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>🏪 Pemberdayaan UMKM & Bansos Pangan</span>
              <span className="text-[#EA580C] font-black">{umkmUnits} Unit</span>
            </div>
            <input
              type="range"
              min={100}
              max={5000}
              step={100}
              value={umkmUnits}
              onChange={(e) => setUmkmUnits(parseInt(e.target.value))}
              className="w-full accent-[#F58220] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>100 Unit</span>
              <span>5.000 Unit</span>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="glass-card rounded-2xl p-5 border-t-4 border-emerald-500">
              <div className="text-xs font-black uppercase text-slate-400">Estimasi IPM</div>
              <div className="mt-2 text-3xl font-black text-slate-900">{sim.ipm}</div>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-800">
                  <ArrowUpRight className="h-3.5 w-3.5" /> {sim.delta_ipm} poin
                </span>
                <span className="text-[11px] text-slate-500">dari {base.ipm}</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border-t-4 border-rose-500">
              <div className="text-xs font-black uppercase text-slate-400">Estimasi Kemiskinan</div>
              <div className="mt-2 text-3xl font-black text-slate-900">{sim.kemiskinan}%</div>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-black text-rose-800">
                  <ArrowDownRight className="h-3.5 w-3.5" /> {sim.delta_kemiskinan}
                </span>
                <span className="text-[11px] text-slate-500">dari {base.kemiskinan}%</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h4 className="text-xs font-black uppercase text-slate-500 mb-3">
              💡 Bobot Kontribusi Sektor (Explainable AI / SHAP)
            </h4>
            <div className="space-y-2.5">
              {simResult.shap_breakdown.map((sh, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-orange-50/70 p-2.5 text-xs">
                  <span className="font-bold text-slate-700">{sh.factor}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{sh.value_raw}</span>
                    <span className="font-black text-[#EA580C] bg-white px-2 py-0.5 rounded-md shadow-sm">
                      {sh.contribution}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-orange-300 bg-orange-100/60 p-4">
            <div className="flex items-start gap-2.5">
              <Sparkles className="h-5 w-5 text-[#F58220] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-black text-slate-900">Narasi AI Prediktif:</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-700">{simResult.ai_narrative}</p>
                <div className="mt-2 text-[10px] font-bold text-slate-400 italic">
                  ℹ️ {simResult.disclaimer}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
