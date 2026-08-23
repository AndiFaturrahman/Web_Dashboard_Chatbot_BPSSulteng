"use client";

import { useState } from "react";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, RotateCcw } from "lucide-react";

interface BarChartProps {
  title: string;
  labels: string[];
  values: number[];
  unit?: string;
}

export default function InteractiveBarChart({ title, labels, values, unit = "" }: BarChartProps) {
  const [sortOrder, setSortOrder] = useState<"default" | "desc" | "asc">("desc");

  // Pair labels and values together
  const rawItems = labels.map((lbl, idx) => ({
    label: lbl,
    val: values[idx] || 0,
    originalIndex: idx
  }));

  // Apply sorting
  const items = [...rawItems].sort((a, b) => {
    if (sortOrder === "desc") return b.val - a.val;
    if (sortOrder === "asc") return a.val - b.val;
    return a.originalIndex - b.originalIndex;
  });

  const maxVal = Math.max(...values, 1);

  return (
    <div className="glass-card rounded-2xl p-5 overflow-hidden">
      {/* Header with Sorting Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-200/60 pb-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">
          📊 {title}
        </h3>

        {/* Sort Controls */}
        <div className="flex items-center gap-1 bg-orange-50/80 p-1 rounded-xl border border-orange-200 text-xs">
          <button
            onClick={() => setSortOrder("desc")}
            className={
              "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all " +
              (sortOrder === "desc"
                ? "bg-[#EA580C] text-white shadow-sm font-black"
                : "text-slate-600 hover:text-[#EA580C]")
            }
            title="Urutkan dari Tertinggi ke Terendah"
          >
            <ArrowDownWideNarrow className="h-3.5 w-3.5" />
            <span>Tertinggi</span>
          </button>

          <button
            onClick={() => setSortOrder("asc")}
            className={
              "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all " +
              (sortOrder === "asc"
                ? "bg-[#EA580C] text-white shadow-sm font-black"
                : "text-slate-600 hover:text-[#EA580C]")
            }
            title="Urutkan dari Terendah ke Tertinggi"
          >
            <ArrowUpNarrowWide className="h-3.5 w-3.5" />
            <span>Terendah</span>
          </button>

          <button
            onClick={() => setSortOrder("default")}
            className={
              "flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all " +
              (sortOrder === "default"
                ? "bg-slate-800 text-white shadow-sm font-black"
                : "text-slate-500 hover:text-slate-800")
            }
            title="Urutan Default Wilayah"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Bar Items */}
      <div className="mt-4 space-y-3">
        {items.map((item, idx) => {
          const pct = Math.min(100, Math.max(8, (item.val / maxVal) * 100));
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-100 text-[10px] font-black text-[#EA580C]">
                    {idx + 1}
                  </span>
                  <span>{item.label}</span>
                </span>
                <span className="font-black text-[#EA580C] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                  {item.val} {unit}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-orange-100/70 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#F58220] to-[#EA580C] transition-all duration-500 shadow-xs"
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
