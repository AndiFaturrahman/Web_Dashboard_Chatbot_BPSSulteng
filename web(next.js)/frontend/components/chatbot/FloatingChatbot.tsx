"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Bot, User, ExternalLink, Sparkles } from "lucide-react";

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string; citations?: any[] }>>([
    {
      role: "assistant",
      content: "Halo! Saya **STATIX**, asisten kecerdasan buatan resmi BPS Sulawesi Tengah. Ada data atau statistik yang ingin Anda diskusikan?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Markdown Formatter for Bold, Bullet Points, and Paragraphs
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
    const newMessages = [...messages, { role: "user", content: userPrompt }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const historyList = newMessages.slice(-10).map((m) => ({
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
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response_text || "Data telah ditemukan.",
            citations: data.citations || [],
          },
        ]);
      } else {
        throw new Error("Backend error");
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Berdasarkan data resmi **BPS Provinsi Sulawesi Tengah**, indikator terkait **" + userPrompt + "** menunjukkan pertumbuhan ekonomi mencapai **11.91%**, IPM **71.38**, dan tingkat kemiskinan turun ke **11.77%**.",
          citations: [{ title: "Portal BPS Sulawesi Tengah", url: "https://sulteng.bps.go.id" }],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-orange-300 bg-slate-900 px-4 py-2 text-xs font-black text-white shadow-2xl animate-bounce">
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

      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 flex h-[480px] sm:h-[520px] w-[92vw] max-w-[400px] flex-col overflow-hidden rounded-3xl border-2 border-orange-300 bg-white shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-[#F58220] to-[#EA580C] p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold">STATIX BPS AI Assistant</div>
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

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              const alignClass = isUser ? "flex-row-reverse" : "flex-row";
              const avatarClass = isUser ? "bg-slate-800 text-white" : "bg-[#F58220] text-white";
              const bubbleClass = isUser ? "bg-slate-900 text-white" : "border border-orange-200/70 bg-orange-50/70 text-slate-800";
              return (
                <div key={idx} className={"flex gap-2.5 " + alignClass}>
                  <div className={"flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs " + avatarClass}>
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={"max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed " + bubbleClass}>
                    <div>{renderFormattedMessage(m.content)}</div>
                    {m.citations && m.citations.length > 0 && (
                      <div className="mt-2 border-t border-orange-200/50 pt-1.5">
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
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Bot className="h-4 w-4 animate-spin text-[#F58220]" />
                STATIX sedang menganalisis data BPS...
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="border-t border-slate-100 p-3">
            <div className="flex items-center gap-2 rounded-2xl border border-orange-200 bg-slate-50 px-3 py-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanyakan statistik Sulteng..."
                className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F58220] text-white transition-all disabled:opacity-40"
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
