"use client";

import { useState, useEffect, useCallback } from "react";

// ─── DADOS ────────────────────────────────────────────────────────────────────

const INTRO_LINES = [
  "São 19h23.",
  "Você tá no corre há 10 horas.",
  "A bag tá pesada. O celular não para.",
  "",
  "Em 2024, 33 motociclistas morreram",
  "POR DIA no Brasil.",
  "",
  "483 só em São Paulo.",
  "Recorde em 10 anos.",
  "",
  "41% dos entregadores de app",
  "já sofreram acidente.",
  "",
  "Você tá prestes a descobrir",
  "que tipo de piloto você é.",
  "",
  "Pega a visão, parceiro.",
];

const SCENARIOS = [
  {
    id: 1,
    location: "Av. Paulista · São Paulo · 19h23 · Horário de pico",
    situation:
      "Corrida urgente. O cliente tá ligando. Seu celular toca no suporte. O trânsito tá travado e você pensa em atender rapidinho enquanto costura entre os carros.",
    urgency: "O que você faz, parceiro?",
    choices: [
      { text: "Atendo rapidão. É só um segundo, tá travado mesmo.", safe: false },
      { text: "Ignoro. Encosto quando der pra retornar.", safe: true },
    ],
    consequence_wrong: {
      number: "80%",
      headline: "80% dos acidentes com moto envolvem distração.",
      stat: "Bastam 2 segundos sem olhar pra frente a 40 km/h e você percorre 22 metros no escuro. No corredor, 22 metros é a diferença entre desviar de uma porta aberta ou beijar o chão. Em 2024, distração foi a principal causa de acidentes com entregadores em São Paulo.",
      impact: "O cliente espera 2 minutos. Sua família espera você voltar pra casa.",
    },
    consequence_right: {
      headline: "Decisão de quem pega a visão.",
      stat: "Você encostou, retornou a ligação, pegou o endereço certo e entregou sem perrengue. O cliente nem percebeu o atraso.",
    },
  },
  {
    id: 2,
    location: "Marginal Tietê · São Paulo · 22h45 · Pista molhada",
    situation:
      "Chuva forte caiu de repente. A pista tá lisa, visibilidade ruim. Você tá a 70 km/h na marginal. Faltam 3 entregas pra bater a meta do dia.",
    urgency: "E aí, o que faz?",
    choices: [
      { text: "Mantenho o ritmo. Já peguei chuva pior que essa.", safe: false },
      { text: "Reduzo pra 40, ligo o alerta e vou na minha.", safe: true },
    ],
    consequence_wrong: {
      number: "3x",
      headline: "Pista molhada triplica sua distância de frenagem.",
      stat: "A 70 km/h no seco, sua moto para em 35 metros. Na chuva, são mais de 100 metros. Em 2024, 1 em cada 4 acidentes fatais com moto em SP aconteceu em pista molhada. Pneu de moto tem menos contato com o chão que a palma da sua mão.",
      impact: "3 entregas não valem o risco de não ter mais nenhuma.",
    },
    consequence_right: {
      headline: "Esperto demais.",
      stat: "Você reduziu, ligou o alerta. Chegou 15 minutos mais tarde. Mas chegou. No dia seguinte, pegou as 3 corridas de volta.",
    },
  },
  {
    id: 3,
    location: "R. Augusta · São Paulo · 13h · Sol forte",
    situation:
      "Dia quente, 35 graus. Você tá com o capacete aberto pra refrescar. A viseira tá levantada. Vai fazer uma entrega rápida ali na esquina, dois quarteirões.",
    urgency: "Qual é a sua?",
    choices: [
      { text: "Vou assim mesmo. É pertinho, rapidão.", safe: false },
      { text: "Fecho o capacete e abaixo a viseira. Sempre.", safe: true },
    ],
    consequence_wrong: {
      number: "40%",
      headline: "40% das mortes de motociclistas são por trauma na cabeça.",
      stat: "Capacete aberto não protege o queixo, que recebe 35% dos impactos em acidentes. Sem viseira, um inseto a 60 km/h atinge seu olho com a força de uma pedrada. 'Pertinho' é onde acontecem 60% dos acidentes com moto: perto de casa, em trajetos curtos.",
      impact: "Dois quarteirões. Era só isso. Mas a porta do carro que abriu não sabia disso.",
    },
    consequence_right: {
      headline: "Protocolo de quem é blindado.",
      stat: "Capacete fechado, viseira abaixada. Dois quarteirões sem problema. Porque segurança não tem distância mínima.",
    },
  },
  {
    id: 4,
    location: "Zona Leste · São Paulo · 01h30 · Madrugada",
    situation:
      "Tá no corre desde as 7 da manhã. 18 horas pilotando. Os olhos pesam. Aparece uma corrida com gorjeta boa. Última do dia.",
    urgency: "Vai ou não vai?",
    choices: [
      { text: "Vou sim. Última corrida e vou dormir.", safe: false },
      { text: "Não vou. Tô no limite. Amanhã tem mais.", safe: true },
    ],
    consequence_wrong: {
      number: "17 seg",
      headline: "Micro-sono: você apaga 17 segundos sem perceber.",
      stat: "A 50 km/h, 17 segundos são 236 metros. Sem controle. Sem freio. Sem nada. 56% dos entregadores de app trabalham mais de 10 horas por dia, todos os dias. Fadiga é a causa invisível: você não sabe que dormiu até acordar no chão.",
      impact: "A gorjeta era de 8 reais. A diária no hospital é 2.400.",
    },
    consequence_right: {
      headline: "Visão de quem quer durar.",
      stat: "Você deslogou, foi pra casa, dormiu. No dia seguinte pegou a primeira corrida das 7h descansado. A gorjeta de 8 reais virou muitas corridas seguras.",
    },
  },
  {
    id: 5,
    location: "Cruzamento · Centro de SP · 18h · Sinal amarelo",
    situation:
      "Sinal ficando amarelo. Você tá atrasado, a entrega já passou do tempo. Dá pra passar se acelerar. Do outro lado, um ônibus espera o sinal abrir.",
    urgency: "Passa ou para?",
    choices: [
      { text: "Acelero e passo. Dá tempo.", safe: false },
      { text: "Freio. Espero o próximo verde.", safe: true },
    ],
    consequence_wrong: {
      number: "37.150",
      headline: "37.150 pessoas morreram no trânsito no Brasil em 2024.",
      stat: "1 a cada 15 minutos. O Brasil é o segundo país que mais mata motociclistas no mundo. Cruzamento é onde acontecem 43% dos acidentes fatais com moto em área urbana. O ônibus que esperava do outro lado não ia te ver. Ninguém vê o motoqueiro.",
      impact: "Maio Amarelo 2026: no trânsito, enxergar o outro é salvar vidas. Mas o outro também precisa te enxergar.",
    },
    consequence_right: {
      headline: "30 segundos. Só isso.",
      stat: "Você esperou. O verde abriu. Você foi. Do outro lado, o ônibus passou. Se você tivesse acelerado, vocês teriam se encontrado no meio do cruzamento.",
    },
  },
];

const PROFILES = {
  blindado: {
    key: "blindado",
    name: "O Blindado",
    emoji: "🛡️",
    color: "#22c55e",
    bg: "#052810",
    minScore: 4,
    description:
      "Você é o parceiro que todo mundo quer do lado no corredor. Pega a visão, respeita o limite, e sabe que chegar vivo é mais importante que chegar rápido. Maio Amarelo é todo dia pra você.",
    cta: "Manda pro grupo e desafia os parceiros!",
    shareText: "Fiz a Missão Na Pista do iFood e sou O BLINDADO 🛡️ — 0 vacilo no trânsito. E você, parceiro? Qual piloto você é?",
  },
  ligeiro: {
    key: "ligeiro",
    name: "O Ligeiro",
    emoji: "⚡",
    color: "#eab308",
    bg: "#1a1500",
    minScore: 3,
    description:
      "Você tem noção, parceiro. Sabe o que é certo. Mas na correria do corre, às vezes escorrega. Cada decisão certa no trânsito é uma chance a mais de voltar pra casa.",
    cta: "Compartilha e vê se o parceiro é melhor que você.",
    shareText: "Fiz a Missão Na Pista do iFood e sou O LIGEIRO ⚡ — quase lá, mas vacilei em uma. E você? Qual piloto você é?",
  },
  sortudo: {
    key: "sortudo",
    name: "O Sortudo",
    emoji: "🎲",
    color: "#f97316",
    bg: "#1a0800",
    minScore: 1,
    description:
      "Parceiro, você tá contando com a sorte. E sorte no trânsito tem prazo de validade. 41% dos entregadores já se acidentaram. Não espera ser o próximo pra mudar.",
    cta: "Manda pro grupo. Hora de pegar a visão.",
    shareText: "Fiz a Missão Na Pista do iFood e sou O SORTUDO 🎲 — tô contando com a sorte, e sorte no trânsito acaba. E você?",
  },
  invisivel: {
    key: "invisivel",
    name: "O Invisível",
    emoji: "👻",
    color: "#ef4444",
    bg: "#1a0202",
    minScore: 0,
    description:
      "Invisível. É assim que o trânsito te trata. E é assim que você tá tratando sua segurança. 33 motociclistas morrem por dia no Brasil. Maio Amarelo 2026 diz: enxergar o outro salva vidas. Mas primeiro, você precisa se enxergar.",
    cta: "Compartilha. Esse resultado precisa mudar.",
    shareText: "Fiz a Missão Na Pista do iFood e sou O INVISÍVEL 👻 — preciso pegar a visão urgente. E você? Faz lá:",
  },
};

function getProfile(score: number) {
  if (score >= 4) return PROFILES.blindado;
  if (score === 3) return PROFILES.ligeiro;
  if (score >= 1) return PROFILES.sortudo;
  return PROFILES.invisivel;
}

type Phase = "landing" | "intro" | "scenario" | "consequence" | "result";

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function MissaoPage() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; timedOut: boolean } | null>(null);
  const [introLineIndex, setIntroLineIndex] = useState(0);
  const [profile, setProfile] = useState<(typeof PROFILES)[keyof typeof PROFILES] | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const noScroll = phase !== "result";
    document.body.style.overflow = noScroll ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  // Timer
  useEffect(() => {
    if (phase !== "scenario") return;
    if (timeLeft <= 0) {
      setAnswers(prev => [...prev, false]);
      setLastAnswer({ correct: false, timedOut: true });
      setPhase("consequence");
      return;
    }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  // Intro cinematográfica
  useEffect(() => {
    if (phase !== "intro") return;
    if (introLineIndex >= INTRO_LINES.length) {
      const t = setTimeout(() => {
        setScenarioIndex(0);
        setTimeLeft(8);
        setPhase("scenario");
      }, 1000);
      return () => clearTimeout(t);
    }
    const delay = INTRO_LINES[introLineIndex] === "" ? 600 : 1400;
    const t = setTimeout(() => setIntroLineIndex(i => i + 1), delay);
    return () => clearTimeout(t);
  }, [phase, introLineIndex]);

  const handleChoice = useCallback((correct: boolean) => {
    if (phase !== "scenario") return;
    setAnswers(prev => [...prev, correct]);
    setLastAnswer({ correct, timedOut: false });
    setPhase("consequence");
  }, [phase]);

  const handleNextScenario = () => {
    const nextIndex = scenarioIndex + 1;
    if (nextIndex >= SCENARIOS.length) {
      const score = [...answers].filter(Boolean).length;
      setProfile(getProfile(score));
      setPhase("result");
    } else {
      setScenarioIndex(nextIndex);
      setTimeLeft(8);
      setPhase("scenario");
    }
  };

  const handleShare = () => {
    if (!profile) return;
    const url = "https://ifooddemo.vercel.app/missao";
    const text = profile.shareText + "\n\n" + url + "\n\n#MaioAmarelo #NaPista #iFood";

    if (navigator.share) {
      navigator.share({ title: "Missão Na Pista", text }).catch(() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        });
      });
    } else {
      navigator.clipboard?.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
    }
  };

  // ─── LANDING ───────────────────────────────────────────────────────────────
  if (phase === "landing") {
    return (
      <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center text-white relative overflow-hidden px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#EA1D2C15_0%,_transparent_70%)] pointer-events-none" />
        <a href="/" className="absolute top-5 left-5 z-10 flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 hover:text-white text-xs font-semibold transition-all">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          Voltar
        </a>
        <div className="text-center relative z-10 max-w-xl">
          <p className="text-[#EA1D2C] text-[10px] font-black uppercase tracking-[0.35em] mb-3">
            MAIO AMARELO 2026 · iFOOD NA PISTA
          </p>
          <p className="text-yellow-400/60 text-xs mb-8">
            No trânsito, enxergar o outro é salvar vidas.
          </p>

          <h1 className="text-6xl sm:text-7xl md:text-9xl font-black leading-none mb-2 tracking-tight font-heading">
            MISSÃO
          </h1>
          <p className="text-[#EA1D2C] text-2xl sm:text-3xl md:text-4xl font-black mb-3 leading-tight font-heading">
            NA PISTA
          </p>
          <p className="text-white/15 text-lg font-bold mb-10">
            🏍️
          </p>

          <div className="space-y-3 text-white/35 text-sm leading-relaxed mb-12 max-w-sm mx-auto">
            <p>33 motociclistas morrem por dia no Brasil.</p>
            <p>5 situações reais do corre. 8 segundos pra decidir.</p>
            <p className="text-white/50 font-semibold">Qual piloto você é?</p>
          </div>

          <button
            onClick={() => { setIntroLineIndex(0); setPhase("intro"); }}
            className="bg-[#EA1D2C] hover:bg-[#C41825] text-white font-black text-base px-14 py-5 rounded-2xl transition-all duration-150 hover:scale-105 active:scale-95 shadow-xl shadow-[#EA1D2C]/25"
          >
            INICIAR MISSÃO
          </button>

          <p className="text-white/15 text-xs mt-6">
            Feito pra quem vive no corre. Compartilhe com os parceiros.
          </p>
        </div>
      </div>
    );
  }

  // ─── INTRO CINEMATOGRÁFICA ─────────────────────────────────────────────────
  if (phase === "intro") {
    const visible = INTRO_LINES.slice(0, introLineIndex);
    return (
      <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center text-white px-8">
        <div className="max-w-md w-full space-y-2">
          {visible.map((line, i) =>
            line === "" ? (
              <div key={i} className="h-5" />
            ) : (
              <p
                key={i}
                className={`text-xl md:text-2xl font-semibold leading-snug transition-all duration-500 ${
                  i === visible.length - 1 ? "text-white" : "text-white/25"
                }`}
              >
                {line}
              </p>
            )
          )}
        </div>
      </div>
    );
  }

  // ─── CENÁRIO ───────────────────────────────────────────────────────────────
  if (phase === "scenario") {
    const scenario = SCENARIOS[scenarioIndex];
    const circumference = 2 * Math.PI * 40;
    const progress = (timeLeft / 8) * circumference;
    const isUrgent = timeLeft <= 2;

    return (
      <div className="min-h-[100dvh] bg-[#060606] text-white">
        {/* Barra de progresso */}
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-[#EA1D2C] transition-all duration-300"
            style={{ width: `${((scenarioIndex + 1) / SCENARIOS.length) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">
              Situação {scenarioIndex + 1} de {SCENARIOS.length}
            </p>
            <p className="text-white/20 text-[11px] mt-0.5">{scenario.location}</p>
          </div>
          {/* Timer circular */}
          <div className="relative w-12 h-12 flex-shrink-0">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 88 88">
              <circle cx="44" cy="44" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
              <circle
                cx="44" cy="44" r="40" fill="none"
                stroke={isUrgent ? "#ef4444" : timeLeft <= 4 ? "#f97316" : "#22c55e"}
                strokeWidth="5" strokeLinecap="round"
                strokeDasharray={`${progress} ${circumference}`}
                style={{ transition: "stroke-dasharray 1s linear, stroke 0.3s" }}
              />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-lg font-black ${isUrgent ? "text-red-400 animate-pulse" : "text-white"}`}>
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="px-5 pb-8 pt-2 max-w-2xl mx-auto w-full">
          <p className="text-xl md:text-2xl font-semibold leading-relaxed mb-3">
            {scenario.situation}
          </p>
          <p className="text-[#EA1D2C] text-sm font-black uppercase tracking-widest mb-8">
            {scenario.urgency}
          </p>

          <div className="space-y-3">
            {scenario.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(choice.safe)}
                className="w-full text-left border border-white/[0.08] hover:border-[#EA1D2C]/40 bg-white/[0.03] hover:bg-[#EA1D2C]/10 rounded-2xl px-5 py-5 transition-all duration-150 active:scale-[0.97]"
              >
                <span className="text-[#EA1D2C]/50 text-xs font-mono mr-3 font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm md:text-base font-medium">{choice.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── CONSEQUÊNCIA ──────────────────────────────────────────────────────────
  if (phase === "consequence") {
    const scenario = SCENARIOS[scenarioIndex];
    const correct = lastAnswer?.correct ?? false;
    const timedOut = lastAnswer?.timedOut ?? false;
    const isLast = scenarioIndex === SCENARIOS.length - 1;

    return (
      <div
        className="min-h-[100dvh] flex flex-col text-white px-6 py-10"
        style={{ backgroundColor: correct ? "#031a0a" : "#1a0205" }}
      >
        <div className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-center">
          {timedOut && (
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-5 animate-pulse">
              TEMPO ESGOTADO — O trânsito não espera
            </p>
          )}

          {correct ? (
            <>
              <div className="text-5xl mb-4 text-green-400 font-black">✓</div>
              <h3 className="text-3xl font-black text-green-400 mb-4 font-heading">
                {scenario.consequence_right.headline}
              </h3>
              <p className="text-white/55 text-base leading-relaxed">
                {scenario.consequence_right.stat}
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl md:text-7xl font-black text-[#EA1D2C] mb-3 leading-none font-heading">
                {scenario.consequence_wrong.number}
              </div>
              <h3 className="text-2xl font-black text-white mb-5 leading-snug">
                {scenario.consequence_wrong.headline}
              </h3>
              <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 mb-4">
                <p className="text-white/70 text-sm leading-relaxed">
                  {scenario.consequence_wrong.stat}
                </p>
              </div>
              <p className="text-white/30 text-sm italic">
                {scenario.consequence_wrong.impact}
              </p>
            </>
          )}

          <button
            onClick={handleNextScenario}
            className="mt-10 bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold py-4 rounded-xl transition-all text-sm tracking-wide active:scale-[0.98]"
          >
            {isLast ? "VER MEU PERFIL →" : "PRÓXIMA SITUAÇÃO →"}
          </button>
        </div>
      </div>
    );
  }

  // ─── RESULTADO ─────────────────────────────────────────────────────────────
  if (phase === "result" && profile) {
    const score = answers.filter(Boolean).length;

    return (
      <div
        className="min-h-[100dvh] flex flex-col items-center justify-center text-white px-6 py-12"
        style={{ backgroundColor: profile.bg }}
      >
        <div className="max-w-md w-full text-center">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.35em] mb-10">
            SEU PERFIL · MAIO AMARELO 2026 · iFOOD NA PISTA
          </p>

          <div className="text-8xl mb-6" style={{ filter: "drop-shadow(0 0 40px currentColor)" }}>
            {profile.emoji}
          </div>

          <h2
            className="text-4xl md:text-5xl font-black mb-3 leading-tight font-heading"
            style={{ color: profile.color }}
          >
            {profile.name}
          </h2>

          {/* Barra de acertos */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-2 rounded-full flex-1 max-w-[40px] transition-all"
                style={{
                  backgroundColor: i < score ? profile.color : "rgba(255,255,255,0.08)",
                }}
              />
            ))}
            <span className="text-white/30 text-xs ml-2 whitespace-nowrap font-bold">
              {score}/5
            </span>
          </div>

          <p className="text-white/55 text-sm leading-relaxed mb-10">
            {profile.description}
          </p>

          {/* Share nativo (WhatsApp no celular) */}
          <div className="space-y-3">
            <button
              onClick={handleShare}
              className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-black py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide flex items-center justify-center gap-2"
            >
              {copied ? (
                "✓ Copiado! Cola no grupo dos parceiros."
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Mandar pros parceiros
                </>
              )}
            </button>

            <button
              onClick={() => {
                setPhase("landing");
                setAnswers([]);
                setScenarioIndex(0);
                setProfile(null);
                setIntroLineIndex(0);
              }}
              className="w-full border border-white/10 hover:border-white/25 text-white/50 hover:text-white font-semibold py-3.5 rounded-xl transition-all text-sm"
            >
              Jogar de novo
            </button>

            <a
              href="/"
              className="block text-white/20 hover:text-white/40 text-xs transition-colors mt-4"
            >
              ← Voltar pro blog
            </a>
          </div>

          <p className="text-white/10 text-[10px] mt-10">
            Maio Amarelo 2026 · No trânsito, enxergar o outro é salvar vidas.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
