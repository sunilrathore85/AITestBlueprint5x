function groqKey() {
  return process.env.Groq_API_KEY || process.env.GROQ_API_KEY;
}

function ollamaBase() {
  return (process.env.OLLAMA_URL || "http://localhost:11434").replace(/\/$/, "");
}

function isGroqChatModel(id) {
  const skip =
    id.startsWith("whisper") ||
    id.includes("prompt-guard") ||
    id.includes("orpheus") ||
    id.includes("safeguard");
  return !skip;
}

export async function listGroqModels() {
  const key = groqKey();
  if (!key) return [];
  const r = await fetch("https://api.groq.com/openai/v1/models", {
    headers: { Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!r.ok) return [];
  const data = await r.json();
  return (data.data || [])
    .map((m) => m.id)
    .filter(isGroqChatModel)
    .sort();
}

export async function listOllamaModels() {
  if (process.env.VERCEL) return [];
  try {
    const r = await fetch(`${ollamaBase()}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!r.ok) return [];
    const data = await r.json();
    return (data.models || []).map((m) => m.name).sort();
  } catch {
    return [];
  }
}

export async function probeModel(provider, model) {
  if (process.env.VERCEL && provider === "ollama") {
    throw new Error("Ollama is not available on Vercel; use Groq in production.");
  }
  const prompt = "Reply with OK only.";
  if (provider === "ollama") {
    const r = await fetch(`${ollamaBase()}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [{ role: "user", content: prompt }],
        options: { temperature: 0 },
      }),
    });
    const body = await r.text();
    if (!r.ok) {
      let msg = body;
      try {
        msg = JSON.parse(body).error || JSON.parse(body).message || body;
      } catch {
        /* keep raw */
      }
      throw new Error(`Ollama: ${msg}`);
    }
    return true;
  }
  const key = groqKey();
  if (!key) throw new Error("Groq API key missing in .env");
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      max_tokens: 8,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const body = await r.text();
  if (!r.ok) {
    let msg = body;
    try {
      msg = JSON.parse(body).error?.message || body;
    } catch {
      /* keep raw */
    }
    throw new Error(`Groq: ${msg}`);
  }
  return true;
}