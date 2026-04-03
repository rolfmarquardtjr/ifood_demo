import { getApiKeys, getPodcastConfig, getArticleAudioConfig, type PodcastCharacter } from "./settings";

interface TTSSegment {
  speaker: string;
  text: string;
}

interface TTSResult {
  audioBuffer: Buffer;
  format: string;
}

// --- WAV header for raw PCM data ---

function addWavHeader(pcmData: Buffer, sampleRate: number, channels: number, bitsPerSample: number): Buffer {
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);
  const dataSize = pcmData.length;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);                          // ChunkID
  header.writeUInt32LE(36 + dataSize, 4);            // ChunkSize
  header.write("WAVE", 8);                           // Format
  header.write("fmt ", 12);                          // Subchunk1ID
  header.writeUInt32LE(16, 16);                      // Subchunk1Size (PCM)
  header.writeUInt16LE(1, 20);                       // AudioFormat (1 = PCM)
  header.writeUInt16LE(channels, 22);                // NumChannels
  header.writeUInt32LE(sampleRate, 24);              // SampleRate
  header.writeUInt32LE(byteRate, 28);                // ByteRate
  header.writeUInt16LE(blockAlign, 32);              // BlockAlign
  header.writeUInt16LE(bitsPerSample, 34);           // BitsPerSample
  header.write("data", 36);                          // Subchunk2ID
  header.writeUInt32LE(dataSize, 40);                // Subchunk2Size

  return Buffer.concat([header, pcmData]);
}

// --- Gemini TTS (supports multi-speaker natively) ---

async function generateGeminiTTS(
  script: TTSSegment[],
  characters: PodcastCharacter[],
  model: string,
): Promise<TTSResult> {
  const keys = await getApiKeys();
  if (!keys.google) throw new Error("Chave de API do Google nao configurada");

  // Use exactly the configured characters (max 2 for Gemini multi-speaker)
  const charMap = new Map(characters.map((c) => [c.name, c]));
  const speakerConfigs = characters.slice(0, 2).map((c) => ({
    speaker: c.name,
    voiceConfig: { prebuiltVoiceConfig: { voiceName: c.voice } },
  }));

  // Remap any unknown speakers in script to known characters
  const knownNames = new Set(characters.map((c) => c.name));
  script = script.map((s) => {
    if (!knownNames.has(s.speaker)) {
      return { ...s, speaker: characters[0].name };
    }
    return s;
  });

  const scriptSpeakers = [...new Set(script.map((s) => s.speaker))];

  const isSingleSpeaker = scriptSpeakers.length === 1;

  // Build style-directed text with Audio Profile + Scene + Director's Notes (Google recommended approach)
  // Fetch configs for scene/directorsNotes
  const podcastCfg = await getPodcastConfig();
  const articleCfg = await getArticleAudioConfig();

  let dialogueText: string;
  if (isSingleSpeaker) {
    const char = charMap.get(scriptSpeakers[0]) || characters[0];
    const scene = articleCfg.scene || "Estudio de broadcast profissional";
    const notes = articleCfg.directorsNotes || "Fale com emocao autentica, varie o ritmo naturalmente.";
    const styleDirective = `[Audio Profile: ${char.role || "Especialista"}. ${char.instructions || ""}]\n[Scene: ${scene}]\n[Director's Notes: ${notes}]\n\n`;
    dialogueText = styleDirective + script.map((s) => s.text).join("\n");
  } else {
    const speakerProfiles = characters
      .filter(c => scriptSpeakers.includes(c.name))
      .map(c => `${c.name}: ${c.role}. ${c.instructions || ""}`)
      .join("\n");
    const scene = podcastCfg.scene || "Dois especialistas em um estudio de podcast profissional";
    const notes = podcastCfg.directorsNotes || "Conversa real entre amigos especialistas. NAO robotico.";
    const multiDirective = `[Audio Profiles:\n${speakerProfiles}]\n[Scene: ${scene}]\n[Director's Notes: ${notes}]\n\n`;
    dialogueText = multiDirective + script.map((s) => `${s.speaker}: ${s.text}`).join("\n");
  }

  // Single speaker uses voiceConfig, multi-speaker uses multiSpeakerVoiceConfig
  const speechConfig = isSingleSpeaker
    ? { voiceConfig: { prebuiltVoiceConfig: { voiceName: speakerConfigs[0].voiceConfig.prebuiltVoiceConfig.voiceName } } }
    : { multiSpeakerVoiceConfig: { speakerVoiceConfigs: speakerConfigs } };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${keys.google}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: dialogueText }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig,
        },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini TTS error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const audioPart = data.candidates?.[0]?.content?.parts?.find(
    (p: { inlineData?: { data: string } }) => p.inlineData?.data,
  );

  if (!audioPart) throw new Error("Gemini TTS: nenhum audio na resposta");

  const rawPcm = Buffer.from(audioPart.inlineData.data, "base64");

  // Gemini TTS returns raw Linear16 PCM at 24kHz mono - add WAV header
  const audioBuffer = addWavHeader(rawPcm, 24000, 1, 16);
  return { audioBuffer, format: "wav" };
}

// --- OpenAI TTS (one call per speaker, then concat) ---

async function generateOpenAISegment(
  text: string,
  voice: string,
  model: string,
  instructions?: string,
): Promise<Buffer> {
  const keys = await getApiKeys();
  if (!keys.openai) throw new Error("Chave de API da OpenAI nao configurada");

  const body: Record<string, unknown> = {
    model,
    input: text,
    voice,
    response_format: "mp3",
  };

  if (instructions && model === "gpt-4o-mini-tts") {
    body.instructions = instructions;
  }

  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${keys.openai}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI TTS error (${res.status}): ${err}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

async function generateOpenAITTS(
  script: TTSSegment[],
  characters: PodcastCharacter[],
  model: string,
): Promise<TTSResult> {
  const charMap = new Map(characters.map((c) => [c.name, c]));

  const segments: Buffer[] = [];
  for (const seg of script) {
    const char = charMap.get(seg.speaker) || characters[0];
    const buf = await generateOpenAISegment(seg.text, char.voice, model, char.instructions);
    segments.push(buf);
  }

  // Concat MP3 segments (MP3 frames are independently decodable)
  const audioBuffer = Buffer.concat(segments);
  return { audioBuffer, format: "mp3" };
}

// --- Public API ---

export async function generateTTSAudio(
  script: TTSSegment[],
): Promise<TTSResult> {
  const config = await getPodcastConfig();

  // For short scripts (single speaker / article audio), generate directly
  if (script.length <= 15) {
    if (config.ttsProvider === "gemini") {
      return generateGeminiTTS(script, config.characters, config.ttsModel);
    }
    return generateOpenAITTS(script, config.characters, config.ttsModel);
  }

  // For long scripts (podcast), chunk into blocks
  // Each chunk gets the full style context to maintain voice consistency
  const CHUNK_SIZE = 15;
  const chunks: TTSSegment[][] = [];
  for (let i = 0; i < script.length; i += CHUNK_SIZE) {
    chunks.push(script.slice(i, i + CHUNK_SIZE));
  }

  const pcmBuffers: Buffer[] = [];
  for (let i = 0; i < chunks.length; i++) {
    console.log(`  TTS chunk ${i + 1}/${chunks.length} (${chunks[i].length} falas)...`);
    // Each chunk is a full TTS call with style context included by generateGeminiTTS
    const result = config.ttsProvider === "gemini"
      ? await generateGeminiTTS(chunks[i], config.characters, config.ttsModel)
      : await generateOpenAITTS(chunks[i], config.characters, config.ttsModel);

    if (result.format === "wav") {
      // Extract raw PCM (skip 44-byte WAV header) for concatenation
      const pcm = result.audioBuffer.subarray(44);
      pcmBuffers.push(pcm);
    } else {
      pcmBuffers.push(result.audioBuffer);
    }
  }

  if (config.ttsProvider === "gemini") {
    // Concatenate raw PCM and add single WAV header
    const totalPcm = Buffer.concat(pcmBuffers);
    const audioBuffer = addWavHeader(totalPcm, 24000, 1, 16);
    return { audioBuffer, format: "wav" };
  }
  return { audioBuffer: Buffer.concat(pcmBuffers), format: "mp3" };
}

export const GEMINI_VOICES = [
  "Achernar", "Achird", "Algenib", "Algieba", "Alnilam",
  "Aoede", "Autonoe", "Callirrhoe", "Charon", "Despina",
  "Enceladus", "Erinome", "Fenrir", "Gacrux", "Iapetus",
  "Kore", "Laomedeia", "Leda", "Orus", "Puck",
  "Pulcherrima", "Rasalgethi", "Sadachbia", "Sadaltager", "Schedar",
  "Sulafat", "Umbriel", "Vindemiatrix", "Zephyr", "Zubenelgenubi",
];

export const OPENAI_VOICES = [
  "marin", "cedar", "alloy", "ash", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer",
];
