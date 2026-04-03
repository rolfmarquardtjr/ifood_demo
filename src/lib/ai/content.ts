import { getApiKeys, getPodcastConfig, getArticleAudioConfig } from "./settings";

interface ScriptLine {
  speaker: string;
  text: string;
}

// --- Generic AI text generation ---

async function callGoogleAI(prompt: string, model: string, apiKey: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  );

  if (!res.ok) throw new Error(`Google AI error (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function callOpenAI(prompt: string, model: string, apiKey: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`OpenAI error (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function callAnthropicAI(prompt: string, model: string, apiKey: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic error (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

export async function generateText(prompt: string, provider?: string, model?: string): Promise<string> {
  const keys = await getApiKeys();

  const p = provider || (keys.google ? "google" : keys.openai ? "openai" : keys.anthropic ? "anthropic" : null);
  if (!p) throw new Error("Nenhuma chave de API configurada");

  if (p === "google" || p.startsWith("google/")) {
    const m = model || (p.includes("/") ? p.split("/")[1] : "gemini-2.5-flash");
    return callGoogleAI(prompt, m, keys.google!);
  }
  if (p === "openai" || p.startsWith("openai/")) {
    const m = model || (p.includes("/") ? p.split("/")[1] : "gpt-4o-mini");
    return callOpenAI(prompt, m, keys.openai!);
  }
  if (p === "anthropic" || p.startsWith("anthropic/")) {
    const m = model || (p.includes("/") ? p.split("/")[1] : "claude-sonnet-4-6");
    return callAnthropicAI(prompt, m, keys.anthropic!);
  }
  throw new Error(`Provider desconhecido: ${p}`);
}

// --- Podcast script generation ---

export async function generatePodcastScript(
  articlesSummaries: { title: string; summary: string }[],
): Promise<ScriptLine[]> {
  const config = await getPodcastConfig();

  const characterDescriptions = config.characters
    .map((c) => `${c.name}: ${c.role}`)
    .join("\n");

  const scriptInstructions = config.scriptPrompt || "";

  const prompt = `Voce e o melhor roteirista de podcasts do Brasil. Vai criar o roteiro do Podcast iFood Insights, referencia em gastronomia, delivery e o ecossistema de alimentação.

PERSONAGENS:
${characterDescriptions}

NOTICIAS DO DIA:
${articlesSummaries.map((a, i) => `${i + 1}. ${a.title}\n   ${a.summary}`).join("\n\n")}

ESTILO: ${config.style}

${scriptInstructions}

Para ${config.durationMinutes} minutos de audio, gere aproximadamente ${config.durationMinutes * 8} falas.

Responda APENAS com um JSON array:
[{"speaker": "NomeDoPersonagem", "text": "Fala do personagem"}]

Nenhum texto fora do JSON.`;

  const result = await generateText(prompt);

  const jsonMatch = result.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Falha ao parsear roteiro do podcast");

  try {
    return JSON.parse(jsonMatch[0]) as ScriptLine[];
  } catch {
    // Try fixing common JSON issues (unescaped quotes in text)
    const fixed = jsonMatch[0]
      .replace(/:\s*"([^"]*)"/g, (_, match) => `: "${match.replace(/"/g, '\\"')}"`)
      .replace(/,\s*\]/g, "]");
    return JSON.parse(fixed) as ScriptLine[];
  }
}

// --- Article content generation ---

export async function generateArticleContent(
  title: string,
  originalSummary: string,
  category: string,
): Promise<{ content: string; summary: string; imagePrompt: string }> {
  const prompt = `Você é um jornalista especializado em gastronomia e delivery, escrevendo para o ecossistema iFood.

Escreva um artigo completo em Markdown sobre o seguinte tema:

Título: ${title}
Resumo original: ${originalSummary}
Categoria: ${category}

REGRAS:
- PÚBLICO: entregadores, restaurantes parceiros e consumidores do iFood.
- Linguagem SIMPLES e DIRETA. Como se estivesse explicando pra quem vive o dia a dia do delivery.
- Escreva em português brasileiro natural e acessível
- Use Markdown com ## para subtítulos, listas, tabelas quando relevante
- O artigo deve ter entre 400-800 palavras
- Inclua dados e informações práticas sobre food delivery, tendências gastronômicas e food tech
- Dê DICAS PRÁTICAS: o que fazer, o que evitar, como melhorar operações
- Contexto iFood Insights: inovação e tendências no mercado de alimentação e delivery
- Termine com orientações práticas que o leitor pode aplicar HOJE
- Use exemplos do cotidiano de quem trabalha com delivery, restaurante ou consome via app

Responda APENAS com um JSON no formato:
{"content": "conteúdo em markdown", "summary": "resumo de 1-2 frases focado no ecossistema delivery", "imagePrompt": "professional photo of food delivery, restaurant kitchen, delivery app, food photography, brazilian city, realistic photography style"}

Não inclua nenhum texto fora do JSON.`;

  const result = await generateText(prompt);
  const jsonMatch = result.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Falha ao parsear artigo gerado");

  return JSON.parse(jsonMatch[0]);
}

// --- Article audio guide script generation ---

export async function generateAudioGuideScript(
  title: string,
  summary: string,
  content: string,
): Promise<string> {
  const config = await getArticleAudioConfig();

  const prompt = `${config.prompt}

Titulo: ${title}
Resumo: ${summary}
Conteudo: ${content.substring(0, 3000)}

Responda APENAS com o texto, sem aspas, sem explicacoes.`;

  return generateText(prompt);
}
