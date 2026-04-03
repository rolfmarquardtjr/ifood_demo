"use client";

import { useState } from "react";

export function NewsletterForm({ variant = "banner" }: { variant?: "banner" | "page" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error);
      }
    } catch {
      setStatus("error");
      setMessage("Erro de conexão");
    }
  };

  if (variant === "banner") {
    return (
      <section className="relative overflow-hidden py-16 border-t border-border bg-card">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA3KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-10 dark:opacity-30" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-[#EA1D2C] text-[11px] font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            Newsletter
          </div>
          <h2 className="text-3xl md:text-4xl font-heading text-foreground mb-4 tracking-tight">
            Receba as novidades do mundo delivery
          </h2>
          <p className="text-muted-foreground text-base mb-10 max-w-lg mx-auto">
            Fique por dentro das tendências de food delivery, novidades dos restaurantes parceiros e inovações do iFood.
          </p>

          {status === "success" ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-muted text-foreground font-semibold backdrop-blur-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-12 px-5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#EA1D2C]/50 focus:border-[#EA1D2C]/50 transition-all text-sm"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="h-12 px-8 rounded-xl bg-[#EA1D2C] text-[#FFFFFF] font-bold text-sm hover:bg-[#C41825] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 whitespace-nowrap"
              >
                {status === "loading" ? "..." : "Assinar"}
              </button>
            </form>
          )}
          {status === "error" && <p className="text-muted-foreground text-sm mt-3">{message}</p>}
        </div>
      </section>
    );
  }

  // Page variant
  return (
    <div className="max-w-sm mx-auto">
      {status === "success" ? (
        <div className="text-center p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <svg className="w-12 h-12 mx-auto mb-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-emerald-400 font-semibold">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-14 px-5 rounded-2xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#EA1D2C]/50 focus:border-[#EA1D2C]/50 transition-all text-sm"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full h-14 rounded-2xl bg-[#EA1D2C] text-[#FFFFFF] font-bold text-sm hover:bg-[#C41825] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#EA1D2C]/25 disabled:opacity-70"
          >
            {status === "loading" ? "Inscrevendo..." : "Assinar Newsletter Gratuita"}
          </button>
          {status === "error" && <p className="text-red-400 text-sm text-center">{message}</p>}
        </form>
      )}
    </div>
  );
}
