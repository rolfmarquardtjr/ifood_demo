import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getApiKeys, getPodcastConfig } from "@/lib/ai/settings";

export const maxDuration = 60;

function addWavHeader(pcmData: Buffer, sampleRate: number, channels: number, bitsPerSample: number): Buffer {
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);
  const dataSize = pcmData.length;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, pcmData]);
}

export async function POST(request: Request) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  try {
    const { voice, provider } = await request.json();
    if (!voice) {
      return NextResponse.json({ error: "Voz obrigatoria" }, { status: 400 });
    }

    const keys = await getApiKeys();
    const config = await getPodcastConfig();
    const ttsProvider = provider || config.ttsProvider;
    const ttsModel = config.ttsModel;

    const sampleText = `[Scene: Estudio de jornalismo profissional]
[Director's Notes: Fale como um jornalista especializado em gastronomia e delivery, com emocao e autoridade natural]

Uma nova tendencia no mercado de food delivery promete mudar o cenario da gastronomia no Brasil. A novidade impacta diretamente entregadores, restaurantes parceiros e consumidores de todo o pais.`;

    if (ttsProvider === "gemini") {
      if (!keys.google) return NextResponse.json({ error: "Chave Google nao configurada" }, { status: 400 });

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:generateContent?key=${keys.google}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: sampleText }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: voice },
                },
              },
            },
          }),
        },
      );

      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json({ error: `Gemini TTS: ${err}` }, { status: 500 });
      }

      const data = await res.json();
      const audioPart = data.candidates?.[0]?.content?.parts?.find(
        (p: { inlineData?: { data: string } }) => p.inlineData?.data,
      );
      if (!audioPart) return NextResponse.json({ error: "Sem audio na resposta" }, { status: 500 });

      const rawPcm = Buffer.from(audioPart.inlineData.data, "base64");
      const wavBuffer = addWavHeader(rawPcm, 24000, 1, 16);

      return new Response(new Uint8Array(wavBuffer), {
        headers: {
          "Content-Type": "audio/wav",
          "Content-Length": wavBuffer.length.toString(),
        },
      });
    }

    // OpenAI TTS
    if (!keys.openai) return NextResponse.json({ error: "Chave OpenAI nao configurada" }, { status: 400 });

    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${keys.openai}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: ttsModel,
        input: sampleText,
        voice,
        response_format: "mp3",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `OpenAI TTS: ${err}` }, { status: 500 });
    }

    const mp3Buffer = Buffer.from(await res.arrayBuffer());
    return new Response(new Uint8Array(mp3Buffer), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": mp3Buffer.length.toString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
