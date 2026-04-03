import { put, del } from "@vercel/blob";

export async function uploadImage(buffer: Buffer, filename: string): Promise<string> {
  const ext = filename.split(".").pop()?.toLowerCase();
  const contentTypes: Record<string, string> = { png: "image/png", jpeg: "image/jpeg", jpg: "image/jpeg", webp: "image/webp" };
  const blob = await put(`images/${filename}`, buffer, {
    access: "public",
    contentType: contentTypes[ext || ""] || "image/png",
    addRandomSuffix: true,
  });
  return blob.url;
}

export async function uploadAudio(buffer: Buffer, filename: string): Promise<string> {
  const ext = filename.split(".").pop()?.toLowerCase();
  const contentTypes: Record<string, string> = {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    opus: "audio/opus",
    aac: "audio/aac",
    flac: "audio/flac",
  };
  const contentType = contentTypes[ext || ""] || "audio/mpeg";

  const blob = await put(`audio/${filename}`, buffer, {
    access: "public",
    contentType,
  });
  return blob.url;
}

export async function deleteBlob(url: string): Promise<void> {
  await del(url);
}
