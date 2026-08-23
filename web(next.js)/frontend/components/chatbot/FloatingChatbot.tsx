"use client";

import { useState } from "react";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  ExternalLink, 
  Sparkles, 
  BarChart2,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Activity
} from "lucide-react";

interface KeyCardItem {
  title: string;
  value: string;
  delta?: string;
  status?: "up" | "down" | "neutral";
  subtext?: string;
}

interface ChartItem {
  label: string;
  value: number;
  unit?: string;
}

interface ChartPayload {
  title: string;
  defaultType?: "bar" | "line" | "pie";
  unit?: string;
  data: ChartItem[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  citations?: Array<{ title: string; url: string }>;
  keycards?: KeyCardItem[];
  chart?: ChartPayload;
}

// Interactive Multi-Chart Renderer (Bar, Line, and Pie with Percentage)
function ChatInteractiveChart({ chart }: { chart: ChartPayload }) {
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">(chart.defaultType || "bar");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const colors = ["#F58220", "#10B981", "#8B5CF6", "#3B82F6", "#EC4899", "#F59E0B", "#E11D48"];
  const totalVal = chart.data.reduce((acc, curr) => acc + curr.value, 0) || 1;
  const maxVal = Math.max(...chart.data.map((d) => d.value), 1);
  const minVal = Math.min(...chart.data.map((d) => d.value), 0);

  // Line Chart SVG Path Calculations
  const svgWidth = 320;
  const svgHeight = 130;
  const padding = 24;
  const plotWidth = svgWidth - padding * 2;
  const plotHeight = svgHeight - padding * 2;

  const points = chart.data.map((d, i) => {
    const x = padding + (i / Math.max(1, chart.data.length - 1)) * plotWidth;
    const y = svgHeight - padding - ((d.value - minVal) / Math.max(0.1, maxVal - minVal)) * plotHeight;
    return { x, y, ...d };
  });

  const linePath = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`), "");
  const areaPath = linePath + ` L ${points[points.length - 1].x},${svgHeight - padding} L ${points[0].x},${svgHeight - padding} Z`;

  // Pie Chart SVG Slices with Percentage
  let cumulativeAngle = 0;
  const pieSlices = chart.data.map((item, idx) => {
    const fraction = item.value / totalVal;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + fraction * 2 * Math.PI;
    cumulativeAngle = endAngle;

    const percentage = ((item.value / totalVal) * 100).toFixed(1) + "%";

    // Coordinates for SVG Arc
    const radius = 52;
    const cx = 70;
    const cy = 70;

    const x1 = cx + radius * Math.cos(startAngle - Math.PI / 2);
    const y1 = cy + radius * Math.sin(startAngle - Math.PI / 2);
    const x2 = cx + radius * Math.cos(endAngle - Math.PI / 2);
    const y2 = cy + radius * Math.sin(endAngle - Math.PI / 2);
    const largeArc = fraction > 0.5 ? 1 : 0;

    const pathData = fraction >= 0.999
      ? `M ${cx},${cy - radius} A ${radius},${radius} 0 1,1 ${cx - 0.01},${cy - radius} Z`
      : `M ${cx},${cy} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;

    return {
      label: item.label,
      value: item.value,
      percentage,
      color: colors[idx % colors.length],
      pathData,
    };
  });

  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-3.5 shadow-xs space-y-3">
      {/* Chart Header with Type Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-orange-100 pb-2">
        <span className="text-[11px] font-black text-slate-800 flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-[#EA580C]" />
          {chart.title}
        </span>

        {/* Switcher Buttons: Bar, Line, Pie */}
        <div className="flex items-center gap-1 bg-orange-50 p-1 rounded-lg border border-orange-200/80 text-[10px] font-bold">
          <button
            onClick={() => setChartType("bar")}
            className={
              "flex items-center gap-1 px-2 py-0.5 rounded-md transition-all " +
              (chartType === "bar" ? "bg-[#EA580C] text-white shadow-xs font-black" : "text-slate-500 hover:text-[#EA580C]")
            }
            title="Tampilkan Grafik Batang"
          >
            <BarChart2 className="h-3 w-3" />
            <span>Bar</span>
          </button>

          <button
            onClick={() => setChartType("line")}
            className={
              "flex items-center gap-1 px-2 py-0.5 rounded-md transition-all " +
              (chartType === "line" ? "bg-[#EA580C] text-white shadow-xs font-black" : "text-slate-500 hover:text-[#EA580C]")
            }
            title="Tampilkan Grafik Garis"
          >
            <LineChartIcon className="h-3 w-3" />
            <span>Line</span>
          </button>

          <button
            onClick={() => setChartType("pie")}
            className={
              "flex items-center gap-1 px-2 py-0.5 rounded-md transition-all " +
              (chartType === "pie" ? "bg-[#EA580C] text-white shadow-xs font-black" : "text-slate-500 hover:text-[#EA580C]")
            }
            title="Tampilkan Pie Chart (%)"
          >
            <PieChartIcon className="h-3 w-3" />
            <span>Pie %</span>
          </button>
        </div>
      </div>

      {/* 1. BAR CHART VIEW */}
      {chartType === "bar" && (
        <div className="space-y-2 pt-1">
          {chart.data.map((ci, cIdx) => {
            const pct = Math.min(100, Math.max(10, (ci.value / maxVal) * 100));
            return (
              <div key={cIdx} className="space-y-0.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-700">
                  <span>{ci.label}</span>
                  <span className="font-black text-[#EA580C] bg-orange-50 px-1.5 py-0.2 rounded border border-orange-100">
                    {ci.value} {ci.unit || chart.unit}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-orange-100/70 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#F58220] to-[#EA580C] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. LINE CHART VIEW */}
      {chartType === "line" && (
        <div className="space-y-2">
          <div className="flex justify-center bg-gradient-to-b from-orange-50/50 to-white rounded-xl border border-orange-100 p-1">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-28 overflow-visible">
              <defs>
                <linearGradient id="chatLineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F58220" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#F58220" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Shaded Area */}
              <path d={areaPath} fill="url(#chatLineGrad)" />

              {/* Stroke Line */}
              <path d={linePath} fill="none" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />

              {/* Data Points */}
              {points.map((p, pIdx) => {
                const isHov = hoveredIndex === pIdx;
                return (
                  <g key={pIdx} onMouseEnter={() => setHoveredIndex(pIdx)} onMouseLeave={() => setHoveredIndex(null)} className="cursor-pointer">
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHov ? 5.5 : 4}
                      fill="#EA580C"
                      stroke="#FFFFFF"
                      strokeWidth={isHov ? 2.5 : 1.5}
                    />
                    <text
                      x={p.x}
                      y={p.y - 8}
                      textAnchor="middle"
                      className="text-[9px] font-black fill-slate-800"
                    >
                      {p.value}
                    </text>
                    <text
                      x={p.x}
                      y={svgHeight - 6}
                      textAnchor="middle"
                      className="text-[9px] font-bold fill-slate-500"
                    >
                      {p.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="text-[10px] text-slate-400 italic text-center">
            💡 Arahkan ke titik grafik untuk melihat nilai spesifik
          </div>
        </div>
      )}

      {/* 3. PIE CHART VIEW (PERSENTASE %) */}
      {chartType === "pie" && (
        <div className="flex flex-col sm:flex-row items-center justify-around gap-3 pt-1">
          {/* SVG Pie Chart */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg width="140" height="140" viewBox="0 0 140 140" className="overflow-visible">
              {pieSlices.map((slice, sIdx) => (
                <path
                  key={sIdx}
                  d={slice.pathData}
                  fill={slice.color}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-all duration-200 hover:opacity-80 cursor-pointer"
                >
                  <title>{`${slice.label}: ${slice.value} (${slice.percentage})`}</title>
                </path>
              ))}
              {/* Inner Donut Center Hole */}
              <circle cx="70" cy="70" r="28" fill="#FFFFFF" />
              <text x="70" y="68" textAnchor="middle" className="text-[9px] font-bold fill-slate-400">
                Total Share
              </text>
              <text x="70" y="80" textAnchor="middle" className="text-[11px] font-black fill-[#EA580C]">
                100%
              </text>
            </svg>
          </div>

          {/* Slices Legend Table with Percentages */}
          <div className="flex-1 w-full space-y-1 text-[11px]">
            {pieSlices.map((slice, sIdx) => (
              <div
                key={sIdx}
                className="flex items-center justify-between p-1.5 rounded-lg border border-orange-100 bg-orange-50/40"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                  <span className="font-bold text-slate-700 truncate">{slice.label}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-slate-400 text-[10px]">({slice.value})</span>
                  <span className="font-black text-[#EA580C] bg-white px-1.5 py-0.2 rounded border border-orange-200 text-[10px]">
                    {slice.percentage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Halo! Saya **STATIX**, asisten kecerdasan buatan resmi BPS Sulawesi Tengah. Ada data atau statistik strategis yang ingin Anda diskusikan?",
      keycards: [
        { title: "Pertumbuhan Ekonomi", value: "11.91%", delta: "+2.14% YoY", status: "up", subtext: "Tertinggi Nasional" },
        { title: "IPM Sulteng", value: "71.38", delta: "+0.54 poin", status: "up", subtext: "Kategori Tinggi" }
      ],
      chart: {
        title: "Perbandingan Pertumbuhan PDRB Sulteng (%)",
        defaultType: "bar",
        unit: "%",
        data: [
          { label: "Morowali", value: 24.85 },
          { label: "Morut", value: 21.40 },
          { label: "Sulteng", value: 11.91 },
          { label: "Banggai", value: 7.45 },
          { label: "Palu", value: 6.82 }
        ]
      }
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Helper to detect statistical keywords and generate interactive KeyCards & Multi-Charts
  const generateVisualWidgets = (query: string, replyText: string): { keycards?: KeyCardItem[]; chart?: ChartPayload } => {
    const q = (query + " " + replyText).toLowerCase();

    if (q.includes("inflasi")) {
      return {
        keycards: [
          { title: "Inflasi YoY 2025", value: "1.84%", delta: "Terkendali", status: "neutral", subtext: "Target BI 2.5±1%" },
          { title: "Inflasi YoY 2024", value: "1.57%", delta: "-1.04% YoY", status: "down", subtext: "Stabil" }
        ],
        chart: {
          title: "Tren Tingkat Inflasi Tahunan (YoY)",
          defaultType: "line",
          unit: "%",
          data: [
            { label: "2023", value: 2.61 },
            { label: "2024", value: 1.57 },
            { label: "2025", value: 1.84 }
          ]
        }
      };
    }

    if (q.includes("ipm") || q.includes("manusia")) {
      return {
        keycards: [
          { title: "IPM Provinsi Sulteng", value: "71.38", delta: "+0.54 poin", status: "up", subtext: "Kategori Tinggi" },
          { title: "IPM Kota Palu", value: "82.52", delta: "Tertinggi", status: "up", subtext: "Sangat Tinggi" }
        ],
        chart: {
          title: "Perbandingan Indeks Pembangunan Manusia (IPM)",
          defaultType: "bar",
          unit: "Poin",
          data: [
            { label: "Kota Palu", value: 82.52 },
            { label: "Morowali", value: 73.80 },
            { label: "Poso", value: 72.48 },
            { label: "Sulteng", value: 71.38 },
            { label: "Donggala", value: 67.12 }
          ]
        }
      };
    }

    if (q.includes("kemiskinan") || q.includes("miskin")) {
      return {
        keycards: [
          { title: "Tingkat Kemiskinan", value: "11.77%", delta: "-0.64% YoY", status: "down", subtext: "379,76 Ribu Jiwa" },
          { title: "Kemiskinan Terendah", value: "6.54%", delta: "Kota Palu", status: "down", subtext: "Prima" }
        ],
        chart: {
          title: "Komparasi Tingkat Kemiskinan Daerah (%)",
          defaultType: "pie",
          unit: "%",
          data: [
            { label: "Kota Palu", value: 6.54 },
            { label: "Banggai", value: 7.32 },
            { label: "Sigi", value: 11.95 },
            { label: "Morowali", value: 12.18 },
            { label: "Poso", value: 15.12 },
            { label: "Donggala", value: 16.48 }
          ]
        }
      };
    }

    if (q.includes("pdrb") || q.includes("ekonomi") || q.includes("tumbuh")) {
      return {
        keycards: [
          { title: "Pertumbuhan Ekonomi", value: "11.91%", delta: "+2.14% YoY", status: "up", subtext: "Tertinggi Nasional" },
          { title: "Total PDRB Sulteng", value: "Rp 265.5 T", delta: "ADHK", status: "up", subtext: "Hilirisasi Nikel" }
        ],
        chart: {
          title: "Pangsa & Laju Pertumbuhan PDRB Daerah",
          defaultType: "pie",
          unit: "%",
          data: [
            { label: "Morowali", value: 24.85 },
            { label: "Morowali Utara", value: 21.40 },
            { label: "Banggai", value: 7.45 },
            { label: "Kota Palu", value: 6.82 },
            { label: "Lainnya", value: 5.20 }
          ]
        }
      };
    }

    if (q.includes("pengangguran") || q.includes("tpt") || q.includes("kerja") || q.includes("penduduk")) {
      return {
        keycards: [
          { title: "Pengangguran TPT", value: "2.95%", delta: "-0.20% YoY", status: "down", subtext: "Terendah Sulawesi" },
          { title: "Jumlah Penduduk", value: "3,15 Juta", delta: "+1.24% YoY", status: "up", subtext: "Sensus 2024" }
        ],
        chart: {
          title: "Tingkat Pengangguran Terbuka TPT (%)",
          defaultType: "bar",
          unit: "%",
          data: [
            { label: "Banggai Laut", value: 2.30 },
            { label: "Parigi Moutong", value: 2.45 },
            { label: "Sigi", value: 2.50 },
            { label: "Sulteng Rata-Rata", value: 2.95 },
            { label: "Kota Palu", value: 5.48 }
          ]
        }
      };
    }

    return {};
  };

  // Markdown Formatter
  const renderFormattedMessage = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, lIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={lIdx} className={lIdx > 0 ? "mt-1.5" : ""}>
          {parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={pIdx} className="font-black text-[#EA580C]">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userPrompt = input.trim();
    setInput("");
    const newMessages = [...messages, { role: "user" as const, content: userPrompt }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const historyList = newMessages.slice(-8).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        content: m.content,
      }));

      const res = await fetch("https://bps-ai-backend.vercel.app/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userPrompt,
          history: historyList,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.response_text || "Data statistik BPS telah ditemukan.";
        const widgets = generateVisualWidgets(userPrompt, replyText);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: replyText,
            citations: data.citations || [],
            keycards: widgets.keycards,
            chart: widgets.chart
          },
        ]);
      } else {
        throw new Error("Backend error");
      }
    } catch (err) {
      let fallbackText = "Berdasarkan data resmi **BPS Provinsi Sulawesi Tengah**, indikator terkait **" + userPrompt + "** menunjukkan akselerasi pertumbuhan ekonomi mencapai **11.91%**, IPM **71.38**, kemiskinan turun ke **11.77%**, dan TPT sebesar **2.95%**.";
      
      if (userPrompt.toLowerCase().includes("inflasi")) {
        fallbackText = "Berdasarkan rilis resmi **BPS Sulawesi Tengah**, perkembangan **tingkat inflasi tahunan (YoY)** tercatat terkendali:\n1. **Tahun 2023**: Inflasi sebesar **2,61%**.\n2. **Tahun 2024**: Inflasi tercatat sebesar **1,57%**.\n3. **Tahun 2025**: Inflasi stabil di angka **1,84%** (dalam sasaran BI 2.5±1%).";
      }

      const widgets = generateVisualWidgets(userPrompt, fallbackText);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: fallbackText,
          citations: [{ title: "Portal Publikasi BPS Sulteng", url: "https://sulteng.bps.go.id" }],
          keycards: widgets.keycards,
          chart: widgets.chart
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-orange-300 bg-slate-900 px-3.5 py-2 text-xs font-black text-white shadow-2xl animate-bounce">
            <Sparkles className="h-3.5 w-3.5 text-[#F58220]" />
            Tanya STATIX AI
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 border-white bg-gradient-to-tr from-[#F58220] to-[#EA580C] text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-orange-500/50"
          title="Buka Chatbot BPS AI"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-50 flex h-[520px] sm:h-[580px] w-[94vw] max-w-[420px] flex-col overflow-hidden rounded-3xl border-2 border-orange-300 bg-white shadow-2xl backdrop-blur-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#F58220] to-[#EA580C] p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold flex items-center gap-1.5">
                  STATIX BPS AI Assistant
                  <span className="rounded-full bg-white/25 px-1.5 py-0.2 text-[9px] font-black">2.0</span>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-orange-100">
                  Sulawesi Tengah AI Gateway
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-white/80 hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin">
            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              const alignClass = isUser ? "flex-row-reverse" : "flex-row";
              const avatarClass = isUser ? "bg-slate-800 text-white" : "bg-[#F58220] text-white";
              const bubbleClass = isUser ? "bg-slate-900 text-white" : "border border-orange-200/80 bg-orange-50/70 text-slate-800";
              
              return (
                <div key={idx} className={"flex gap-2.5 " + alignClass}>
                  <div className={"flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs " + avatarClass}>
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  <div className={"max-w-[85%] space-y-2.5 rounded-2xl p-3.5 text-xs leading-relaxed " + bubbleClass}>
                    {/* Message Text */}
                    <div>{renderFormattedMessage(m.content)}</div>

                    {/* 1. KEYCARDS */}
                    {m.keycards && m.keycards.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {m.keycards.map((kc, kIdx) => (
                          <div key={kIdx} className="rounded-xl border border-orange-200 bg-white p-2.5 shadow-xs">
                            <div className="text-[10px] font-bold text-slate-400 truncate">{kc.title}</div>
                            <div className="mt-0.5 text-base font-black text-[#EA580C]">{kc.value}</div>
                            <div className="mt-1 flex items-center justify-between text-[9px] font-bold text-slate-600">
                              <span className={kc.status === "up" ? "text-emerald-600" : kc.status === "down" ? "text-rose-600" : "text-amber-600"}>
                                {kc.delta}
                              </span>
                              <span className="truncate text-slate-400">{kc.subtext}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 2. MULTI-CHART WIDGET: BAR, LINE, PIE (%) */}
                    {m.chart && (
                      <ChatInteractiveChart chart={m.chart} />
                    )}

                    {/* Citations */}
                    {m.citations && m.citations.length > 0 && (
                      <div className="border-t border-orange-200/50 pt-1.5">
                        <div className="text-[10px] font-bold text-[#F58220]">Sumber Resmi:</div>
                        {m.citations.map((c: any, i: number) => (
                          <a
                            key={i}
                            href={c.url || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-0.5 flex items-center gap-1 text-[10px] text-blue-600 hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {c.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-orange-50/50 p-2.5 rounded-xl border border-orange-100">
                <Bot className="h-4 w-4 animate-spin text-[#F58220]" />
                STATIX sedang menganalisis database & membuat visualisasi multi-grafik...
              </div>
            )}
          </div>

          {/* Quick Suggestions Chips */}
          <div className="flex gap-1.5 overflow-x-auto px-3 py-1.5 bg-orange-50/40 border-t border-orange-100 scrollbar-none text-[10px] font-bold text-slate-600">
            <button
              onClick={() => setInput("Berapa laju inflasi tahunan Sulteng?")}
              className="shrink-0 rounded-full border border-orange-200 bg-white px-2.5 py-1 hover:bg-orange-100 hover:text-[#EA580C]"
            >
              📈 Tren Inflasi
            </button>
            <button
              onClick={() => setInput("Bagaimana perbandingan IPM kota dan kabupaten di Sulteng?")}
              className="shrink-0 rounded-full border border-orange-200 bg-white px-2.5 py-1 hover:bg-orange-100 hover:text-[#EA580C]"
            >
              ❤️ IPM Daerah
            </button>
            <button
              onClick={() => setInput("Berapa angka kemiskinan daerah Sulteng?")}
              className="shrink-0 rounded-full border border-orange-200 bg-white px-2.5 py-1 hover:bg-orange-100 hover:text-[#EA580C]"
            >
              🥧 Share Kemiskinan %
            </button>
            <button
              onClick={() => setInput("Tampilkan pertumbuhan ekonomi PDRB daerah")}
              className="shrink-0 rounded-full border border-orange-200 bg-white px-2.5 py-1 hover:bg-orange-100 hover:text-[#EA580C]"
            >
              💰 PDRB Ekonomi
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="border-t border-slate-100 p-3">
            <div className="flex items-center gap-2 rounded-2xl border border-orange-200 bg-slate-50 px-3 py-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanyakan data inflasi, IPM, kemiskinan..."
                className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F58220] text-white transition-all disabled:opacity-40 hover:bg-[#EA580C]"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
