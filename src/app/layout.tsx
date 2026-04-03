import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "iFood Na Pista | Maio Amarelo 2026 — No Trânsito, Enxergar o Outro é Salvar Vidas",
    template: "%s | iFood Na Pista",
  },
  description:
    "Blog do iFood pra quem vive no corre. Segurança no trânsito, dicas de entrega e novidades pra quem roda de moto todo dia. Maio Amarelo é todo dia, parceiro.",
  keywords: ["motoboy", "entregador", "motoqueiro", "maio amarelo", "segurança no trânsito", "delivery", "ifood", "entregas"],
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
      className={`${playfair.variable} ${dmSans.variable} h-full antialiased font-sans`}
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
