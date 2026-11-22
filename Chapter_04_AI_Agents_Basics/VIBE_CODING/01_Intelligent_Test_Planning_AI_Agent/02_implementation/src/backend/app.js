import cors from "cors";
import express from "express";
import { loadLocalEnv } from "./env.js";
import { fetchIssue } from "./jira.js";
import { generateTestPlan } from "./generatePlan.js";
import { activeModel, getLlmConfig, setLlmConfig } from "./llmConfig.js";
import { listGroqModels, listOllamaModels, probeModel } from "./llmModels.js";

loadLocalEnv();

export const app = express();
app.use(cors());
app.use(express.json());

function jiraConfig() {
  return {
    url: (process.env.JIRA_API_URL || "").replace(/\/$/, ""),
    email: process.env.JIRA_API_USERNAME || "",
    token: process.env.JIRA_API_TOKEN || "",
  };
}

function mask(s) {
  if (!s) return "";
  if (s.length <= 4) return "****";
  return s.slice(0, 2) + "****" + s.slice(-2);
}

app.get("/api/settings", async (_req, res) => {
  const j = jiraConfig();
  const cfg = getLlmConfig();
  let groqModels;
  let ollamaModels = [];
  if (process.env.VERCEL) {
    groqModels = [...new Set([cfg.groqModel, "openai/gpt-oss-20b", "qwen/qwen3.8-27b"])];
  } else {
    [groqModels, ollamaModels] = await Promise.all([listGroqModels(), listOllamaModels()]);
  }
  res.json({
    jira: {
      url: j.url || "(not set)",
      email: j.email ? mask(j.email) : "(not set)",
      tokenConfigured: Boolean(j.token),
    },
    llm: {
      ...cfg,
      activeModel: activeModel(cfg),
      groqModels,
      ollamaModels,
      groqConfigured: Boolean(process.env.Groq_API_KEY || process.env.GROQ_API_KEY),
      ollamaUrl: process.env.OLLAMA_URL || "http://localhost:11434",
    },
  });
});

app.put("/api/settings/llm", (req, res) => {
  const { provider, groqModel, ollamaModel } = req.body || {};
  if (provider && provider !== "groq" && provider !== "ollama") {
    return res.status(400).json({ error: "provider must be groq or ollama" });
  }
  const llm = setLlmConfig({ provider, groqModel, ollamaModel });
  res.json({ ok: true, llm: { ...llm, activeModel: activeModel(llm) } });
});

app.post("/api/test-jira", async (_req, res) => {
  const j = jiraConfig();
  if (!j.url || !j.email || !j.token) {
    return res.status(400).json({ ok: false, error: "Jira credentials missing in .env" });
  }
  try {
    const r = await fetch(`${j.url}/rest/api/3/myself`, {
      headers: {
        Authorization: "Basic " + Buffer.from(`${j.email}:${j.token}`).toString("base64"),
        Accept: "application/json",
      },
    });
    if (!r.ok) throw new Error(`Jira returned ${r.status}`);
    res.json({ ok: true, message: "Jira connection OK" });
  } catch (e) {
    res.status(502).json({ ok: false, error: e.message });
  }
});

app.post("/api/test-llm", async (req, res) => {
  const cfg = getLlmConfig();
  const provider = req.body?.provider || cfg.provider;
  const model =
    provider === "ollama"
      ? req.body?.ollamaModel || cfg.ollamaModel
      : req.body?.groqModel || cfg.groqModel;
  try {
    await probeModel(provider, model);
    res.json({ ok: true, message: `${provider} model OK: ${model}` });
  } catch (e) {
    res.status(502).json({ ok: false, error: e.message });
  }
});

app.post("/api/generate", async (req, res) => {
  const issueKey = (req.body?.issueKey || "").trim().toUpperCase();
  if (!issueKey || !/^[A-Z][A-Z0-9]+-\d+$/.test(issueKey)) {
    return res.status(400).json({ error: "Invalid Jira issue ID (e.g. QA-123)" });
  }
  const j = jiraConfig();
  if (!j.url || !j.email || !j.token) {
    return res.status(500).json({ error: "Jira not configured" });
  }
  try {
    const issue = await fetchIssue(j, issueKey);
    const plan = await generateTestPlan(issue);
    res.json({ issueKey, title: issue.summary, plan });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || "Generation failed" });
  }
});