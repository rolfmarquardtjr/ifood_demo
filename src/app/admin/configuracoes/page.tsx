"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GEMINI_VOICES: { id: string; label: string }[] = [
  { id: "Achird", label: "Achird (M) Amigavel" },
  { id: "Achernar", label: "Achernar (F) Suave" },
  { id: "Algenib", label: "Algenib (M) Grave" },
  { id: "Algieba", label: "Algieba (M) Aveludado" },
  { id: "Alnilam", label: "Alnilam (M) Firme" },
  { id: "Aoede", label: "Aoede (F) Leve" },
  { id: "Autonoe", label: "Autonoe (F) Vibrante" },
  { id: "Callirrhoe", label: "Callirrhoe (F) Descontraida" },
  { id: "Charon", label: "Charon (M) Informativo" },
  { id: "Despina", label: "Despina (F) Suave" },
  { id: "Enceladus", label: "Enceladus (M) Sussurrante" },
  { id: "Erinome", label: "Erinome (F) Clara" },
  { id: "Fenrir", label: "Fenrir (M) Empolgado" },
  { id: "Gacrux", label: "Gacrux (M) Maduro" },
  { id: "Iapetus", label: "Iapetus (M) Claro" },
  { id: "Kore", label: "Kore (F) Firme" },
  { id: "Laomedeia", label: "Laomedeia (F) Animada" },
  { id: "Leda", label: "Leda (F) Jovem" },
  { id: "Orus", label: "Orus (M) Firme" },
  { id: "Puck", label: "Puck (M) Animado" },
  { id: "Pulcherrima", label: "Pulcherrima (F) Projetada" },
  { id: "Rasalgethi", label: "Rasalgethi (M) Informativo" },
  { id: "Sadachbia", label: "Sadachbia (F) Energetica" },
  { id: "Sadaltager", label: "Sadaltager (M) Sabio" },
  { id: "Schedar", label: "Schedar (M) Equilibrado" },
  { id: "Sulafat", label: "Sulafat (M) Caloroso" },
  { id: "Umbriel", label: "Umbriel (M) Tranquilo" },
  { id: "Vindemiatrix", label: "Vindemiatrix (F) Gentil" },
  { id: "Zephyr", label: "Zephyr (F) Brilhante" },
  { id: "Zubenelgenubi", label: "Zubenelgenubi (M) Casual" },
];

const OPENAI_VOICES: { id: string; label: string }[] = [
  { id: "marin", label: "Marin - Recomendado" },
  { id: "cedar", label: "Cedar - Recomendado" },
  { id: "alloy", label: "Alloy - Neutro" },
  { id: "ash", label: "Ash - Moderno" },
  { id: "coral", label: "Coral - Caloroso" },
  { id: "echo", label: "Echo - Conversacional" },
  { id: "fable", label: "Fable - Narrativo" },
  { id: "nova", label: "Nova - Energetico" },
  { id: "onyx", label: "Onyx - Grave/Profundo" },
  { id: "sage", label: "Sage - Sabio" },
  { id: "shimmer", label: "Shimmer - Suave" },
];

interface PodcastCharacter {
  name: string;
  voice: string;
  role: string;
  instructions: string;
}

export default function AdminConfigPage() {
  // General
  const [aiModel, setAiModel] = useState("google/gemini-2.5-flash");
  const [publishTime] = useState("07:00");
  const [podcastTime] = useState("07:15");
  // Dias da semana: [Dom, Seg, Ter, Qua, Qui, Sex, Sab]
  const [articleDays, setArticleDays] = useState([false, true, true, true, true, true, false]);
  const [podcastDays, setPodcastDays] = useState([false, true, false, false, true, false, false]);
  const [delivery, setDelivery] = useState(40);
  const [restaurantes, setRestaurantes] = useState(35);
  const [tendencias, setTendencias] = useState(25);

  // API Keys
  const [googleKey, setGoogleKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");

  // Podcast
  const [ttsProvider, setTtsProvider] = useState("gemini");
  const [ttsModel, setTtsModel] = useState("gemini-2.5-flash-tts");
  const [podcastDuration, setPodcastDuration] = useState(10);
  const [podcastScene, setPodcastScene] = useState("Dois entregadores sentados na calçada com as motos estacionadas, bags do lado, tomando um café entre corridas. Clima de conversa real entre parceiros que se encontram todo dia.");
  const [podcastScriptPrompt, setPodcastScriptPrompt] = useState(`ESTRUTURA DO EPISODIO:
1. ABERTURA: Cumprimento de motoboy, já emenda na parada do dia.
2. MANCHETES: O que tá rolando no mundo do entregador.
3. DISCUSSAO: Cada notícia com impacto pro motoboy.
4. SEGURANÇA: Dica prática de segurança no trânsito (Maio Amarelo).
5. ENCERRAMENTO: Resumo e "se cuida no corre, parceiro".

REGRAS ABSOLUTAS:
- Os personagens NUNCA falam de si mesmos. Nada de "na minha experiencia", "eu que trabalho ha anos". ZERO autopromocao.
- Foco 100% nas NOTICIAS e no IMPACTO PRATICO pro ouvinte.
- Conversa REAL: um fala, o outro reage, complementa, discorda, provoca. Bate-papo entre parceiros.
- Reacoes naturais: "Eita!", "Pega a visão...", "É nóis...", "Parceiro!", "Mas calma aí..."
- Cada fala 1 a 3 frases. Ninguem faz discurso longo.
- Traga NUMEROS e DADOS das notícias.
- Gírias do dia a dia: corrida, trampo, no corre, bag, baú, corredor, costurar.
- Portugues brasileiro natural de motoboy.
- Ritmo dinamico: empolgacao, seriedade, humor leve.`);
  const [podcastDirectorsNotes, setPodcastDirectorsNotes] = useState("ESSENCIAL: Isso é conversa REAL entre dois motoboys que se conhecem há anos. Um fala, o outro REAGE - concorda, discorda, ri, fica indignado com uma notícia de acidente. Use gírias naturalmente: 'pega a visão', 'no corre', 'parceiro', 'corredor'. Mas quando o assunto é segurança, o tom fica sério SEM perder a naturalidade. A mensagem do Maio Amarelo 2026 'enxergar o outro salva vidas' tem que estar no DNA de cada episódio.");
  const [podcastStyle, setPodcastStyle] = useState("Podcast Na Pista do iFood - feito POR entregadores PRA entregadores. Dois motoboys veteranos discutem o corre do dia: segurança no trânsito, dicas de entrega, novidades do app e o que tá rolando no Maio Amarelo. Linguagem de quem vive no corredor, usa bag e baú todo dia. Ritmo de conversa entre parceiros no ponto de espera. Nada de papo formal - aqui é conversa de quem sabe o que é pegar chuva na Marginal.");
  const [characters, setCharacters] = useState<PodcastCharacter[]>([
    { name: "Tião", voice: "Puck", role: "Apresentador principal - motoboy raiz", instructions: "Tom de quem vive o corre todo dia. Fala como motoboy de SP, usa gírias naturalmente mas passa informação séria sobre segurança." },
    { name: "Juh", voice: "Kore", role: "Co-apresentadora - entregadora experiente", instructions: "Tom direto e esperto. Traz dados e contexto mas fala como parceira, não como professora. Reage com emoção real." },
  ]);

  // Article Audio
  const [articleAudioVoice, setArticleAudioVoice] = useState("Charon");
  const [articleAudioScene, setArticleAudioScene] = useState("Motoboy veterano gravando um áudio pro grupo de WhatsApp dos entregadores");
  const [articleAudioDirectorsNotes, setArticleAudioDirectorsNotes] = useState("Fale como motoboy que sabe das coisas. Emoção real, ritmo natural. NAO soe robotico. Quando falar de acidente, o tom muda - fica sério porque sabe que podia ser qualquer um dos parceiros.");
  const [articleAudioPrompt, setArticleAudioPrompt] = useState(`Você é um motoboy experiente que virou comunicador. Fala como entregador mas com informação de qualidade. Reporta notícias pro parceiro entregador como se tivesse explicando no ponto de espera entre corridas. Tom: direto, engajado, com a energia de quem vive o trânsito. NUNCA fale de si mesmo. Foco nos FATOS. Maio Amarelo 2026: no trânsito, enxergar o outro salva vidas. Duração 1-2 min (150-300 palavras). Português brasileiro natural de motoboy.

COMO VOCE DEVE FALAR:
- Comece com impacto: reaja a notícia como especialista
- Fale com emocao real: indignacao quando e absurdo, empolgacao quando e bom pro setor, preocupacao quando e grave
- Traga sua experiencia de campo
- Explique o impacto pratico no dia a dia de entregadores, restaurantes e consumidores
- Use numeros e dados concretos
- De sua opiniao profissional sem medo
- Termine com orientacao direta: o que o profissional do setor deve fazer AGORA
- Duração: 1 a 2 minutos (150-300 palavras)
- Tom: especialista apaixonado, direto, com personalidade forte
- Portugues brasileiro coloquial profissional
- NAO use marcadores ou formatacao. Texto corrido natural`);

  // Image
  const [imageProvider, setImageProvider] = useState("google");
  const [imageModel, setImageModel] = useState("imagen-4.0-generate-001");
  const [imageQuality, setImageQuality] = useState("low");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.ok ? r.json() : {})
      .then((data: Record<string, unknown>) => {
        if (data.ai_model) setAiModel(data.ai_model as string);
        // horários e artigos por dia sao fixos
        if (data.article_days) setArticleDays(data.article_days as boolean[]);
        if (data.podcast_days) setPodcastDays(data.podcast_days as boolean[]);
        if (data.category_proportions) {
          const cp = data.category_proportions as { delivery?: number; restaurantes?: number; tendencias?: number };
          setDelivery(cp.delivery || 40);
          setRestaurantes(cp.restaurantes || 35);
          setTendencias(cp.tendencias || 25);
        }
        if (data.api_keys) {
          const keys = data.api_keys as { google?: string; openai?: string; anthropic?: string };
          if (keys.google) setGoogleKey(keys.google);
          if (keys.openai) setOpenaiKey(keys.openai);
          if (keys.anthropic) setAnthropicKey(keys.anthropic);
        }
        if (data.podcast_config) {
          const pc = data.podcast_config as {
            ttsProvider?: string; ttsModel?: string; durationMinutes?: number;
            style?: string; characters?: PodcastCharacter[];
          };
          if (pc.ttsProvider) setTtsProvider(pc.ttsProvider);
          if (pc.ttsModel) setTtsModel(pc.ttsModel);
          if (pc.durationMinutes) setPodcastDuration(pc.durationMinutes);
          if (pc.style) setPodcastStyle(pc.style);
          if (pc.characters) setCharacters(pc.characters);
          if ((pc as Record<string, unknown>).scene) setPodcastScene((pc as Record<string, unknown>).scene as string);
          if ((pc as Record<string, unknown>).directorsNotes) setPodcastDirectorsNotes((pc as Record<string, unknown>).directorsNotes as string);
          if ((pc as Record<string, unknown>).scriptPrompt) setPodcastScriptPrompt((pc as Record<string, unknown>).scriptPrompt as string);
        }
        if (data.article_audio_config) {
          const aac = data.article_audio_config as { voice?: string; prompt?: string; scene?: string; directorsNotes?: string };
          if (aac.voice) setArticleAudioVoice(aac.voice);
          if (aac.prompt) setArticleAudioPrompt(aac.prompt);
          if (aac.scene) setArticleAudioScene(aac.scene);
          if (aac.directorsNotes) setArticleAudioDirectorsNotes(aac.directorsNotes);
        }
        if (data.image_config) {
          const ic = data.image_config as { provider?: string; model?: string; quality?: string };
          if (ic.provider) setImageProvider(ic.provider);
          if (ic.model) setImageModel(ic.model);
          if (ic.quality) setImageQuality(ic.quality);
        }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ai_model: aiModel,
        publish_time: publishTime,
        podcast_time: podcastTime,
        articles_per_day: 1,
        article_days: articleDays,
        podcast_days: podcastDays,
        category_proportions: { delivery, restaurantes, tendencias },
        api_keys: {
          google: googleKey || undefined,
          openai: openaiKey || undefined,
          anthropic: anthropicKey || undefined,
        },
        podcast_config: {
          ttsProvider,
          ttsModel,
          durationMinutes: podcastDuration,
          style: podcastStyle,
          scene: podcastScene,
          directorsNotes: podcastDirectorsNotes,
          scriptPrompt: podcastScriptPrompt,
          characters,
        },
        article_audio_config: {
          voice: articleAudioVoice,
          prompt: articleAudioPrompt,
          scene: articleAudioScene,
          directorsNotes: articleAudioDirectorsNotes,
        },
        image_config: {
          provider: imageProvider,
          model: imageModel,
          quality: imageQuality,
        },
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateCharacter = (index: number, field: keyof PodcastCharacter, value: string) => {
    const updated = [...characters];
    updated[index] = { ...updated[index], [field]: value };
    setCharacters(updated);
  };

  const addCharacter = () => {
    setCharacters([...characters, { name: "", voice: ttsProvider === "gemini" ? "Charon" : "marin", role: "", instructions: "" }]);
  };

  const removeCharacter = (index: number) => {
    setCharacters(characters.filter((_, i) => i !== index));
  };

  const voiceOptions = ttsProvider === "gemini" ? GEMINI_VOICES : OPENAI_VOICES;
  const allVoiceOptions = ttsProvider === "gemini" ? GEMINI_VOICES : OPENAI_VOICES;
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const previewVoice = async (voice: string) => {
    if (previewingVoice === voice) {
      previewAudioRef.current?.pause();
      setPreviewingVoice(null);
      return;
    }
    setPreviewingVoice(voice);
    try {
      const res = await fetch("/api/admin/generate/voice-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voice, provider: ttsProvider }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Erro" }));
        alert(err.error || "Erro ao gerar preview");
        setPreviewingVoice(null);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      const audio = new Audio(url);
      previewAudioRef.current = audio;
      audio.onended = () => setPreviewingVoice(null);
      audio.play();
    } catch {
      setPreviewingVoice(null);
    }
  };

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>

      <Tabs defaultValue="general" className="max-w-3xl">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="api-keys">Chaves de API</TabsTrigger>
          <TabsTrigger value="podcast">Podcast</TabsTrigger>
          <TabsTrigger value="article-audio">Audio Artigo</TabsTrigger>
          <TabsTrigger value="image">Imagem</TabsTrigger>
        </TabsList>

        {/* ==================== GERAL ==================== */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Modelo de IA (Geração de conteudo)</CardTitle></CardHeader>
            <CardContent>
              <Select value={aiModel} onValueChange={(v) => v && setAiModel(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="google/gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                  <SelectItem value="google/gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                  <SelectItem value="google/gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</SelectItem>
                  <SelectItem value="openai/gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="openai/gpt-4o-mini">GPT-4o Mini</SelectItem>
                  <SelectItem value="anthropic/claude-sonnet-4-6">Claude Sonnet 4.6</SelectItem>
                  <SelectItem value="anthropic/claude-haiku-4-5">Claude Haiku 4.5</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Geração Automática</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Artigo</span>
                <span className="text-sm font-mono font-semibold">07:00 BRT</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Podcast</span>
                <span className="text-sm font-mono font-semibold">07:15 BRT</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Newsletter</span>
                <span className="text-sm font-mono font-semibold">07:30 BRT</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Artigos por dia</span>
                <span className="text-sm font-mono font-semibold">1</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Dias de Geração</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Artigos</Label>
                <div className="flex gap-2 mt-2">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day, i) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => { const d = [...articleDays]; d[i] = !d[i]; setArticleDays(d); }}
                      className={`w-10 h-10 rounded-lg text-xs font-bold transition-all cursor-pointer ${articleDays[i] ? "bg-[#EA1D2C] text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Podcast</Label>
                <div className="flex gap-2 mt-2">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day, i) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => { const d = [...podcastDays]; d[i] = !d[i]; setPodcastDays(d); }}
                      className={`w-10 h-10 rounded-lg text-xs font-bold transition-all cursor-pointer ${podcastDays[i] ? "bg-[#EA1D2C] text-[#13151A]" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Vermelho = artigos, Amarelo = podcast. Clique pra ativar/desativar.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Proporção de Categorias</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Logística & Entrega: {delivery}%</Label>
                <Slider value={[delivery]} onValueChange={(val) => { const v = Array.isArray(val) ? val[0] : val; setDelivery(v); setTendencias(100 - v - restaurantes); }} min={0} max={100} step={5} className="mt-2" />
              </div>
              <div>
                <Label>Restaurantes & Parceiros: {restaurantes}%</Label>
                <Slider value={[restaurantes]} onValueChange={(val) => { const v = Array.isArray(val) ? val[0] : val; setRestaurantes(v); setTendencias(100 - delivery - v); }} min={0} max={100} step={5} className="mt-2" />
              </div>
              <div>
                <Label>Tendências & Inovação: {tendencias}%</Label>
                <p className="text-sm text-muted-foreground">(calculado automáticamente)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== API KEYS ==================== */}
        <TabsContent value="api-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chaves de API</CardTitle>
              <p className="text-sm text-muted-foreground">As chaves sao usadas para geração de conteudo, TTS e imagens.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Google AI (Gemini)</Label>
                <Input
                  type="password"
                  value={googleKey}
                  onChange={(e) => setGoogleKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">TTS, imagem (Imagen 3), conteudo (Gemini 2.5)</p>
              </div>
              <div>
                <Label>OpenAI</Label>
                <Input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-..."
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">TTS (gpt-4o-mini-tts), imagem (gpt-image-1), conteudo (GPT-4o)</p>
              </div>
              <div>
                <Label>Anthropic (Claude)</Label>
                <Input
                  type="password"
                  value={anthropicKey}
                  onChange={(e) => setAnthropicKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">Conteudo (Claude Sonnet 4.6, Haiku 4.5)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== PODCAST ==================== */}
        <TabsContent value="podcast" className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Provider de TTS</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Provider</Label>
                <Select value={ttsProvider} onValueChange={(v) => {
                  if (!v) return;
                  setTtsProvider(v);
                  if (v === "gemini") {
                    setTtsModel("gemini-2.5-flash-tts");
                    setCharacters(chars => chars.map(c => ({ ...c, voice: "Puck" })));
                  } else {
                    setTtsModel("gpt-4o-mini-tts");
                    setCharacters(chars => chars.map(c => ({ ...c, voice: "nova" })));
                  }
                }}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                    <SelectItem value="openai">OpenAI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Modelo TTS</Label>
                <Select value={ttsModel} onValueChange={(v) => v && setTtsModel(v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ttsProvider === "gemini" ? (
                      <>
                        <SelectItem value="gemini-2.5-pro-preview-tts">Pro (melhor qualidade)</SelectItem>
                        <SelectItem value="gemini-2.5-flash-preview-tts">Flash (rapido e bom)</SelectItem>
                        <SelectItem value="gemini-2.5-pro-tts">Pro Stable</SelectItem>
                        <SelectItem value="gemini-2.5-flash-tts">Flash Stable</SelectItem>
                        <SelectItem value="gemini-2.5-flash-lite-preview-tts">Flash Lite (economico)</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="gpt-4o-mini-tts">Mini TTS (melhor)</SelectItem>
                        <SelectItem value="tts-1-hd">TTS HD (alta qualidade)</SelectItem>
                        <SelectItem value="tts-1">TTS Standard</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Configurações do Podcast</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Duração aproximada (minutos)</Label>
                <Input type="number" min={2} max={60} value={podcastDuration} onChange={(e) => setPodcastDuration(parseInt(e.target.value) || 10)} className="mt-1 w-24" />
              </div>
              <div>
                <Label>Estilo / Tom do podcast</Label>
                <Textarea value={podcastStyle} onChange={(e) => setPodcastStyle(e.target.value)} rows={3} className="mt-1 text-sm" />
              </div>
              <div>
                <Label>Scene (cenario do TTS)</Label>
                <Textarea value={podcastScene} onChange={(e) => setPodcastScene(e.target.value)} rows={2} className="mt-1 text-sm" placeholder="Ex: Dois especialistas em um estudio de podcast profissional..." />
                <p className="text-xs text-muted-foreground mt-1">Define o ambiente e clima emocional para o modelo de voz</p>
              </div>
              <div>
                <Label>Director's Notes (instruções de voz)</Label>
                <Textarea value={podcastDirectorsNotes} onChange={(e) => setPodcastDirectorsNotes(e.target.value)} rows={2} className="mt-1 text-sm" placeholder="Ex: Conversa natural entre amigos especialistas..." />
                <p className="text-xs text-muted-foreground mt-1">Instruções de performance: ritmo, emocao, pausas, naturalidade</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Prompt do Roteiro</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Define como a IA vai escrever o roteiro do podcast. Estrutura, regras, tom da conversa. Os personagens, notícias e estilo sao injetados automáticamente.</p>
              <Textarea
                value={podcastScriptPrompt}
                onChange={(e) => setPodcastScriptPrompt(e.target.value)}
                rows={15}
                className="text-sm font-mono"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Personagens</CardTitle>
                <Button variant="ghost" size="sm" onClick={addCharacter} className="text-[#EA1D2C]">
                  + Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {characters.map((char, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Personagem {i + 1}</span>
                    {characters.length > 1 && (
                      <Button variant="ghost" size="sm" className="text-destructive h-6 px-2 text-xs" onClick={() => removeCharacter(i)}>
                        Remover
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Nome</Label>
                      <Input value={char.name} onChange={(e) => updateCharacter(i, "name", e.target.value)} placeholder="Ivo" className="mt-1 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Funcao</Label>
                      <Input value={char.role} onChange={(e) => updateCharacter(i, "role", e.target.value)} placeholder="Apresentador" className="mt-1 text-sm" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Voz</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Select value={char.voice} onValueChange={(v) => v && updateCharacter(i, "voice", v)}>
                        <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {voiceOptions.map((v) => (
                            <SelectItem key={v.id} value={v.id}>{v.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`px-3 border border-border ${previewingVoice === char.voice ? "text-[#EA1D2C] border-[#EA1D2C]/30" : "text-muted-foreground"}`}
                        disabled={previewingVoice !== null && previewingVoice !== char.voice}
                        onClick={() => previewVoice(char.voice)}
                      >
                        {previewingVoice === char.voice ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Instruções de voz / personalidade</Label>
                    <Textarea value={char.instructions} onChange={(e) => updateCharacter(i, "instructions", e.target.value)} rows={2} className="mt-1 text-sm" placeholder="Tom animado e informativo..." />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== AUDIO DO ARTIGO ==================== */}
        <TabsContent value="article-audio" className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Voz do Audio do Artigo</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Essa voz e usada para gerar o audio guia individual de cada artigo (diferente das vozes do podcast).</p>
              <div>
                <Label>Voz</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Select value={articleAudioVoice} onValueChange={(v) => v && setArticleAudioVoice(v)}>
                    <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {allVoiceOptions.map((v) => (
                        <SelectItem key={v.id} value={v.id}>{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-3 border border-border ${previewingVoice === articleAudioVoice ? "text-[#EA1D2C] border-[#EA1D2C]/30" : "text-muted-foreground"}`}
                    disabled={previewingVoice !== null && previewingVoice !== articleAudioVoice}
                    onClick={() => previewVoice(articleAudioVoice)}
                  >
                    {previewingVoice === articleAudioVoice ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Estilo de Voz (TTS)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Scene (cenario)</Label>
                <Textarea value={articleAudioScene} onChange={(e) => setArticleAudioScene(e.target.value)} rows={2} className="mt-1 text-sm" placeholder="Ex: Estudio de broadcast profissional..." />
                <p className="text-xs text-muted-foreground mt-1">O ambiente e clima emocional da gravacao</p>
              </div>
              <div>
                <Label>Director's Notes (instruções de performance)</Label>
                <Textarea value={articleAudioDirectorsNotes} onChange={(e) => setArticleAudioDirectorsNotes(e.target.value)} rows={2} className="mt-1 text-sm" placeholder="Ex: Fale com emocao autentica, varie o ritmo..." />
                <p className="text-xs text-muted-foreground mt-1">Como a voz deve se comportar: ritmo, emocao, pausas, naturalidade</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Prompt de Geração</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Este prompt define como a IA vai escrever o roteiro do audio antes de converter em voz. O titulo, resumo e conteudo do artigo sao adicionados automáticamente ao final.</p>
              <Textarea
                value={articleAudioPrompt}
                onChange={(e) => setArticleAudioPrompt(e.target.value)}
                rows={15}
                className="text-sm font-mono"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== IMAGEM ==================== */}
        <TabsContent value="image" className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Geração de Imagem</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Provider</Label>
                <Select value={imageProvider} onValueChange={(v) => {
                  if (!v) return;
                  setImageProvider(v);
                  if (v === "google") setImageModel("imagen-4.0-generate-001");
                  else setImageModel("gpt-image-1");
                }}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="openai">OpenAI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Modelo</Label>
                <Select value={imageModel} onValueChange={(v) => v && setImageModel(v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {imageProvider === "google" ? (
                      <>
                        <SelectItem value="imagen-4.0-generate-001">Imagen 4 Standard</SelectItem>
                        <SelectItem value="imagen-4.0-ultra-generate-001">Imagen 4 Ultra</SelectItem>
                        <SelectItem value="imagen-4.0-fast-generate-001">Imagen 4 Fast</SelectItem>
                        <SelectItem value="gemini-2.5-flash-image">Gemini 2.5 Flash Image</SelectItem>
                        <SelectItem value="gemini-3.1-flash-image-preview">Gemini 3.1 Flash Image</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="gpt-image-1">gpt-image-1</SelectItem>
                        <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              {imageProvider === "openai" && (
                <div>
                  <Label>Qualidade</Label>
                  <Select value={imageQuality} onValueChange={(v) => v && setImageQuality(v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="max-w-3xl mt-6">
        <Button onClick={handleSave} disabled={saving} className="bg-[#EA1D2C] hover:bg-[#EA1D2C]/90 w-full">
          {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar Configurações"}
        </Button>
      </div>
    </AdminShell>
  );
}
