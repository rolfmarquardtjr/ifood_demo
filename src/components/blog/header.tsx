"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const categories = [
  { name: "Blog", href: "/" },
  { name: "Segurança no Trânsito", href: "/categoria/seguranca" },
  { name: "Prevenção de Acidentes", href: "/categoria/prevencao" },
  { name: "Conscientização", href: "/categoria/conscientizacao" },
  { name: "Podcast Na Pista", href: "/podcast" },
];

export function BlogHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/90 backdrop-blur-2xl border-b border-border" : "bg-background/40 backdrop-blur-md"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/logo-ifood-header.png" alt="iFood Na Pista" width={120} height={24} className="transition-all duration-300" />
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className={`relative px-2.5 lg:px-3 py-2 text-[11px] lg:text-[12px] font-bold uppercase tracking-wider hover:text-foreground transition-colors duration-300 group/link ${scrolled ? "text-muted-foreground" : "text-white/80"}`}
              >
                {cat.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#EA1D2C] transition-all duration-300 opacity-0 group-hover/link:w-1/2 group-hover/link:opacity-100 rounded-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-5 animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-0.5">
              {categories.map((cat) => (
                <Link key={cat.href} href={cat.href} onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all">
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
