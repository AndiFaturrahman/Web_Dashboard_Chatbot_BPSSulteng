import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import FloatingChatbot from "@/components/chatbot/FloatingChatbot";
import ClientOnly from "@/components/common/ClientOnly";

export const metadata: Metadata = {
  title: "BPS Sulteng Insight AI — Dashboard Statistik & AI Analysis",
  description: "Official BPS Central Sulawesi Data Portal & AI Graph Insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-[#FFFDF9]" suppressHydrationWarning>
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 px-4 py-8 sm:px-8 md:ml-64">
            {children}
          </main>
        </div>
        <ClientOnly>
          <FloatingChatbot />
        </ClientOnly>
      </body>
    </html>
  );
}
