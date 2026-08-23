"use client";

import { MetricItem } from "@/types";

interface KpiCardProps {
  title: string;
  item: MetricItem;
  icon: string;
}

export default function KpiCard({ title, item, icon }: KpiCardProps) {
  const isUp = item.status === "up";
  const isDown = item.status === "down";

  const badgeClass = isUp
    ? "bg-emerald-100 text-emerald-800"
    : isDown
    ? "bg-rose-100 text-rose-800"
    : "bg-amber-100 text-amber-800";

  return (
    <div className="glass-card relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F58220] via-[#FF9233] to-[#FFA64D]" />
      
      <div className="flex items-start justify-between">
        <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          {title}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100/80 text-xl">
          {icon}
        </div>
      </div>

      <div className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
        {item.val}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className={"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold " + badgeClass}>
          {isUp ? "▲" : isDown ? "▼" : "●"} {item.delta}
        </span>
      </div>

      <div className="mt-2 text-xs font-medium text-slate-500">
        {item.subtext}
      </div>
    </div>
  );
}
