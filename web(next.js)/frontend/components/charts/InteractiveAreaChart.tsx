"use client";

interface AreaChartProps {
  title: string;
  years: string[];
  sultengData: number[];
  nasionalData: number[];
  unit?: string;
}

export default function InteractiveAreaChart({
  title,
  years,
  sultengData,
  nasionalData,
  unit = "%",
}: AreaChartProps) {
  const maxVal = Math.max(...sultengData, ...nasionalData, 1);

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-200/60 pb-3">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">
            📈 {title}
          </h3>
          <p className="text-xs text-slate-500">Trajektori komparatif pertumbuhan tahunan</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-[#EA580C]">
            <span className="h-3 w-3 rounded-full bg-[#EA580C]" /> Sulawesi Tengah
          </span>
          <span className="flex items-center gap-1.5 text-slate-800">
            <span className="h-3 w-3 rounded-full bg-slate-800" /> Rata-Rata Nasional
          </span>
        </div>
      </div>

      <div className="mt-6 flex h-48 items-end gap-3 border-b border-orange-200 pb-2">
        {years.map((yr, idx) => {
          const hSulteng = (sultengData[idx] / maxVal) * 160;
          const hNasional = (nasionalData[idx] / maxVal) * 160;

          return (
            <div key={idx} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex items-end justify-center gap-1.5">
                <div
                  className="w-4 rounded-t-lg bg-gradient-to-t from-[#F58220] to-[#EA580C] shadow-md transition-all duration-700 hover:brightness-110"
                  style={{ height: hSulteng + "px" }}
                  title={"Sulteng: " + sultengData[idx] + unit}
                />
                <div
                  className="w-4 rounded-t-lg bg-gradient-to-t from-slate-700 to-slate-900 shadow-md transition-all duration-700 hover:brightness-110"
                  style={{ height: hNasional + "px" }}
                  title={"Nasional: " + nasionalData[idx] + unit}
                />
              </div>
              <div className="text-[11px] font-black text-slate-600">{yr}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
