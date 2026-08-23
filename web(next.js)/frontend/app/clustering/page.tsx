"use client";
import { useEffect, useState } from "react";
import { fetchMlClusters } from "@/lib/api";
import { ClustersResponse, ClusterRegion } from "@/types";
import { Layers, MapPin } from "lucide-react";

export default function ClusteringPage() {
  const [clusterData, setClusterData] = useState<ClustersResponse | null>(null);
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<ClusterRegion | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchMlClusters();
        setClusterData(res);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  if (!clusterData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F58220] border-t-transparent" />
      </div>
    );
  }

  const defs = clusterData.cluster_definitions;
  const filteredRegions = selectedClusterId !== null
    ? clusterData.regions.filter((r) => r.cluster_id === selectedClusterId)
    : clusterData.regions;

  return (
    <div className="space-y-6 sm:space-y-8 overflow-hidden w-full">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-100/70 px-3 py-1 text-xs font-black text-[#EA580C]">
          <Layers className="h-3.5 w-3.5" /> UNSUPERVISED LEARNING
        </div>
        <h1 className="mt-2 text-xl sm:text-2xl font-black text-slate-900">
          K-Means Regional Clustering 13 Kabupaten/Kota
        </h1>
        <p className="text-xs text-slate-500">
          Pengelompokan tipologi sosio-ekonomi berdasarkan multi-variabel (IPM, PDRB, Kemiskinan, Pengangguran, NTP, Penduduk)
        </p>
      </div>

      {/* 4 Cluster Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(defs).map(([cid, cdef]) => {
          const idNum = parseInt(cid);
          const isSelected = selectedClusterId === idNum;
          const count = clusterData.regions.filter((r) => r.cluster_id === idNum).length;

          return (
            <button
              key={cid}
              onClick={() => setSelectedClusterId(isSelected ? null : idNum)}
              className={
                "glass-card flex flex-col items-start rounded-2xl p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-1 " +
                (isSelected ? "border-2 ring-4 shadow-xl" : "")
              }
              style={{
                borderColor: isSelected ? cdef.color : undefined,
              }}
            >
              <div
                className="rounded-full px-2.5 py-0.5 text-[10px] font-black text-white"
                style={{ backgroundColor: cdef.color }}
              >
                {cdef.badge}
              </div>
              <h3 className="mt-3 text-sm sm:text-base font-black text-slate-900">{cdef.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{cdef.desc}</p>
              <div className="mt-4 flex w-full items-center justify-between border-t border-orange-200/60 pt-3 text-xs font-bold text-slate-500">
                <span>{count} Wilayah</span>
                <span className="text-[#EA580C]">{isSelected ? "Aktif Filter" : "Klik Filter"}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2D PCA Dimensionality Canvas */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-200/60 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              🌌 Proyeksi 2D PCA (Principal Component Analysis)
            </h3>
            <p className="text-xs text-slate-500">
              Visualisasi reduksi dimensi klasterisasi multi-variabel 13 Kabupaten/Kota
            </p>
          </div>
          {selectedClusterId !== null && (
            <button
              onClick={() => setSelectedClusterId(null)}
              className="rounded-xl bg-slate-900 px-3 py-1 text-xs font-bold text-white hover:bg-slate-800"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Scrollable Container on Mobile */}
        <div className="mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-200">
          <div className="relative h-80 min-w-[500px] w-full rounded-2xl border border-orange-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 overflow-hidden">
            <div className="absolute top-1/2 left-0 right-0 border-b border-dashed border-slate-700" />
            <div className="absolute left-1/2 top-0 bottom-0 border-r border-dashed border-slate-700" />

            <div className="absolute top-3 left-4 text-[10px] font-black text-slate-400">
              Komponen Utama 2 (IPM & Layanan Modern) ↑
            </div>
            <div className="absolute bottom-3 right-4 text-[10px] font-black text-slate-400">
              Komponen Utama 1 (PDRB & Skala Industri) →
            </div>

            {clusterData.regions.map((reg) => {
              const posX = ((reg.pca_x + 4.0) / 8.0) * 100;
              const posY = ((reg.pca_y + 3.0) / 6.0) * 100;
              const isDimmed = selectedClusterId !== null && reg.cluster_id !== selectedClusterId;

              return (
                <div
                  key={reg.kode}
                  onMouseEnter={() => setHoveredRegion(reg)}
                  onClick={() => setHoveredRegion(reg)}
                  className={
                    "absolute -translate-x-1/2 translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-125 hover:z-30 " +
                    (isDimmed ? "opacity-25" : "opacity-100")
                  }
                  style={{
                    left: `${posX}%`,
                    bottom: `${posY}%`,
                  }}
                >
                  <div
                    className="flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 text-[11px] font-black text-white shadow-xl ring-2 ring-white/20 whitespace-nowrap"
                    style={{ backgroundColor: reg.cluster_color }}
                  >
                    <MapPin className="h-3 w-3" />
                    {reg.wilayah.replace("Kabupaten ", "").replace("Kab. ", "").replace("Kota ", "")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {hoveredRegion && (
          <div className="mt-4 rounded-2xl border border-orange-300 bg-orange-50/90 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-black text-white"
                  style={{ backgroundColor: hoveredRegion.cluster_color }}
                >
                  {hoveredRegion.cluster_badge}
                </span>
                <h4 className="mt-1 text-base sm:text-lg font-black text-slate-900">{hoveredRegion.wilayah}</h4>
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4 text-xs font-bold text-slate-700">
                <span>❤️ IPM: <strong>{hoveredRegion.ipm}</strong></span>
                <span>💰 PDRB: <strong>Rp {hoveredRegion.pdrb} T</strong></span>
                <span>📉 Kemiskinan: <strong>{hoveredRegion.kemiskinan}%</strong></span>
                <span>🌾 NTP: <strong>{hoveredRegion.ntp}</strong></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cluster Table */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 overflow-hidden">
        <h3 className="text-sm font-extrabold uppercase text-slate-800 mb-3">
          📋 Tabel Klasifikasi Wilayah ({filteredRegions.length} Wilayah)
        </h3>
        <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-200">
          <table className="min-w-[580px] w-full text-left text-xs">
            <thead>
              <tr className="border-b border-orange-200 text-slate-500 bg-orange-50/50">
                <th className="p-2.5 font-black">Kabupaten / Kota</th>
                <th className="p-2.5 font-black">Cluster AI</th>
                <th className="p-2.5 font-black">IPM</th>
                <th className="p-2.5 font-black">PDRB Riil</th>
                <th className="p-2.5 font-black">Kemiskinan</th>
                <th className="p-2.5 font-black">NTP Petani</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegions.map((r) => (
                <tr key={r.kode} className="border-b border-orange-100 hover:bg-orange-50/50">
                  <td className="p-2.5 font-bold text-slate-900 whitespace-nowrap">{r.wilayah}</td>
                  <td className="p-2.5 whitespace-nowrap">
                    <span
                      className="rounded-md px-2 py-0.5 text-[10px] font-black text-white"
                      style={{ backgroundColor: r.cluster_color }}
                    >
                      {r.cluster_badge}
                    </span>
                  </td>
                  <td className="p-2.5 font-bold text-slate-700">{r.ipm}</td>
                  <td className="p-2.5 font-bold text-slate-700">Rp {r.pdrb} T</td>
                  <td className="p-2.5 font-bold text-slate-700">{r.kemiskinan}%</td>
                  <td className="p-2.5 font-bold text-slate-700">{r.ntp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
