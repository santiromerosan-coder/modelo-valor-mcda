import type { Metadata } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Modelo de Valor · Análisis MCDA de Medicamentos",
  description:
    "Plataforma ejecutiva para el análisis multicriterio (MCDA) de medicamentos anti-VEGF en degeneración macular. Eficacia, seguridad, costo y calidad de vida del paciente.",
  keywords: [
    "MCDA",
    "Modelo de valor",
    "Anti-VEGF",
    "Degeneración macular",
    "Análisis multicriterio",
    "Evaluación de medicamentos",
  ],
  authors: [{ name: "Modelo de Valor" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${interSans.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
