import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const ifoodTextos = localFont({
  src: [
    { path: "./fonts/iFoodRCTextos-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/iFoodRCTextos-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/iFoodRCTextos-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/iFoodRCTextos-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-ifood-textos",
  display: "swap",
});

const ifoodTitulos = localFont({
  src: [
    { path: "./fonts/iFoodRCTitulos-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/iFoodRCTitulos-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/iFoodRCTitulos-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/iFoodRCTitulos-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-ifood-titulos",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "iFood Na Pista | Maio Amarelo 2026 — No Trânsito, Enxergar o Outro é Salvar Vidas",
    template: "%s | iFood Na Pista",
  },
  description:
    "Blog do iFood pra quem vive no corre. Segurança no trânsito, dicas de entrega e novidades pra quem roda de moto todo dia. Maio Amarelo é todo dia, parceiro.",
  keywords: ["segurança no trânsito", "prevenção de acidentes", "conscientização", "maio amarelo", "motociclista", "motoboy"],
  openGraph: {
    title: "iFood Na Pista | Maio Amarelo 2026 — No Trânsito, Enxergar o Outro é Salvar Vidas",
    description: "Blog do iFood pra quem vive no corre. Segurança no trânsito, dicas de entrega e novidades pra quem roda de moto todo dia. Maio Amarelo é todo dia, parceiro.",
    siteName: "iFood Na Pista",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${ifoodTitulos.variable} ${ifoodTextos.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
