import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, "llm-config.json");
const TEMPLATE = path.resolve(__dirname, "../../../01_plan/Test_Case_Template.md");

const DEFAULTS = { provider: "groq", groqModel: "openai/gpt-oss-120b", ollamaModel: "gemma3:4b" };

export function getLlmConfig() {
  try {
    return { ...DEFAULTS, ...JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8")) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function setLlmConfig(next) {
  const cfg = {
    provider: next.provider === "ollama" ? "ollama" : "groq",
    groqModel: (next.groqModel || DEFAULTS.groqModel).trim(),
    ollamaModel: (next.ollamaModel || DEFAULTS.ollamaModel).trim(),
  };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2));
  return cfg;
}

export function activeModel(cfg) {
  return cfg.provider === "ollama" ? cfg.ollamaModel : cfg.groqModel;
}

function promptFor(issue, template) {
  return `You are a Senior QA Engineer. Write a Test Case Design Document in Markdown.
Follow the template section names and order exactly. This is test cases, not a test strategy or test plan.
Use only facts from the Jira issue. Do not invent behavior, rules, messages, field limits, or roles.
Missing facts: write exactly "Insufficient information to determine."
Extra coverage: prefix "Proposed Test Scenario:".
Unconfirmed conditions: prefix "Assumption (Requires Confirmation):".
Ambiguous requirements: prefix "Clarification Required:".
Scenario IDs: TS-[MODULE]-001. Test case IDs: TC-[MODULE]-001. Titles: Verify [behavior] when [condition].
One objective per case. Include steps and expected results. Status is Draft. Do not mark cases executed or passed.
Trace every case to Jira ${issue.key}.

Jira ${issue.key}
Summary: ${issue.summary}
Type: ${issue.type}
Status: ${issue.status}
Priority: ${issue.priority}
Labels: ${issue.labels}
Description:
${issue.description || "Insufficient information to determine."}

TEMPLATE:
${template}

Output Markdown only. No code fences.`;
}

async function callGroq(prompt, model) {
  const key = process.env.Groq_API_KEY || process.env.GROQ_API_KEY;
  if (!key) throw Object.assign(new Error("Groq API key missing in .env"), { status: 500 });
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const body = await res.text();
  if (!res.ok) {
    let detail = body;
    try {
      detail = JSON.parse(body).error?.message || body;
    } catch {
      /* keep raw */
    }
    throw Object.assign(new Error(`Groq generation failed: ${detail}`), { status: 502 });
  }
  return JSON.parse(body).choices?.[0]?.message?.content || "";
}

async function callOllama(prompt, model) {
  const base = (process.env.OLLAMA_URL || "http://localhost:11434").replace(/\/$/, "");
  const res = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [{ role: "user", content: prompt }],
      options: { temperature: 0 },
    }),
  });
  const body = await res.text();
  if (!res.ok) {
    let detail = body;
    try {
      detail = JSON.parse(body).error || JSON.parse(body).message || body;
    } catch {
      /* keep raw */
    }
    throw Object.assign(new Error(`Ollama generation failed: ${detail}`), { status: 502 });
  }
  return JSON.parse(body).message?.content || "";
}

export async function listModels(provider) {
  if (provider === "ollama") {
    try {
      const base = (process.env.OLLAMA_URL || "http://localhost:11434").replace(/\/$/, "");
      const r = await fetch(`${base}/api/tags`, { signal: AbortSignal.timeout(3000) });
      if (!r.ok) return [];
      const data = await r.json();
      return (data.models || []).map((m) => m.name).sort();
    } catch {
      return [];
    }
  }
  const key = process.env.Groq_API_KEY || process.env.GROQ_API_KEY;
  if (!key) return [];
  const r = await fetch("https://api.groq.com/openai/v1/models", {
    headers: { Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!r.ok) return [];
  const data = await r.json();
  return (data.data || [])
    .map((m) => m.id)
    .filter((id) => !id.startsWith("whisper") && !id.includes("guard") && !id.includes("orpheus"))
    .sort();
}

export async function probeModel(provider, model) {
  const ping = "Reply with OK only.";
  if (provider === "ollama") {
    await callOllama(ping, model);
    return;
  }
  await callGroq(ping, model);
}

export async function generateCases(issue) {
  if (!fs.existsSync(TEMPLATE)) throw Object.assign(new Error("Test case template not found"), { status: 500 });
  const template = fs.readFileSync(TEMPLATE, "utf8");
  const cfg = getLlmConfig();
  const prompt = promptFor(issue, template);
  const text =
    cfg.provider === "ollama"
      ? await callOllama(prompt, cfg.ollamaModel)
      : await callGroq(prompt, cfg.groqModel);
  if (!text.trim()) throw Object.assign(new Error("Model returned empty test cases"), { status: 502 });
  return text.replace(/^```(?:markdown)?\s*/i, "").replace(/\s*```$/, "");
}
