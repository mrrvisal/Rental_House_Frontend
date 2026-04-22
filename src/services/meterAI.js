const USE_GEMINI = false; // ← flip to true to use Gemini

// ─── Convert File → base64 data URL ──────────────────────
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

// ─── Shared prompt ────────────────────────────────────────
const buildPrompt = (type) => {
  const meter = type === "electric" ? "electricity (kWh)" : "water (m³)";
  return `This is a photo of a ${meter} utility meter.
Read the meter display and return ONLY the current numeric reading.
Rules:
- Return ONLY the number (e.g. "1234.5" or "089.30")
- No units, no labels, no explanation
- If unreadable, return exactly: CANNOT_READ
Meter reading:`;
};

// ─── Parse number from AI text response ──────────────────
const parseNumber = (raw) => {
  if (!raw || raw.includes("CANNOT_READ")) return null;
  const match = raw.trim().match(/\d+\.?\d*/);
  return match ? parseFloat(match[0]) : null;
};

// ════════════════════════════════════════════════════════════
//  OPTION A: HuggingFace (needs "Inference Providers" permission on token)
// ════════════════════════════════════════════════════════════
const scanWithHuggingFace = async (file, type) => {
  const { default: OpenAI } = await import("openai");

  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: import.meta.env.VITE_HF_TOKEN,
    dangerouslyAllowBrowser: true,
  });

  const base64DataUrl = await fileToBase64(file);

  const response = await client.chat.completions.create({
    model: "google/gemma-4-31B-it:novita",
    max_tokens: 50,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: buildPrompt(type) },
          { type: "image_url", image_url: { url: base64DataUrl } },
        ],
      },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? "";
  return parseNumber(raw);
};

// ════════════════════════════════════════════════════════════
//  OPTION B: Google Gemini Flash 2.0 (free tier, no extra package)
// ════════════════════════════════════════════════════════════
const scanWithGemini = async (file, type) => {
  const apiKey = import.meta.env.VITE_GEMINI_KEY;
  if (!apiKey) throw new Error("VITE_GEMINI_KEY មិនបានកំណត់ក្នុង .env");

  const dataUrl = await fileToBase64(file);
  const base64 = dataUrl.split(",")[1]; // strip "data:image/...;base64,"
  const mimeType = file.type || "image/jpeg";

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: buildPrompt(type) },
              { inline_data: { mime_type: mimeType, data: base64 } },
            ],
          },
        ],
        generationConfig: { maxOutputTokens: 50, temperature: 0 },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini API error ${res.status}`);
  }

  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return parseNumber(raw);
};

// ════════════════════════════════════════════════════════════
//  Public export
// ════════════════════════════════════════════════════════════
/**
 * @param {File}   file  - Uploaded meter image
 * @param {string} type  - "electric" | "water"
 * @returns {Promise<number|null>}
 */
export const scanMeterImage = (file, type) =>
  USE_GEMINI ? scanWithGemini(file, type) : scanWithHuggingFace(file, type);
