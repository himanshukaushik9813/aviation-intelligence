import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Footer } from "@/components/dashboard/footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ADIP — Aviation Disruption Intelligence Platform",
  description:
    "Real-time aviation analytics and ML-powered disruption intelligence platform monitoring global geopolitical impacts on flight operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetbrains.variable} font-sans antialiased bg-[#050B1A] text-slate-200 min-h-screen`}
      >
        <div className="flex flex-col min-h-screen relative z-10">
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 ml-[72px]">
              {children}
            </main>
          </div>
          <Footer />
        </div>
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "rgba(14, 28, 58, 0.9)",
              border: "1px solid rgba(31, 163, 255, 0.2)",
              color: "#e2e8f0",
            },
          }}
        />
      </body>
    </html>
  );
}
