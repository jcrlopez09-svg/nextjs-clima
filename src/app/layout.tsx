import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { UnitsProvider } from "@/context/units-context";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "clima.now | Tu dashboard del tiempo",
    template: "%s | clima.now",
  },
  description:
    "Dashboard del clima con pronóstico por horas, 7 días, calidad del aire y ciudades favoritas. Construido con Next.js 16.",
  keywords: ["clima", "pronóstico", "tiempo", "Next.js", "Open-Meteo"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <UnitsProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </UnitsProvider>
      </body>
    </html>
  );
}
