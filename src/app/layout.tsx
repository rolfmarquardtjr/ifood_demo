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
    default: "iFood Insights | Tendências em Delivery e Gastronomia",
    template: "%s | iFood Insights",
  },
  description:
    "Blog do iFood sobre tendências em delivery, gastronomia, restaurantes parceiros e inovação no setor de alimentação.",
  keywords: ["delivery", "gastronomia", "restaurantes", "ifood", "tendências"],
  openGraph: {
    title: "iFood Insights | Tendências em Delivery e Gastronomia",
    description: "Blog do iFood sobre tendências em delivery, gastronomia, restaurantes parceiros e inovação no setor de alimentação.",
    siteName: "iFood Insights",
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
