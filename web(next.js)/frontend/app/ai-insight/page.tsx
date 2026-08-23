import AiInsightBox from "@/components/ai/AiInsightBox";
import { fetchAiInsight } from "@/lib/api";

export default async function AiStudioPage() {
  const aiPdrb = await fetchAiInsight("Hilirisasi Industri Nikel & PDRB", "Kabupaten Morowali");
  const aiIpm = await fetchAiInsight("Pembangunan Manusia & Pendidikan", "Kota Palu");
  const aiPoverty = await fetchAiInsight("Kemiskinan Pesisir & Maritim", "Kabupaten Donggala");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">🤖 AI Insight Studio</h1>
        <p className="text-sm font-semibold text-slate-500">Laporan analisis otomatis multi-sektor berbasis Google Gemini AI Engine</p>
      </div>

      <div className="space-y-6">
        <AiInsightBox title="PDRB & Hilirisasi Nikel Morowali" insight={aiPdrb} />
        <AiInsightBox title="Pencapaian IPM & Pendidikan Kota Palu" insight={aiIpm} />
        <AiInsightBox title="Pengentasan Kemiskinan Pesisir Donggala" insight={aiPoverty} />
      </div>
    </div>
  );
}
