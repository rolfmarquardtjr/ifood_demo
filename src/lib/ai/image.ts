import { getApiKeys, getImageConfig } from "./settings";

interface ImageResult {
  imageBuffer: Buffer;
  format: string;
}

// --- OpenAI Image Generation (gpt-image-1, dall-e-3) ---

async function generateOpenAIImage(
  prompt: string,
  model: string,
  quality: string,
): Promise<ImageResult> {
  const keys = await getApiKeys();
  if (!keys.openai) throw new Error("Chave de API da OpenAI nao configurada");

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${keys.openai}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      size: model === "dall-e-3" ? "1792x1024" : "1536x1024",
      quality,
      response_format: "b64_json",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI Image error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI Image: nenhuma imagem na resposta");

  return { imageBuffer: Buffer.from(b64, "base64"), format: "png" };
}

// --- Google Imagen 4 (via Gemini API predict endpoint) ---

async function generateImagen(
  prompt: string,
  model: string,
  apiKey: string,
): Promise<ImageResult> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: "16:9",
        },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Imagen error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const b64 = data.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) throw new Error("Imagen: nenhuma imagem na resposta");

  return { imageBuffer: Buffer.from(b64, "base64"), format: "png" };
}

// --- Gemini generateContent Image (gemini-2.0-flash-exp) ---

async function generateGeminiImage(
  prompt: string,
  model: string,
  apiKey: string,
): Promise<ImageResult> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini Image error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const imagePart = data.candidates?.[0]?.content?.parts?.find(
    (p: { inlineData?: { mimeType: string; data: string } }) =>
      p.inlineData?.mimeType?.startsWith("image/"),
  );

  if (!imagePart) throw new Error("Gemini Image: nenhuma imagem na resposta");

  return {
    imageBuffer: Buffer.from(imagePart.inlineData.data, "base64"),
    format: imagePart.inlineData.mimeType.split("/")[1] || "png",
  };
}

// --- Public API ---

export async function generateImage(prompt: string): Promise<ImageResult> {
  const config = await getImageConfig();
  const keys = await getApiKeys();

  const fullPrompt = `Professional photojournalistic image for a Brazilian food delivery and gastronomy news article. Style: realistic photography, editorial quality, sharp focus, natural lighting, no cartoons, no illustrations, no drawings, no AI artifacts. The image should look like a real photo from a news agency (Reuters, AFP style). Subject matter: food delivery, restaurant kitchen, delivery app, food photography. Topic: ${prompt}`;

  if (config.provider === "google") {
    if (!keys.google) throw new Error("Chave de API do Google nao configurada");

    // Imagen 4 uses predict endpoint, Gemini native uses generateContent
    if (config.model.startsWith("imagen")) {
      return generateImagen(fullPrompt, config.model, keys.google);
    }
    return generateGeminiImage(fullPrompt, config.model, keys.google);
  }

  return generateOpenAIImage(fullPrompt, config.model, config.quality);
}
