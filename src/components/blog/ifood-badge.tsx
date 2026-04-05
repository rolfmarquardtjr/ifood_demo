"use client";

import Image from "next/image";

export function IFoodBadge() {
  return (
    <a
      href="https://www.detran.sp.gov.br/detransp/pb/servico/educacao/realizar_inscricao_para_curso_especializado_de_motofrete?id=carta_de_servico_realizar_inscricao_para_curso_especializado_de_motofrete"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-[60] group"
      title="Curso de Motofrete — DETRAN SP"
    >
      <div className="relative flex flex-col items-center">
        {/* Logo container with ring and glow */}
        <div className="w-[72px] h-[72px] rounded-full bg-white p-2.5 shadow-2xl shadow-black/30 ring-2 ring-white/20 group-hover:ring-[#EA1D2C]/40 group-hover:scale-110 group-hover:shadow-[#EA1D2C]/20 transition-all duration-300">
          <Image
            src="/logo-detran-sp.png"
            alt="DETRAN SP"
            width={200}
            height={200}
            className="w-full h-full object-contain"
          />
        </div>
        {/* Label */}
        <span className="mt-1.5 px-2.5 py-0.5 rounded-full bg-[#EA1D2C] text-white text-[8px] font-black uppercase tracking-wider shadow-lg whitespace-nowrap">
          Motofrete
        </span>
      </div>
    </a>
  );
}
