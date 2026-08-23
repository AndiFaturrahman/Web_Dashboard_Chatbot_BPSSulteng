import type { Metadata } from "next";
import "./globals.css";
import FloatingChatbot from "@/components/chatbot/FloatingChatbot";
import ClientOnly from "@/components/common/ClientOnly";
import { SidebarProvider } from "@/components/common/SidebarContext";
import AppLayoutWrapper from "@/components/common/AppLayoutWrapper";

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
      <body className="min-h-screen bg-[#FFFDF9] text-slate-900 antialiased overflow-x-hidden" suppressHydrationWarning>
        <SidebarProvider>
          <AppLayoutWrapper>
            {children}
          </AppLayoutWrapper>
        </SidebarProvider>
        <ClientOnly>
          <FloatingChatbot />
        </ClientOnly>
      </body>
    </html>
  );
}
