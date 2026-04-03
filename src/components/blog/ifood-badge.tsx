"use client";

import Image from "next/image";

export function IFoodBadge() {
  return (
    <a
      href="https://www.detran.sp.gov.br/detransp/pb/servico/educacao/realizar_inscricao_para_curso_especializado_de_motofrete?id=carta_de_servico_realizar_inscricao_para_curso_especializado_de_motofrete"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[60] group"
      title="Curso de Motofrete — DETRAN SP"
    >
      <Image
        src="/logo-detran-sp.svg"
        alt="DETRAN SP — Curso de Motofrete"
        width={100}
        height={100}
        className="drop-shadow-xl opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 rounded-full"
      />
    </a>
  );
}
