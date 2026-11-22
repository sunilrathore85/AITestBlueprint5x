import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, "llm-config.json");

const DEFAULTS = {
  provider: "groq",
  groqModel: "openai/gpt-oss-20b",
  ollamaModel: "gemma3:4b",
};

const GROQ_MODEL_ALIASES = {
  "llama-3.3-70b-versatile": "openai/gpt-oss-20b",
  "llama-3.1-8b-instant": "openai/gpt-oss-20b",
  "mixtral-8x7b-32768": "openai/gpt-oss-20b",
  "llama3-70b-8192": "openai/gpt-oss-20b",
};

let runtimeConfig = null;

function fromEnv() {
  const provider = process.env.LLM_PROVIDER === "ollama" ? "ollama" : "groq";
  return {
    provider,
    groqModel: process.env.GROQ_MODEL || DEFAULTS.groqModel,
    ollamaModel: process.env.OLLAMA_MODEL || DEFAULTS.ollamaModel,
  };
}

function normalize(cfg) {
  const merged = {
    ...DEFAULTS,
    ...fromEnv(),
    ...cfg,
    provider: cfg.provider === "ollama" ? "ollama" : "groq",
  };
  merged.groqModel = GROQ_MODEL_ALIASES[merged.groqModel] || merged.groqModel;
  return merged;
}

export function getLlmConfig() {
  if (runtimeConfig) return runtimeConfig;
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf8");
    return normalize(JSON.parse(raw));
  } catch {
    return normalize({});
  }
}

export function setLlmConfig({ provider, groqModel, ollamaModel }) {
  const current = getLlmConfig();
  const next = normalize({
    provider,
    groqModel: groqModel?.trim() || current.groqModel,
    ollamaModel: ollamaModel?.trim() || current.ollamaModel,
  });
  runtimeConfig = next;
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(next, null, 2));
  } catch {
    /* Vercel: in-memory only */
  }
  return next;
}

export function activeModel(cfg) {
  return cfg.provider === "ollama" ? cfg.ollamaModel : cfg.groqModel;
}