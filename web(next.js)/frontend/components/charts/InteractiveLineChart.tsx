"use client";

interface LineChartProps {
  title: string;
  years: string[];
  sulteng: number[];
  nasional: number[];
}

export default function InteractiveLineChart({ title, years, sulteng, nasional }: LineChartProps) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-700">{title}</h3>
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-[#F58220]">
            <span className="h-3 w-3 rounded-full bg-[#F58220]" /> Sulteng
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="h-3 w-3 rounded-full bg-slate-800" /> Nasional
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-2 text-center">
        {years.map((yr, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <div className="text-xs font-black text-[#EA580C]">{sulteng[idx]}</div>
            <div className="flex h-32 items-end justify-center gap-1.5">
              <div
                className="w-3 rounded-t-md bg-[#F58220]"
                style={{ height: ((sulteng[idx] / 100) * 120) + "px" }}
              />
              <div
                className="w-3 rounded-t-md bg-slate-800"
                style={{ height: ((nasional[idx] / 100) * 120) + "px" }}
              />
            </div>
            <div className="text-[11px] font-bold text-slate-500">{yr}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
