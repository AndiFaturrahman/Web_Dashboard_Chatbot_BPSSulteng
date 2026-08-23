"use client";

interface BarChartProps {
  title: string;
  labels: string[];
  values: number[];
  unit?: string;
}

export default function InteractiveBarChart({ title, labels, values, unit = "" }: BarChartProps) {
  const maxVal = Math.max(...values, 1);

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-700">{title}</h3>
      <div className="mt-4 space-y-2.5">
        {labels.map((lbl, idx) => {
          const val = values[idx];
          const pct = Math.min(100, Math.max(8, (val / maxVal) * 100));
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>{lbl}</span>
                <span className="text-[#EA580C]">{val} {unit}</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-orange-100/70">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#F58220] to-[#EA580C] transition-all duration-700"
                  style={{ width: pct + "%" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
