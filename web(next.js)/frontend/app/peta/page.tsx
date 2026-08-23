"use client";

import { useEffect, useState } from "react";
import InteractiveGeoMap from "@/components/map/InteractiveGeoMap";
import InteractiveScatterQuadrant from "@/components/charts/InteractiveScatterQuadrant";
import { fetchRegencies } from "@/lib/api";
import { Regency } from "@/types";

export default function PetaPage() {
  const [regencies, setRegencies] = useState<Regency[]>([]);

  useEffect(() => {
    async function load() {
      const regs = await fetchRegencies();
      setRegencies(regs);
    }
    load();
  }, []);

  if (regencies.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F58220] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Peta Geospasial Tematik Sulawesi Tengah</h1>
        <p className="text-xs font-medium text-slate-500">
          Eksplorasi spasial 13 Kabupaten/Kota dengan filter indikator kemiskinan, IPM, PDRB, dan NTP
        </p>
      </div>

      <InteractiveGeoMap regencies={regencies} />

      <InteractiveScatterQuadrant
        title="Distribusi Spasial Sosio-Ekonomi (IPM vs Kemiskinan)"
        regencies={regencies}
      />
    </div>
  );
}
