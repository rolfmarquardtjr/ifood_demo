import { getDb } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export interface ApiKeys {
  google?: string;
  openai?: string;
  anthropic?: string;
}

export interface PodcastCharacter {
  name: string;
  voice: string;
  role: string;
  instructions?: string;
}

export interface PodcastConfig {
  durationMinutes: number;
  ttsProvider: "gemini" | "openai";
  ttsModel: string;
  characters: PodcastCharacter[];
  style: string;
  scene: string;
  directorsNotes: string;
  scriptPrompt: string;
}

export interface ArticleAudioConfig {
  voice: string;
  prompt: string;
  scene: string;
  directorsNotes: string;
}

export interface ImageConfig {
  provider: "openai" | "google";
  model: string;
  quality: string;
}

const DEFAULTS: Record<string, unknown> = {
  api_keys: {},
  podcast_config: {
    durationMinutes: 10,
    ttsProvider: "gemini",
    ttsModel: "gemini-2.5-flash-tts",
    characters: [
      { name: "Ivo", voice: "Puck", role: "Apresentador principal", instructions: "Tom animado e informativo, como um apresentador de podcast sobre gastronomia e delivery." },
      { name: "Flora", voice: "Kore", role: "Co-apresentadora", instructions: "Tom analitico e complementar, traz dados e contexto sobre o mercado de alimentação e food tech." },
    ],
    style: "O podcast de food delivery e gastronomia mais ouvido do Brasil. Dois apresentadores discutem as notícias do dia com analise afiada, dados concretos e linguagem direta. Ritmo de programa de radio ao vivo: dinamico, com provocacoes, humor pontual e sempre trazendo o impacto pratico pro ecossistema de delivery e restaurantes. Nada de papo academico - aqui e conversa de quem vive o mercado de alimentação.",
    scene: "Estudio de podcast profissional com iluminacao neon vermelha, microfones de mesa, duas pessoas sentadas frente a frente com energia alta. Clima de programa de radio matinal: cafe e comida na mesa, tela com manchetes sobre food delivery ao fundo, conversa fluindo naturalmente entre dois profissionais que se conhecem ha anos e adoram debater sobre gastronomia e delivery.",
    directorsNotes: "ESSENCIAL: Isso e uma conversa REAL entre dois amigos que sao feras em gastronomia e delivery. Um fala algo, o outro REAGE de verdade - concorda enfatico, discorda com argumento, ri de uma situacao absurda, fica indignado com uma estatistica do mercado. Varie MUITO o tom: momentos de empolgacao rapida, momentos de seriedade com voz mais grave, momentos de humor com leveza. Use pausas curtas antes de revelar um dado impactante. NUNCA soe como dois robos lendo um roteiro. A energia deve ser contagiante - o ouvinte tem que sentir que ta ali na conversa com eles.",
    scriptPrompt: `ESTRUTURA DO EPISODIO:
1. ABERTURA (2-3 falas): Cumprimento rapido e direto. "Fala pessoal!" / "Salve!" - ja emenda nas manchetes do dia sem enrolacao.
2. MANCHETES (2-3 falas): Antecipe os assuntos do episódio de forma provocativa pra prender o ouvinte.
3. DISCUSSAO (blocos por notícia): Cada notícia com analise, dados concretos, impacto pratico e o que muda pro ecossistema de delivery e restaurantes.
4. ENCERRAMENTO (2-3 falas): Resumo rapido e convite pra seguir o Podcast iFood Insights.

REGRAS ABSOLUTAS:
- Os personagens NUNCA falam de si mesmos. Nada de "na minha experiencia", "eu que trabalho ha anos". ZERO autopromocao.
- Foco 100% nas NOTICIAS e no IMPACTO PRATICO pro ouvinte.
- Conversa REAL: um fala, o outro reage, complementa, discorda, provoca. Bate-papo entre colegas.
- Reacoes naturais: "Eita!", "Olha so...", "Pois e...", "Exatamente!", "Mas calma ai..."
- Cada fala 1 a 3 frases. Ninguem faz discurso longo.
- Traga NUMEROS e DADOS das notícias.
- Transicoes naturais entre assuntos.
- Portugues brasileiro natural, coloquial profissional.
- Ritmo dinamico: empolgacao, seriedade, humor leve.`,
  },
  article_audio_config: {
    voice: "Charon",
    scene: "Estudio de jornalismo profissional, falando diretamente ao ouvinte",
    directorsNotes: "Fale como jornalista de TV especializado em gastronomia e delivery. Emocao autentica, ritmo natural, pausas para enfase. NAO soe robotico.",
    prompt: `Voce e um jornalista especializado em gastronomia, food delivery e food tech no Brasil.

Escreva o roteiro de um AUDIO JORNALISTICO sobre a notícia abaixo. Voce esta reportando essa notícia para o ouvinte, como um correspondente de gastronomia e delivery em um telejornal ou programa de radio.

REGRAS:
- Va direto ao ponto: o que aconteceu, quem e afetado, o que muda na pratica
- NUNCA mencione voce mesmo, sua experiencia, seus anos de carreira ou se posicione pessoalmente
- NUNCA use "na minha opiniao", "eu acredito", "na minha experiencia"
- Fale sobre os FATOS da notícia com clareza e emocao jornalistica
- Traga dados e numeros concretos do artigo
- Explique o impacto pratico: o que muda para entregadores, restaurantes parceiros e consumidores
- Termine com o que os profissionais do setor devem ficar atentos
- Duração: 1 a 2 minutos (150-300 palavras)
- Tom: jornalista informativo, engajado, com energia e credibilidade
- Portugues brasileiro natural, fluido
- NAO use marcadores, titulos ou formatacao. Texto corrido para ser falado`,
  },
  image_config: {
    provider: "google",
    model: "imagen-4.0-generate-001",
    quality: "standard",
  },
};

export async function getSetting<T>(key: string): Promise<T> {
  const db = getDb();
  const [row] = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return (row?.value ?? DEFAULTS[key] ?? null) as T;
}

export async function getApiKeys(): Promise<ApiKeys> {
  return getSetting<ApiKeys>("api_keys");
}

export async function getPodcastConfig(): Promise<PodcastConfig> {
  return getSetting<PodcastConfig>("podcast_config");
}

export async function getArticleAudioConfig(): Promise<ArticleAudioConfig> {
  return getSetting<ArticleAudioConfig>("article_audio_config");
}

export async function getImageConfig(): Promise<ImageConfig> {
  return getSetting<ImageConfig>("image_config");
}
