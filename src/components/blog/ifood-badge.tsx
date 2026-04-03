"use client";

import Image from "next/image";

export function IFoodBadge() {
  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <Image
        src="/logo-ifood-badge.png"
        alt="Maio Amarelo 2026"
        width={140}
        height={140}
        className="drop-shadow-xl opacity-90 hover:opacity-100 hover:scale-110 transition-all duration-300"
      />
    </div>
  );
}
