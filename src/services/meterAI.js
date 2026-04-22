// src/services/meterAI.js
// Uses OpenRouter.ai — free, works globally, no region restrictions
//
// SETUP:
//   1. https://openrouter.ai → Sign up (free)
//   2. https://openrouter.ai/keys → Create Key → copy sk-or-v1-xxxxx
//   3. .env → VITE_OPENROUTER_KEY=sk-or-v1-xxxxx
//   4. Vercel/Netlify → Environment Variables → same key → Redeploy

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

const buildPrompt = (type) => {
  const meter = type === "electric" ? "electricity (kWh)" : "water (m³)";
  return `This is a photo of a ${meter} utility meter display.
Read the meter and return ONLY the current numeric reading.
Rules:
- Return ONLY the number (e.g. "1234.5" or "089.30")
- No units, no labels, no explanation
- If unreadable, return exactly: CANNOT_READ
Meter reading:`;
};

const parseNumber = (raw) => {
  if (!raw || raw.toUpperCase().includes("CANNOT_READ")) return null;
  const match = raw.trim().match(/\d+\.?\d*/);
  return match ? parseFloat(match[0]) : null;
};

// Free vision models — tried in order, falls back if one is unavailable
const FREE_VISION_MODELS = [
  "qwen/qwen2.5-vl-32b-instruct:free",
  "meta-llama/llama-3.2-11b-vision-instruct:free",
  "google/gemma-3-12b-it:free",
];

const callOpenRouter = async (apiKey, model, base64, mimeType, type) => {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
    },
    body: JSON.stringify({
      model,
      max_tokens: 60,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: buildPrompt(type) },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64}` },
            },
          ],
        },
      ],
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `Error ${res.status}`);
  return data?.choices?.[0]?.message?.content ?? "";
};

export const scanMeterImage = async (file, type) => {
  const apiKey = import.meta.env.VITE_OPENROUTER_KEY;
  if (!apiKey)
    throw new Error(
      "VITE_OPENROUTER_KEY មិនទាន់បានកំណត់។\n" +
        "១. ចូល https://openrouter.ai → Sign up\n" +
        "២. បង្កើត Key នៅ https://openrouter.ai/keys\n" +
        "៣. បន្ថែមក្នុង .env: VITE_OPENROUTER_KEY=sk-or-v1-xxx\n" +
        "៤. បន្ថែមក្នុង Vercel/Netlify environment variables",
    );

  const dataUrl = await fileToBase64(file);
  const base64 = dataUrl.split(",")[1];
  const mimeType = file.type || "image/jpeg";

  let lastError = null;
  for (const model of FREE_VISION_MODELS) {
    try {
      const raw = await callOpenRouter(apiKey, model, base64, mimeType, type);
      return parseNumber(raw);
      console.log("OCR Raw Output:", raw);
    } catch (e) {
      console.warn(`Model ${model} failed:`, e.message);
      lastError = e;
    }
  }

  throw new Error(lastError?.message || "AI មិនអាចអានបាន។ សូមព្យាយាមម្ដងទៀត។");
};
