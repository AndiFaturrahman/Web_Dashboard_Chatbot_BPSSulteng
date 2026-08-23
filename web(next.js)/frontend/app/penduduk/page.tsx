import InteractiveBarChart from "@/components/charts/InteractiveBarChart";
import AiInsightBox from "@/components/ai/AiInsightBox";
import { fetchRegencies, fetchAiInsight } from "@/lib/api";

export default async function PendudukPage() {
  const regencies = await fetchRegencies();
  const aiInsight = await fetchAiInsight("Demografi Penduduk", "Sulawesi Tengah");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">👥 Kependudukan & Demografi</h1>
        <p className="text-sm font-semibold text-slate-500">Struktur umur, persebaran populasi 13 kab/kota, dan bonus demografi</p>
      </div>

      <InteractiveBarChart
        title="Jumlah Penduduk per Kabupaten/Kota (Ribu Jiwa)"
        labels={regencies.map((r) => r.Wilayah)}
        values={regencies.map((r) => r.Penduduk_Ribu)}
        unit="Ribu"
      />

      <AiInsightBox title="Bonus Demografi & Ketenagakerjaan" insight={aiInsight} />
    </div>
  );
}
