"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── ÍCONES SVG ───────────────────────────────────────────────────────────────

function IconPhone({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>;
}
function IconHandStop({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075-5.925v2.925m0-2.925a1.575 1.575 0 013.15 0v3.15M14.25 7.5v3.075m0 0v2.175a1.575 1.575 0 01-.478 1.134l-3.1 3.1a2.624 2.624 0 01-.879.607L7.5 18.75m0 0v-3.375c0-.621.504-1.125 1.125-1.125H12m-4.5 4.5H6.375c-.621 0-1.125-.504-1.125-1.125V15" /></svg>;
}
function IconWind({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
}
function IconChevronDown({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
}
function IconSun({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>;
}
function IconHardHat({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>;
}
function IconCurrency({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function IconXCircle({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>;
}
function IconTrafficLight({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>;
}
function IconStop({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" /></svg>;
}

// Ícones dos perfis
function IconShield({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>;
}
function IconBolt({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;
}
function IconDice({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>;
}
function IconGhost({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg>;
}

const CHOICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "phone": IconPhone,
  "hand": IconHandStop,
  "wind": IconWind,
  "slow": IconChevronDown,
  "sun": IconSun,
  "helmet": IconHardHat,
  "money": IconCurrency,
  "stop": IconStop,
  "traffic": IconTrafficLight,
  "no": IconXCircle,
};

const PROFILE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "blindado": IconShield,
  "ligeiro": IconBolt,
  "sortudo": IconDice,
  "invisivel": IconGhost,
};

// ─── DADOS ────────────────────────────────────────────────────────────────────

const INTRO_LINES = [
  { text: "São 19h23.", delay: 1200 },
  { text: "Você tá no corre há 10 horas.", delay: 1400 },
  { text: "A bag pesa. O corpo pede pra parar.", delay: 1600 },
  { text: "", delay: 600 },
  { text: "Mas apareceu mais uma corrida.", delay: 1400 },
  { text: "", delay: 800 },
  { text: "33", delay: 800, big: true },
  { text: "motociclistas morrem por dia no Brasil.", delay: 1800 },
  { text: "", delay: 600 },
  { text: "483 só em São Paulo em 2024.", delay: 1600 },
  { text: "Recorde em 10 anos.", delay: 1400 },
  { text: "", delay: 800 },
  { text: "41% dos entregadores", delay: 1200 },
  { text: "já se acidentaram.", delay: 1400 },
  { text: "", delay: 1000 },
  { text: "Você é o próximo?", delay: 2000, big: true },
];

const SCENARIOS = [
  {
    id: 1, location: "Av. Paulista · SP", time: "19h23", weather: "clear",
    situation: "Corrida urgente. O cliente tá ligando. Seu celular toca no suporte. O trânsito tá travado e você pensa em atender rapidinho enquanto costura entre os carros.",
    urgency: "O que você faz, parceiro?",
    choices: [
      { text: "Atendo. É só um segundo.", safe: false, icon: "phone" },
      { text: "Ignoro. Encosto quando der.", safe: true, icon: "hand" },
    ],
    consequence_wrong: { number: "80%", headline: "dos acidentes com moto envolvem distração.", stat: "2 segundos sem olhar a 40 km/h = 22 metros no escuro. No corredor, isso é a diferença entre desviar de uma porta aberta ou beijar o chão.", impact: "O cliente espera 2 minutos. Sua família espera você voltar pra casa." },
    consequence_right: { headline: "Visão de quem quer durar.", stat: "Você encostou, retornou a ligação, pegou o endereço certo. Entregou sem perrengue." },
  },
  {
    id: 2, location: "Marginal Tietê · SP", time: "22h45", weather: "rain",
    situation: "Chuva forte caiu de repente. Pista lisa, visibilidade ruim. Você tá a 70 km/h. Faltam 3 entregas pra bater a meta.",
    urgency: "E aí?",
    choices: [
      { text: "Mantenho. Já peguei chuva pior.", safe: false, icon: "wind" },
      { text: "Reduzo pra 40 e ligo o alerta.", safe: true, icon: "slow" },
    ],
    consequence_wrong: { number: "3x", headline: "a distância de frenagem na chuva.", stat: "A 70 km/h no seco: 35m pra parar. Na chuva: mais de 100m. 1 em cada 4 acidentes fatais com moto em SP acontece em pista molhada.", impact: "3 entregas não valem o risco de não ter mais nenhuma." },
    consequence_right: { headline: "Esperto demais.", stat: "Chegou 15 minutos mais tarde. Mas chegou. No dia seguinte, pegou as 3 corridas de volta." },
  },
  {
    id: 3, location: "R. Augusta · SP", time: "13h00", weather: "hot",
    situation: "35 graus. Capacete aberto, viseira levantada. Entrega rápida na esquina, dois quarteirões. Vai assim mesmo?",
    urgency: "Qual é a sua?",
    choices: [
      { text: "Vou assim. É pertinho.", safe: false, icon: "sun" },
      { text: "Fecho tudo. Sempre.", safe: true, icon: "helmet" },
    ],
    consequence_wrong: { number: "40%", headline: "das mortes são trauma na cabeça.", stat: "Capacete aberto não protege o queixo — que recebe 35% dos impactos. 60% dos acidentes com moto acontecem PERTO DE CASA, em trajetos curtos.", impact: "Dois quarteirões. Era só isso. Mas a porta do carro que abriu não sabia disso." },
    consequence_right: { headline: "Protocolo de blindado.", stat: "Capacete fechado, viseira abaixada. Dois quarteirões sem problema. Segurança não tem distância mínima." },
  },
  {
    id: 4, location: "Zona Leste · SP", time: "01h30", weather: "night",
    situation: "18 horas pilotando. Os olhos pesam. Aparece uma corrida com gorjeta de 8 reais. Última do dia. Vai ou não vai?",
    urgency: "Decide aí.",
    choices: [
      { text: "Vou sim. Última e vou dormir.", safe: false, icon: "money" },
      { text: "Não vou. Tô no limite.", safe: true, icon: "stop" },
    ],
    consequence_wrong: { number: "17s", headline: "de micro-sono sem perceber.", stat: "A 50 km/h, 17 segundos = 236 metros sem controle. 56% dos entregadores trabalham +10h por dia, todos os dias. Fadiga é a causa invisível.", impact: "A gorjeta era de R$8. A diária no hospital é R$2.400." },
    consequence_right: { headline: "Visão de longo prazo.", stat: "Deslogou, foi pra casa, dormiu. No dia seguinte, pegou a primeira corrida das 7h descansado." },
  },
  {
    id: 5, location: "Centro · SP", time: "18h00", weather: "clear",
    situation: "Sinal ficando amarelo. Entrega atrasada. Dá pra passar se acelerar. Do outro lado, um ônibus espera o verde.",
    urgency: "Passa ou para?",
    choices: [
      { text: "Acelero. Dá tempo.", safe: false, icon: "traffic" },
      { text: "Freio. Espero o verde.", safe: true, icon: "stop" },
    ],
    consequence_wrong: { number: "37.150", headline: "mortes no trânsito em 2024.", stat: "1 a cada 15 minutos. Brasil é o 2° país que mais mata motociclistas no mundo. 43% dos acidentes fatais com moto são em cruzamentos.", impact: "Maio Amarelo 2026: enxergar o outro salva vidas. Mas o ônibus não ia te enxergar." },
    consequence_right: { headline: "30 segundos. Só isso.", stat: "Esperou. O verde abriu. Foi. Do outro lado, o ônibus passou. Se tivesse acelerado, iam se encontrar no meio." },
  },
];

const PROFILES = {
  blindado: {
    key: "blindado", name: "O Blindado", icon: "blindado", color: "#22c55e", bg: "#052810",
    description: "Você é o parceiro que todo mundo quer do lado no corredor. Pega a visão, respeita o limite, e sabe que chegar vivo é mais importante que chegar rápido.",
    shareText: "Fiz a Missao Na Pista e sou O BLINDADO — 0 vacilo. E voce, qual piloto e?",
  },
  ligeiro: {
    key: "ligeiro", name: "O Ligeiro", icon: "ligeiro", color: "#eab308", bg: "#1a1500",
    description: "Tem noção, parceiro. Sabe o que é certo. Mas na correria, às vezes escorrega. Cada decisão certa é uma chance a mais de voltar pra casa.",
    shareText: "Fiz a Missao Na Pista e sou O LIGEIRO — quase la mas vacilei em uma. E voce?",
  },
  sortudo: {
    key: "sortudo", name: "O Sortudo", icon: "sortudo", color: "#f97316", bg: "#1a0800",
    description: "Tá contando com a sorte, parceiro. E sorte no trânsito tem prazo de validade. 41% dos entregadores já se acidentaram.",
    shareText: "Fiz a Missao Na Pista e sou O SORTUDO — to contando com a sorte e sorte acaba. E voce?",
  },
  invisivel: {
    key: "invisivel", name: "O Invisível", icon: "invisivel", color: "#ef4444", bg: "#1a0202",
    description: "Invisível. É assim que o trânsito te trata. E é assim que você tá tratando sua segurança. 33 motociclistas morrem por dia no Brasil.",
    shareText: "Fiz a Missao Na Pista e sou O INVISIVEL — preciso pegar a visao. E voce?",
  },
};

function getProfile(score: number) {
  if (score >= 4) return PROFILES.blindado;
  if (score === 3) return PROFILES.ligeiro;
  if (score >= 1) return PROFILES.sortudo;
  return PROFILES.invisivel;
}

type Phase = "landing" | "intro" | "scenario" | "consequence" | "result";

// ─── EFEITOS VISUAIS ──────────────────────────────────────────────────────────

function RainEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} className="absolute w-[1px] bg-gradient-to-b from-transparent via-blue-300/30 to-transparent animate-rain"
          style={{ left: `${Math.random() * 100}%`, height: `${15 + Math.random() * 25}px`, animationDelay: `${Math.random() * 2}s`, animationDuration: `${0.4 + Math.random() * 0.3}s` }}
        />
      ))}
    </div>
  );
}

function HeartbeatPulse({ active }: { active: boolean }) {
  if (!active) return null;
  return <div className="fixed inset-0 pointer-events-none z-[100]"><div className="absolute inset-0 animate-heartbeat bg-red-600/10 rounded-full" /></div>;
}

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
  const [shakeScreen, setShakeScreen] = useState(false);
  const [flashRed, setFlashRed] = useState(false);
  const [flashGreen, setFlashGreen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [landingReady, setLandingReady] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => { if (phase === "landing") { const t = setTimeout(() => setLandingReady(true), 300); return () => clearTimeout(t); } }, [phase]);
  const vibrate = (pattern: number | number[]) => { try { navigator?.vibrate?.(pattern); } catch {} };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = phase !== "result" ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  useEffect(() => { setFadeIn(false); const t = requestAnimationFrame(() => { requestAnimationFrame(() => setFadeIn(true)); }); return () => cancelAnimationFrame(t); }, [phase, scenarioIndex]);

  useEffect(() => {
    if (phase !== "scenario") return;
    if (timeLeft <= 0) {
      vibrate([200, 100, 200, 100, 400]); setShakeScreen(true); setFlashRed(true);
      setTimeout(() => { setShakeScreen(false); setFlashRed(false); }, 600);
      setAnswers(prev => [...prev, false]); setLastAnswer({ correct: false, timedOut: true }); setPhase("consequence"); return;
    }
    if (timeLeft <= 3) vibrate(50);
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  useEffect(() => {
    if (phase !== "intro") return;
    if (introLineIndex >= INTRO_LINES.length) { const t = setTimeout(() => { setScenarioIndex(0); setTimeLeft(8); setPhase("scenario"); }, 1200); return () => clearTimeout(t); }
    const line = INTRO_LINES[introLineIndex];
    if (line.big) vibrate(100);
    const t = setTimeout(() => setIntroLineIndex(i => i + 1), line.delay);
    return () => clearTimeout(t);
  }, [phase, introLineIndex]);

  useEffect(() => {
    if (phase !== "consequence" || !counterRef.current || lastAnswer?.correct) return;
    const target = SCENARIOS[scenarioIndex].consequence_wrong.number;
    const el = counterRef.current;
    const numMatch = target.replace(/[.,]/g, '').match(/^\d+$/);
    if (numMatch) {
      const finalNum = parseInt(target.replace(/[.,]/g, '')); const duration = 1500; const startTime = Date.now();
      const tick = () => { const p = Math.min((Date.now() - startTime) / duration, 1); el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * finalNum).toLocaleString('pt-BR'); if (p < 1) requestAnimationFrame(tick); else el.textContent = target; };
      el.textContent = "0"; requestAnimationFrame(tick);
    } else { el.textContent = target; }
  }, [phase, scenarioIndex, lastAnswer]);

  const handleChoice = useCallback((correct: boolean) => {
    if (phase !== "scenario") return;
    if (correct) { vibrate(50); setFlashGreen(true); setTimeout(() => setFlashGreen(false), 400); }
    else { vibrate([200, 100, 200]); setShakeScreen(true); setFlashRed(true); setTimeout(() => { setShakeScreen(false); setFlashRed(false); }, 500); }
    setAnswers(prev => [...prev, correct]); setLastAnswer({ correct, timedOut: false });
    setTimeout(() => setPhase("consequence"), correct ? 300 : 500);
  }, [phase]);

  const handleNextScenario = () => {
    const next = scenarioIndex + 1;
    if (next >= SCENARIOS.length) { const s = [...answers].filter(Boolean).length; setProfile(getProfile(s)); vibrate(s >= 4 ? [100, 50, 100, 50, 100] : [400]); setPhase("result"); }
    else { setScenarioIndex(next); setTimeLeft(8); setPhase("scenario"); }
  };

  const handleShare = () => {
    if (!profile) return;
    const text = profile.shareText + "\n\nhttps://ifooddemo.vercel.app/missao\n\n#MaioAmarelo #NaPista";
    if (navigator.share) { navigator.share({ title: "Missao Na Pista", text }).catch(() => { navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 3000); }); }); }
    else { navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 3000); }); }
  };

  const weatherBg = (w: string) => {
    if (w === "rain") return "bg-gradient-to-b from-[#0a0f1a] via-[#0d1520] to-[#060a10]";
    if (w === "night") return "bg-gradient-to-b from-[#050510] via-[#0a0a18] to-[#020208]";
    if (w === "hot") return "bg-gradient-to-b from-[#1a1005] via-[#120c03] to-[#0a0802]";
    return "bg-gradient-to-b from-[#080808] via-[#060606] to-[#040404]";
  };

  // ─── LANDING ───────────────────────────────────────────────────────────────
  if (phase === "landing") {
    return (
      <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center text-white relative overflow-hidden px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#EA1D2C08_0%,_transparent_60%)] pointer-events-none animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_#EA1D2C10_0%,_transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="absolute h-[1px] bg-gradient-to-r from-transparent via-[#EA1D2C]/20 to-transparent animate-scan" style={{ top: `${30 + i * 20}%`, animationDelay: `${i * 2}s` }} />
          ))}
        </div>
        <a href="/" className="absolute top-5 left-5 z-10 flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white text-xs font-semibold transition-all">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          Voltar
        </a>
        <div className={`text-center relative z-10 max-w-xl transition-all duration-1000 ${landingReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EA1D2C]/10 border border-[#EA1D2C]/20 mb-8">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-[#EA1D2C] opacity-75" /><span className="relative rounded-full h-2 w-2 bg-[#EA1D2C]" /></span>
            <span className="text-[#EA1D2C] text-[10px] font-black uppercase tracking-[0.3em]">Maio Amarelo 2026</span>
          </div>
          <h1 className="text-7xl sm:text-8xl md:text-[10rem] font-black leading-[0.85] mb-2 tracking-tighter font-heading">MISSÃO</h1>
          <p className="text-[#EA1D2C] text-3xl sm:text-4xl md:text-5xl font-black mb-10 leading-tight font-heading tracking-tight">NA PISTA</p>
          <div className="flex items-center justify-center gap-6 mb-12 text-white/20 text-xs">
            <div className="text-center"><p className="text-2xl font-black text-white/40 mb-0.5">5</p><p>situações</p></div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center"><p className="text-2xl font-black text-white/40 mb-0.5">8s</p><p>pra decidir</p></div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center"><p className="text-2xl font-black text-white/40 mb-0.5">1</p><p>perfil</p></div>
          </div>
          <button onClick={() => { setIntroLineIndex(0); setPhase("intro"); vibrate(50); }} className="group relative bg-[#EA1D2C] hover:bg-[#C41825] text-white font-black text-lg px-16 py-6 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xl shadow-[#EA1D2C]/30">
            <span className="relative z-10">INICIAR</span>
            <div className="absolute inset-0 rounded-2xl bg-[#EA1D2C] animate-ping opacity-20 group-hover:opacity-0" />
          </button>
          <p className="text-white/10 text-xs mt-8">Feito pra quem vive no corre.</p>
        </div>
      </div>
    );
  }

  // ─── INTRO ─────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    const visible = INTRO_LINES.slice(0, introLineIndex);
    return (
      <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center text-white px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#EA1D2C05_0%,_transparent_50%)] pointer-events-none" />
        <div className="max-w-md w-full space-y-1.5 relative z-10">
          {visible.map((line, i) => line.text === "" ? <div key={i} className="h-6" /> : (
            <p key={i} className={`font-semibold leading-snug transition-all duration-700 ${i === visible.length - 1 ? (line.big ? "text-5xl md:text-7xl font-black text-[#EA1D2C] font-heading" : "text-xl md:text-2xl text-white") : (line.big ? "text-5xl md:text-7xl font-black text-[#EA1D2C]/30 font-heading" : "text-xl md:text-2xl text-white/15")}`}>
              {line.text}
            </p>
          ))}
        </div>
        <div className="absolute bottom-10 flex gap-1">
          {INTRO_LINES.filter(l => l.text !== "").map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i < visible.filter(l => l.text !== "").length ? 'w-3 bg-[#EA1D2C]' : 'w-1.5 bg-white/10'}`} />
          ))}
        </div>
      </div>
    );
  }

  // ─── CENÁRIO ───────────────────────────────────────────────────────────────
  if (phase === "scenario") {
    const scenario = SCENARIOS[scenarioIndex];
    const pct = timeLeft / 8;
    const isUrgent = timeLeft <= 2;

    return (
      <div className={`min-h-[100dvh] text-white relative overflow-hidden ${weatherBg(scenario.weather)} ${shakeScreen ? 'animate-shake' : ''} transition-all duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        {scenario.weather === "rain" && <RainEffect />}
        <HeartbeatPulse active={isUrgent} />
        {flashRed && <div className="fixed inset-0 bg-red-600/20 z-[90] pointer-events-none animate-flash" />}
        {flashGreen && <div className="fixed inset-0 bg-green-500/15 z-[90] pointer-events-none animate-flash" />}
        <div className="relative z-10">
          <div className="h-1.5 bg-white/5"><div className="h-full transition-all duration-1000 linear rounded-r-full" style={{ width: `${pct * 100}%`, backgroundColor: isUrgent ? '#ef4444' : timeLeft <= 4 ? '#f97316' : '#22c55e' }} /></div>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {SCENARIOS.map((_, i) => (<div key={i} className={`h-1.5 w-1.5 rounded-full transition-all ${i < scenarioIndex ? 'bg-[#EA1D2C]' : i === scenarioIndex ? 'bg-white w-4' : 'bg-white/10'}`} />))}
              </div>
            </div>
            <div className={`text-4xl font-black tabular-nums transition-all ${isUrgent ? 'text-red-500 scale-125 animate-pulse' : timeLeft <= 4 ? 'text-orange-400' : 'text-white/30'}`}>{timeLeft}</div>
          </div>
        </div>
        <div className="relative z-10 px-5 pb-8 pt-4 max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-white/20 text-[10px] uppercase tracking-widest font-bold">{scenario.location}</span>
            <span className="text-white/10">/</span>
            <span className="text-white/20 text-[10px] font-mono">{scenario.time}</span>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold leading-snug mb-4">{scenario.situation}</p>
          <p className="text-[#EA1D2C] text-sm font-black uppercase tracking-widest mb-8">{scenario.urgency}</p>
          <div className="space-y-3">
            {scenario.choices.map((choice, i) => {
              const Icon = CHOICE_ICONS[choice.icon];
              return (
                <button key={i} onClick={() => handleChoice(choice.safe)} className="w-full text-left border border-white/[0.06] hover:border-[#EA1D2C]/30 bg-white/[0.02] hover:bg-[#EA1D2C]/5 rounded-2xl px-5 py-5 transition-all duration-150 active:scale-[0.96] group flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] group-hover:bg-[#EA1D2C]/10 flex items-center justify-center flex-shrink-0 transition-colors">
                    {Icon && <Icon className="w-5 h-5 text-white/40 group-hover:text-[#EA1D2C] transition-colors" />}
                  </div>
                  <span className="text-sm md:text-base font-medium flex-1">{choice.text}</span>
                  <svg className="w-4 h-4 text-white/10 group-hover:text-[#EA1D2C]/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                </button>
              );
            })}
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
      <div className={`min-h-[100dvh] flex flex-col text-white px-6 py-10 transition-all duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: correct ? "#031a0a" : "#1a0205" }}>
        <div className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-center">
          {timedOut && (
            <div className="flex items-center gap-2 mb-5">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-red-400 text-xs font-black uppercase tracking-widest animate-pulse">Tempo esgotado — o trânsito não espera</p>
            </div>
          )}
          {correct ? (
            <div className={`transition-all duration-700 ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              </div>
              <h3 className="text-3xl font-black text-green-400 mb-4 font-heading">{scenario.consequence_right.headline}</h3>
              <p className="text-white/50 text-base leading-relaxed">{scenario.consequence_right.stat}</p>
            </div>
          ) : (
            <div className={`transition-all duration-700 ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <span ref={counterRef} className="block text-6xl sm:text-7xl md:text-8xl font-black text-[#EA1D2C] mb-3 leading-none font-heading tabular-nums">{scenario.consequence_wrong.number}</span>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-6 leading-snug">{scenario.consequence_wrong.headline}</h3>
              <div className="bg-white/[0.03] border-l-2 border-[#EA1D2C]/50 rounded-r-xl px-5 py-4 mb-5"><p className="text-white/60 text-sm leading-relaxed">{scenario.consequence_wrong.stat}</p></div>
              <p className="text-white/25 text-sm italic leading-relaxed">{scenario.consequence_wrong.impact}</p>
            </div>
          )}
          <button onClick={() => { handleNextScenario(); vibrate(30); }} className="mt-10 bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold py-4 rounded-xl transition-all text-sm tracking-wide active:scale-[0.97] border border-white/[0.06]">
            {isLast ? "VER MEU PERFIL" : "PRÓXIMA SITUAÇÃO"}
            <svg className="w-4 h-4 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </button>
        </div>
      </div>
    );
  }

  // ─── RESULTADO ─────────────────────────────────────────────────────────────
  if (phase === "result" && profile) {
    const score = answers.filter(Boolean).length;
    const ProfileIcon = PROFILE_ICONS[profile.icon];
    return (
      <div className={`min-h-[100dvh] flex flex-col items-center justify-center text-white px-6 py-12 transition-all duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: profile.bg }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 40%, ${profile.color}08 0%, transparent 60%)` }} />
        <div className="max-w-md w-full text-center relative z-10">
          <p className="text-white/15 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Seu perfil / Maio Amarelo 2026</p>
          <div className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center animate-bounce-slow" style={{ backgroundColor: `${profile.color}15`, boxShadow: `0 0 60px ${profile.color}20` }}>
            {ProfileIcon && <ProfileIcon className="w-12 h-12" style={{ color: profile.color } as React.CSSProperties} />}
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 leading-none font-heading" style={{ color: profile.color }}>{profile.name}</h2>
          <div className="flex items-center justify-center gap-2 mb-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-2.5 rounded-full flex-1 max-w-[44px] transition-all duration-500" style={{ backgroundColor: i < score ? profile.color : "rgba(255,255,255,0.06)", transitionDelay: `${i * 150}ms` }} />
            ))}
            <span className="text-white/25 text-sm ml-2 font-black tabular-nums">{score}/5</span>
          </div>
          <p className="text-white/45 text-sm leading-relaxed mb-12 max-w-sm mx-auto">{profile.description}</p>
          <div className="space-y-3">
            <button onClick={handleShare} className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-black py-5 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.97] text-base flex items-center justify-center gap-3 shadow-xl shadow-[#25D366]/20">
              {copied ? (
                <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg> Copiado! Cola no grupo.</>
              ) : (
                <><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg> Mandar pros parceiros</>
              )}
            </button>
            <button onClick={() => { setPhase("landing"); setAnswers([]); setScenarioIndex(0); setProfile(null); setIntroLineIndex(0); setLandingReady(false); }} className="w-full border border-white/8 hover:border-white/20 text-white/40 hover:text-white font-semibold py-4 rounded-xl transition-all text-sm">Jogar de novo</button>
            <a href="/" className="block text-white/15 hover:text-white/30 text-xs transition-colors mt-6">Voltar pro blog</a>
          </div>
          <p className="text-white/8 text-[10px] mt-12 leading-relaxed">iFood Na Pista / Maio Amarelo 2026 / No trânsito, enxergar o outro é salvar vidas.</p>
        </div>
      </div>
    );
  }

  return null;
}
